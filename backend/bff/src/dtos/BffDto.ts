import { z } from 'zod';

// ─── Autenticación ───

export const loginBffSchema = z.object({
  email: z.string().min(1, 'El email es obligatorio').email('Email inválido'),
  password: z.string().min(1, 'La contraseña es obligatoria').min(6, 'Mínimo 6 caracteres'),
});

export const loginAuthBffSchema = z.object({
  identifier: z.string().min(1, 'El email es obligatorio').email('Email inválido'),
  password: z.string().min(1, 'La contraseña es obligatoria').min(6, 'Mínimo 6 caracteres'),
});

export const registerBffSchema = z.object({
  rut: z.string().min(1, 'El RUT es obligatorio').regex(/^\d{7,8}$/, 'RUT debe tener 7-8 dígitos'),
  dv: z.string().length(1, 'DV debe ser 1 carácter'),
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  apellido: z.string().min(1, 'El apellido es obligatorio'),
  email: z.string().min(1, 'El email es obligatorio').email('Email inválido'),
  password: z.string().min(1, 'La contraseña es obligatoria').min(6, 'Mínimo 6 caracteres'),
  rol: z.string().min(1).refine(val => ['admin', 'profesor'].includes(val), 'Rol debe ser admin o profesor'),
});

// ─── Cursos ───

export const crearCursoBffSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  nivel: z.string().min(1, 'El nivel es obligatorio'),
  letra: z.string().length(1, 'La letra debe ser un carácter'),
  anio: z.string().optional(),
});

export const crearAsignaturaBffSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  codigo: z.string().min(1, 'El código es obligatorio'),
  descripcion: z.string().optional(),
});

export const asignarMateriaBffSchema = z.object({
  cursoId: z.number().int().positive(),
  asignaturaId: z.number().int().positive(),
  profesorId: z.number().int().positive().optional().nullable(),
});

// ─── Clases ───

export const crearClaseBffSchema = z.object({
  curso_asignatura_id: z.number().int().positive(),
  fecha: z.string().min(1, 'La fecha es obligatoria'),
  hora_inicio: z.string().min(1, 'La hora de inicio es obligatoria'),
  hora_fin: z.string().min(1, 'La hora de fin es obligatoria'),
});

// ─── Horarios ───

export const crearHorarioBffSchema = z.object({
  curso_asignatura_id: z.number().int().positive(),
  dia_semana: z.number().int().min(1).max(5, 'Día debe ser 1-5 (lunes a viernes)'),
  hora_inicio: z.string().min(1, 'La hora de inicio es obligatoria'),
  hora_fin: z.string().min(1, 'La hora de fin es obligatoria'),
});

// ─── Asistencia ───

export const marcarAsistenciaBffSchema = z.object({
  clase_id: z.number().int().positive(),
  estudiante_rut: z.string().min(1, 'El RUT del estudiante es obligatorio'),
  presente: z.boolean(),
});

// ─── Mensajería ───

export const crearConversacionBffSchema = z.object({
  participantes: z.array(z.string()).min(2, 'Debe haber al menos 2 participantes'),
});

export const enviarMensajeBffSchema = z.object({
  conversacion_id: z.number().int().positive(),
  remitente_rut: z.string().min(1, 'El RUT del remitente es obligatorio'),
  contenido: z.string().min(1, 'El contenido no puede estar vacío'),
});

// ─── Notas ───

export const crearNotaBffSchema = z.object({
  estudianteRut: z.string().min(1, 'El RUT del estudiante es obligatorio'),
  asignatura: z.string().min(1, 'La asignatura es obligatoria'),
  curso: z.string().min(1, 'El curso es obligatorio'),
  nota: z.string().min(1, 'La nota es obligatoria'),
  tipoEvaluacion: z.enum(['prueba', 'prueba_sintesis', 'presentacion', 'trabajo', 'tarea']),
  fecha: z.string().min(1, 'La fecha es obligatoria'),
  profesorRut: z.string().min(1, 'El RUT del profesor es obligatorio'),
  coeficiente: z.number().int().positive().default(1),
});

export const notasBatchBffSchema = z.array(crearNotaBffSchema).min(1, 'Debe haber al menos una nota');

// ─── Notificaciones ───

export const avisoInasistenciaBffSchema = z.object({
  subscriberId: z.string().min(1, 'El subscriberId es obligatorio'),
  nombreApoderado: z.string().min(1, 'El nombre del apoderado es obligatorio'),
  nombreAlumno: z.string().min(1, 'El nombre del alumno es obligatorio'),
  curso: z.string().min(1, 'El curso es obligatorio'),
  fecha: z.string().min(1, 'La fecha es obligatoria'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
});

export const avisoNotaBffSchema = z.object({
  subscriberId: z.string().min(1, 'El subscriberId es obligatorio'),
  estudianteRut: z.string().min(1, 'El RUT del estudiante es obligatorio'),
  nombreAlumno: z.string().min(1, 'El nombre del alumno es obligatorio'),
  emailAlumno: z.string().email('Email del alumno inválido'),
  nombreApoderado: z.string().optional(),
  emailApoderado: z.string().email('Email del apoderado inválido').optional(),
  asignatura: z.string().min(1, 'La asignatura es obligatoria'),
  nota: z.string().min(1, 'La nota es obligatoria'),
  tipoEvaluacion: z.string().min(1, 'El tipo de evaluación es obligatorio'),
  nombreProfesor: z.string().min(1, 'El nombre del profesor es obligatorio'),
  curso: z.string().min(1, 'El curso es obligatorio'),
});

// ─── Types ───

export type LoginBffDto = z.infer<typeof loginBffSchema>;
export type LoginAuthBffDto = z.infer<typeof loginAuthBffSchema>;
export type RegisterBffDto = z.infer<typeof registerBffSchema>;
export type CrearCursoBffDto = z.infer<typeof crearCursoBffSchema>;
export type CrearAsignaturaBffDto = z.infer<typeof crearAsignaturaBffSchema>;
export type AsignarMateriaBffDto = z.infer<typeof asignarMateriaBffSchema>;
export type CrearClaseBffDto = z.infer<typeof crearClaseBffSchema>;
export type CrearHorarioBffDto = z.infer<typeof crearHorarioBffSchema>;
export type MarcarAsistenciaBffDto = z.infer<typeof marcarAsistenciaBffSchema>;
export type CrearConversacionBffDto = z.infer<typeof crearConversacionBffSchema>;
export type EnviarMensajeBffDto = z.infer<typeof enviarMensajeBffSchema>;
export type CrearNotaBffDto = z.infer<typeof crearNotaBffSchema>;
export type AvisoInasistenciaBffDto = z.infer<typeof avisoInasistenciaBffSchema>;
export type AvisoNotaBffDto = z.infer<typeof avisoNotaBffSchema>;
