# 🔧 Backend - Monorepo de Microservicios

Monorepo basado en **npm workspaces** con 4 microservicios independientes usando **Hono + SQLite + Drizzle ORM**.

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Ejecutar microservicio de Estudiantes
npm run dev:estudiantes

# El servidor estará en http://localhost:3001
```

---

## 📁 Estructura

```
backend/App/
├── node_modules/                    ← Dependencias compartidas (centralizado)
├── data/                            ← Bases de datos SQLite
│   ├── estudiantes.db
│   ├── autentificacion.db
│   ├── notificaciones.db
│   └── profesores.db
├── scripts/
│   └── clean-modules.js             ← Limpia node_modules duplicados
├── gateway/                         ← API Gateway
│   ├── src/index.ts
│   ├── package.json
│   └── tsconfig.json
├── microservicios/
│   ├── estudiantes/
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── models/
│   │   │   │   ├── schema.ts        (Tablas de BD)
│   │   │   │   └── data.ts          (Inicialización)
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── autentificacion/
│   ├── notificaciones/
│   └── profesores/
├── package.json                     ← Configuración workspace
├── .npmrc
└── README.md                        ← Este archivo
```

---

## 🎮 Comandos Principales

### Ejecutar Microservicios

```bash
npm run dev:estudiantes       # Puerto 3001
npm run dev:autentificacion   # Puerto 3002
npm run dev:notificaciones    # Puerto 3003
npm run dev:profesores        # Puerto 3004
npm run dev:gateway           # Puerto 3000
```

### Comando Alternativo (workspace)

```bash
npm run -w microservicios/estudiantes dev
```

### Instalar Paquetes

```bash
# En un microservicio específico
npm install paquete -w microservicios/estudiantes

# En todos los workspaces
npm install paquete -w "*"
```

### Limpiar e Reinstalar

```bash
rm -r node_modules package-lock.json
npm install
```

---

## 📊 Microservicios Disponibles

### 👨‍🎓 Estudiantes (Puerto 3001)

**Ruta**: `microservicios/estudiantes/`
**BD**: `data/estudiantes.db`

**Endpoints**:
```bash
GET    /                  # Listar todos
GET    /:rut              # Obtener por RUT
POST   /                  # Crear
PUT    /:rut              # Actualizar
DELETE /:rut              # Eliminar
GET    /curso/:curso      # Obtener por curso
```

**Ejemplo**:
```bash
curl -X POST http://localhost:3001/estudiantes \
  -H "Content-Type: application/json" \
  -d '{
    "rut": "12345678",
    "dv": "K",
    "nombre": "Juan",
    "apellido": "Pérez",
    "cursos": "4to A"
  }'
```

### 🔐 Autentificación (Puerto 3002)

**Ruta**: `microservicios/autentificacion/`
**BD**: `data/autentificacion.db`
**Tablas**: `usuarios`, `sesiones`, `tokens_recuperacion`, `permisos`

### 📢 Notificaciones (Puerto 3003)

**Ruta**: `microservicios/notificaciones/`
**BD**: `data/notificaciones.db`
**Tablas**: `notificaciones`, `eventos`, `logs`

### 👨‍🏫 Profesores (Puerto 3004)

**Ruta**: `microservicios/profesores/`
**BD**: `data/profesores.db`
**Tablas**: `profesores`, `horarios`, `clases`, `disponibilidad`

---

## 🏗️ Arquitectura

### Flujo de una Solicitud

```
Cliente
  ↓
HTTP Request (POST /estudiantes)
  ↓
EstudiantesController (endpoints)
  ↓
EstudiantesService (lógica negocio)
  ↓
EstudiantesRepository (acceso BD)
  ↓
Drizzle ORM + SQLite
  ↓
Respuesta JSON
```

### Estructura de un Microservicio

```
microservicios/estudiantes/
├── src/
│   ├── controllers/
│   │   └── EstudiantesController.ts     ← Endpoints HTTP
│   ├── services/
│   │   └── EstudiantesService.ts        ← Lógica de negocio
│   ├── repositories/
│   │   └── EstudiantesRepository.ts     ← Acceso a datos
│   ├── models/
│   │   ├── schema.ts                    ← Definición tablas
│   │   └── data.ts                      ← Inicialización BD
│   └── index.ts                         ← Punto de entrada
├── package.json
├── tsconfig.json
└── README.md
```

---

## 📝 Desarrollo

### Crear un nuevo endpoint

**1. Actualizar schema** (`src/models/schema.ts`):

```typescript
export const estudiantes = sqliteTable('estudiantes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  rut: text('rut').notNull().unique(),
  // ... más columnas
});
```

**2. Actualizar Repository** (`src/repositories/EstudiantesRepository.ts`):

```typescript
static getByRut(rut: string) {
  const db = getDatabaseinstance();
  return db.query.estudiantes.findFirst({
    where: eq(estudiantes.rut, rut)
  });
}
```

**3. Actualizar Service** (`src/services/EstudiantesService.ts`):

```typescript
static getByRut(rut: string) {
  return EstudiantesRepository.getByRut(rut);
}
```

**4. Agregar endpoint** (`src/controllers/EstudiantesController.ts`):

```typescript
app.get('/:rut', (c) => {
  const rut = c.req.param('rut');
  const estudiante = EstudiantesService.getByRut(rut);
  return c.json(estudiante);
});
```

---

## 🛠️ Tecnologías

| Dependencia | Versión | Propósito |
|---|---|---|
| **hono** | 4.12.15 | Framework REST API |
| **@hono/node-server** | 2.0.0 | Servidor Node.js |
| **better-sqlite3** | 12.9.0 | Base de datos |
| **drizzle-orm** | 0.45.2 | ORM type-safe |
| **drizzle-kit** | 0.18.1 | CLI para BD |
| **tsx** | 4.7.1 | Runtime TypeScript |
| **typescript** | 5.8.3 | Lenguaje tipado |

---

## 🧪 Testing

### Con curl

```bash
# GET
curl http://localhost:3001/estudiantes

# POST
curl -X POST http://localhost:3001/estudiantes \
  -H "Content-Type: application/json" \
  -d '{"rut":"12345678","dv":"K","nombre":"Juan","apellido":"Pérez","cursos":"4to A"}'

# PUT
curl -X PUT http://localhost:3001/estudiantes/12345678 \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Juan Carlos"}'

# DELETE
curl -X DELETE http://localhost:3001/estudiantes/12345678
```

### Con Postman

1. Crear colección con los endpoints
2. Configurar variables de entorno (`base_url: http://localhost`)
3. Probar cada request

---

## 🐛 Troubleshooting

### Error: "Cannot find module"

**Solución**: Verificar que imports apunten a `models/` no `utils/`:
```typescript
// ✅ Correcto
import { estudiantes } from '../models/schema.js';

// ❌ Incorrecto  
import { estudiantes } from '../utils/schema.js';
```

### Puerto en uso (EADDRINUSE)

```powershell
# Encontrar proceso
netstat -ano | findstr ":3001"

# Matar
taskkill /PID [PID] /F
```

### node_modules corrompidos

```bash
cd backend/App
rm -r node_modules package-lock.json
npm install
```

### Cambios no se aplican

- `tsx watch` debe estar activo en terminal
- Reiniciar: Ctrl+C y ejecutar `npm run dev:estudiantes` de nuevo
- Verificar que no hay errores de sintaxis en el editor

---

## 📚 Recursos

- [Hono Documentation](https://hono.dev)
- [Drizzle ORM](https://orm.drizzle.team)
- [SQLite](https://www.sqlite.org)
- [TypeScript](https://www.typescriptlang.org)

---

## 🔄 npm Workspaces

Este proyecto usa **npm workspaces** para compartir dependencias:

```json
{
  "workspaces": [
    "microservicios/autentificacion",
    "microservicios/estudiantes",
    "microservicios/notificaciones",
    "microservicios/profesores",
    "gateway"
  ]
}
```

**Ventajas**:
- ✅ Una copia de `node_modules` (81 MB centralizado)
- ✅ Una sola `package-lock.json`
- ✅ Scripts post-install automáticos
- ✅ Instalación más rápida

---

## 📞 Soporte

Si encuentras problemas:
1. Verifica Node.js v20+: `node --version`
2. Verifica npm v10+: `npm --version`  
3. Revisa logs en la terminal
4. Abre un Issue en GitHub

---

**Versión**: 1.0.0 | **Última actualización**: Abril 2026
