# Student Task Portal MVP

Hackathon-ready MVP web app that helps students organize what to review for an assignment or quiz.

## What it does

A student enters a task such as:
- "Write an essay on the New Deal"
- "Study for a chemistry quiz on gas laws"

The app returns:
1. Best matches
2. Course materials
3. Past assignments
4. Reputable online sources
5. Suggested study plan

## Tech stack

- Frontend: HTML, CSS, vanilla JavaScript
- Backend: Node.js + Express
- Upload handling: Multer
- Optional orchestration: OpenAI Responses API

## Folder structure

```text
.
├── public/
│   ├── app.js
│   ├── index.html
│   └── styles.css
├── routes/
│   └── taskRoutes.js
├── services/
│   └── retrievalService.js
├── uploads/
├── .env.example
├── package.json
├── README.md
└── server.js
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create env file:
   ```bash
   cp .env.example .env
   ```
3. Start server:
   ```bash
   npm start
   ```
4. Open:
   ```
   http://localhost:3000
   ```

## API

### `POST /api/process-task`
Multipart form fields:
- `task` (required string)
- `documents` (optional file array)

Returns structured JSON:
- `task`
- `mode` (`mock` or `openai`)
- `warning`
- `sections` object:
  - `bestMatches`
  - `courseMaterials`
  - `pastAssignments`
  - `onlineSources`
  - `suggestedStudyPlan`
- `adapters` status object

## OpenAI wiring notes

- If `OPENAI_API_KEY` is missing or `USE_MOCK_DATA=true`, the app uses mock retrieval data.
- `services/retrievalService.js` includes TODO markers for full OpenAI file search wiring (vector store + file indexing).
- Web search tool is scaffolded via Responses API when mock mode is disabled.

## MVP guardrail

The UI includes a warning that source suggestions are for guidance only and should not be copied as final coursework.
