# Career Growth Tracker

Full-stack Django + React app to set learning goals, break them into tasks, attach resources, and track progress with a dashboard.

## Tech Stack
- Backend: Python, Django, Django REST Framework, SimpleJWT (JWT auth), PostgreSQL (SQLite fallback), django-cors-headers.
- Frontend: React (Vite), React Router, Axios, Bootstrap 5.
- Testing: Django tests for API.

## Features
- Auth: JWT login (`/api/auth/login/`).
- Goals: create/list/detail/delete.
- Tasks: per goal, with status (todo/doing/done) to track progress.
- Resources: links per goal (article/video/course/other).
- Dashboard: totals for goals and tasks plus category breakdown.

## Quick Start (Local)
### Backend
```
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env    # set SECRET_KEY; leave DB_* blank for SQLite or set Postgres
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver   # http://127.0.0.1:8000
```

### Frontend
```
cd frontend
npm install
cp .env.example .env   # keeps VITE_API_URL=http://localhost:8000/api
npm run dev             # usually http://localhost:5173
```

## Using the App
1) Start backend and frontend (see above).
2) Login on the frontend with the superuser you created.
3) Add Goals on the Goals page; click a goal to open its detail.
4) In Goal Detail, add Tasks (set status todo/doing/done) and Resources (links).
5) Dashboard shows progress (tasks by status, goals by category, totals).

## API Reference (core)
- `POST /api/auth/login/` → `{access, refresh}`
- Goals: `GET/POST /api/goals/`, `GET/PUT/PATCH/DELETE /api/goals/:id/`
- Tasks: `GET/POST /api/tasks/?goal=<id>`, `GET/PUT/PATCH/DELETE /api/tasks/:id/`
- Resources: `GET/POST /api/resources/?goal=<id>`, `GET/PUT/PATCH/DELETE /api/resources/:id/`
- Dashboard: `GET /api/dashboard/summary/`

## Environment
- Backend env sample: `backend/.env.example`
- Frontend env sample: `frontend/.env.example`

## Tests
```
cd backend
source .venv/bin/activate
python manage.py test tracker
```

## Deploy Notes (high level)
- Backend: configure Postgres env vars and `ALLOWED_HOSTS`, run `collectstatic` if needed, serve via Gunicorn/Uvicorn + reverse proxy.
- Frontend: `npm run build`, host static build (S3/CloudFront, Netlify, etc.), set `VITE_API_URL` to your backend. 

## Deployment Checklist (short)
- Backend deps installed (`pip install -r backend/requirements.txt`) and Postgres up.
- Env set on server: `SECRET_KEY`, `DEBUG=False`, `ALLOWED_HOSTS=<domain,ip>`, `DB_*` pointing to Postgres.
- Run DB setup from `backend/`: `python manage.py migrate` then `python manage.py createsuperuser` (optional).
- Collect static files if serving them: `python manage.py collectstatic`.
- Start app with a process manager + reverse proxy; confirm an API endpoint (e.g., `/api/dashboard/summary/`) and `/admin` load.
