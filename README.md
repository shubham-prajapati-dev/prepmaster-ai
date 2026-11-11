# PrepMaster AI

AI-powered daily placement assessment platform.

## Stack
- React + Vite
- Node.js + Express
- MongoDB + Mongoose
- OpenAI API (planned integration)

## Phase 2: Run the application

### 1. Prerequisites
- Node.js 20 or newer
- MongoDB running locally, or a MongoDB Atlas connection string

### 2. Install dependencies
Run this from the project root (the folder containing this README and package.json):

```bash
npm install
```

The root package uses npm workspaces, so this installs both frontend and backend dependencies.

### 3. Configure the backend
Copy `server/.env.example` to `server/.env`, then set:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/prepmaster_ai
CLIENT_URL=http://localhost:5173
```

Do not add your OpenAI key to the React client. It will be configured on the server when AI integration is implemented.

### 4. Start both applications
From the project root:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend health check: http://localhost:5000/api/health

You can also run only one service:
```bash
npm run dev:client
npm run dev:server
```

## Phase 2 features
- 10 vocabulary MCQs
- 10 reasoning MCQs
- 10 arithmetic/logical MCQs
- 1 C++ coding prompt
- Section-specific countdown timers
- Question palette and navigation
- Mark for review
- Automatic section progression when time expires
- MCQ score summary

## Current limitations
This phase uses a local demonstration question bank. AI question generation, secure server-side scoring, code execution, persistent attempts, and adaptive difficulty will be added in later phases. The coding editor currently stores the submitted code in the browser session; it does not compile or execute code yet.
