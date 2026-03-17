import { RateLimiter } from "@convex-dev/rate-limiter";
import { components } from "./_generated/api";

export const rateLimiter = new RateLimiter(components.rateLimiter, {
    // Demo safety limit: max 15 requests per minute globally (bursting up to 15)
    // You can adjust these to match your Google AI Studio quota (15 RPM free tier).
    generateBriefingGlobal: {
        kind: "token bucket",
        rate: 15,
        period: 60000,
        capacity: 15
    },
});
