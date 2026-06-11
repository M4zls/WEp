# Portal Educativo — Colegio Bernardo O'Higgins

Plataforma web integral para la gestión académica del Colegio Bernardo O'Higgins. Centraliza la administración de estudiantes, profesores, cursos, clases y asignaturas en un solo sistema accesible desde el navegador.

---

## Tecnologías

| Tecnología | Propósito |
|---|---|
| **Bun** | Runtime JavaScript + test runner del backend |
| **React 18** | Librería de interfaz de usuario |
| **Hono** | Framework web para microservicios |
| **PostgreSQL 16** | Base de datos relacional |
| **Docker Compose** | Orquestación de contenedores |
| **Vitest** | Test runner del frontend |

---

## Dependencias

Necesitás tener instalado lo siguiente en tu máquina:

| Dependencia | Versión mínima | Descarga |
|---|---|---|
| **Bun** | 1.3.x | [bun.sh](https://bun.sh) — `powershell -c "irm bun.sh/install.ps1 | iex"` |
| **Docker Desktop** | — | [docker.com](https://www.docker.com/products/docker-desktop/) |
| **Node.js** | 18+ | [nodejs.org](https://nodejs.org/) — solo para el frontend (npm) |

> Bun es el runtime principal del proyecto. Se usa para el backend (servidores, tests) y también para gestionar dependencias del frontend si se prefiere.

---

## Cómo Empezar

### 1. Clonar e instalar dependencias

```bash
git clone <repo>
cd Wep

# Backend (cada microservicio)
cd backend/microservicios/autentificacion && bun install
cd ../estudiantes && bun install
cd ../profesores && bun install
cd ../cursos && bun install
cd ../clases && bun install
cd ../notificaciones && bun install

# BFF
cd ../../bff && bun install

# Frontend
cd ../../frontend && npm install

# Volver a la raíz
cd ..
```



### 2. Iniciar base de datos

```bash
docker compose up -d
```

Esto levanta PostgreSQL 16 en `localhost:5432`.

### 3. Correr migraciones y seed

```bash
# Cada microservicio tiene su schema
cd backend/microservicios/autentificacion && bun run seed
cd ../estudiantes && bun run seed
cd ../profesores && bun run seed
cd ../cursos && bun run seed
cd ../clases && bun run seed
cd ../notificaciones && bun run seed
```

### 4. Iniciar los servicios

```bash
# Cada microservicio en su propia terminal
cd backend/microservicios/autentificacion && bun run dev   # :3002
cd backend/microservicios/estudiantes && bun run dev       # :3001
cd backend/microservicios/profesores && bun run dev        # :3004
cd backend/microservicios/cursos && bun run dev            # :3005
cd backend/microservicios/clases && bun run dev            # :3006
cd backend/microservicios/notificaciones && bun run dev    # :3003

# BFF (única API que consume el frontend)
cd backend/bff && bun run dev                              # :3000

# Frontend
cd frontend && npm run dev                                 # :8081
```

La aplicación queda disponible en `http://localhost:8081`.

---

## Arquitectura

```mermaid
flowchart TB
    Browser["Navegador"]

    subgraph Frontend["Frontend - React SPA :8081"]
        ReactApp["App.tsx<br/>Router"]
        Pages["pages/<br/>auth / student / professor / dashboard / home"]
        Shared["shared/<br/>apiClient / layout / courses / clases"]
    end

    subgraph BFF["BFF - Hono :3000"]
        BFFRoutes["routes/*.ts"]
        OpenAPI["openapi.ts<br/>Swagger UI"]
    end

    subgraph Microservices["Microservicios Backend"]
        Auth["Autentificación<br/>:3002"]
        Students["Estudiantes<br/>:3001"]
        Clases["Clases y Horarios<br/>:3006"]
        Teachers["Profesores<br/>:3004"]
        Courses["Cursos<br/>:3005"]
        Notif["Notificaciones<br/>:3003"]
    end

    subgraph DB["PostgreSQL 16 (5432)"]
        S1["schema: autentificacion"]
        S2["schema: estudiantes"]
        S3["schema: profesores"]
        S4["schema: cursos"]
        S5["schema: notificaciones"]
        S6["schema: clases"]
    end

    Browser --> ReactApp
    ReactApp --> BFFRoutes
    BFFRoutes --> Auth
    BFFRoutes --> Students
    BFFRoutes --> Teachers
    BFFRoutes --> Courses
    BFFRoutes --> Notif
    BFFRoutes --> Clases
    Auth --> S1
    Students --> S2
    Teachers --> S3
    Courses --> S4
    Notif --> S5
    Clases --> S6
```

- **Frontend**: aplicación React SPA que consume una sola API (el BFF)
- **BFF**: única puerta de entrada para el frontend, orquesta los microservicios internos
- **Microservicios**: 6 servicios independientes, cada uno con su propio schema de DB
- **Base de datos**: PostgreSQL con schemas aislados por microservicio

### Microservicios

| Servicio | Puerto | Responsabilidad |
|---|---|---|
| **BFF** | 3000 | Orquestación — única API que consume el frontend |
| **Autentificación** | 3002 | Login, registro, manejo de sesiones JWT |
| **Estudiantes** | 3001 | CRUD de estudiantes |
| **Profesores** | 3004 | CRUD de profesores |
| **Cursos** | 3005 | Gestión de cursos, asignaturas y asignaciones |
| **Clases y Horarios** | 3006 | Gestión de clases y bloques horarios |
| **Notificaciones** | 3003 | Notificaciones del sistema |

---

## Testing

| Capa | Runner | Comando | Docs |
|---|---|---|---|
| **Frontend** | Vitest | `cd frontend && npm test` | [frontend/README.md](./frontend/README.md) |
| **Backend** | Bun test | `cd backend/microservicios/<svc> && bun test` | [backend/README.md](./backend/README.md) |

Ver README de cada capa para detalles de cobertura y estructura de tests.

---

## Estructura del Repositorio

```
Wep/
├── frontend/           → Aplicación React (Vite + TailwindCSS + Zustand)
├── backend/
│   ├── bff/            → Backend for Frontend (Hono + Zod OpenAPI)
│   └── microservicios/ → 6 microservicios independientes
│       ├── autentificacion/
│       ├── estudiantes/
│       ├── profesores/
│       ├── cursos/
│       ├── clases/
│       └── notificaciones/
├── docker-compose.yml  → Orquestación de todos los servicios
└── README.md
```

---

## Documentación API

Swagger UI disponible en `GET /docs` del BFF (`http://localhost:3000/docs`). Generado automáticamente desde los schemas Zod usando `@hono/zod-openapi`.
