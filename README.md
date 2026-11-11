# PrepMaster AI

A personal daily placement-practice platform. Phase 1 includes a responsive React dashboard and an Express API health endpoint. The repository also includes the planned MongoDB schemas and architecture notes for subsequent phases.

## Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- AI: OpenAI Responses API (server-side only)
- Coding evaluation (later phase): isolated Judge0-compatible execution service

## Requirements
- Node.js 20+
- MongoDB local instance or MongoDB Atlas connection string

## Run locally

### 1. Backend
```bash
cd server
cp .env.example .env
npm install
npm run dev
```
Set `MONGODB_URI` in `server/.env`. `OPENAI_API_KEY` is not needed for Phase 1.

### 2. Frontend
```bash
cd client
npm install
npm run dev
```
Open the Vite URL, usually http://localhost:5173.

## Phase 1 scope
- Dashboard layout and navigation
- Daily test overview: 10 vocabulary, 10 reasoning, 10 arithmetic/logical, 1 coding
- Section timing overview
- Recent activity and progress visual placeholders clearly marked as not yet populated
- Backend health endpoint

## Planned phases
1. Dashboard and application foundation (current)
2. Daily test lifecycle and section timer
3. OpenAI question generation with structured outputs and validation
4. Submission, scoring, and result explanations
5. Coding editor and sandboxed code evaluation
6. History, analytics, adaptive difficulty, and deployment

## Security notes
- Never put the OpenAI API key in the client app.
- Do not execute submitted code inside the Express process or on the application host.
- Keep answer keys on the server; only send question text and options to the browser during an active test.
- Enforce test deadlines on the server, not only with a browser timer.
