# Test Report

## Backend Tests (`bun test` from `backend/`)

**177 tests, 0 failures — 19 test files, 202 `expect()` calls**

### Microservices

| Service | Tests | Suite |
|---------|-------|-------|
| BFF (dto) | 38 | `bff/src/__tests__/dto.test.ts` |
| Asistencia | 6 | `microservicios/asistencia/src/__tests__/asistencia.service.test.ts` |
| Autentificación | 10 | `microservicios/autentificacion/src/__tests__/auth.service.test.ts` |
| Autentificación (dto) | 9 | `microservicios/autentificacion/src/__tests__/dto.test.ts` |
| Clases | 7 | `microservicios/clases/src/__tests__/clases.service.test.ts` |
| Clases (dto) | 6 | `microservicios/clases/src/__tests__/dto.test.ts` |
| Clases (horarios) | 7 | `microservicios/clases/src/__tests__/horarios.service.test.ts` |
| Cursos | 13 | `microservicios/cursos/src/__tests__/cursos.service.test.ts` |
| Cursos (dto) | 6 | `microservicios/cursos/src/__tests__/dto.test.ts` |
| Estudiantes | 12 | `microservicios/estudiantes/src/__tests__/estudiantes.service.test.ts` |
| Estudiantes (dto) | 5 | `microservicios/estudiantes/src/__tests__/dto.test.ts` |
| Horario | 10 | `microservicios/horario/src/__tests__/horario.service.test.ts` |
| Mensajería | 7 | `microservicios/mensajeria/src/__tests__/mensajeria.service.test.ts` |
| Notas | 13 | `microservicios/notas/src/__tests__/notas.service.test.ts` |
| Notas (dto) | 7 | `microservicios/notas/src/__tests__/dto.test.ts` |
| Notificaciones | 5 | `microservicios/notificaciones/src/__tests__/notificaciones.service.test.ts` |
| Notificaciones (dto) | 2 | `microservicios/notificaciones/src/__tests__/dto.test.ts` |
| Profesores | 10 | `microservicios/profesores/src/__tests__/profesores.service.test.ts` |
| Profesores (dto) | 3 | `microservicios/profesores/src/__tests__/dto.test.ts` |

### Coverage by layer

| Layer | Tests | Status |
|-------|-------|--------|
| BFF | 38 dto schema tests | ✅ All pass |
| Mensajería | 7 service tests (NEW) | ✅ All pass |
| Asistencia | 6 service tests (NEW) | ✅ All pass |
| Horario | 10 service tests (NEW) | ✅ All pass |
| Notificaciones | 5 service tests (FIXED) | ✅ All pass |
| Other 6 microservices | 111 existing tests | ✅ All pass |

### New tests added this session

- **`backend/microservicios/mensajeria/src/__tests__/mensajeria.service.test.ts`** — 7 tests
- **`backend/microservicios/asistencia/src/__tests__/asistencia.service.test.ts`** — 6 tests
- **`backend/microservicios/horario/src/__tests__/horario.service.test.ts`** — 10 tests
- **`backend/bff/src/__tests__/dto.test.ts`** — expanded from 12 to 38 tests (added registerBffSchema, crearClaseBffSchema, crearHorarioBffSchema, marcarAsistenciaBffSchema, crearConversacionBffSchema, enviarMensajeBffSchema, crearNotaBffSchema, notasBatchBffSchema, avisoInasistenciaBffSchema, avisoNotaBffSchema)

### Fixed test

- **`backend/microservicios/notificaciones/src/__tests__/notificaciones.service.test.ts`** — added model/schema/drizzle-orm mocks so service doesn't crash at import time

### Infrastructure

- Added `test` + `test:coverage` scripts to `backend/microservicios/mensajeria/package.json`
- Ran `bun install` in BFF and 7 microservices to restore missing `node_modules`

---

## Frontend Tests (`npm run test:run` from `frontend/`)

**⚠️ KNOWN ISSUE — Pre-existing test import path errors**

| Test File | Status |
|-----------|--------|
| `routes.test.ts` | ✅ 5 pass |
| `WelcomePage.test.tsx` | ✅ 4 pass |
| Other 15 files | ❌ Import resolution failures (wrong paths) |
| `utils.test.ts` | ❌ 2 assertion failures |

The majority of frontend test files have incorrect import paths (e.g., `../shared/api/apiClient` instead of correct module paths). This is a pre-existing issue not caused by changes in this session. A full audit and rewrite of the test imports is needed.

### Coverage threshold

`vitest.config.ts` enforces 80% minimum on lines, functions, branches, and statements. Currently unmet due to the broken imports described above.
