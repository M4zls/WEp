# Frontend — Portal Educativo

Aplicación web React que provee la interfaz de usuario para la gestión académica del Colegio Bernardo O'Higgins. Consume el BFF como única puerta de entrada a los microservicios del backend.

---

## Tecnologías

| Tecnología | Versión | Propósito | Justificación |
|---|---|---|---|
| **React** | ^18.2.0 | Librería UI | Estable, hooks, `createRoot`, ecosistema consolidado |
| **Vite** | ^6.3.2 | Build tool | HMR instantáneo, build rápido, dependencias mínimas |
| **TypeScript** | ^6.0.3 | Lenguaje con tipos | Tipado estricto, `strict: true`, `noImplicitAny: true` |
| **TailwindCSS** | ^3.4.1 | Framework CSS | Utility-first, sin runtime JS, build pequeño con purga automática |
| **Zustand** | ^5.0.13 | Estado global | Store liviano (<1KB), sin context providers, re-renders óptimos |
| **react-router-dom** | ^6.30.3 | Enrutamiento SPA | Loaders, acciones, navegación declarativa |

---

## Arquitectura

```
src/
├── features/                   ← Organizado por funcionalidad de negocio
│   ├── welcome/
│   │   └── WelcomePage.tsx     → Página de bienvenida
│   ├── auth/
│   │   ├── LoginForm.tsx       → Inicio de sesión
│   │   ├── ProtectedRoute.tsx  → Ruteo protegido
│   │   ├── auth.service.ts     → Servicio de autenticación
│   │   └── auth.store.ts       → Estado global de sesión (Zustand)
│   ├── student/
│   │   ├── StudentDashboard.tsx → Dashboard del estudiante
│   │   └── student.service.ts   → Servicio de estudiantes
│   └── professor/
│       ├── ProfessorDashboard.tsx → Dashboard del profesor
│       └── CourseCard.tsx         → Componente de curso
├── shared/                     ← Recursos compartidos entre features
│   ├── api/apiClient.ts        → Cliente HTTP singleton (Authorization header)
│   ├── courses/course.service.ts → Servicio de cursos (compartido)
│   ├── components/             → Componentes reutilizables (Navbar, UserCard, etc.)
│   ├── assets/
│   └── styles/
├── config/routes.ts            → Constantes de rutas (ROUTES)
├── App.tsx                     → Router principal (React Router v6)
└── main.tsx                    → Entry point
```

### Patrones

| Patrón | Ubicación | Descripción |
|---|---|---|
| **Screaming Architecture** | `features/` | Organización por funcionalidad de negocio, no por capas técnicas |
| **Service Layer Pattern** | `features/*/*.service.ts` | Objetos singleton que encapsulan comunicación con API |
| **State Management Pattern** | `auth.store.ts` | Zustand centraliza estado global de autenticación con middleware `persist` |
| **Component-Based Architecture** | `features/*/*.tsx` | Componentes funcionales reutilizables con responsabilidad única |

---

## Cómo Empezar

```bash
# Desarrollo
cd frontend/Happ
bun install
bun run dev

# Build producción
bun run build

# Preview del build
bun run preview
```

### Variables de Entorno

```env
PORT=puerto_del_dev_server
REACT_APP_API_URL=http://host:puerto/api
```

---

## Convenciones

- **Rutas**: definidas como constantes en `config/routes.ts` (objeto `ROUTES`)
- **API Client**: singleton genérico con tipado, inyecta `Authorization` header automáticamente
- **Estilos**: TailwindCSS utility-first, sin archivos CSS personalizados
- **Loading/Error**: `ErrorBoundary` global en `App.tsx`, estados de carga con spinners
