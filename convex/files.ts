import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

// ======================================
// STORAGE URL GENERATION
// ======================================

// Generate an upload URL for the frontend
export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl()
})

// ======================================
// MUTATIONS (Write data)
// ======================================

// Save metadata for an uploaded file
export const saveFileMetadata = mutation({
    args: {
        sessionId: v.id("sessions"),
        storageId: v.id("_storage"),
        format: v.string(),
        name: v.string(),
        size: v.number(),
    },
    handler: async (ctx, args) => {
        // 1. Insert file record
        const fileId = await ctx.db.insert("files", {
            sessionId: args.sessionId,
            storageId: args.storageId,
            format: args.format,
            name: args.name,
            size: args.size,
            uploadedAt: Date.now(),
        })

        // 2. Automatically update session status to reflect that files are uploaded
        await ctx.db.patch(args.sessionId, {
            status: "files_uploaded"
        })

        return fileId
    },
})

// ======================================
// QUERIES (Read data)
// ======================================

// Get all files for a specific session
export const getSessionFiles = query({
    args: { sessionId: v.id("sessions") },
    handler: async (ctx, args) => {
        const files = await ctx.db
            .query("files")
            .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
            .collect()

        // Add download URLs to the files
        return Promise.all(
            files.map(async (file) => ({
                ...file,
                url: await ctx.storage.getUrl(file.storageId),
            }))
        )
    },
})
