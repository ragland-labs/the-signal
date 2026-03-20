import { defineApp } from "convex/server";
import rateLimiter from "@convex-dev/rate-limiter/convex.config";
import actionCache from "@convex-dev/action-cache/convex.config";

const app = defineApp();
app.use(rateLimiter, { name: "rateLimiter" });
app.use(actionCache, { name: "actionCache" });

export default app;
