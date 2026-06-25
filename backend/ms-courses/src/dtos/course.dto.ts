import { z } from 'zod';

export const createCourseSchema = z.object({
  name: z
    .string({ error: 'El nombre del curso es obligatorio' })
    .min(1, 'El nombre no puede estar vacío'),
  level: z
    .string({ error: 'El nivel es obligatorio' })
    .min(1, 'El nivel no puede estar vacío'),
  letter: z
    .string({ error: 'La letra es obligatoria' })
    .length(1, 'La letra debe ser un solo carácter'),
  year: z.string().optional(),
});

export const createSubjectSchema = z.object({
  name: z
    .string({ error: 'El nombre de la asignatura es obligatorio' })
    .min(1, 'El nombre no puede estar vacío'),
  code: z
    .string({ error: 'El código es obligatorio' })
    .min(1, 'El código no puede estar vacío'),
  description: z.string().optional(),
});

export const assignSubjectSchema = z.object({
  courseId: z
    .number({ error: 'El ID del curso es obligatorio' })
    .int('El ID del curso debe ser un número entero')
    .positive('El ID del curso debe ser positivo'),
  subjectId: z
    .number({ error: 'El ID de la asignatura es obligatorio' })
    .int('El ID de la asignatura debe ser un número entero')
    .positive('El ID de la asignatura debe ser positivo'),
  professorId: z
    .number()
    .int()
    .positive()
    .optional()
    .nullable(),
});

export type CreateCourseDto = z.infer<typeof createCourseSchema>;
export type CreateSubjectDto = z.infer<typeof createSubjectSchema>;
export type AssignSubjectDto = z.infer<typeof assignSubjectSchema>;
