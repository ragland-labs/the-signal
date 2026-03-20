import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

// ======================================
// MUTATIONS (Write data)
// ======================================

// Initialize a new session
export const createSession = mutation({
    args: {
        userId: v.optional(v.id("users")), // optional for MVP without auth
        title: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const sessionId = await ctx.db.insert("sessions", {
            userId: args.userId,
            title: args.title || "New Briefing",
            createdAt: Date.now(),
            status: "idle",
        })
        return sessionId
    },
})

// Update session status (idle, processing, ready, failed)
export const updateSessionStatus = mutation({
    args: {
        sessionId: v.id("sessions"),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.sessionId, {
            status: args.status,
        })
    },
})

// ======================================
// QUERIES (Read data)
// ======================================

// Get a specific session by ID
export const getSession = query({
    args: { sessionId: v.id("sessions") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.sessionId)
    },
})

// Get all sessions for a user
export const getUserSessions = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("sessions")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .order("desc") // Newest first
            .collect()
    },
})
