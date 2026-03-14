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

```text
.
├── public/
│   ├── index.html        # UI layout and sections
│   ├── styles.css        # Styling for cards, layout, warning, status
│   └── app.js            # Form submit, API call, render logic
├── routes/
│   └── taskRoutes.js     # POST /api/process-task + upload middleware
├── services/
│   └── retrievalService.js # Mock/OpenAI retrieval orchestration
├── uploads/              # Uploaded files storage (gitkept)
├── server.js             # Express app entrypoint and static serving
├── package.json          # Scripts + dependencies
├── .env.example          # Environment variable template
└── README.md
```

### Responsibilities by file

- `server.js` initializes Express, mounts routes, and serves frontend assets.
- `routes/taskRoutes.js` validates input, handles file uploads, and calls the retrieval layer.
- `services/retrievalService.js` produces the dashboard payload (`mock` or `openai` mode).
- `public/app.js` maps backend JSON to UI cards per section.

---

## 6) API contract

### Endpoint
`POST /api/process-task`

### Request
`multipart/form-data`
- `task` (required string)
- `documents` (optional file array)

### Response shape

```json
{
  "task": "Study for a chemistry quiz on gas laws",
  "mode": "mock",
  "warning": "Sources are for guidance...",
  "sections": {
    "bestMatches": [],
    "courseMaterials": [],
    "pastAssignments": [],
    "onlineSources": [],
    "suggestedStudyPlan": []
  },
  "adapters": {
    "localUploadSearch": "enabled-mock",
    "openAIFileSearch": "todo",
    "openAIWebSearch": "todo"
  }
}
```

---


## 7) Public link deployment (no local clone required)

To make the app accessible by URL for anyone (without cloning/running locally), deploy to **Render** using the included `render.yaml`.

### Deploy steps (5–10 minutes)

1. Push this repo to GitHub.
2. In Render, choose **New + → Blueprint**.
3. Connect your GitHub repo.
4. Render will detect `render.yaml` and create the web service.
5. Set secrets in Render dashboard:
   - `OPENAI_API_KEY` (optional; omit for mock mode)
6. Click **Apply** / **Deploy**.
7. Share the generated Render URL, e.g.:
   - `https://student-task-portal.onrender.com`

### Why this satisfies “accessible via link”

Once deployed, users can open the Render URL directly in a browser and use the app immediately—no local setup required.

---

## 8) Local setup

1. Install dependencies
   ```bash
   npm install
   ```
2. Copy env template
   ```bash
   cp .env.example .env
   ```
3. Optional: force deterministic demo mode
   ```bash
   echo "USE_MOCK_DATA=true" >> .env
   ```
4. Start server
   ```bash
   npm start
   ```
5. Open `http://localhost:3000`

---

## 9) Environment variables

From `.env.example`:

- `PORT` — server port (default `3000`)
- `OPENAI_API_KEY` — enables OpenAI mode when present
- `OPENAI_MODEL` — optional model override
- `USE_MOCK_DATA` — defaults to mock unless set to `false`

---

## 10) OpenAI integration status

Current implementation intentionally prioritizes MVP speed:

- ✅ Responses API scaffold present
- ✅ Web search tool scaffold present
- ⚠️ File-search/vector-store indexing is marked TODO for next iteration

This allows reliable hackathon demos now, with a clear path to stronger retrieval later.

---

## 11) Academic integrity guardrail

The UI and payload include a clear warning:

> Sources are guidance for studying. Students should not copy generated output as final coursework.

This keeps the product aligned with educational best practices.

---

## 12) Roadmap (post-hackathon)

1. Implement full OpenAI file-search indexing for uploaded materials.
2. Add citation quality scoring + better source deduplication.
3. Improve reranking across local + web results.
4. Add result persistence per student session.
5. Add lightweight test coverage for route and retrieval service.

---

## 13) One-sentence summary for judges

**Student Task Portal transforms a vague homework prompt into an actionable, source-labeled study plan by combining uploaded class materials and online references in a single clean dashboard.**
