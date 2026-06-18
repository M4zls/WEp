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
│   ├── auth/                → LoginForm, store Zustand, ProtectedRoute
│   ├── calificaciones/      → CalificacionesView, GestionNotasView
│   ├── contacto/            → Directorio con emergencias, inspectores, secretarios
│   ├── cursos/              → SubjectDetail, servicio de cursos
│   ├── estudiante/          → Dashboard y servicio del estudiante
│   ├── mensajeria/          → Bandeja de mensajes y conversaciones
│   └── profesor/            → Dashboard del profesor
├── layout/                  → DashboardLayout + Sidebar
├── api/                     → apiClient.ts — inyecta JWT en cada request
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

### Desarrollo con Docker (backends) + Vite local (frontend)

```bash
# 1. Asegúrate de que Docker esté corriendo (docker compose up -d desde la raíz)
# 2. Para el contenedor del frontend para liberar el puerto 8080
docker compose stop frontend

# 3. Inicia el dev server con hot-reload
cd frontend
npm install        # solo la primera vez
npm run dev        # http://localhost:8081
```

El frontend se conecta automáticamente al BFF en `http://localhost:3000/api` (Docker) sin configuración adicional.

### Solo frontend (mockeando API)

```bash
cd frontend
npm install
npm run dev
# http://localhost:8081
```

### Variables de Entorno

```env
PORT=8081                    # Puerto del dev server (vite.config.ts)
```

---

## Flujo JWT

1. **Login**: `pages/auth/components/LoginForm.tsx` llama al BFF, recibe `{ ..., token }`
2. **Persistencia**: el token se guarda en `sessionStorage.setItem('token', token)` — tanto para estudiantes como profesores
3. **Inyección automática**: `shared/api/apiClient.ts`:
   ```ts
   const token = authService.getToken();   // sessionStorage.getItem('token')
   if (token) headers.Authorization = `Bearer ${token}`;
   ```
4. **BFF valida**: el middleware del BFF verifica la firma del token en cada request a `/api/*`
5. **401**: si el token falta o es inválido, el BFF responde con error y el frontend redirige al login

---

## Convenciones

- **Rutas**: definidas como constantes en `config/routes.ts`
- **API Client**: singleton genérico en `api/apiClient.ts` — lee el token de `sessionStorage` y lo inyecta como `Authorization: Bearer <token>`
- **Token JWT**: se guarda en `sessionStorage.setItem('token', token)` al hacer login (estudiante o profesor)
- **Estado global**: Zustand con middleware `persist` para sesión de usuario
- **Estilos**: TailwindCSS utility-first
- **Organización**: feature-based en `pages/`, componentes compartidos en `layout/` y `api/`
