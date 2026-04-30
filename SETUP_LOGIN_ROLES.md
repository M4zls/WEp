# Configuración del Sistema de Login con Rol de Estudiante/Profesor

## Cambios Realizados

### Frontend (React)

#### 1. **Nuevas Páginas**
- [RoleSelection.jsx](src/pages/RoleSelection.jsx): Pantalla inicial para seleccionar entre Estudiante o Profesor
- [Login.jsx](src/pages/Login.jsx): Login actualizado con soporte para roles y conexión al backend

#### 2. **Servicios**
- [EstudiantesService.js](src/infra/EstudiantesService.js): Cliente para el microservicio de estudiantes con endpoint de login

#### 3. **Componentes**
- [ProtectedRoute.jsx](src/features/ProtectedRoute.jsx): Componente de ruta protegida basado en sessionStorage

#### 4. **Configuración**
- Agregado `react-router-dom` al [package.json](package.json)
- Actualizado [App.jsx](src/App.jsx) con enrutamiento completo

### Backend (Microservicio de Estudiantes)

#### 1. **Base de Datos**
- Actualizado [schema.ts](src/models/schema.ts): Agregados campos `password` y cambio de `email` a requerido

#### 2. **Repositorio**
- [EstudiantesRepository.ts](src/repositories/EstudiantesRepository.ts): Nuevo método `obtenerPorEmail()`

#### 3. **Servicio**
- [EstudiantesService.ts](src/services/EstudiantesService.ts): Nuevo método `login(email, password)`

#### 4. **Controlador**
- [EstudiantesController.ts](src/controllers/EstudiantesController.ts): Nuevo endpoint `POST /estudiantes/login`

## Instalación

### Frontend
```bash
cd frontend/Happ
npm install
npm start
```

El frontend estará disponible en `http://localhost:3000`

### Backend - Microservicio Estudiantes
```bash
cd backend/App
npm install
npm run dev:estudiantes
```

El microservicio correrá en `http://localhost:3001`

## Flujo de Uso

1. **Pantalla inicial** → Usuario selecciona su rol (Estudiante/Profesor)
2. **Login** → Ingresa credenciales según el rol seleccionado
3. **Validación** → Para estudiantes, se valida contra el microservicio de estudiantes
4. **Dashboard** → Acceso al dashboard personalizado según el rol

## Configuración de Variables de Entorno

Crear un archivo `.env` en `frontend/Happ/`:

```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ESTUDIANTES_API_URL=http://localhost:3001/estudiantes
```

## Estructura de Datos para Estudiante

```json
{
  "rut": "12345678",
  "dv": "9",
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "cursos": "1A",
  "telefono": "912345678",
  "apoderado": "María García"
}
```

## Endpoints del Microservicio de Estudiantes

### Autenticación
- `POST /estudiantes/login` - Login con email y contraseña

### CRUD
- `GET /estudiantes` - Obtener todos
- `GET /estudiantes/:rut` - Obtener por RUT
- `POST /estudiantes` - Crear nuevo
- `PUT /estudiantes/:rut` - Actualizar
- `DELETE /estudiantes/:rut` - Eliminar
- `GET /estudiantes/curso/:curso` - Obtener por curso

## Notas de Seguridad

⚠️ **IMPORTANTE**: En producción, las contraseñas deben:
- Hash con bcrypt o argon2
- No almacenarse en texto plano
- Validar con HTTPS
- Implementar CORS adecuado
- Agregar JWT o sesiones seguras

Actualmente el sistema usa validación simple para desarrollo. Actualizar antes de usar en producción.

## Prueba Rápida

1. Crear un estudiante de prueba:
```bash
curl -X POST http://localhost:3001/estudiantes \
  -H "Content-Type: application/json" \
  -d '{
    "rut": "12345678",
    "dv": "9",
    "nombre": "Test",
    "apellido": "User",
    "email": "test@example.com",
    "password": "test123",
    "cursos": "1A"
  }'
```

2. Intentar login con `test@example.com` / `test123` en el frontend
