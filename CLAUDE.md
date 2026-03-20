# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**The Signal** is an executive intelligence briefing system. Users upload documents (PDFs, images, audio, video, text) and the system uses Google Gemini to produce structured intelligence briefings: Strategic Risks, Immediate Actions, and Key Financials with a confidence score.

The project is a React + Convex + Gemini SaaS MVP. All backend logic runs on Convex; the frontend is React 19 with Tailwind CSS v4.

## Commands

```bash
# From the-signal/ directory
npm run dev       # Start Vite dev server (also runs convex dev in watch mode)
npm run build     # TypeScript check + Vite production build
npm run lint      # Run ESLint
npm run preview   # Preview production build

# Convex backend (run separately if needed)
npx convex dev    # Watch & sync backend functions to Convex cloud
npx convex deploy # Deploy backend to production
```

The `.env.local` file holds `VITE_CONVEX_URL` and `CONVEX_DEPLOYMENT`. The `GEMINI_API_KEY` environment variable must be set in the Convex dashboard (not in `.env.local`) because it's consumed server-side by Convex actions.

## Architecture

### Data Flow

1. **Upload**: Browser → Dropzone → `sessions.createSession()` → `files.generateUploadUrl()` × N → POST bytes to Convex Storage → `files.saveFileMetadata()` (session status → `"files_uploaded"`)
2. **Generate**: Dropzone → `gemini.generateBriefing(sessionId)` → fetch files from storage → base64-encode → Gemini 2.5 Pro API → parse JSON → `briefings.saveBriefing()` (session status → `"ready"`)
3. **Display**: `App.tsx` subscribes to `briefings.getBriefingForSession()` via `useQuery`; renders when briefing exists

### Convex Backend (`convex/`)

| File | Purpose |
|------|---------|
| `schema.ts` | Defines `users`, `sessions`, `files`, `briefings` tables |
| `sessions.ts` | Session lifecycle CRUD; status: `idle → files_uploaded → processing → ready/failed` |
| `files.ts` | `generateUploadUrl()`, `saveFileMetadata()`, `getSessionFiles()` with download URLs |
| `briefings.ts` | `saveBriefing()` and `getBriefingForSession()` |
| `gemini.ts` | Main AI action: rate-limit → fetch files → base64 → Gemini 2.5 Pro → parse → save |
| `rateLimiter.ts` | Token bucket: 15 requests per 60 seconds globally |
| `convex.config.ts` | Registers `@convex-dev/rate-limiter` and `@convex-dev/action-cache` components |

**Important**: Convex `action` functions (like `generateBriefing`) cannot directly call mutations — they must use `ctx.runMutation(internal.*)` or `ctx.runMutation(api.*)`. Rate limiting is enforced via an `internalMutation` called from within the action.

### React Frontend (`src/`)

- `main.tsx` — wraps app with `ConvexReactClient`
- `App.tsx` — session state, `useQuery` subscriptions, briefing result rendering
- `components/ui/Dropzone.tsx` — file staging, concurrent upload orchestration, triggers generation
- `components/ui/StatusBar.tsx` — animated 3-step progress during processing
- `components/layout/` — Topbar (theme toggle), Hero, Footer
- `index.css` — Tailwind v4 + CSS custom properties for theming

### Design System

CSS custom properties defined in `index.css` with `data-theme` attribute on `<html>`. Colors: `--bg`, `--bg-card`, `--border`, `--text`, `--text-dim`, `--red`, `--amber`, `--green`. Fonts: Cormorant Garamond (display/headings), IBM Plex Sans (body), IBM Plex Mono (code/labels). Dark mode is the default; light mode toggled via localStorage.

### Key Patterns

- **Session-scoped everything**: Files and briefings belong to a session. Session status drives UI state.
- **Real-time via Convex `useQuery`**: Components auto-update when database changes — no polling.
- **Multimodal files sent inline**: Files are base64-encoded and sent as `inlineData` to Gemini. Large files (audio/video) will need Gemini File API upload instead.
- **Forced JSON output**: Gemini called with `responseMimeType: "application/json"` and a strict schema prompt.

## Design Context

### Users
Anyone seeking structured intelligence from raw documents — executives, analysts, founders, investors. The core job-to-be-done: upload something dense and messy, receive clear, actionable structure. Users arrive with varying technical literacy but high time pressure and expectations for quality output.

### Brand Personality
**Sharp · Premium · Calm** — The interface should feel like a well-edited intelligence report, not a dashboard. Authoritative without being loud. Confidence conveyed through restraint.

### Aesthetic Direction
Editorial intelligence — The Atlantic meets NYT digital. Serif display type grounds the experience in gravitas; mono labels add analytical precision; generous whitespace lets the content breathe. Dark navy is the primary environment; warm beige light mode is equally considered. No flashy gradients or aggressive UI chrome — every visual detail earns its place.

Anti-references: avoid the "AI chatbot" aesthetic (floating bubbles, rounded-everything, purple gradients), avoid data-dashboard density that overwhelms rather than clarifies.

### Mobile / iOS
Best-practice mobile-first approach: briefings readable on phone are the primary mobile use case, but file upload (from camera roll, Files app, share sheet) must work natively. Touch targets ≥ 44px, no hover-only interactions, bottom-anchored CTAs on small screens, iOS safe area insets respected.

### Design Principles
1. **Clarity over completeness** — Show what matters. Every element that doesn't aid comprehension should be removed or subordinated.
2. **Editorial restraint** — Typography and whitespace carry the weight. Color and motion are accents, not features.
3. **Confidence through precision** — Exact labels, structured output, confidence scores. Never vague.
4. **Mobile is a first-class surface** — The experience on iOS must feel intentional, not adapted.
5. **The output is the product** — The briefing result is the hero. Upload UI is a means to an end.

## Multimodal File Handling

`gemini.ts` routes files to one of two paths based on type and size:

- **Inline base64** (`inlineData`): images, small PDFs, text files under 15 MB
- **Gemini File API** (`fileData`): audio/\*, video/\*, any file > 15 MB

The File API path polls for `ACTIVE` state (up to ~60s, 2s interval). Files are fetched from Convex Storage, converted to `Blob`, uploaded, then referenced by URI in the Gemini request.

## Planned Enhancements

- **Gemini Embeddings**: Integrate `gemini-embedding-exp-03-07` for semantic search / document similarity across briefings.
- **Auth**: `users` table exists in schema but auth is not yet wired; `userId` on sessions is optional.
