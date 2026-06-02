import { z } from 'zod';

export const crearCursoSchema = z.object({
  nombre: z
    .string({ error: 'El nombre del curso es obligatorio' })
    .min(1, 'El nombre no puede estar vacío'),
  nivel: z
    .string({ error: 'El nivel es obligatorio' })
    .min(1, 'El nivel no puede estar vacío'),
  letra: z
    .string({ error: 'La letra es obligatoria' })
    .length(1, 'La letra debe ser un solo carácter'),
  anio: z.string().optional(),
});

export const crearAsignaturaSchema = z.object({
  nombre: z
    .string({ error: 'El nombre de la asignatura es obligatorio' })
    .min(1, 'El nombre no puede estar vacío'),
  codigo: z
    .string({ error: 'El código es obligatorio' })
    .min(1, 'El código no puede estar vacío'),
  descripcion: z.string().optional(),
});

export const asignarMateriaSchema = z.object({
  cursoId: z
    .number({ error: 'El ID del curso es obligatorio' })
    .int('El ID del curso debe ser un número entero')
    .positive('El ID del curso debe ser positivo'),
  asignaturaId: z
    .number({ error: 'El ID de la asignatura es obligatorio' })
    .int('El ID de la asignatura debe ser un número entero')
    .positive('El ID de la asignatura debe ser positivo'),
  profesorId: z
    .number()
    .int()
    .positive()
    .optional()
    .nullable(),
});

export type CrearCursoDto = z.infer<typeof crearCursoSchema>;
export type CrearAsignaturaDto = z.infer<typeof crearAsignaturaSchema>;
export type AsignarMateriaDto = z.infer<typeof asignarMateriaSchema>;
