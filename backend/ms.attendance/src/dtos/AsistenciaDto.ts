import { z } from 'zod';

export const marcarAsistenciaSchema = z.object({
  claseId: z.number({ error: 'El ID de la clase es obligatorio' }).int().positive(),
  cursoAsignaturaId: z.number({ error: 'El ID del curso-asignatura es obligatorio' }).int().positive(),
  registros: z.array(z.object({
    estudianteRut: z.string({ error: 'El RUT del estudiante es obligatorio' }).min(1),
    estudianteNombre: z.string({ error: 'El nombre del estudiante es obligatorio' }).min(1),
    presente: z.boolean({ error: 'El estado de asistencia es obligatorio' }),
    justificacion: z.string().optional(),
  })).min(1, 'Debe haber al menos un registro de asistencia'),
});

export const actualizarAsistenciaSchema = z.object({
  presente: z.boolean().optional(),
  justificacion: z.string().optional(),
});

export type MarcarAsistenciaDto = z.infer<typeof marcarAsistenciaSchema>;
export type ActualizarAsistenciaDto = z.infer<typeof actualizarAsistenciaSchema>;
