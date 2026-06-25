import { z } from 'zod';

const estadosValidos = ['pendiente', 'realizada', 'cancelada'] as const;

export const crearClaseSchema = z.object({
  cursoAsignaturaId: z
    .number({ error: 'El ID del curso-asignatura es obligatorio' })
    .int('Debe ser un número entero')
    .positive('Debe ser un número positivo'),
  titulo: z
    .string({ error: 'El título es obligatorio' })
    .min(1, 'El título no puede estar vacío'),
  descripcion: z.string().optional(),
  fecha: z
    .string({ error: 'La fecha es obligatoria' })
    .min(1, 'La fecha no puede estar vacía'),
  horaInicio: z
    .string({ error: 'La hora de inicio es obligatoria' })
    .regex(/^\d{2}:\d{2}$/, 'La hora debe estar en formato HH:MM'),
  horaTermino: z
    .string({ error: 'La hora de término es obligatoria' })
    .regex(/^\d{2}:\d{2}$/, 'La hora debe estar en formato HH:MM'),
  estado: z.enum(estadosValidos).optional().default('pendiente'),
});

export const actualizarClaseSchema = z.object({
  titulo: z.string().min(1, 'El título no puede estar vacío').optional(),
  descripcion: z.string().optional(),
  fecha: z.string().min(1, 'La fecha no puede estar vacía').optional(),
  horaInicio: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'La hora debe estar en formato HH:MM')
    .optional(),
  horaTermino: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'La hora debe estar en formato HH:MM')
    .optional(),
  estado: z.enum(estadosValidos).optional(),
});

export type CrearClaseDto = z.infer<typeof crearClaseSchema>;
export type ActualizarClaseDto = z.infer<typeof actualizarClaseSchema>;
