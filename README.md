# AI Project Mentor

A beginner-friendly full-stack training application where users can manage software projects, development tasks, and ask an AI mentor to break requirements into tasks.

## Application objective

AI Project Mentor helps learners practise full-stack development by:

- Creating and managing software projects.
- Adding development tasks and updating their priorities and statuses.
- Viewing project progress through a dashboard.
- Asking an AI mentor to break requirements into development tasks.
- Viewing previous AI interactions.

The frontend runs entirely on mock data so students can explore the UI before connecting a backend.

## Technology stack

- HTML5, CSS3, JavaScript ES6+
- React.js (functional components and hooks)
- Vite (React build tool)
- React Router DOM (navigation)
- Axios (prepared for future backend API calls)
- lucide-react (icons)

No TypeScript, Next.js, or Supabase is used.

## Current frontend features

- Responsive sidebar and collapsible mobile navigation.
- Dashboard with summary cards, project progress, recent tasks, and AI recommendation.
- Projects page with create, edit, and delete (confirmation dialog included).
- Project details page with per-project task list and progress bar.
- Tasks page with filters (project, priority, status), search, inline status change, and CRUD.
- AI Mentor page with structured mock response and task-generation actions.
- AI History page with filters and full-response viewer.
- Reusable UI components: LoadingSpinner, ErrorMessage, SuccessMessage, EmptyState, ConfirmDialog, Modal, Badges.
- Form validation with inline error messages.

## Planned backend technologies

- Python
- FastAPI REST APIs
- SQL Server database
- Ollama Cloud API using a GPT-OSS model

The Ollama API key and database credentials will live only in the Python backend.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Production build

```bash
npm run build
```

## Folder structure

```
src/
  components/
    Layout/        App shell, sidebar, header
    Common/        Reusable UI components (Modal, badges, spinners, etc.)
  context/         DataContext providing in-memory mock CRUD state
  data/            mockData.js (projects, tasks, AI interactions)
  pages/           One file per route (Dashboard, Projects, Tasks, AI, etc.)
  services/        api.js (Axios service prepared for the FastAPI backend)
  styles/          global.css (theme, components, utilities)
  App.jsx          Router and providers
  main.jsx         React entry point
```

## Environment variables

Copy `.env.example` to `.env` and adjust as needed:

| Variable              | Description                                          | Default                |
| --------------------- | ---------------------------------------------------- | ---------------------- |
| `VITE_API_BASE_URL`   | Base URL of the future FastAPI backend               | `http://127.0.0.1:8000` |
| `VITE_USE_MOCK_DATA`  | When `true` the app uses mock data instead of APIs   | `true`                 |

Never place the Ollama API key, database username, database password, or SQL Server connection string in the frontend. Those belong only in the Python backend.

## Future FastAPI integration plan

The frontend is prepared to consume these endpoints once the backend is ready:

- `GET /api/health`
- `GET /api/dashboard`
- `GET /api/projects` · `POST /api/projects` · `GET /api/projects/{id}` · `PUT /api/projects/{id}` · `DELETE /api/projects/{id}`
- `GET /api/tasks` · `POST /api/tasks` · `GET /api/tasks/{id}` · `PUT /api/tasks/{id}` · `PATCH /api/tasks/{id}/status` · `DELETE /api/tasks/{id}`
- `POST /api/ai/plan` · `POST /api/ai/next-task` · `GET /api/ai/history/{project_id}`

Reusable Axios functions for these endpoints already exist in `src/services/api.js`. To switch from mock data to the real backend, set `VITE_USE_MOCK_DATA=false` and replace the functions in `src/context/DataContext.jsx` with calls to the API service.
