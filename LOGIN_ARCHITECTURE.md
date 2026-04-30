# Diagrama de Flujo - Sistema de Login con Roles

```
┌─────────────────────────────────────────────────────────────┐
│                    INICIO (/)                               │
│         Seleccionar Rol: Estudiante | Profesor              │
└────────────────┬────────────────────────┬──────────────────┘
                 │                        │
        ┌────────▼────────┐      ┌────────▼────────┐
        │   ESTUDIANTE    │      │    PROFESOR     │
        │   (/login)      │      │    (/login)     │
        └────────┬────────┘      └────────┬────────┘
                 │                        │
        ┌────────▼─────────────────────────┴────┐
        │  Login Page                           │
        │  - Email input                        │
        │  - Password input                     │
        │  - Botón Iniciar sesión               │
        │  - Botón Volver                       │
        └────────┬──────────────────────────────┘
                 │
        ┌────────▼──────────┐
        │  VALIDACIÓN       │
        └────┬───────┬──────┘
             │       │
    ┌────────▼┐    ┌─▼──────────┐
    │EXITOSA  │    │ERROR       │
    └────┬────┘    └─┬──────────┘
         │          │
      ┌──▼──────────▼┐
      │ sessionStorage│
      │ role, email   │
      └──┬───────────┘
         │
    ┌────▼─────────────────────┐
    │  DASHBOARD (/dashboard)  │
    │  - Perfil del usuario    │
    │  - Contenido específico  │
    │  - Botón Logout          │
    └──────────────────────────┘
```

## Conexiones entre Frontend y Backend

```
FRONTEND                          BACKEND
═════════════════════════════════════════════════════

┌─────────────────┐
│  React App      │
│  Port: 3000     │
└────────┬────────┘
         │
         │ HTTP REQUEST: POST /estudiantes/login
         │ {email, password}
         │
         ▼
    ┌──────────────────────────────┐
    │ Microservicio Estudiantes    │
    │ Port: 3001                   │
    │                              │
    │ EstudiantesController        │
    │ ├─ POST /login               │
    │ ├─ GET /                     │
    │ ├─ GET /:rut                 │
    │ ├─ POST /                    │
    │ ├─ PUT /:rut                 │
    │ └─ DELETE /:rut              │
    │                              │
    │ EstudiantesService           │
    │ ├─ login()                   │
    │ ├─ obtenerTodos()            │
    │ ├─ obtenerEstudiante()       │
    │ └─ ...                       │
    │                              │
    │ EstudiantesRepository        │
    │ └─ obtenerPorEmail()         │
    │                              │
    │ Database (SQLite)            │
    │ └─ Tabla: estudiantes        │
    └──────────────────────────────┘
         ▲
         │ JSON RESPONSE: {rut, nombre, email, ...}
         │
         └─ sessionStorage.setItem()
```

## Cambios de Archivos

### Frontend

```
src/
├── App.jsx                          ✅ ACTUALIZADO (Router + rutas)
├── pages/
│   ├── Login.jsx                    ✅ ACTUALIZADO (con roles)
│   └── RoleSelection.jsx            ✨ NUEVO (seleccionar rol)
├── features/
│   └── ProtectedRoute.jsx           ✅ ACTUALIZADO (sessionStorage)
├── infra/
│   ├── ApiClient.js
│   ├── AuthService.js
│   └── EstudiantesService.js        ✨ NUEVO (login estudiantes)
└── shared/
    └── styles/
        └── index.css

package.json                         ✅ ACTUALIZADO (react-router-dom)
.env.example                         ✨ NUEVO (vars de entorno)
```

### Backend (Microservicio Estudiantes)

```
src/
├── controllers/
│   └── EstudiantesController.ts     ✅ ACTUALIZADO (POST /login)
├── services/
│   └── EstudiantesService.ts        ✅ ACTUALIZADO (login method)
├── repositories/
│   └── EstudiantesRepository.ts     ✅ ACTUALIZADO (obtenerPorEmail)
├── models/
│   ├── schema.ts                    ✅ ACTUALIZADO (password field)
│   └── data.ts
└── index.ts
```

## Estados de Autenticación

```
┌──────────────────┐
│  NO AUTENTICADO  │
│                  │
│ - Rol: null      │
│ - Email: null    │
│ - Token: null    │
│ - Ruta: /        │
└──────────────────┘
         │
         │ Selecciona rol
         ▼
┌──────────────────┐
│   EN LOGIN       │
│                  │
│ - Rol: selec.   │
│ - Email: input  │
│ - Token: null   │
│ - Ruta: /login  │
└──────────────────┘
         │
         │ POST /estudiantes/login
         ▼
┌──────────────────┐
│  AUTENTICADO     │
│                  │
│ - Rol: guardado  │
│ - Email: guardado│
│ - Token: sesión  │
│ - Ruta: /dash   │
└──────────────────┘
```

## Requisitos Implementados ✅

✅ Pantalla de selección de rol (Profesor/Estudiante)
✅ Login específico para cada rol
✅ Conexión con microservicio de estudiantes
✅ Endpoint de autenticación en backend
✅ Validación de credenciales
✅ Dashboard personalizado por rol
✅ Rutas protegidas
✅ Logout funcional
