import { z } from 'zod';

export const markAttendanceSchema = z.object({
  classId: z.number({ error: 'El ID de la clase es obligatorio' }).int().positive(),
  courseSubjectId: z.number({ error: 'El ID del curso-asignatura es obligatorio' }).int().positive(),
  records: z.array(z.object({
    studentRut: z.string({ error: 'El RUT del estudiante es obligatorio' }).min(1),
    studentName: z.string({ error: 'El nombre del estudiante es obligatorio' }).min(1),
    present: z.boolean({ error: 'El estado de asistencia es obligatorio' }),
    justification: z.string().optional(),
  })).min(1, 'Debe haber al menos un registro de asistencia'),
});

export const updateAttendanceSchema = z.object({
  present: z.boolean().optional(),
  justification: z.string().optional(),
});

export type MarkAttendanceDto = z.infer<typeof markAttendanceSchema>;
export type UpdateAttendanceDto = z.infer<typeof updateAttendanceSchema>;
