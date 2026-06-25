import { z } from 'zod';

const validStatuses = ['pending', 'completed', 'cancelled'] as const;

export const createClassSchema = z.object({
  courseSubjectId: z
    .number({ error: 'El ID del curso-asignatura es obligatorio' })
    .int('Debe ser un número entero')
    .positive('Debe ser un número positivo'),
  title: z
    .string({ error: 'El título es obligatorio' })
    .min(1, 'El título no puede estar vacío'),
  description: z.string().optional(),
  date: z
    .string({ error: 'La fecha es obligatoria' })
    .min(1, 'La fecha no puede estar vacía'),
  startTime: z
    .string({ error: 'La hora de inicio es obligatoria' })
    .regex(/^\d{2}:\d{2}$/, 'La hora debe estar en formato HH:MM'),
  endTime: z
    .string({ error: 'La hora de término es obligatoria' })
    .regex(/^\d{2}:\d{2}$/, 'La hora debe estar en formato HH:MM'),
  status: z.enum(validStatuses).optional().default('pending'),
});

export const updateClassSchema = z.object({
  title: z.string().min(1, 'El título no puede estar vacío').optional(),
  description: z.string().optional(),
  date: z.string().min(1, 'La fecha no puede estar vacía').optional(),
  startTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'La hora debe estar en formato HH:MM')
    .optional(),
  endTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'La hora debe estar en formato HH:MM')
    .optional(),
  status: z.enum(validStatuses).optional(),
});

export type CreateClassDto = z.infer<typeof createClassSchema>;
export type UpdateClassDto = z.infer<typeof updateClassSchema>;
