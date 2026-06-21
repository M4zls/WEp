import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';
import { z } from 'zod';
import {
  loginBffSchema, loginAuthBffSchema, registerBffSchema,
  crearCursoBffSchema, crearAsignaturaBffSchema, asignarMateriaBffSchema,
  crearClaseBffSchema, crearHorarioBffSchema, marcarAsistenciaBffSchema,
  crearConversacionBffSchema, enviarMensajeBffSchema, crearNotaBffSchema, notasBatchBffSchema,
  avisoInasistenciaBffSchema, avisoNotaBffSchema,
} from './dtos/BffDto.js';

const openapi = new OpenAPIHono();

const apiInfo = {
  openapi: '3.0.0',
  info: {
    title: 'Portal Educativo CBO — API',
    version: '1.0.0',
    description: 'API del Colegio Bernardo O\'Higgins. Microservicios orquestados por el BFF.\n\nAutenticación: endpoints públicos marcados, el resto requiere `Authorization: Bearer <token>`.',
  },
  servers: [{ url: 'http://localhost:3000', description: 'BFF local' }],
};

openapi.doc('/doc', apiInfo);
openapi.get('/ui', swaggerUI({ url: '/docs/doc' }));

const stub = async (c: any) => c.json({ message: 'Ver documentación interactiva' });

// ─── Autenticación ───

openapi.openapi(createRoute({
  method: 'post', path: '/auth/login', tags: ['Autenticación'],
  summary: 'Login profesores/admin',
  description: 'Público. Recibe email+password, delega al microservicio de autentificación, retorna JWT + datos del usuario.',
  request: { body: { content: { 'application/json': { schema: loginAuthBffSchema } } } },
  responses: { 200: { description: 'Login exitoso, retorna { token, usuario }' }, 400: { description: 'Datos inválidos' }, 401: { description: 'Credenciales incorrectas' } },
}), stub);

openapi.openapi(createRoute({
  method: 'post', path: '/auth/register', tags: ['Autenticación'],
  summary: 'Registro profesores/admin',
  description: 'Público. Crea un nuevo usuario con rol admin o profesor.',
  request: { body: { content: { 'application/json': { schema: registerBffSchema } } } },
  responses: { 200: { description: 'Registro exitoso, retorna { token, usuario }' }, 400: { description: 'Datos inválidos o email/rut duplicado' } },
}), stub);

openapi.openapi(createRoute({
  method: 'post', path: '/auth/logout', tags: ['Autenticación'],
  summary: 'Cerrar sesión',
  description: 'Requiere token. Invalida la sesión del token proporcionado.',
  responses: { 200: { description: 'Sesión cerrada' }, 401: { description: 'Token inválido' } },
}), stub);

openapi.openapi(createRoute({
  method: 'get', path: '/auth/verify', tags: ['Autenticación'],
  summary: 'Verificar token',
  description: 'Requiere token. Verifica que el JWT sea válido y la sesión esté vigente.',
  responses: { 200: { description: 'Token válido, retorna payload del usuario' }, 401: { description: 'Token inválido o expirado' } },
}), stub);

// ─── Estudiantes ───

openapi.openapi(createRoute({
  method: 'post', path: '/estudiantes/login', tags: ['Estudiantes'],
  summary: 'Login estudiantes',
  description: 'Público. Login para estudiantes, retorna datos del estudiante + JWT generado por el BFF.',
  request: { body: { content: { 'application/json': { schema: loginBffSchema } } } },
  responses: { 200: { description: 'Login exitoso, retorna datos del estudiante + token' }, 400: { description: 'Datos inválidos' }, 401: { description: 'Credenciales incorrectas' } },
}), stub);

openapi.openapi(createRoute({
  method: 'get', path: '/estudiantes', tags: ['Estudiantes'],
  summary: 'Listar todos los estudiantes',
  responses: { 200: { description: 'Lista de estudiantes' } },
}), stub);

openapi.openapi(createRoute({
  method: 'get', path: '/estudiantes/{id}', tags: ['Estudiantes'],
  summary: 'Obtener estudiante por ID o RUT',
  request: { params: z.object({ id: z.string() }) },
  responses: { 200: { description: 'Datos del estudiante' }, 404: { description: 'Estudiante no encontrado' } },
}), stub);

openapi.openapi(createRoute({
  method: 'post', path: '/estudiantes', tags: ['Estudiantes'],
  summary: 'Crear estudiante',
  request: { body: { content: { 'application/json': { schema: z.any() } } } },
  responses: { 201: { description: 'Estudiante creado' }, 400: { description: 'Datos inválidos' } },
}), stub);

openapi.openapi(createRoute({
  method: 'put', path: '/estudiantes/{id}', tags: ['Estudiantes'],
  summary: 'Actualizar estudiante',
  request: { params: z.object({ id: z.string() }), body: { content: { 'application/json': { schema: z.any() } } } },
  responses: { 200: { description: 'Estudiante actualizado' }, 404: { description: 'Estudiante no encontrado' } },
}), stub);

openapi.openapi(createRoute({
  method: 'delete', path: '/estudiantes/{id}', tags: ['Estudiantes'],
  summary: 'Eliminar estudiante',
  request: { params: z.object({ id: z.string() }) },
  responses: { 200: { description: 'Estudiante eliminado' }, 404: { description: 'Estudiante no encontrado' } },
}), stub);

openapi.openapi(createRoute({
  method: 'get', path: '/estudiantes/curso/{curso}', tags: ['Estudiantes'],
  summary: 'Listar estudiantes por curso',
  description: 'Ej: GET /api/estudiantes/curso/4-B',
  request: { params: z.object({ curso: z.string() }) },
  responses: { 200: { description: 'Lista de estudiantes del curso' } },
}), stub);

// ─── Profesores ───

openapi.openapi(createRoute({
  method: 'get', path: '/profesores', tags: ['Profesores'],
  summary: 'Listar todos los profesores',
  responses: { 200: { description: 'Lista de profesores' } },
}), stub);

openapi.openapi(createRoute({
  method: 'get', path: '/profesores/{id}', tags: ['Profesores'],
  summary: 'Obtener profesor por ID',
  request: { params: z.object({ id: z.string() }) },
  responses: { 200: { description: 'Datos del profesor' }, 404: { description: 'Profesor no encontrado' } },
}), stub);

openapi.openapi(createRoute({
  method: 'post', path: '/profesores', tags: ['Profesores'],
  summary: 'Crear profesor',
  request: { body: { content: { 'application/json': { schema: z.any() } } } },
  responses: { 201: { description: 'Profesor creado' }, 400: { description: 'Datos inválidos' } },
}), stub);

openapi.openapi(createRoute({
  method: 'put', path: '/profesores/{id}', tags: ['Profesores'],
  summary: 'Actualizar profesor',
  request: { params: z.object({ id: z.string() }), body: { content: { 'application/json': { schema: z.any() } } } },
  responses: { 200: { description: 'Profesor actualizado' }, 404: { description: 'Profesor no encontrado' } },
}), stub);

openapi.openapi(createRoute({
  method: 'delete', path: '/profesores/{id}', tags: ['Profesores'],
  summary: 'Eliminar profesor',
  request: { params: z.object({ id: z.string() }) },
  responses: { 200: { description: 'Profesor eliminado' }, 404: { description: 'Profesor no encontrado' } },
}), stub);

// ─── Cursos ───

openapi.openapi(createRoute({
  method: 'get', path: '/cursos', tags: ['Cursos'],
  summary: 'Listar todos los cursos',
  responses: { 200: { description: 'Lista de cursos' } },
}), stub);

openapi.openapi(createRoute({
  method: 'get', path: '/cursos/{id}', tags: ['Cursos'],
  summary: 'Obtener curso por ID',
  request: { params: z.object({ id: z.coerce.number().int() }) },
  responses: { 200: { description: 'Datos del curso' }, 404: { description: 'Curso no encontrado' } },
}), stub);

openapi.openapi(createRoute({
  method: 'post', path: '/cursos', tags: ['Cursos'],
  summary: 'Crear un curso',
  request: { body: { content: { 'application/json': { schema: crearCursoBffSchema } } } },
  responses: { 201: { description: 'Curso creado' }, 400: { description: 'Datos inválidos' } },
}), stub);

openapi.openapi(createRoute({
  method: 'put', path: '/cursos/{id}', tags: ['Cursos'],
  summary: 'Actualizar curso',
  request: { params: z.object({ id: z.coerce.number().int() }), body: { content: { 'application/json': { schema: z.any() } } } },
  responses: { 200: { description: 'Curso actualizado' }, 404: { description: 'Curso no encontrado' } },
}), stub);

openapi.openapi(createRoute({
  method: 'delete', path: '/cursos/{id}', tags: ['Cursos'],
  summary: 'Eliminar curso',
  request: { params: z.object({ id: z.coerce.number().int() }) },
  responses: { 200: { description: 'Curso eliminado' }, 404: { description: 'Curso no encontrado' } },
}), stub);

openapi.openapi(createRoute({
  method: 'get', path: '/cursos/asignaturas', tags: ['Cursos'],
  summary: 'Listar todas las asignaturas',
  responses: { 200: { description: 'Lista de asignaturas' } },
}), stub);

openapi.openapi(createRoute({
  method: 'post', path: '/cursos/asignaturas', tags: ['Cursos'],
  summary: 'Crear una asignatura',
  request: { body: { content: { 'application/json': { schema: crearAsignaturaBffSchema } } } },
  responses: { 201: { description: 'Asignatura creada' }, 400: { description: 'Datos inválidos' } },
}), stub);

openapi.openapi(createRoute({
  method: 'put', path: '/cursos/asignaturas/{id}', tags: ['Cursos'],
  summary: 'Actualizar asignatura',
  request: { params: z.object({ id: z.coerce.number().int() }), body: { content: { 'application/json': { schema: z.any() } } } },
  responses: { 200: { description: 'Asignatura actualizada' }, 404: { description: 'Asignatura no encontrada' } },
}), stub);

openapi.openapi(createRoute({
  method: 'delete', path: '/cursos/asignaturas/{id}', tags: ['Cursos'],
  summary: 'Eliminar asignatura',
  request: { params: z.object({ id: z.coerce.number().int() }) },
  responses: { 200: { description: 'Asignatura eliminada' }, 404: { description: 'Asignatura no encontrada' } },
}), stub);

openapi.openapi(createRoute({
  method: 'get', path: '/cursos/{cursoId}/materias', tags: ['Cursos'],
  summary: 'Listar materias de un curso',
  description: 'Retorna las asignaturas asignadas a un curso con sus profesores.',
  request: { params: z.object({ cursoId: z.coerce.number().int() }) },
  responses: { 200: { description: 'Lista de materias del curso' } },
}), stub);

openapi.openapi(createRoute({
  method: 'post', path: '/cursos/asignar-materia', tags: ['Cursos'],
  summary: 'Asignar materia a un curso',
  description: 'Asocia una asignatura a un curso con un profesor.',
  request: { body: { content: { 'application/json': { schema: asignarMateriaBffSchema } } } },
  responses: { 201: { description: 'Materia asignada' }, 400: { description: 'Datos inválidos' } },
}), stub);

openapi.openapi(createRoute({
  method: 'put', path: '/cursos/asignar-materia/{id}', tags: ['Cursos'],
  summary: 'Actualizar asignación de materia',
  request: { params: z.object({ id: z.coerce.number().int() }), body: { content: { 'application/json': { schema: z.any() } } } },
  responses: { 200: { description: 'Asignación actualizada' }, 404: { description: 'Asignación no encontrada' } },
}), stub);

openapi.openapi(createRoute({
  method: 'delete', path: '/cursos/asignar-materia/{id}', tags: ['Cursos'],
  summary: 'Eliminar asignación de materia',
  request: { params: z.object({ id: z.coerce.number().int() }) },
  responses: { 200: { description: 'Asignación eliminada' }, 404: { description: 'Asignación no encontrada' } },
}), stub);

// ─── Clases ───

openapi.openapi(createRoute({
  method: 'get', path: '/clases', tags: ['Clases'],
  summary: 'Listar clases',
  description: 'Filtro opcional por curso_asignatura_id: GET /api/clases?curso_asignatura_id=1',
  request: { query: z.object({ curso_asignatura_id: z.coerce.number().int().optional() }) },
  responses: { 200: { description: 'Lista de clases' } },
}), stub);

openapi.openapi(createRoute({
  method: 'get', path: '/clases/{id}', tags: ['Clases'],
  summary: 'Obtener clase por ID',
  request: { params: z.object({ id: z.coerce.number().int() }) },
  responses: { 200: { description: 'Datos de la clase' }, 404: { description: 'Clase no encontrada' } },
}), stub);

openapi.openapi(createRoute({
  method: 'post', path: '/clases', tags: ['Clases'],
  summary: 'Crear una clase',
  request: { body: { content: { 'application/json': { schema: crearClaseBffSchema } } } },
  responses: { 201: { description: 'Clase creada' }, 400: { description: 'Datos inválidos' } },
}), stub);

openapi.openapi(createRoute({
  method: 'put', path: '/clases/{id}', tags: ['Clases'],
  summary: 'Actualizar clase',
  request: { params: z.object({ id: z.coerce.number().int() }), body: { content: { 'application/json': { schema: z.any() } } } },
  responses: { 200: { description: 'Clase actualizada' }, 404: { description: 'Clase no encontrada' } },
}), stub);

openapi.openapi(createRoute({
  method: 'delete', path: '/clases/{id}', tags: ['Clases'],
  summary: 'Eliminar clase',
  request: { params: z.object({ id: z.coerce.number().int() }) },
  responses: { 200: { description: 'Clase eliminada' }, 404: { description: 'Clase no encontrada' } },
}), stub);

// ─── Horarios ───

openapi.openapi(createRoute({
  method: 'get', path: '/horarios', tags: ['Horarios'],
  summary: 'Listar horarios',
  description: 'Filtro opcional por curso_asignatura_id: GET /api/horarios?curso_asignatura_id=1',
  request: { query: z.object({ curso_asignatura_id: z.coerce.number().int().optional() }) },
  responses: { 200: { description: 'Lista de horarios' } },
}), stub);

openapi.openapi(createRoute({
  method: 'get', path: '/horarios/{id}', tags: ['Horarios'],
  summary: 'Obtener horario por ID',
  request: { params: z.object({ id: z.coerce.number().int() }) },
  responses: { 200: { description: 'Datos del horario' }, 404: { description: 'Horario no encontrado' } },
}), stub);

openapi.openapi(createRoute({
  method: 'post', path: '/horarios', tags: ['Horarios'],
  summary: 'Crear un horario',
  request: { body: { content: { 'application/json': { schema: crearHorarioBffSchema } } } },
  responses: { 201: { description: 'Horario creado' }, 400: { description: 'Datos inválidos' } },
}), stub);

openapi.openapi(createRoute({
  method: 'put', path: '/horarios/{id}', tags: ['Horarios'],
  summary: 'Actualizar horario',
  request: { params: z.object({ id: z.coerce.number().int() }), body: { content: { 'application/json': { schema: z.any() } } } },
  responses: { 200: { description: 'Horario actualizado' }, 404: { description: 'Horario no encontrado' } },
}), stub);

openapi.openapi(createRoute({
  method: 'delete', path: '/horarios/{id}', tags: ['Horarios'],
  summary: 'Eliminar horario',
  request: { params: z.object({ id: z.coerce.number().int() }) },
  responses: { 200: { description: 'Horario eliminado' }, 404: { description: 'Horario no encontrado' } },
}), stub);

// ─── Asistencia ───

openapi.openapi(createRoute({
  method: 'get', path: '/asistencia/clase/{claseId}', tags: ['Asistencia'],
  summary: 'Obtener asistencia por clase',
  request: { params: z.object({ claseId: z.coerce.number().int() }) },
  responses: { 200: { description: 'Registros de asistencia de la clase' } },
}), stub);

openapi.openapi(createRoute({
  method: 'get', path: '/asistencia/estudiante/{rut}', tags: ['Asistencia'],
  summary: 'Obtener asistencia por estudiante',
  request: { params: z.object({ rut: z.string() }) },
  responses: { 200: { description: 'Registros de asistencia del estudiante' } },
}), stub);

openapi.openapi(createRoute({
  method: 'get', path: '/asistencia/curso-asignatura/{id}', tags: ['Asistencia'],
  summary: 'Obtener asistencia por curso-asignatura',
  request: { params: z.object({ id: z.coerce.number().int() }) },
  responses: { 200: { description: 'Registros de asistencia' } },
}), stub);

openapi.openapi(createRoute({
  method: 'post', path: '/asistencia/marcar', tags: ['Asistencia'],
  summary: 'Marcar asistencia',
  description: 'Registra la asistencia de un estudiante en una clase.',
  request: { body: { content: { 'application/json': { schema: marcarAsistenciaBffSchema } } } },
  responses: { 200: { description: 'Asistencia marcada' }, 400: { description: 'Datos inválidos' } },
}), stub);

openapi.openapi(createRoute({
  method: 'put', path: '/asistencia/{id}', tags: ['Asistencia'],
  summary: 'Actualizar registro de asistencia',
  request: { params: z.object({ id: z.coerce.number().int() }), body: { content: { 'application/json': { schema: z.any() } } } },
  responses: { 200: { description: 'Asistencia actualizada' }, 404: { description: 'Registro no encontrado' } },
}), stub);

// ─── Mensajería ───

openapi.openapi(createRoute({
  method: 'post', path: '/mensajeria/conversaciones', tags: ['Mensajería'],
  summary: 'Crear o reutilizar conversación',
  description: 'Crea una nueva conversación o reutiliza una existente entre los participantes.',
  request: { body: { content: { 'application/json': { schema: crearConversacionBffSchema } } } },
  responses: { 200: { description: 'Conversación creada o existente' }, 400: { description: 'Datos inválidos' } },
}), stub);

openapi.openapi(createRoute({
  method: 'get', path: '/mensajeria/conversaciones/{usuarioId}', tags: ['Mensajería'],
  summary: 'Listar conversaciones de un usuario',
  request: { params: z.object({ usuarioId: z.string() }) },
  responses: { 200: { description: 'Lista de conversaciones' } },
}), stub);

openapi.openapi(createRoute({
  method: 'post', path: '/mensajeria/mensajes', tags: ['Mensajería'],
  summary: 'Enviar mensaje',
  request: { body: { content: { 'application/json': { schema: enviarMensajeBffSchema } } } },
  responses: { 200: { description: 'Mensaje enviado' }, 400: { description: 'Datos inválidos' } },
}), stub);

openapi.openapi(createRoute({
  method: 'get', path: '/mensajeria/mensajes/{conversacionId}', tags: ['Mensajería'],
  summary: 'Obtener mensajes de una conversación',
  request: { params: z.object({ conversacionId: z.coerce.number().int() }) },
  responses: { 200: { description: 'Lista de mensajes' } },
}), stub);

openapi.openapi(createRoute({
  method: 'put', path: '/mensajeria/mensajes/leer/{conversacionId}/{usuarioId}', tags: ['Mensajería'],
  summary: 'Marcar mensajes como leídos',
  request: { params: z.object({ conversacionId: z.coerce.number().int(), usuarioId: z.string() }) },
  responses: { 200: { description: 'Mensajes marcados como leídos' } },
}), stub);

// ─── Notas ───

openapi.openapi(createRoute({
  method: 'get', path: '/notas/estudiante/{rut}', tags: ['Notas'],
  summary: 'Obtener notas por estudiante',
  request: { params: z.object({ rut: z.string() }) },
  responses: { 200: { description: 'Lista de notas del estudiante' }, 404: { description: 'Estudiante no encontrado' } },
}), stub);

openapi.openapi(createRoute({
  method: 'get', path: '/notas/curso/{curso}', tags: ['Notas'],
  summary: 'Obtener notas por curso',
  description: 'Filtro opcional por profesorRut: GET /api/notas/curso/4-B?profesorRut=22222222',
  request: { params: z.object({ curso: z.string() }), query: z.object({ profesorRut: z.string().optional() }) },
  responses: { 200: { description: 'Notas del curso' } },
}), stub);

openapi.openapi(createRoute({
  method: 'get', path: '/notas/profesor/{rut}', tags: ['Notas'],
  summary: 'Obtener notas por profesor',
  request: { params: z.object({ rut: z.string() }) },
  responses: { 200: { description: 'Notas registradas por el profesor' } },
}), stub);

openapi.openapi(createRoute({
  method: 'post', path: '/notas', tags: ['Notas'],
  summary: 'Crear una nota',
  request: { body: { content: { 'application/json': { schema: crearNotaBffSchema } } } },
  responses: { 200: { description: 'Nota creada' }, 400: { description: 'Datos inválidos' } },
}), stub);

openapi.openapi(createRoute({
  method: 'post', path: '/notas/batch', tags: ['Notas'],
  summary: 'Crear notas en lote',
  description: 'Crea múltiples notas en una sola llamada.',
  request: { body: { content: { 'application/json': { schema: notasBatchBffSchema } } } },
  responses: { 200: { description: 'Notas creadas' }, 400: { description: 'Datos inválidos' } },
}), stub);

openapi.openapi(createRoute({
  method: 'put', path: '/notas/{id}', tags: ['Notas'],
  summary: 'Actualizar una nota',
  request: { params: z.object({ id: z.coerce.number().int() }), body: { content: { 'application/json': { schema: z.any() } } } },
  responses: { 200: { description: 'Nota actualizada' }, 404: { description: 'Nota no encontrada' } },
}), stub);

openapi.openapi(createRoute({
  method: 'delete', path: '/notas/{id}', tags: ['Notas'],
  summary: 'Eliminar una nota',
  request: { params: z.object({ id: z.coerce.number().int() }) },
  responses: { 200: { description: 'Nota eliminada' }, 404: { description: 'Nota no encontrada' } },
}), stub);

// ─── Notificaciones ───

openapi.openapi(createRoute({
  method: 'post', path: '/notificaciones/aviso-inasistencia', tags: ['Notificaciones'],
  summary: 'Enviar aviso de inasistencia',
  description: 'Dispara una notificacion via Novu informando la inasistencia de un alumno al apoderado.',
  request: { body: { content: { 'application/json': { schema: avisoInasistenciaBffSchema } } } },
  responses: { 200: { description: 'Notificacion enviada' }, 400: { description: 'Datos invalidos' }, 500: { description: 'Error al enviar' } },
}), stub);

openapi.openapi(createRoute({
  method: 'post', path: '/notificaciones/aviso-nota', tags: ['Notificaciones'],
  summary: 'Enviar aviso de nueva calificacion',
  description: 'Dispara una notificacion via Novu y guarda notificacion in-app al crear una calificacion.',
  request: { body: { content: { 'application/json': { schema: avisoNotaBffSchema } } } },
  responses: { 200: { description: 'Notificacion enviada' }, 400: { description: 'Datos invalidos' }, 500: { description: 'Error al enviar' } },
}), stub);

openapi.openapi(createRoute({
  method: 'get', path: '/notificaciones/usuario/{usuarioId}', tags: ['Notificaciones'],
  summary: 'Obtener notificaciones de un usuario',
  request: { params: z.object({ usuarioId: z.coerce.number().int() }) },
  responses: { 200: { description: 'Lista de notificaciones del usuario' } },
}), stub);

openapi.openapi(createRoute({
  method: 'get', path: '/notificaciones/usuario/{usuarioId}/no-leidas', tags: ['Notificaciones'],
  summary: 'Contar notificaciones no leidas',
  request: { params: z.object({ usuarioId: z.coerce.number().int() }) },
  responses: { 200: { description: 'Conteo de notificaciones no leidas, ej: { "count": 3 }' } },
}), stub);

openapi.openapi(createRoute({
  method: 'put', path: '/notificaciones/{id}/leer', tags: ['Notificaciones'],
  summary: 'Marcar notificacion como leida',
  request: { params: z.object({ id: z.coerce.number().int() }) },
  responses: { 200: { description: 'Notificacion marcada como leida' }, 400: { description: 'ID invalido' } },
}), stub);

export default openapi;
