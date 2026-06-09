# Backend — Portal Educativo

Conjunto de microservicios que proveen la API para la gestión académica del Colegio Bernardo O'Higgins. Implementa una arquitectura orientada a microservicios con comunicación interna orquestada por un BFF.

---

## Tecnologías

| Tecnología | Versión | Propósito | Justificación |
|---|---|---|---|
| **Bun** | 1.3.14 | Runtime JavaScript | Nativo TypeScript, HTTP server incorporado (`Bun.serve`), reemplaza Node.js + tsx + @hono/node-server |
| **Hono** | ^4.12.15 | Framework web | Ultraligero, ESM nativo, integración JWT (`hono/jwt`), middleware simple |
| **TypeScript** | ^5.9.3 | Lenguaje con tipos | Tipado estricto completo, `noImplicitAny: true` |
| **Drizzle ORM** | ^0.45.2 | ORM PostgreSQL | Type-safe, `pgSchema()` para schemas aislados por microservicio |
| **postgres.js** | ^3.4.9 | Driver PostgreSQL | Conexiones preparadas, ESM nativo, rápido |
| **Zod** | ^4.4.3 | Validación DTOs | Schemas declarativos con inferencia automática de tipos |
| **bcryptjs** | — | Hashing de contraseñas | Algoritmo estándar para almacenamiento seguro de passwords |
| **JWT (hono/jwt)** | — | Autenticación | Tokens firmados con `JWT_SECRET`, sesiones persistentes en DB |

---

## Arquitectura

```
Frontend (8080) → BFF (3000) → [autentificacion, estudiantes, profesores, cursos, notificaciones]
                                                                          │
                                                                  PostgreSQL 16 (5432)
```

Cada microservicio sigue una arquitectura en capas:

```
src/
├── controllers/   → Capa de presentación (Hono router) — recibe HTTP, valida con Zod, delega al service
├── services/      → Capa de negocio (lógica de la aplicación)
├── repositories/  → Capa de datos (Repository Pattern) — queries Drizzle ORM
├── models/        → Schemas Drizzle (pgSchema) + conexión postgres.js (getDatabaseinstance)
├── dtos/          → DTO Pattern — Schemas Zod para validación de requests
├── types/         → Interfaces TypeScript (payloads, respuestas)
├── common/        → Constantes (JWT secret, expiración) + utilidades (PasswordUtils, handleControllerError)
└── index.ts       → Entry point (Bun.serve)
```

### Microservicios

| Servicio | Puerto | Schema DB | Responsabilidad |
|---|---|---|---|
| **BFF** | 3000 | — | BFF: única puerta de entrada del frontend, orquesta los demás servicios |
| **Autentificación** | 3002 | `autentificacion` | Login, registro, JWT, sesiones |
| **Estudiantes** | 3001 | `estudiantes` | CRUD de estudiantes |
| **Profesores** | 3004 | `profesores` | CRUD de profesores |
| **Cursos** | 3005 | `cursos` | Cursos, asignaturas, asignación materia-profesor |
| **Notificaciones** | 3003 | `notificaciones` | Notificaciones del sistema |

---

## Patrones de Diseño

| Patrón | Descripción |
|---|---|
| **BFF Pattern (Backend for Frontend)** | El frontend solo conoce al BFF (puerto 3000), que orquesta las llamadas a los microservicios internos |
| **Layered Architecture (n-tier)** | Separación en capas: Controller → Service → Repository → DB. Cada capa tiene una responsabilidad única |
| **Repository Pattern** | Abstracción de la capa de datos mediante repositorios que usan Drizzle ORM |
| **DTO Pattern** | Schemas Zod para validación de requests en la capa de controller |

---

## Cómo Empezar

```bash
# Desarrollo (ejecutar un microservicio específico)
cd backend/App
bun install
bun run dev:estudiantes
bun run dev:autentificacion
bun run dev:profesores
bun run dev:notificaciones
bun run dev:cursos
bun run dev:bff

# Seed de base de datos (migraciones + datos de prueba)
bun run seed
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

- **Firma**: `sign(payload, JWT_SECRET)` con `hono/jwt` — payload incluye `sub`, `email`, `rut`, `rol`, `nombre`, `apellido`, `exp`
- **Sesiones**: cada token se persiste en `autentificacion.sesiones` con fecha de expiración
- **Verificación**: al validar un token se chequea firma + existencia en DB + vigencia
- **Contraseñas**: hasheadas con bcrypt
- **JWT_SECRET**: requerido desde entorno (sin fallback hardcodeado), el servidor falla al iniciar si no está definido

---

## Documentación API

Swagger UI disponible en `GET /docs` del BFF. Generado automáticamente desde los schemas Zod usando `@hono/zod-openapi`. La documentación siempre refleja el código porque los schemas Zod son la fuente de verdad.
