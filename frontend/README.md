# Frontend — Portal Educativo

Aplicación web React que provee la interfaz de usuario para la gestión académica del Colegio Bernardo O'Higgins. Consume el BFF como única puerta de entrada a los microservicios del backend.

---

## Tecnologías

| Tecnología | Versión | Propósito |
|---|---|---|
| **React** | ^18.2.0 | Librería UI |
| **Vite** | ^6.3.2 | Build tool y dev server |
| **TypeScript** | ^6.0.3 | Lenguaje con tipos |
| **TailwindCSS** | ^3.4.1 | Framework CSS utility-first |
| **Zustand** | ^5.0.13 | Estado global liviano |
| **react-router-dom** | ^6.30.3 | Enrutamiento SPA |
| **Vitest** | ^4.1.8 | Test runner |
| **@testing-library/react** | ^16.3.2 | Testing de componentes React |

---

## Arquitectura

```
src/
├── pages/                   ← Organizado por funcionalidad de negocio
│   ├── home/                → Página de bienvenida (WelcomePage)
│   ├── login/               → Inicio de sesión (LoginForm)
│   ├── auth/                → Servicio de auth, store Zustand, ProtectedRoute
│   ├── dashboard/home/      → Dashboard principal con estadísticas
│   ├── student/             → Dashboard y servicio de estudiantes
│   └── professor/           → Dashboard del profesor
├── shared/                  ← Recursos compartidos
│   ├── api/apiClient.ts     → Cliente HTTP singleton con JWT
│   ├── layout/              → DashboardLayout y Sidebar
│   ├── courses/             → Servicio de cursos, SubjectDetail, modales
│   ├── clases/              → Servicios y tipos de clases y horarios
│   └── styles/index.css     → Estilos globales Tailwind
├── config/routes.ts         → Constantes de rutas (ROUTES)
├── common/utils.ts          → Utilidades generales
├── __tests__/               → Tests unitarios (vitest)
├── App.tsx                  → Router principal (React Router v6)
└── index.tsx                → Entry point
```

---

## Testing

El frontend usa **Vitest** con **jsdom** y **@testing-library/react**.

```bash
cd frontend

npm test              # Modo watch
npm run test:run      # Ejecución única
npm run test:coverage # Con reporte de cobertura (threshold 80%)
```

Los tests se encuentran en `src/__tests__/` e incluyen:
- **Servicios**: auth, student, course, clase, horario, apiClient
- **Store**: auth store (Zustand)
- **Componentes**: ProtectedRoute, LoginForm, WelcomePage, Sidebar, DashboardLayout, App routing
- **Constantes y utilidades**: routes, utils, tipos

---

## Cómo Empezar

```bash
cd frontend
npm install
npm run dev
```

### Variables de Entorno

```env
PORT=8081                    # Puerto del dev server
```

---

## Convenciones

- **Rutas**: definidas como constantes en `config/routes.ts`
- **API Client**: singleton genérico que inyecta `Authorization` header automáticamente
- **Estado global**: Zustand con middleware `persist` para sesión de usuario
- **Estilos**: TailwindCSS utility-first
- **Organización**: feature-based en `pages/`, componentes compartidos en `shared/`
