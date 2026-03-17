# Project Overview: The Signal

## Product Description
The Signal is a client-side executive intelligence briefing tool. It allows users to drop in dense context (RFPs, legal filings, earnings releases, audio recordings, or videos) and receive a structured briefing highlighting strategic risks, immediate actions, and key financials in seconds.

## Purpose & Problem Solved
Professionals often suffer from information overload when dealing with large, complex, and varied media. The Signal solves this by synthesizing up to 5 modalities of data into clear, actionable executive intelligence.

## Current Implementation & Vision
The current implementation is a standalone, lightweight HTML/CSS/JS application that uses PDF.js for local parsing and the Gemini API for document synthesis. 
The product vision is to expand this into a robust, scalable SaaS application leveraging Convex for persistent storage, user accounts, and expanded multimodal capabilities spanning text, images, video, audio, and PDFs.

## Minimum Viable Product (MVP) Definition
To evolve this into a scalable SaaS product, the core MVP feature set must include:
1. **User Authentication & Profiles**: Allowing users to log in, save preferences, and manage their briefing history.
2. **Multimodal Session Support**: The ability to upload any combination of Text, Images, Video, Audio, and PDFs into a single "Session" to contextually generate a briefing.
3. **Persistent Session History**: Securely storing session files and their resulting briefings for later review.
4. **Context Updating**: Allowing users to return to previous sessions, inject more context (e.g., a new document or audio file), and regenerate an updated briefing based on the combined information.

*Note: Chat interfaces and Vector Search / RAG are explicitly excluded from the MVP. The focus is strictly on the comprehensive structured briefing derived from session media.*

## Future Roadmap (Post-MVP)
- **Vector Search & Chat (RAG)**: Introducing the ability to query specific data points within uploaded documents and media via interactive chat, powered by `text-embedding-004` and Convex Vector Search.

### What Exists
- Solid frontend design system and UI (Dropzone, Loading states, Intelligence Grid).
- Prompt engineering for strategic extraction.

### What Must Be Added/Refactored
- **Backend & Database**: Migrate to a **Convex** backend, leveraging Convex File Storage for the diverse media types.
- **Authentication**: Add an Auth provider integrated with Convex.
- **State Management**: Refactor into a modular React framework for easier state management regarding sessions and diverse media types.
- **API Upgrades**: Integrate the `gemini-api-dev` skill patterns to handle the complex payload formatting required for submitting 5 distinct modalities to the Gemini API simultaneously.
