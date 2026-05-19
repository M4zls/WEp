# Portal Educativo — Colegio Bernardo O'Higgins

Plataforma web integral para la gestión académica del Colegio Bernardo O'Higgins. Centraliza la administración de estudiantes, profesores, cursos y asignaturas en un solo sistema accesible desde el navegador.

---

## Objetivo del Negocio

Digitalizar y unificar los procesos administrativos y académicos del colegio, reemplazando planillas manuales y sistemas aislados por una plataforma centralizada que permita:

- **Gestión de estudiantes**: registro, consulta y actualización de datos académicos
- **Gestión de profesores**: administración del cuerpo docente y asignación de materias
- **Administración de cursos**: creación y organización de cursos con sus respectivas asignaturas
- **Autenticación centralizada**: inicio de sesión único para estudiantes, profesores y administradores
- **Notificaciones**: comunicación interna dentro de la plataforma

---

## Tecnologías

| Tecnología | Propósito |
|---|---|
| **Bun** | Runtime JavaScript — ejecuta TypeScript nativamente, reemplaza Node.js + tsx |
| **React 18** | Librería de interfaz de usuario |
| **Hono** | Framework web para microservicios |
| **PostgreSQL 16** | Base de datos relacional |
| **Docker Compose** | Orquestación de contenedores |

---

## Arquitectura

```mermaid
flowchart TB
    Browser["Navegador"]

    subgraph Frontend["Frontend - React SPA (8080)"]
        ReactApp["App.tsx<br/>Router + ErrorBoundary"]
        Features["features/<br/>auth / student / professor / welcome"]
        Shared["shared/<br/>apiClient / components"]
    end

    subgraph BFF["BFF - Hono (3000)"]
        BFFRoutes["routes/*.ts"]
        OpenAPI["openapi.ts<br/>Swagger UI"]
    end

    subgraph Microservices["Microservicios Backend"]
        Auth["Autentificación<br/>(3002)"]
        Students["Estudiantes<br/>(3001)"]
        Teachers["Profesores<br/>(3004)"]
        Courses["Cursos<br/>(3005)"]
        Notif["Notificaciones<br/>(3003)"]
    end

    subgraph DB["PostgreSQL 16 (5432)"]
        S1["schema: autentificacion"]
        S2["schema: estudiantes"]
        S3["schema: profesores"]
        S4["schema: cursos"]
        S5["schema: notificaciones"]
    end

    Browser --> ReactApp
    ReactApp --> Features
    Features --> Shared
    Shared --> BFFRoutes
    BFFRoutes --> Auth
    BFFRoutes --> Students
    BFFRoutes --> Teachers
    BFFRoutes --> Courses
    BFFRoutes --> Notif
    Auth --> S1
    Students --> S2
    Teachers --> S3
    Courses --> S4
    Notif --> S5
```

- **Frontend**: aplicación React de página única (SPA) que consume una sola API (el BFF)
- **BFF (Backend for Frontend)**: única puerta de entrada para el frontend, orquesta las llamadas a los microservicios internos
- **Microservicios**: 5 servicios independientes, cada uno con su propio schema de base de datos y responsabilidad de negocio
- **Base de datos**: PostgreSQL con schemas aislados por microservicio

### Microservicios

| Servicio | Puerto | Responsabilidad |
|---|---|---|
| **BFF** | 3000 | Orquestación — única API que consume el frontend |
| **Autentificación** | 3002 | Login, registro, manejo de sesiones JWT |
| **Estudiantes** | 3001 | CRUD de estudiantes |
| **Profesores** | 3004 | CRUD de profesores |
| **Cursos** | 3005 | Gestión de cursos, asignaturas y asignaciones |
| **Notificaciones** | 3003 | Notificaciones del sistema |

---

## Cómo Empezar

```bash
git clone <repo>
cd Wep
docker compose up -d
```

La aplicación queda disponible en `http://localhost:8080`.

### Requisitos

- Docker Desktop (o Docker Engine + Docker Compose)
- Puerto 5432, 3000-3005, 8080 libres

---

## Estructura del Repositorio

```
Wep/
├── frontend/Happ/       → Aplicación React (Vite, TailwindCSS, Zustand)
├── backend/App/         → Microservicios backend (Hono, Drizzle ORM, PostgreSQL)
├── docker-compose.yml   → Orquestación de todos los servicios
└── README.md
```

---

## Documentación API

Swagger UI disponible en `GET /docs` del BFF (`http://localhost:3000/docs`). Generado automáticamente desde los schemas Zod usando `@hono/zod-openapi`.
