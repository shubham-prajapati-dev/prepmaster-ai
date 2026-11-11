# PrepMaster AI

A personal daily placement-practice platform with a React dashboard, Express API, MongoDB persistence foundation, and Gemini-generated daily assessments.

## Stack

- Frontend: React + Vite
- Backend: Node.js + Express (ES modules)
- Database: MongoDB + Mongoose
- AI provider: Google Gemini via the official `@google/genai` SDK

## Prerequisites

- Node.js 22 or newer
- npm
- MongoDB running locally or a MongoDB Atlas connection string
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/api-keys)

## Install

Run from the repository root:

```bash
npm install
```

The root package uses npm workspaces to install the client and server.

## Configure the backend

Copy `server/.env.example` to `server/.env` and fill in your own values:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/prepmaster_ai
CLIENT_ORIGIN=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.8-flash
```

Never commit `server/.env`, put the Gemini key in the React client, or expose the key in browser code. The backend loads `server/.env` by an explicit path, so the root workspace command works consistently.

## Run both applications

From the repository root:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- API health: http://localhost:5000/api/health
- Database health: http://localhost:5000/api/health/db

To run one service:

```bash
npm run dev:client
npm run dev:server
```

The backend connects to MongoDB before opening its HTTP port. If MongoDB is unavailable or `MONGODB_URI` is missing, startup fails with a visible error instead of reporting a misleading healthy API.

## Current implementation

- React dashboard and section-based assessment UI
- Local demo question bank: 10 vocabulary, 10 reasoning, 10 arithmetic/logical MCQs
- One C++ coding prompt (editor only; no execution)
- Section timers, question navigation, mark-for-review, and local MCQ scoring
- Backend MongoDB models for questions, daily tests, user profiles, and attempts
- Gemini generates 10 vocabulary, 10 reasoning, 10 arithmetic MCQs and one C++ coding prompt in a single structured assessment response
- The dashboard prepares the next Gemini assessment in the background; starting the test never waits for the Gemini request
- If Gemini or the backend is unavailable, the app falls back to the bundled local question bank

## Known limitations

- Gemini question generation requires a working backend and a valid server-side `GEMINI_API_KEY`; the dashboard displays whether fresh AI questions are ready or the local backup will be used.
- The current MCQ result calculation runs in the browser and must be moved to the backend before production use.
- Coding submissions are not compiled or executed. Do not execute user code directly on the Express server; integrate a separate isolated judge service when adding this feature.
- Authentication, server-authoritative timing, attempt persistence, adaptive difficulty, and analytics are not yet implemented.
- AI-generated questions still require semantic quality review; schema validation alone cannot guarantee that the selected answer is correct.
- The browser currently calculates MCQ scores; server-side scoring and persisted attempts remain future work.

## Gemini test endpoint

With the server running, send:

```http
POST http://localhost:5000/api/ai/generate-assessment
Content-Type: application/json

{"difficulty":"easy"}
```

Send `{"difficulty":"medium"}` as the JSON body. The endpoint returns the full assessment (10 questions per MCQ section and one coding prompt) when Gemini generation succeeds. Provider-specific errors are logged on the server; the API response intentionally does not expose internal error details.
