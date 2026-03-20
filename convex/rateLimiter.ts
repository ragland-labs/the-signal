import { RateLimiter } from "@convex-dev/rate-limiter";
import { components } from "./_generated/api";

export const rateLimiter = new RateLimiter(components.rateLimiter, {
    // Per-minute limit: matches Gemini free tier (5 RPM)
    // Prevents quota errors in demo/free-tier usage
    generateBriefingGlobal: {
        kind: "token bucket",
        rate: 5,
        period: 60000,   // 1 minute
        capacity: 5
    },
    // Daily ceiling: Gemini 2.5 Pro free tier is 25 requests/day
    // Set to 20 to leave a buffer for testing/retries
    generateBriefingDaily: {
        kind: "token bucket",
        rate: 20,
        period: 86400000, // 24 hours
        capacity: 20
    },
});
