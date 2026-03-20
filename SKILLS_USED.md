# Recommended & Used Skills

This document tracks the AI agent skills installed and used to guide development processes, architecture, and code quality.

## Actively Used
- **`find-skills` (vercel-labs)**: Provides an interactive CLI (`npx skills`) to dynamically discover and install domain expertise for agents.
- **`copywriting`**: Ensures executive-grade language is used throughout the product UI and generated briefings.
- **`gemini-api-dev`**: Deep knowledge of the Gemini API specifications, primarily used for structuring requests that utilize the 5-modality capabilities (text, image, video, audio, PDF) simultaneously via the File API and inline data.

## Recommended Skills for Project Phases
These are identified as necessary for the project transition to a Convex SaaS:

### Architecture & Backend
- **`convex-best-practices`**: Essential for designing efficient schema, indexing, and queries.
- **`convex-file-storage`**: Crucial for securely handling the uploads of large audio and video files before processing by the Gemini API.
- **`convex-agents`**: For building the backend workflows securely.
- **`convex-security-audit`**: To ensure the MVP SaaS database and external API proxy remain secure.

### Automated Testing & DevOps
- **`convex-migrations`**: Required when evolving the schemas in the future.
