# Donezo Full Stack Application

A simple todo app: an Express + Prisma backend backed by Supabase Postgres, and a
React (Vite) single-page frontend that authenticates against Supabase.

## Backend

The backend connects to Supabase using Prisma (see
[the Supabase + Prisma guide](https://supabase.com/partners/integrations/prisma)).
It does not handle authentication itself — only authorization: it verifies the
Supabase-issued JWT on each request.

See [`backend/README.md`](backend/README.md) for backend-specific setup.

## Frontend

The frontend is a React single-page application. It uses the Supabase
Authentication service (via a Supabase client) and talks to the backend API.

See [`frontend/README.md`](frontend/README.md) for frontend-specific setup.

---

## Deployment

The project is containerized and runs anywhere Docker runs (Render, Fly.io,
Railway, a VPS, etc.). The database is Supabase (managed separately).

### Environment variables

**Backend** (`backend/.env` — copy from `backend/.env.example`):

| Variable       | Required | Description                                                        |
| -------------- | -------- | ------------------------------------------------------------------ |
| `DATABASE_URL` | yes      | Supabase pooled connection string (used by Prisma at runtime).     |
| `DIRECT_URL`   | yes      | Supabase direct connection string (used for migrations).           |
| `DATABASE_PASS`| no       | Supabase database password (reference).                            |
| `JWT_SECRET`   | yes      | Supabase JWT secret (Project Settings → API → JWT). Verifies tokens. |
| `PORT`         | no       | Port to listen on. Defaults to `8080`; most hosts inject this.     |
| `CORS_ORIGIN`  | no       | Comma-separated allowed origins. Unset = allow all (dev only).     |

**Frontend** (build-time, baked into the bundle by Vite — copy from `frontend/.env.example`):

| Variable                  | Required | Description                                    |
| ------------------------- | -------- | ---------------------------------------------- |
| `VITE_API_URL`            | yes      | Public URL of the backend API (no trailing /). |
| `VITE_SUPABASE_URL`       | yes      | Supabase project URL.                          |
| `VITE_SUPABASE_ANON_KEY`  | yes      | Supabase anon/public key.                      |

> Frontend variables are **build-time**: changing them requires rebuilding the
> frontend image.

### Run everything with Docker Compose

```bash
# 1. Backend secrets
cp backend/.env.example backend/.env   # then fill in DATABASE_URL, JWT_SECRET, ...

# 2. Compose-level vars (frontend build args + CORS origin)
cp .env.example .env                   # then fill in VITE_SUPABASE_* etc.

# 3. Build and start
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend:  http://localhost:8080 (health check at `/health`)

### Build / run the images individually

```bash
# Backend
docker build -t donezo-backend ./backend
docker run --env-file backend/.env -p 8080:8080 donezo-backend

# Frontend (Vite vars passed as build args)
docker build -t donezo-frontend ./frontend \
  --build-arg VITE_API_URL=https://api.example.com \
  --build-arg VITE_SUPABASE_URL=https://your-project.supabase.co \
  --build-arg VITE_SUPABASE_ANON_KEY=your-anon-key
docker run -p 3000:80 donezo-frontend
```

### Deploying to a PaaS

- **Backend**: deploy `backend/` as a Docker web service. Set the env vars above
  in the platform dashboard. The image runs `npm start`, and `prisma generate`
  runs automatically on install. Set `CORS_ORIGIN` to your frontend's URL.
- **Frontend**: deploy `frontend/` as a Docker image (or as a static site by
  running `npm run build` and serving `dist/`). Provide the `VITE_*` values as
  build args / build-time env vars.

The database schema is managed in Supabase. If you change `prisma/schema.prisma`,
push it with `npx prisma db push` (using `DIRECT_URL`) before deploying.
