# Architecture: The Signal

## Current Architecture
The application currently operates with a zero-build-step, pure client-side architecture. 

### Key Components
- **Frontend**: Pure HTML, CSS, and Vanilla JavaScript (`app.html`, `index.html`, `landing.html`). No framework (e.g., React/Vue) or build tool (e.g., Webpack/Vite) is used.
- **Document Parsing**: `PDF.js` operates locally in the browser to extract text from user-uploaded PDFs.
- **AI Integration**: The Gemini API (`gemini-3-pro-preview`) is used to synthesize extracted text into JSON-structured briefings.
- **Serverless Proxy**: Cloudflare Pages Functions (`/functions/api/analyze.js`) proxy requests to the Gemini API to keep the API key secure.

### Technical Limitations
- **No Persistence**: Refreshing the page loses the parsed document and history.
- **Vanilla JS Scalability**: Managing complex state (loading, errors, multiple briefings) in a single vanilla JS file (`app.html` is ~1500 lines) becomes brittle as features grow.
- **File Types**: Currently exclusively optimized for PDF parsing on the client.

---

## Target SaaS Architecture (Convex Backend)
To evolve the project into a scalable SaaS product, the architecture will transition to a modern stack emphasizing simplicity, multimodal session history, and modularity.

### Proposed Stack
- **Frontend Framework**: React (Next.js or Vite) to allow component-based architecture and seamless integration with Convex.
- **Backend & Database**: **Convex** will replace the Cloudflare Pages Function. Convex will handle:
  - Database (storing user data, session definitions, and briefing history).
  - Storage (Convex File Storage to securely hold text, images, video, audio, and pdfs).
  - Server Functions & Actions (interacting with the Gemini API securely).
  - Real-time updates to the client.
  - *Post-MVP: Indexing components for Vector Search to support RAG workflows.*
- **Authentication**: Clerk (natively integrates with Convex) for secure user login and session management.
- **AI Orchestration**: Convex Actions will manage the workflow of fetching files from storage, packaging them into the required Gemini API schema for multimodal processing (using the `gemini-api-dev` skill guidelines), and generating the resulting briefing JSON.

### Integration Points
- **Client -> Convex Queries/Mutations**: Standard database reads/writes for user state and tracking session history.
- **Client -> Convex Storage**: Direct, authenticated file uploads for the 5-modality media items.
- **Convex Action -> Gemini API**: Securely passing the array of multimodal file objects to the `gemini-2.5-pro` model to synthesize a comprehensive briefing based on the total session context.
