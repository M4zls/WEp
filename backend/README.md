# Backend — Portal Educativo

Conjunto de microservicios que proveen la API para la gestión académica del Colegio Bernardo O'Higgins. Implementa una arquitectura orientada a microservicios con comunicación interna orquestada por un BFF.

---

## Tecnologías

| Tecnología | Versión | Propósito |
|---|---|---|
| **Bun** | 1.3.14 | Runtime JavaScript + test runner |
| **Hono** | ^4.12.15 | Framework web ultraligero |
| **TypeScript** | ^5.9.3 | Lenguaje con tipos |
| **Drizzle ORM** | ^0.45.2 | ORM PostgreSQL type-safe |
| **postgres.js** | ^3.4.9 | Driver PostgreSQL |
| **Zod** | ^4.4.3 | Validación DTOs con inferencia de tipos |
| **bcryptjs** | — | Hashing de contraseñas |
| **JWT (hono/jwt)** | — | Autenticación con tokens firmados |

---

## Arquitectura

```
Frontend (:8080) → BFF (:3000) → [autentificacion, estudiantes, profesores, cursos, clases, notificaciones]
                                                                                │
                                                                        PostgreSQL 16 (:5432)
```

Cada microservicio sigue una arquitectura en capas:

```
src/
├── controllers/   → Capa de presentación (Hono router)
├── services/      → Capa de negocio (lógica de la aplicación)
├── repositories/  → Capa de datos (Repository Pattern con Drizzle)
├── models/        → Schemas Drizzle + conexión postgres.js
├── dtos/          → Schemas Zod para validación de requests
├── types/         → Interfaces TypeScript
├── common/        → Constantes y utilidades compartidas
├── __tests__/     → Tests unitarios (bun test)
└── index.ts       → Entry point (Bun.serve)
```

### Microservicios

| Servicio | Puerto | Schema DB | Responsabilidad |
|---|---|---|---|
| **BFF** | 3000 | — | BFF: única puerta de entrada del frontend |
| **Autentificación** | 3002 | `autentificacion` | Login, registro, JWT, sesiones |
| **Estudiantes** | 3001 | `estudiantes` | CRUD de estudiantes |
| **Profesores** | 3004 | `profesores` | CRUD de profesores |
| **Cursos** | 3005 | `cursos` | Cursos, asignaturas, asignaciones |
| **Clases** | 3006 | `clases` | Clases |
| **Horario** | 3007 | `horario` | Bloques horarios fijos (08:00-16:00) |
| **Asistencia** | 3008 | `asistencia` | Registro de asistencia por clase y estudiante |
| **Notificaciones** | 3003 | `notificaciones` | Notificaciones del sistema |
| **Notas** | 3010 | `notas` | Gestión de calificaciones de alumnos |

---

## Testing

Todos los microservicios usan **bun test** (no vitest). Los tests se encuentran en `src/__tests__/`.

```bash
# Ejecutar tests de un microservicio
cd backend/microservicios/<servicio>
bun test

# Con cobertura
bun test --coverage
```

Cada microservicio incluye tests unitarios para:
- **Services**: lógica de negocio con mocks de repositorios y utilidades
- **DTOs**: validación de schemas Zod

---

## Cómo Empezar

```bash
# Desarrollo (ejecutar un microservicio específico)
cd backend/microservicios/<servicio>
bun install
bun run dev
```

### Variables de Entorno

Cada microservicio requiere:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/wep
PORT=3000                    # Puerto del servicio
JWT_SECRET=tu_secreto_jwt    # Solo autentificacion
NOVU_SECRET_KEY=tu_key       # Solo notificaciones
```

---

## Autenticación JWT

### BFF Middleware (`backend/bff/src/middleware/auth.ts`)

Todas las rutas `/api/*` del BFF están protegidas. El middleware se aplica globalmente en `index.ts`:

```ts
app.use('/api/*', authMiddleware);
```

| Aspecto | Detalle |
|---|---|
| **Verificación** | Solo firma con `verify(token, JWT_SECRET, { alg: 'HS256' })` — stateless |
| **Algoritmo** | HS256 |
| **Secret** | `JWT_SECRET` env var, fallback `colegio_ohiggins_secret_changeme` |
| **Rutas públicas** | `/api/auth/login`, `/api/auth/register`, `/api/estudiantes/login`, `/health`, `/docs` |
| **401** | `Token no proporcionado` / `Token inválido o expirado` |

### Microservicio de Autentificación

| Aspecto | Detalle |
|---|---|
| **Firma** | `sign(payload, JWT_SECRET)` con `hono/jwt` |
| **Sesiones** | cada token se persiste en `autentificacion.sesiones` |
| **Verificación** | firma + existencia en DB + vigencia |
| **Contraseñas** | hasheadas con bcrypt |
| **JWT_SECRET** | requerido desde entorno (`Consts.JWT_SECRET`) |

### Nota

El BFF solo verifica firma (stateless, no consulta DB). El microservicio de autentificación (para profesores) verifica firma + DB. El BFF genera el JWT para estudiantes directamente porque su microservicio no maneja autenticación.

---

## Documentación API

Swagger UI disponible en `GET /docs` del BFF. Generado automáticamente desde los schemas Zod usando `@hono/zod-openapi`.
