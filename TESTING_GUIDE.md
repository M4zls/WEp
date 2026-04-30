# Guía de Testing - Sistema de Login con Roles

## Paso 1: Instalar Dependencias

### Frontend
```bash
cd frontend/Happ
npm install  # Instala incluido react-router-dom
```

### Backend
```bash
cd backend/App
npm install
```

## Paso 2: Crear Estudiante de Prueba

Abre una terminal y ejecuta (con el microservicio corriendo):

```bash
curl -X POST http://localhost:3001/estudiantes \
  -H "Content-Type: application/json" \
  -d '{
    "rut": "12345678",
    "dv": "9",
    "nombre": "Juan",
    "apellido": "García",
    "email": "juan@example.com",
    "password": "password123",
    "cursos": "1A",
    "telefono": "912345678",
    "apoderado": "María García"
  }'
```

**Respuesta esperada:**
```json
{
  "message": "Estudiante creado correctamente",
  "datos": {
    "rut": "12345678",
    "dv": "9",
    "nombre": "Juan",
    "apellido": "García",
    "email": "juan@example.com",
    "cursos": "1A",
    "telefono": "912345678",
    "apoderado": "María García"
  }
}
```

## Paso 3: Iniciar los Servidores

### Terminal 1 - Backend Estudiantes
```bash
cd backend/App
npm run dev:estudiantes
# Debería mostrar: "Microservicio Estudiantes running on http://localhost:3001"
```

### Terminal 2 - Frontend
```bash
cd frontend/Happ
npm start
# Debería abrir automáticamente http://localhost:3000
```

## Paso 4: Testing Manual

### Escenario 1: Login como Estudiante

1. Abre `http://localhost:3000`
2. Haz clic en el card "Estudiante"
3. Completa el formulario:
   - Email: `juan@example.com`
   - Contraseña: `password123`
4. Haz clic en "Iniciar sesión"

**Resultado esperado:**
- Redirige a `/dashboard`
- Muestra "Mis Cursos" con los datos del estudiante
- En la navbar: `👨‍🎓 estudiante` y `juan@example.com`
- Botón "Cerrar sesión" funcional

### Escenario 2: Login como Profesor

1. Desde la página inicial, haz clic en el card "Profesor"
2. Completa con cualquier email y contraseña:
   - Email: `profesor@example.com`
   - Contraseña: `test123`
3. Haz clic en "Iniciar sesión"

**Resultado esperado:**
- Redirige a `/dashboard`
- Muestra "Mis Cursos" con contenido para profesores
- En la navbar: `👨‍🏫 profesor` y `profesor@example.com`

### Escenario 3: Validación de Errores

#### 3a: Email incorrecto
1. En login de estudiante, ingresa: `noexiste@example.com` / `password123`
2. Haz clic en "Iniciar sesión"

**Resultado esperado:**
- Muestra error: "Estudiante no encontrado"
- Permanece en `/login`

#### 3b: Contraseña incorrecta
1. En login de estudiante, ingresa: `juan@example.com` / `contraseñaerrada`
2. Haz clic en "Iniciar sesión"

**Resultado esperado:**
- Muestra error: "Contraseña incorrecta"
- Permanece en `/login`

#### 3c: Campos vacíos
1. No completes los campos
2. Haz clic en "Iniciar sesión"

**Resultado esperado:**
- HTML5 validation previene el envío
- El navegador solicita completar los campos

### Escenario 4: Navegación

1. Desde estudiante, haz clic en "Volver"

**Resultado esperado:**
- Regresa a la pantalla inicial de selección de rol
- sessionStorage se limpia

### Escenario 5: Protección de Rutas

1. Desde la URL, intenta acceder directamente a `http://localhost:3000/dashboard`

**Resultado esperado:**
- Redirige automáticamente a `/` (página de selección de rol)
- No puede acceder sin estar autenticado

### Escenario 6: Logout

1. Desde el dashboard, haz clic en "Cerrar sesión"

**Resultado esperado:**
- Limpia sessionStorage
- Redirige a `/`
- Al intentar ir a `/dashboard` nuevamente, redirige a `/`

## Paso 5: Testing de API (Opcional)

### Obtener todos los estudiantes
```bash
curl http://localhost:3001/estudiantes
```

### Obtener estudiante por RUT
```bash
curl http://localhost:3001/estudiantes/12345678
```

### Login (POST)
```bash
curl -X POST http://localhost:3001/estudiantes/login \
  -H "Content-Type: application/json" \
  -d '{"email": "juan@example.com", "password": "password123"}'
```

**Respuesta esperada:**
```json
{
  "id": 1,
  "rut": "12345678",
  "dv": "9",
  "nombre": "Juan",
  "apellido": "García",
  "email": "juan@example.com",
  "cursos": "1A",
  "telefono": "912345678",
  "apoderado": "María García",
  "fechaRegistro": "2024-..."
}
```

## Checklist de Validación ✅

### Frontend
- [ ] Página inicial muestra dos cards (Estudiante/Profesor)
- [ ] Al clickear Estudiante, va a `/login` con estilo azul
- [ ] Al clickear Profesor, va a `/login` con estilo verde
- [ ] Form de login tiene email y password
- [ ] Botón "Iniciar sesión" valida credenciales
- [ ] Botón "Volver" regresa a página inicial
- [ ] Dashboard muestra contenido diferente por rol
- [ ] Navbar muestra rol e email
- [ ] Logout limpia datos y redirige
- [ ] Rutas protegidas funcionan

### Backend
- [ ] GET `/estudiantes` retorna lista
- [ ] GET `/estudiantes/:rut` retorna un estudiante
- [ ] POST `/estudiantes` crea nuevo
- [ ] POST `/estudiantes/login` autentica
- [ ] PUT `/estudiantes/:rut` actualiza
- [ ] DELETE `/estudiantes/:rut` elimina
- [ ] GET `/estudiantes/curso/:curso` filtra por curso

### Seguridad (Notas)
- [ ] ⚠️ Las contraseñas se guardan en texto plano (ACTUALIZAR EN PRODUCCIÓN)
- [ ] ⚠️ No hay validación HTTPS (USAR EN PRODUCCIÓN)
- [ ] ⚠️ No hay rate limiting (IMPLEMENTAR EN PRODUCCIÓN)
- [ ] ⚠️ No hay JWT/tokens (IMPLEMENTAR EN PRODUCCIÓN)

## Troubleshooting

### Error: "CORS policy"
**Solución:** Agregar CORS al backend (Hono tiene middleware de CORS)

### Error: "Cannot GET /dashboard"
**Solución:** Asegúrate de usar BrowserRouter en App.jsx (ya está implementado)

### Error: "estudiantes API returns 404"
**Solución:** Verifica que el microservicio corra en puerto 3001

### Error: "Email field already exists"
**Solución:** El email ya existe en BD, usa uno diferente

### Error: "TypeError: Cannot read property 'email' of null"
**Solución:** El estudiante no existe en BD, crea uno primero

## Notas Finales

- El sistema usa `sessionStorage` para mantener la sesión (se limpia al cerrar pestaña)
- Para producción, cambiar a `localStorage` o implementar JWT
- Las contraseñas deben hashearse con bcrypt
- Implementar validaciones de email más robustas
- Agregar 2FA si es necesario
