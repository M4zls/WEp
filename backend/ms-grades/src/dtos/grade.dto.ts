import { z } from 'zod';

/** @const Esquema Zod para crear una nota */
export const createGradeSchema = z.object({
  studentRut: z.string().min(1, 'El RUT del estudiante es obligatorio'),
  subject: z.string().min(1, 'La asignatura es obligatoria'),
  curso: z.string().min(1, 'El curso es obligatorio'),
  grade: z
    .string()
    .min(1, 'El valor de la nota es obligatorio')
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num >= 1.0 && num <= 7.0;
      },
      { message: 'La nota debe estar entre 1.0 y 7.0' },
    ),
  evaluationType: z.string().min(1, 'El tipo de evaluación es obligatorio'),
  date: z.string().min(1, 'La fecha es obligatoria'),
  professorRut: z.string().min(1, 'El RUT del profesor es obligatorio'),
  coefficient: z.union([z.literal(1), z.literal(2)]).optional().default(1),
});

/** @const Esquema Zod para actualizar una nota (todos los campos opcionales) */
export const updateGradeSchema = createGradeSchema.partial();

/** @const Esquema Zod para crear múltiples notas en batch */
export const createGradesBatchSchema = z.object({
  grades: z.array(createGradeSchema).min(1, 'Debe incluir al menos una nota'),
});

/** @const Esquema Zod para consultar notas por RUT de estudiante */
export const gradesForStudentSchema = z.object({
  rut: z.string().min(1, 'El RUT es obligatorio'),
});

/** @const Esquema Zod para consultar notas por curso */
export const gradesForCourseSchema = z.object({
  curso: z.string().min(1, 'El curso es obligatorio'),
  professorRut: z.string().min(1, 'El RUT del profesor es obligatorio'),
});

export type CreateGradeDto = z.infer<typeof createGradeSchema>;
export type UpdateGradeDto = z.infer<typeof updateGradeSchema>;
export type CreateGradesBatchDto = z.infer<typeof createGradesBatchSchema>;
export type GradesForStudentDto = z.infer<typeof gradesForStudentSchema>;
export type GradesForCourseDto = z.infer<typeof gradesForCourseSchema>;
