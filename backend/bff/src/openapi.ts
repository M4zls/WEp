import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';
import { loginBffSchema, loginAuthBffSchema, crearCursoBffSchema, crearAsignaturaBffSchema } from './dtos/BffDto.js';

const openapi = new OpenAPIHono();

openapi.doc('/doc', {
  openapi: '3.0.0',
  info: {
    title: 'Portal Educativo CBO — API',
    version: '1.0.0',
    description: 'API del Colegio Bernardo O\'Higgins. Microservicios orquestados por el BFF.',
  },
  servers: [{ url: 'http://localhost:3000', description: 'BFF local' }],
});

openapi.get('/ui', swaggerUI({ url: '/docs/doc' }));

// POST /api/auth/login
openapi.openapi(
  createRoute({
    method: 'post',
    path: '/auth/login',
    tags: ['Autenticación'],
    summary: 'Login profesores/admin',
    request: {
      body: { content: { 'application/json': { schema: loginAuthBffSchema } } },
    },
    responses: {
      200: { description: 'Login exitoso, retorna token + usuario' },
      400: { description: 'Datos inválidos' },
      401: { description: 'Credenciales incorrectas' },
    },
  }),
  async (c) => c.json({ message: 'Ver documentación interactiva' })
);

// POST /api/estudiantes/login
openapi.openapi(
  createRoute({
    method: 'post',
    path: '/estudiantes/login',
    tags: ['Estudiantes'],
    summary: 'Login estudiantes',
    request: {
      body: { content: { 'application/json': { schema: loginBffSchema } } },
    },
    responses: {
      200: { description: 'Login exitoso, retorna datos del estudiante' },
      400: { description: 'Datos inválidos' },
      401: { description: 'Credenciales incorrectas' },
    },
  }),
  async (c) => c.json({ message: 'Ver documentación interactiva' })
);

// POST /api/cursos
openapi.openapi(
  createRoute({
    method: 'post',
    path: '/cursos',
    tags: ['Cursos'],
    summary: 'Crear un curso',
    request: {
      body: { content: { 'application/json': { schema: crearCursoBffSchema } } },
    },
    responses: {
      201: { description: 'Curso creado' },
      400: { description: 'Datos inválidos' },
    },
  }),
  async (c) => c.json({ message: 'Ver documentación interactiva' })
);

// POST /api/cursos/asignaturas
openapi.openapi(
  createRoute({
    method: 'post',
    path: '/cursos/asignaturas',
    tags: ['Cursos'],
    summary: 'Crear una asignatura',
    request: {
      body: { content: { 'application/json': { schema: crearAsignaturaBffSchema } } },
    },
    responses: {
      201: { description: 'Asignatura creada' },
      400: { description: 'Datos inválidos' },
    },
  }),
  async (c) => c.json({ message: 'Ver documentación interactiva' })
);

// GET /api/cursos
openapi.openapi(
  createRoute({
    method: 'get',
    path: '/cursos',
    tags: ['Cursos'],
    summary: 'Listar todos los cursos',
    responses: {
      200: { description: 'Lista de cursos' },
    },
  }),
  async (c) => c.json({ message: 'Ver documentación interactiva' })
);

// GET /api/cursos/asignaturas
openapi.openapi(
  createRoute({
    method: 'get',
    path: '/cursos/asignaturas',
    tags: ['Cursos'],
    summary: 'Listar asignaturas',
    responses: {
      200: { description: 'Lista de asignaturas' },
    },
  }),
  async (c) => c.json({ message: 'Ver documentación interactiva' })
);

// GET /api/estudiantes
openapi.openapi(
  createRoute({
    method: 'get',
    path: '/estudiantes',
    tags: ['Estudiantes'],
    summary: 'Listar estudiantes',
    responses: {
      200: { description: 'Lista de estudiantes' },
    },
  }),
  async (c) => c.json({ message: 'Ver documentación interactiva' })
);

export default openapi;
