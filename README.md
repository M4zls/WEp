# Portal Educativo — Colegio Bernardo O'Higgins

Plataforma web para gestionar estudiantes, profesores, cursos y asignaturas.  
Arquitectura de microservicios con backend en Node.js/Hono, frontend en React, base de datos PostgreSQL (Supabase), todo contenerizado con Docker.

---

## Tecnologías

| Tecnología | Versión | Propósito | Justificación |
|---|---|---|---|
| **Node.js** | 24-alpine | Runtime del backend | Última LTS con soporte ESM nativo, Web Crypto API estable, imagen Alpine liviana (~50MB) |
| **React** | ^18.2.0 | Librería UI | Estable, hooks, `createRoot`, ecosistema consolidado |
| **Vite** | ^6.4.2 | Build tool | HMR instantáneo, build ~1s (vs ~30s CRA), 139 dependencias (vs ~2000 CRA), Tree-shaking nativo |
| **TypeScript** | ^5.9.3 | Lenguaje con tipos | Inferencia mejorada, `satisfies`, ESM estable, tipado estricto completo |
| **Hono** | ^4.12.15 | Framework web backend | Ultraligero, ESM nativo, integración JWT nativa (`hono/jwt`), middleware simple |
| **Zod** | ^4.4.3 | Validación DTOs | Schemas declarativos con inferencia automática de tipos, integración OpenAPI directa |
| **Drizzle ORM** | ^0.45.2 | ORM PostgreSQL | Type-safe, soporte `pgSchema()` para schemas aislados por microservicio |
| **postgres.js** | ^3.4.9 | Driver PostgreSQL | Conexiones preparadas, ESM nativo, ~2x más rápido que `pg` |
| **TailwindCSS** | ^3.4.1 | Framework CSS | Utility-first, sin runtime JS, build pequeño con purga automática |
| **Zustand** | ^5.x | Estado global | Store liviano (<1KB), sin context providers, re-renders óptimos, middleware `persist` |
| **tsx** | ^4.21.0 | Ejecutor TypeScript | Corre TypeScript directo sin compilar, ideal para contenedores y dev |
| **react-router-dom** | ^6.30.3 | Enrutamiento SPA | Loaders, acciones, navegación declarativa |
| **Supabase** | — | Hosting PostgreSQL | Base de datos administrada (no se usa auth de Supabase, todo es JWT propio) |
| **Docker Compose** | — | Orquestación | Multi-servicio, red bridge, variables de entorno centralizadas |
| **JWT (hono/jwt)** | — | Autenticación | Tokens firmados con secret propio, sesiones persistentes en DB, sin depender de terceros |
| **SHA-256 (Web Crypto)** | — | Hashing passwords | Algoritmo estándar implementado nativamente en Node.js |
| **Swagger UI** | — | Documentación API | UI interactiva generada desde schemas Zod via `@hono/zod-openapi`, siempre sincronizada |

---

## Arquitectura

### Frontend — Screaming Architecture

```
src/
├── features/                   ← Organizado por funcionalidad de negocio
│   ├── welcome/
│   │   └── WelcomePage.tsx     → Página de bienvenida
│   ├── auth/
│   │   ├── LoginForm.tsx       → Inicio de sesión
│   │   ├── ProtectedRoute.tsx  → Ruteo protegido
│   │   ├── auth.service.ts     → Servicio de autenticación (tokens)
│   │   └── auth.store.ts       → Estado global de sesión (Zustand)
│   ├── student/
│   │   ├── StudentDashboard.tsx → Dashboard del estudiante
│   │   └── student.service.ts   → Servicio de estudiantes (login + CRUD)
│   └── professor/
│       ├── ProfessorDashboard.tsx → Dashboard del profesor
│       └── CourseCard.tsx         → Componente de curso
├── shared/                     ← Recursos compartidos entre features
│   ├── api/apiClient.ts        → Cliente HTTP singleton (Authorization header)
│   ├── courses/course.service.ts → Servicio de cursos (compartido)
│   ├── assets/
│   └── styles/
├── config/routes.ts
├── App.tsx                     → Router principal (React Router v6)
└── index.tsx                   → Entry point
```

- **Screaming Architecture**: la estructura del proyecto grita su propósito de negocio (welcome, auth, student, professor) en lugar de capas técnicas (components, services, pages, store)
- **Vite**: build tool moderna (~1s build, HMR instantáneo),
- **Single Page Application (SPA)**: navegación sin recargar el navegador, React Router v6 con rutas protegidas
- **Component-Based Architecture (CBA)**: componentes funcionales reutilizables (FC + ReactElement), responsabilidad única
- **State Management Pattern**: Zustand centraliza el estado global de autenticación con middleware `persist` en sessionStorage, sin providers
- **Service Layer Pattern**: objetos singleton encapsulan fetch, storage y comunicación con API
- **TailwindCSS**: estilos utility-first sin librería externa

### Backend — Microservices Architecture

```
cada microservicio:
src/
├── controllers/   → Capa de presentación (Hono router) — recibe HTTP, valida con Zod, delega al service
├── services/      → Capa de negocio (lógica de la aplicación)
├── repositories/  → Capa de datos (Repository Pattern) — queries Drizzle ORM
├── models/        → Schemas Drizzle (pgSchema) + conexión postgres.js
├── dtos/          → DTO Pattern — Schemas Zod para validación de requests
├── types/         → Interfaces TypeScript (payloads, respuestas)
├── common/        → Constantes (JWT secret, expiración) + utilidades
└── index.ts       → Entry point (serve Hono)
```

#### Microservicios

| Servicio | Puerto | Schema DB | Rol |
|---|---|---|---|
| **bff** | 3000 | — | BFF: única puerta de entrada del frontend, orquesta los demás servicios |
| **autentificacion** | 3002 | `autentificacion` | Login, registro, JWT, sesiones |
| **estudiantes** | 3001 | `estudiantes` | CRUD de estudiantes (sin JWT, usan login directo) |
| **profesores** | 3004 | `profesores` | CRUD de profesores |
| **cursos** | 3005 | `cursos` | Cursos, asignaturas, asignación materia-profesor |
| **notificaciones** | 3003 | `notificaciones` | Notificaciones del sistema |

#### Comunicación

```
Frontend (8080) → BFF (3000) → [autentificacion, estudiantes, profesores, cursos, notificaciones]
```

El frontend solo conoce al BFF. Los microservicios internos no son accesibles desde fuera del contenedor.

---

## Patrones de Diseño

| Patrón | Lado | Ubicación | Descripción |
|---|---|---|---|
| **BFF Pattern (Backend for Frontend)** | Backend | bff-service | El frontend solo conoce al BFF (puerto 3000), que orquesta las llamadas a los microservicios internos. Estos no son accesibles desde fuera del contenedor. |
| **Layered Architecture (n-tier)** | Backend | Cada microservicio | Separación en capas: Controller (HTTP) → Service (negocio) → Repository (datos) → DB. Cada capa tiene una responsabilidad única. |
| **Screaming Architecture** | Frontend | `features/` | La estructura del proyecto se organiza por funcionalidades de negocio (`welcome/`, `auth/`, `student/`, `professor/`) en vez de capas técnicas, haciendo que el propósito del sistema sea evidente desde la jerarquía de directorios. |
| **State Management Pattern** | Frontend | `auth.store.ts` | Zustand centraliza el estado global de autenticación (user, token, role) con middleware `persist`, evitando prop drilling y re-renders innecesarios. |
| **Service Layer Pattern** | Frontend | `features/*/*.service.ts` | Objetos singleton (`studentService`, `authService`, `courseService`) que encapsulan fetch y lógica de API. |

---

## Autenticación JWT

- Implementación **propia** con `hono/jwt` (no usa Supabase Auth)
- **Firma**: `sign(payload, JWT_SECRET)` — payload incluye `sub`, `email`, `rut`, `rol`, `nombre`, `apellido`, `exp`
- **Sesiones**: cada token se persiste en `autentificacion.sesiones` con fecha de expiración
- **Verificación**: al validar un token se chequea firma + existencia en DB + vigencia
- **Contraseñas**: hasheadas con SHA-256 via Web Crypto API
- **Estudiantes**: no usan JWT, se autentican directamente contra el microservicio de estudiantes (login retorna datos del usuario)
- **Profesores/Admin**: login retorna JWT + datos del usuario

---

## Base de Datos

- **Supabase PostgreSQL** usado solo como hosting de base de datos
- Cada microservicio tiene su propio schema PostgreSQL aislado via `pgSchema('nombre')` en Drizzle
- Migraciones gestionadas con `drizzle-kit` desde `drizzle.config.ts`
- Seed ejecutado con `tsx backend/App/seed.ts` — datos de prueba: 6 cursos, 3 asignaturas, 5 profesores, 10 estudiantes, 18 relaciones curso-asignatura-profesor

### Dominios de email

| Rol | Dominio |
|---|---|
| Estudiante | `@alumnoCBO.cl` |
| Profesor / Admin | `@profesorCBO.cl` |

El frontend detecta el rol automáticamente desde el email (sin pantalla de selección).

---

## Docker

```yaml
7 servicios en red bridge "wep-network":
- autentificacion (3002)
- estudiantes (3001)
- profesores (3004)
- cursos (3005)
- notificaciones (3003)
- bff (3000)
- frontend (8080)
```

- Variables de entorno centralizadas en `.env` (`DATABASE_URL`)
- Frontend: build multi-stage con `node:24-alpine`, compila con Vite (output `dist/`), sirve con `serve -s dist`
- Backend: cada microservicio corre con `npx tsx` (sin compilar)
- **Windows + Supabase IPv6**: se usa `netsh interface portproxy` para redirigir IPv4 → IPv6

---

## Documentación API

- Swagger UI disponible en `GET /docs` del BFF
- Generado automáticamente desde los schemas Zod usando `@hono/zod-openapi`
- La documentación siempre refleja el código porque los schemas Zod son la fuente de verdad

---

## Versiones

| Paquete | Versión |
|---|---|
| Node.js | 24-alpine |
| React | ^18.2.0 |
| TypeScript | ^5.9.3 |
| Hono | ^4.12.15 |
| Zod | ^4.4.3 |
| Drizzle ORM | ^0.45.2 |
| postgres.js | ^3.4.9 |
| TailwindCSS | ^3.4.1 |
| Zustand | ^5.x |
| tsx | ^4.21.0 |
| react-router-dom | ^6.30.3 |
| Vite | ^6.4.2 |
| @vitejs/plugin-react | ^4.7.0 |
| Drizzle Kit | ^0.31.10 |
| @hono/node-server | ^2.0.0 |
