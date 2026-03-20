import { v } from "convex/values"
import { mutation } from "./_generated/server"

export const joinWaitlist = mutation({
    args: {
        email: v.string(),
        source: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const email = args.email.trim().toLowerCase()

        // Basic format check
        if (!email.includes("@") || !email.includes(".")) {
            throw new Error("Please enter a valid email address.")
        }

        // Idempotent — silently succeed if already signed up
        const existing = await ctx.db
            .query("waitlist")
            .withIndex("by_email", (q) => q.eq("email", email))
            .first()

        if (existing) {
            return { alreadyJoined: true }
        }

        await ctx.db.insert("waitlist", {
            email,
            joinedAt: Date.now(),
            source: args.source ?? "demo-briefing",
        })

        return { alreadyJoined: false }
    },
})
