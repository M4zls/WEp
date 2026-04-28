

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
└── README.md                      
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

```

### Puerto en uso (EADDRINUSE)

```powershell
# Encontrar proceso
netstat -ano | findstr ":3001"

# Matar
taskkill /PID [PID] /F
```





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




