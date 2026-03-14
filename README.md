# Student Task Portal MVP

A presentation-ready hackathon MVP that helps students turn a broad assignment prompt into a focused study dashboard.

---

## 1) Elevator pitch

**Student Task Portal** is a lightweight web app where a student enters a task (for example, *"Write an essay on the New Deal"*), optionally uploads class documents, and receives a structured dashboard with:

- Best matches
- Course materials
- Past assignments
- Reputable online sources
- Suggested study plan

The product goal is to reduce time spent searching and increase time spent learning.

---

## 2) Problem this solves

Students often start with an unclear prompt and scattered resources. They need to quickly answer:

1. What should I review first?
2. Which class materials are relevant?
3. Which external sources are trustworthy?

This MVP solves that by centralizing retrieval and showing organized, source-labeled results in one place.

---

## 3) Demo flow (what to show in a presentation)

1. Open the homepage.
2. Paste a task prompt.
3. Upload course notes or prior assignments.
4. Click **Generate Study Dashboard**.
5. Walk through each result section.
6. Highlight the academic-integrity warning (guidance only, no copying).

---

## 4) Architecture at a glance

### Frontend (Vanilla HTML/CSS/JS)
- Collects task input + files
- Sends multipart request to backend
- Renders categorized result cards from JSON

### Backend (Node.js + Express)
- Accepts `POST /api/process-task`
- Stores uploaded files via Multer
- Runs retrieval orchestration service
- Returns structured JSON payload to UI

### Retrieval service
- **Mock mode** for offline/demo reliability
- **OpenAI mode** scaffold using Responses API + web search tool
- Normalizes online source links to be task-specific (avoids generic homepage links)

---

## 5) Codebase walkthrough
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
