import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

// ======================================
// MUTATIONS (Write data)
// ======================================

export const saveBriefing = mutation({
    args: {
        sessionId: v.id("sessions"),
        strategicRisks: v.array(v.string()),
        immediateActions: v.array(v.string()),
        keyFinancials: v.array(v.string()),
        confidenceScore: v.number(),
        rawResponse: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // 1. Save the briefing
        const briefingId = await ctx.db.insert("briefings", {
            sessionId: args.sessionId,
            strategicRisks: args.strategicRisks,
            immediateActions: args.immediateActions,
            keyFinancials: args.keyFinancials,
            confidenceScore: args.confidenceScore,
            rawResponse: args.rawResponse,
            generatedAt: Date.now(),
        })

        // 2. Update session status to ready
        await ctx.db.patch(args.sessionId, {
            status: "ready",
        })

        return briefingId
    },
})

// ======================================
// QUERIES (Read data)
// ======================================

export const getBriefingForSession = query({
    args: { sessionId: v.id("sessions") },
    handler: async (ctx, args) => {
        // Since there's one briefing per session ideally, just grab the first match
        return await ctx.db
            .query("briefings")
            .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
            .first()
    },
})
