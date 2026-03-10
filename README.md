# The Signal — Intelligence Briefing System

A client-side executive intelligence briefing tool. Drop in any document — RFP, legal filing, earnings release — and receive a structured briefing with strategic risks, immediate actions, and key financials. Powered by the Gemini API.

## Project Structure

```
the-signal/
├── index.html      # Landing page
├── app.html        # Intelligence briefing application
├── _redirects      # Cloudflare Pages routing
├── _headers        # Cloudflare Pages security headers
└── README.md       # This file
```

## Tech Stack

- Pure HTML/CSS/JS — zero build step, zero dependencies
- [Gemini API](https://ai.google.dev/) — `gemini-3-pro-preview` for document synthesis
- [PDF.js](https://mozilla.github.io/pdf.js/) — client-side PDF parsing
- Google Fonts: Cormorant Garamond + IBM Plex Mono

## Deploying to Cloudflare Pages

1. Push this repo to GitHub
2. Go to [Cloudflare Pages](https://pages.cloudflare.com) → Create a project
3. Connect your GitHub repo
4. Build settings:
   - **Framework preset**: None
   - **Build command**: *(leave empty)*
   - **Output directory**: `/` (root)
5. **Environment Variables**:
   - In the Cloudflare Pages dashboard, go to **Settings** → **Environment variables**.
   - Add a variable named `GEMINI_API_KEY`.
   - Paste your Gemini API key from [Google AI Studio](https://aistudio.google.dev/).
6. **Save and Deploy**. (You may need to trigger a new deployment for the variable to take effect).

That's it. No build process, no environment variables needed.

## Security & Privacy

- **API Security**: The API key is stored securely in Cloudflare's environment variables. It is never exposed in the client-side code or the public GitHub repository. calls are proxied through a serverless function (`/functions/api/analyze.js`).
- **Data Privacy**: All document processing happens within the Gemini API. No document content is stored on the Cloudflare server or in the browser after the session ends.

## Running Locally

Open `index.html` in any browser — no server required.

Or use any simple static server:
```bash
npx serve .
# or
python3 -m http.server 8080
```

## Design System

- **Colors**: Steel blue accent (`#2F5F85` light / `#5B8FBA` dark), cream background, deep navy dark mode
- **Typography**: Cormorant Garamond (editorial display) + IBM Plex Mono (data/labels)
- **Theme**: Auto-detects system preference, toggle available in both pages
