# Inicio Rápido - Sistema de Login con Roles

## 🚀 En 5 Minutos

### 1. Instala dependencias
```bash
# Frontend
cd frontend/Happ && npm install

# Backend
cd backend/App && npm install
```

### 2. Inicia los servicios
```bash
# Terminal 1 - Backend (puerto 3001)
cd backend/App
npm run dev:estudiantes

# Terminal 2 - Frontend (puerto 3000)
cd frontend/Happ
npm start
```

### 3. Crea un estudiante de prueba
```bash
curl -X POST http://localhost:3001/estudiantes \
  -H "Content-Type: application/json" \
  -d '{
    "rut": "12345678-9",
    "dv": "9",
    "nombre": "Juan",
    "apellido": "García",
    "email": "juan@example.com",
    "password": "123456",
    "cursos": "1A"
  }'
```

### 4. Abre http://localhost:3000
- Selecciona "Estudiante"
- Login con: `juan@example.com` / `123456`
- ¡Listo! 🎉

---

## 📁 Archivos Clave

| Archivo | Tipo | Descripción |
|---------|------|-------------|
| `frontend/Happ/src/pages/RoleSelection.jsx` | ✨ NUEVO | Selecciona Profesor/Estudiante |
| `frontend/Happ/src/pages/Login.jsx` | 🔄 ACTUALIZADO | Login con roles |
| `frontend/Happ/src/App.jsx` | 🔄 ACTUALIZADO | Router con rutas |
| `frontend/Happ/src/infra/EstudiantesService.js` | ✨ NUEVO | Cliente de API estudiantes |
| `backend/App/microservicios/estudiantes/src/controllers/EstudiantesController.ts` | 🔄 ACTUALIZADO | Endpoint POST /login |
| `backend/App/microservicios/estudiantes/src/services/EstudiantesService.ts` | 🔄 ACTUALIZADO | Método login() |
| `backend/App/microservicios/estudiantes/src/models/schema.ts` | 🔄 ACTUALIZADO | Agregado password |

---

## 🎨 Pantallas

### Selección de Rol
```
┌─────────────────────────────────────────────┐
│         Bienvenido                          │
│   Selecciona tu rol para continuar          │
│                                             │
│  ┌─────────────┐        ┌──────────────┐   │
│  │   STUDENT   │        │   PROFESSOR  │   │
│  │    👨‍🎓      │        │     👨‍🏫      │   │
│  │  Estudiante │        │   Profesor   │   │
│  │  Continuar  │        │  Continuar   │   │
│  └─────────────┘        └──────────────┘   │
└─────────────────────────────────────────────┘
```

### Login
```
┌─────────────────────────────────────┐
│   Login - Estudiante                │
│                                     │
│   Email:    [___________________]  │
│                                     │
│   Password: [___________________]  │
│                                     │
│  [Iniciar sesión]  [Volver]        │
└─────────────────────────────────────┘
```

### Dashboard
```
┌─────────────────────────────────────────────┐
│ Dashboard          👨‍🎓 estudiante            │
│                    juan@example.com [Logout] │
├─────────────────────────────────────────────┤
│                                             │
│  Mis Cursos                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │Matemática│  │ Historia │  │ Ciencias │ │
│  │ Calif: A │  │ Cal: B+  │  │ Cal: A- │ │
│  └──────────┘  └──────────┘  └──────────┘ │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🔗 Endpoints Disponibles

### Frontend
| Ruta | Descripción |
|------|------------|
| `/` | Seleccionar rol |
| `/login` | Formulario de login |
| `/dashboard` | Dashboard (protegido) |

### Backend (POST)
```
POST /estudiantes/login
{
  "email": "juan@example.com",
  "password": "123456"
}
→ {id, rut, nombre, apellido, email, cursos, ...}
```

---

## 🧪 Credenciales de Prueba

Después de ejecutar el curl de arriba:

| Campo | Valor |
|-------|-------|
| Email | juan@example.com |
| Contraseña | 123456 |
| Rol | Estudiante |

---

## ❓ Problemas Comunes

| Problema | Solución |
|----------|----------|
| "Cannot POST /estudiantes/login" | Verifica que el backend corra en puerto 3001 |
| "Estudiante no encontrado" | Crea un estudiante primero con el curl |
| "CORS error" | El backend debe permitir CORS (ya configurado en Hono) |
| "Cannot find module 'react-router-dom'" | Ejecuta `npm install` en frontend/Happ |
| "Contraseña incorrecta" | Verifica que la contraseña sea exacta (case-sensitive) |

---

## 📚 Documentación Completa

- **[CAMBIOS_REALIZADOS.md](CAMBIOS_REALIZADOS.md)** - Lista detallada de cambios
- **[LOGIN_ARCHITECTURE.md](LOGIN_ARCHITECTURE.md)** - Diagramas de arquitectura
- **[SETUP_LOGIN_ROLES.md](SETUP_LOGIN_ROLES.md)** - Instalación completa
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Guía de testing completa

---

## 🎓 Próximos Pasos (Opcionales)

1. **Mejora de Seguridad:**
   - Hashear contraseñas con bcrypt
   - Implementar JWT
   - Agregar HTTPS

2. **Funcionalidades:**
   - Implementar login para profesores
   - Sistema de recuperación de contraseña
   - Dos factores de autenticación (2FA)

3. **UI/UX:**
   - Agregar más estilos
   - Animaciones de transición
   - Responsive design mejorado

4. **Testing:**
   - Tests unitarios
   - Tests de integración
   - E2E testing

---

## ✅ Verificación Rápida

```bash
# 1. ¿Backend corriendo?
curl http://localhost:3001/estudiantes
# Debe retornar: []

# 2. ¿Estudiante creado?
curl http://localhost:3001/estudiantes
# Debe retornar: [{...datos...}]

# 3. ¿Login funciona?
curl -X POST http://localhost:3001/estudiantes/login \
  -H "Content-Type: application/json" \
  -d '{"email": "juan@example.com", "password": "123456"}'
# Debe retornar: {id, rut, nombre, ...}

# 4. ¿Frontend corriendo?
# Abre http://localhost:3000 en el navegador
```

---

**¡Todo listo! Disfruta del sistema de login con roles.** 🚀
