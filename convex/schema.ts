import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
    users: defineTable({
        email: v.string(),
        name: v.optional(v.string()),
        // We'll add auth identifiers later
    }).index("by_email", ["email"]),

    sessions: defineTable({
        userId: v.optional(v.id("users")),
        title: v.string(), // e.g., "Earnings Report Q3"
        createdAt: v.number(),
        status: v.string(), // e.g., "processing", "ready", "failed"
    }).index("by_user", ["userId"]),

    files: defineTable({
        sessionId: v.id("sessions"),
        storageId: v.id("_storage"),
        format: v.string(), // e.g., "pdf", "image/png", "audio/mp3", "video/mp4"
        name: v.string(),
        size: v.number(),
        uploadedAt: v.number(),
    }).index("by_session", ["sessionId"]),

    briefings: defineTable({
        sessionId: v.id("sessions"),
        strategicRisks: v.array(v.string()),
        immediateActions: v.array(v.string()),
        keyFinancials: v.array(v.string()),
        confidenceScore: v.number(),
        rawResponse: v.optional(v.string()), // Entire model output if needed
        generatedAt: v.number(),
    }).index("by_session", ["sessionId"]),
})
