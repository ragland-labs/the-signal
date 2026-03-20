import { v } from "convex/values"
import { action, internalMutation } from "./_generated/server"
import { internal } from "./_generated/api"
import { api } from "./_generated/api"
import { GoogleGenAI, type Part } from "@google/genai"
import { rateLimiter } from "./rateLimiter"

// Files above this threshold or of these types use the Gemini File API
// instead of inline base64 (which has a ~20MB combined limit per request)
const INLINE_LIMIT_BYTES = 15 * 1024 * 1024 // 15MB

function needsFileApi(mimeType: string, sizeBytes: number): boolean {
    return (
        mimeType.startsWith("audio/") ||
        mimeType.startsWith("video/") ||
        sizeBytes > INLINE_LIMIT_BYTES
    )
}

export const checkRateLimit = internalMutation({
    args: {},
    handler: async (ctx) => {
        // Per-minute check (5 RPM — Gemini free tier)
        const perMinute = await rateLimiter.limit(ctx, "generateBriefingGlobal", { key: "global" })
        if (!perMinute.ok) {
            throw new Error("Too many requests. Please wait a moment before generating another briefing.")
        }
        // Daily check (20/day — leaves buffer below the 25 RPD free tier ceiling)
        const perDay = await rateLimiter.limit(ctx, "generateBriefingDaily", { key: "global" })
        if (!perDay.ok) {
            throw new Error("Daily briefing limit reached. The system resets at midnight UTC.")
        }
    }
})

export const generateBriefing = action({
    args: {
        sessionId: v.id("sessions"),
    },
    handler: async (ctx, args) => {
        // 0. Verify rate limit before hitting expensive APIs
        await ctx.runMutation(internal.gemini.checkRateLimit, {})

        // 1. Mark session as processing immediately so UI reflects real state
        await ctx.runMutation(api.sessions.updateSessionStatus, {
            sessionId: args.sessionId,
            status: "processing"
        })

        // 2. Fetch required configuration & setup SDK
        const apiKey = process.env.GEMINI_API_KEY
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY environment variable is not defined")
        }
        const ai = new GoogleGenAI({ apiKey })

        // 3. Fetch the session files from Convex
        const files = await ctx.runQuery(api.files.getSessionFiles, {
            sessionId: args.sessionId
        })

        if (!files || files.length === 0) {
            await ctx.runMutation(api.sessions.updateSessionStatus, {
                sessionId: args.sessionId,
                status: "failed"
            })
            throw new Error("No files found for this session")
        }

        // 4. Process files for Gemini — inline base64 for small files,
        //    Gemini File API for audio / video / large files
        const contents: Part[] = []

        for (const file of files) {
            if (!file.url) continue

            const response = await fetch(file.url)
            const arrayBuffer = await response.arrayBuffer()

            if (needsFileApi(file.format, file.size)) {
                // Upload to Gemini File API
                const blob = new Blob([arrayBuffer], { type: file.format })
                const uploaded = await ai.files.upload({
                    file: blob,
                    config: { mimeType: file.format, displayName: file.name }
                })

                // Poll until ACTIVE (Gemini processes async; max ~60s)
                let fileInfo = uploaded
                let polls = 0
                while (fileInfo.state === "PROCESSING" && polls < 30) {
                    await new Promise(r => setTimeout(r, 2000))
                    fileInfo = await ai.files.get({ name: uploaded.name! })
                    polls++
                }

                if (fileInfo.state !== "ACTIVE") {
                    throw new Error(`File "${file.name}" failed to process. Please try again.`)
                }

                contents.push({
                    fileData: { fileUri: fileInfo.uri!, mimeType: file.format }
                })
            } else {
                // Inline base64 for images, small PDFs, text
                // Convex runs in a V8 isolate — no Buffer. Use Web API instead.
                const uint8 = new Uint8Array(arrayBuffer)
                let binary = ""
                for (let i = 0; i < uint8.length; i += 8192) {
                    binary += String.fromCharCode(...uint8.subarray(i, i + 8192))
                }
                const base64Data = btoa(binary)
                contents.push({
                    inlineData: { data: base64Data, mimeType: file.format }
                })
            }
        }

        // 5. Append the analysis prompt
        const prompt = `
You are an expert executive intelligence system. Analyze the provided document(s) — which may include PDFs, images, audio transcripts, video content, or text files.

Extract the intelligence into EXACTLY three categories formatted as JSON:
1. strategicRisks: Array of strings detailing the highest-severity risks or concerns.
2. immediateActions: Array of strings detailing exact next steps or recommendations.
3. keyFinancials: Array of strings detailing core metrics, costs, numbers, or quantitative data points.

Also provide a confidenceScore between 0 and 100 based on the quality and completeness of the source material.

Output strictly as JSON matching this schema:
{
   "strategicRisks": [],
   "immediateActions": [],
   "keyFinancials": [],
   "confidenceScore": number
}
`
        contents.push({ text: prompt })

        // 6. Generate Content with GenAI SDK
        const genResponse = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: contents,
            config: {
                responseMimeType: "application/json",
            }
        })

        const resultText = genResponse.text ?? ""

        // 7. Parse and save to DB
        try {
            const parsed = JSON.parse(resultText)

            await ctx.runMutation(api.briefings.saveBriefing, {
                sessionId: args.sessionId,
                strategicRisks: parsed.strategicRisks || [],
                immediateActions: parsed.immediateActions || [],
                keyFinancials: parsed.keyFinancials || [],
                confidenceScore: parsed.confidenceScore ?? 85,
                rawResponse: resultText
            })

            return { success: true }
        } catch (e) {
            console.error("Failed to parse Gemini output JSON:", e)
            await ctx.runMutation(api.sessions.updateSessionStatus, {
                sessionId: args.sessionId,
                status: "failed"
            })
            throw new Error("Failed to parse intelligence briefing output")
        }
    },
})
