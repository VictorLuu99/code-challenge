# Problem 5 - CRUD Server

A small Express + TypeScript service that exposes CRUD endpoints over
a `Task` resource. PostgreSQL via Prisma. Packaged with Docker Compose
so a reviewer can run it with one command.

## Stack

- Node.js 20, Express 4, TypeScript 5
- Prisma 5 + PostgreSQL 16
- Zod for request validation
- Pino for logging
- Vitest + supertest for integration tests
- Docker / Docker Compose

## Quick start (Docker)

```
cp .env.example .env
docker compose up --build
```

The API is then served on `http://localhost:3000`.

The `app` container runs `prisma migrate deploy` on startup.

## Local development (DB in Docker, app on host)

```
cp .env.example .env
docker compose up db -d
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

## Endpoints

Base path: `/api/v1`

| Method | Path           | Description                              |
|--------|----------------|------------------------------------------|
| POST   | `/tasks`       | Create a task                            |
| GET    | `/tasks`       | List with filters/pagination/sort        |
| GET    | `/tasks/:id`   | Get one task                             |
| PATCH  | `/tasks/:id`   | Partial update                           |
| DELETE | `/tasks/:id`   | Delete                                   |
| GET    | `/health`      | Health check (no `/api/v1` prefix)       |

### List query parameters

- `status` - `todo` | `in_progress` | `done`
- `priority` - `low` | `medium` | `high`
- `q` - case-insensitive substring match on title
- `dueBefore` - ISO-8601 timestamp
- `page` - default `1`
- `limit` - default `20`, max `100`
- `sort` - `<field>:asc|desc` where field is `createdAt`, `updatedAt`, `dueDate`, `priority`, or `status` (default `createdAt:desc`)

### Examples

```
curl -s -X POST http://localhost:3000/api/v1/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":"Refactor auth","priority":"high","dueDate":"2026-06-01T00:00:00Z"}'

curl -s 'http://localhost:3000/api/v1/tasks?status=todo&priority=high&page=1&limit=10&sort=dueDate:asc'

curl -s -X PATCH http://localhost:3000/api/v1/tasks/<id> \
  -H 'Content-Type: application/json' \
  -d '{"status":"done"}'
```

## Project layout

```
src/
  config/         env loader
  db/             prisma client singleton
  modules/tasks/  routes, controller, service, zod schemas
  middlewares/    error handler, request logger, 404
  utils/          AppError, asyncHandler, pagination
  app.ts          Express app factory
  server.ts       boot
prisma/
  schema.prisma
  seed.ts
tests/            vitest + supertest integration tests
```

## Tests

```
docker compose up db -d
docker exec problem5-db-1 psql -U postgres -c "CREATE DATABASE tasks_test;"
npm test
```

The test runner uses `.env.test`; migrations are applied automatically
by the test setup file and the test database is reset between cases.

## Notes

- The service is intentionally not user-scoped; auth is out of scope
  for this problem.
- Rate limiting is configured but generous (100 req/min by default).
- The `tasks_test` database must exist before running tests; create it
  with the `psql` command above (run once).
