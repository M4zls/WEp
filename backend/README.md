# Backend — Portal Educativo

Conjunto de microservicios que proveen la API para la gestión académica del Colegio Bernardo O'Higgins. Implementa una arquitectura orientada a microservicios con un API Gateway (KrakenD) como punto de entrada único y GlitchTip para monitoreo.

---

## Tecnologías

| Tecnología | Propósito |
|---|---|
| **Bun** | Runtime JavaScript + test runner |
| **Hono** | Framework web ultraligero |
| **TypeScript** | Lenguaje con tipos |
| **Drizzle ORM** | ORM PostgreSQL type-safe |
| **postgres.js** | Driver PostgreSQL |
| **Zod** | Validación DTOs con inferencia de tipos |
| **bcryptjs** | Hashing de contraseñas |
| **JWT (hono/jwt)** | Autenticación con tokens firmados |
| **KrakenD** | API Gateway — rutea peticiones a microservicios |
| **@sentry/bun** | SDK de error tracking + performance (envía a GlitchTip) |

---

## Arquitectura

```
Frontend (:8080 / :8081 dev) → KrakenD (:3100) → microservicios (ms-*)
                                                      │
                                                     GlitchTip
                                                      │
                                              PostgreSQL 16 (:5432 / host :5433)
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
├── glitchtip/     → Integración con Sentry/GlitchTip
│   ├── init.ts          → Inicialización con normalización de DSN
│   ├── middleware.ts     → Span de rendimiento por request
│   ├── error-handler.ts → Captura de errores no manejados
│   ├── lifecycle.ts     → Hooks de ciclo de vida del SDK
│   └── index.ts         → Exportaciones públicas
├── tracing/       → Trazabilidad distribuida
│   ├── config.ts        → Configuración de AsyncLocalStorage
│   ├── context.ts       → Contexto de request
│   ├── middleware.ts     → Inyección de X-Request-Id
│   └── index.ts         → Exportaciones públicas
├── __tests__/     → Tests unitarios (bun test)
└── index.ts       → Entry point (Bun.serve + GlitchTip init)
```

---

## KrakenD — API Gateway

### ¿Qué es KrakenD?

KrakenD es un API Gateway de alto rendimiento escrito en Go, diseñado para ser configurado mediante JSON (sin código). Actúa como intermediario entre el frontend y los microservicios internos.

### ¿Cómo funciona en este proyecto?

1. **El frontend** envía todas las peticiones a `http://localhost:3100/api/*`
2. **KrakenD** (contenedor `krakend-service`, puerto 3100) recibe la petición, aplica CORS y la enruta al microservicio destino según la configuración en `krakend.json`
3. **El microservicio** procesa la petición y devuelve la respuesta
4. **KrakenD** retorna la respuesta al frontend

Características:
- **Enrutamiento explícito**: cada endpoint posible está definido en `krakend.json` con método HTTP, patrón de URL y backend destino
- **Proxy directo**: no hay plugins Go ni lógica adicional — solo reenvío de peticiones
- **CORS unificado**: la configuración CORS se define una sola vez en el gateway
- **Sin estado**: KrakenD no almacena sesiones ni cachea respuestas
- **Config**: `backend/krakend/krakend.json` (55+ endpoints)

### Ejemplo de endpoint definido

```json
{
  "endpoint": "/api/students/{id}",
  "method": "GET",
  "backend": [{ "host": ["http://ms-students:3001"], "url_pattern": "/students/{id}" }]
}
```

Esto significa: cuando el frontend haga `GET /api/students/123`, KrakenD reenviará a `http://ms-students:3001/students/123`.

---

## GlitchTip — Error Tracking y Performance

### ¿Qué es GlitchTip?

GlitchTip es una plataforma open-source de monitoreo de errores y rendimiento, compatible con el protocolo de Sentry. Permite centralizar logs de errores, trazas de rendimiento y métricas de todos los servicios.

### ¿Cómo funciona en este proyecto?

1. Cada microservicio incluye `@sentry/bun` configurado en `src/glitchtip/`
2. Al iniciar el servicio, se lee `SENTRY_DSN` del entorno. Si está definido, se inicializa el SDK de Sentry apuntando al DSN de GlitchTip
3. **Middleware**: cada request entrante se envuelve en un span de rendimiento (`Sentry.startSpan()`)
4. **Error handler**: los errores no manejados se capturan y envían automáticamente
5. **Trazas de rendimiento**: se habilitan con la env var `SENTRY_TRACES_SAMPLE_RATE` (valor 0-100, default 0)

### DSN Normalization

`@sentry/bun@10.x` valida estrictamente el DSN y rechaza UUIDs con guiones en el public key. Para solucionarlo, el init.js normaliza el DSN:

```ts
const url = new URL(dsn);
url.username = url.username.replace(/-/g, '');
Sentry.init({ dsn: url.toString(), ... });
```

Esto es seguro para UUIDs con o sin guiones (es no-op si no hay guiones).

### Variables de entorno

| Variable | Obligatorio | Descripción |
|---|---|---|
| `SENTRY_DSN` | No | DSN de GlitchTip/Sentry. Si no se define, se salta la inicialización |
| `SENTRY_ENVIRONMENT` | No | Entorno (`development`, `production`, etc.) |
| `SENTRY_TRACES_SAMPLE_RATE` | No | Porcentaje de muestreo (0-100). Default: 0 |

Si `SENTRY_DSN` no está definida, el servicio arranca normalmente sin telemetría y muestra `[glitchtip] SENTRY_DSN not set, skipping init`.

---

## Microservicios

| Servicio | Puerto | Schema DB | Responsabilidad |
|---|---|---|---|
| **KrakenD** | 3100 | — | API Gateway: punto de entrada único del frontend |
| **Estudiantes** | 3001 | `estudiantes` | CRUD de estudiantes |
| **Autentificación** | 3002 | `autentificacion` | Login, registro, JWT, sesiones |
| **Notificaciones** | 3003 | `notificaciones` | Notificaciones del sistema (Novu) |
| **Profesores** | 3004 | `profesores` | CRUD de profesores |
| **Cursos** | 3005 | `cursos` | Cursos, asignaturas, asignaciones |
| **Clases** | 3006 | `clases` | Clases |
| **Horario** | 3007 | `horario` | Bloques horarios fijos (08:00-16:00) |
| **Asistencia** | 3008 | `asistencia` | Registro de asistencia por clase y estudiante |
| **Mensajería** | 3009 | `mensajeria` | Mensajería interna entre usuarios |
| **Notas** | 3010 | `notas` | Gestión de calificaciones de alumnos |

---

## Testing

Todos los microservicios usan **bun test** (no vitest). Los tests se encuentran en `src/__tests__/`.

```bash
# Ejecutar todos los tests del backend
cd backend
bun test

# Ejecutar tests de un microservicio específico
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
# Dentro de Docker se usa el hostname del contenedor (db:5432)
# Desde fuera del contenedor se usa localhost:5433
DATABASE_URL_DEV=postgresql://postgres:postgres@localhost:5433/wep
PORT=3000                    # Puerto del servicio
JWT_SECRET=tu_secreto_jwt    # Solo autentificacion
NOVU_SECRET_KEY=tu_key       # Solo notificaciones
SENTRY_DSN=https://key@glitchtip.example.com/1  # Opcional — error tracking
```

### Kubernetes

Los manifests en `k8s/` despliegan cada microservicio como un Deployment + ClusterIP Service. Las imágenes se construyen con `docker compose build` (usa los mismos Dockerfiles).

```bash
# Construir imágenes
docker compose build

# Desplegar todo
kubectl apply -f k8s/config/00-namespace.yaml
kubectl apply -f k8s/config/secret.yaml
kubectl apply -f k8s/config/configmap.yaml
kubectl apply -f k8s/database/
kubectl apply -f k8s/microservices/
```

> Los manifests usan `imagePullPolicy: Never` — para producción cambiá a `Always` y usá un container registry.

---

## Autenticación JWT

El API Gateway KrakenD no valida JWT — pasa el token directamente al microservicio destino. Cada microservicio que requiere autenticación verifica el token internamente.

### Microservicio de Autentificación

| Aspecto | Detalle |
|---|---|
| **Firma** | `sign(payload, JWT_SECRET)` con `hono/jwt` |
| **Sesiones** | cada token se persiste en `autentificacion.sesiones` |
| **Verificación** | firma + existencia en DB + vigencia |
| **Contraseñas** | hasheadas con bcrypt |
| **JWT_SECRET** | requerido desde entorno (`Consts.JWT_SECRET`) |

### Flujo

1. **Login** → el microservicio de autentificación genera y firma un JWT
2. **Frontend** guarda el token en `sessionStorage` y lo envía como `Authorization: Bearer <token>`
3. **KrakenD** reenvía el header al microservicio destino sin modificarlo
4. **Microservicio** verifica la firma con `verify(token, JWT_SECRET)` — stateless
5. **401** si el token falta, es inválido o expiró

---

## Documentación API

Cada microservicio expone su propia documentación vía Swagger UI en `GET /docs` si está configurado.
