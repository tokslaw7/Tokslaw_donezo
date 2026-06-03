# Donezo Backend

Express + Prisma API. It verifies the Supabase-issued JWT on every request and
reads/writes todos and user profiles in Supabase Postgres.

## Setup

In order to spin this project up, you need the following (from your Supabase
project settings):

1. Supabase Database URL (`DATABASE_URL`)
2. Supabase Database Direct URL (`DIRECT_URL`)
3. Supabase Database Password (`DATABASE_PASS`)
4. Supabase JWT Secret (`JWT_SECRET` — Project Settings → API → JWT Settings)

Then:

```bash
cp .env.example .env     # fill in the values above
npm install              # also runs `prisma generate`
npm run dev              # development (auto-reload)
# or
npm start                # production
```

The server listens on `PORT` (default `8080`) and exposes a `/health` endpoint.

See the root [`README.md`](../README.md) for full deployment instructions.
