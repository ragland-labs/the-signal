# Spec-Driven Agentic System Architecture

To evolve The Signal into a scalable SaaS, we will implement a multi-agent system based on spec-driven development patterns, using Convex as the backend foundation. 

## Agent Architecture
We follow a hierarchical sub-agent model:

1. **Planner Agent (Top-Level Orchestrator)**
   - Responsibilities: Analyzes user requests, defines specs, delegates tasks to sub-agents, and verifies final integration.
   - Key Tools: `find-skills` to dynamically load best-practice constraints and guidelines.

2. **Architecture Agent**
   - Responsibilities: Designs the system schemas (e.g., Convex tables for users, sessions, files, and briefings) and ensures that all modules adhere to `convex-best-practices`.
   - Output: Generates the `schema.ts`.

3. **Backend Agent**
   - Responsibilities: Implements the Convex backend logic (Mutations, Queries, Actions, CRON jobs). Follows patterns from the `convexskills` repository by Wayne Sutton.
   - Focus: Security (`convex-security-audit`), handling secure direct uploads to Convex File Storage (`convex-file-storage`), and grouping diverse files into chronological sessions.

4. **Frontend Agent**
   - Responsibilities: Translates backend data into React components. Focuses on speed, modularity, and UX (leveraging Vite or Next.js), especially for handling a unified drag-and-drop zone that correctly accepts all 5 media modalities.

5. **API Integration Agent**
   - Responsibilities: Wraps external APIs (e.g., Gemini 2.5 Pro Multimodal API). Utilizes the `gemini-api-dev` skill to format payload requests correctly, ensuring text, images, audio, video, and PDFs are sent as valid `Part` objects.

6. **Documentation Agent**
   - Responsibilities: Continuously updates `PROGRESS_LOG.md`, `SKILLS_USED.md`, and other system files to act as organizational memory.
