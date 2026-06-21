# WEp — Portal Educativo

Monorepo for Colegio Bernardo O'Higgins academic management platform.

## Architecture

- **frontend/**: React 18 SPA (Vite + TailwindCSS + Zustand + React Router v6)
- **backend/**: Hono microservices + BFF gateway
  - `backend/bff/`: Single API gateway (`:3000`), JWT middleware on `/api/*`, Swagger UI at `/docs`
  - `backend/microservicios/`: 10 independent Hono services, each with own PostgreSQL schema
  - Each service: `controllers/ → services/ → repositories/ → models/` (Drizzle ORM + postgres.js)
  - **No shared packages between microservices** (each standalone)

## Runtimes & Package Managers

| Area | Runtime | Install | Dev server |
|------|---------|---------|------------|
| Backend (all) | **Bun** | `bun install` | `bun run dev` |
| Frontend | **Node.js** (npm) or Bun | `npm install` or `bun install` | `npm run dev` (`:8081`) |

## Commands

### Backend (per microservice dir)
```bash
bun install
bun run dev                          # hot-reload via Bun
bun run migrate                      # Drizzle migration
bun test                             # bun test runner
bun test --coverage
```

### Root backend orchestration
```bash
cd backend
bun run dev:estudiantes              # run a specific service from root
bun run dev:bff
bun test                             # runs tests for ALL microservices
```

### Frontend
```bash
npm install
npm run dev                          # Vite at :8081 (strict port)
npm test                             # vitest watch mode
npm run test:run                     # single run
npm run test:coverage                # 80% threshold per vitest.config.ts
npm run build                        # vite build
```

### Docker (dev)
```bash
docker compose up -d                 # starts all services + DB (:5433)
docker compose stop frontend         # free port 8080 for local Vite dev
docker compose --profile seed up seed # run seed data once
```

### K8s (production)
```bash
kubectl apply -f k8s/config/
kubectl apply -f k8s/database/
kubectl apply -f k8s/microservices/
```
Uses `imagePullPolicy: Never` — change to `Always` + registry for prod.

## Testing quirks

- **Backend**: `bun test` (NOT vitest). Tests at `src/__tests__/`. Unit tests with mocked repos.
- **Frontend**: `vitest` with jsdom. Uses `@testing-library/react`. Setup at `src/__tests__/setup.ts`.
- **No linter or formatter config** in the repo — no prettier, eslint, or biome.

## Auth

- JWT HS256, `JWT_SECRET` env var (fallback: `colegio_ohiggins_secret_changeme`)
- BFF validates stateless (signature only). Auth microservice validates signature + DB session.
- Token in `sessionStorage` key `'token'`, injected as `Authorization: Bearer` by `frontend/src/api/apiClient.ts`
- Public BFF routes: `/api/auth/login`, `/api/auth/register`, `/api/estudiantes/login`, `/health`, `/docs`

## DB

- PostgreSQL 16, exposed on host `:5433` (internal `:5432`)
- Schemas per microservice (e.g., `autentificacion`, `estudiantes`, `cursos`, etc.)
- Drizzle migrations per microservice in `drizzle/` subdir. Run `bun run migrate` in each.
- Seed script at `k8s/jobs/seed-all.ts` (idempotent — skips if data exists).

## Key conventions

- Feature-based page structure in `frontend/src/pages/`
- Routes as constants in `frontend/src/config/routes.ts`
- Zustand store with `persist` middleware for user session
- TailwindCSS utility-first (no CSS modules or styled-components)
- No `.github/workflows/` — no CI/CD pipeline present
- `.vscode/settings.json` only suppresses Postman dotenv notification
