import { z } from 'zod';

const diasValidos = [1, 2, 3, 4, 5] as const;

export const createScheduleSchema = z.object({
  courseSubjectId: z.number({ error: 'El ID del curso-asignatura es obligatorio' }).int().positive(),
  weekDay: z.number({ error: 'El día de semana es obligatorio' }).int()
    .refine(d => diasValidos.includes(d as any), 'Debe ser 1=Lun, 2=Mar, 3=Mié, 4=Jue, 5=Vie'),
  startTime: z.string({ error: 'La hora de inicio es obligatoria' }).regex(/^\d{2}:\d{2}$/, 'Formato HH:MM'),
  endTime: z.string({ error: 'La hora de término es obligatoria' }).regex(/^\d{2}:\d{2}$/, 'Formato HH:MM'),
});

export const updateScheduleSchema = z.object({
  courseSubjectId: z.number().int().positive().optional(),
  weekDay: z.number().int()
    .refine(d => diasValidos.includes(d as any), 'Debe ser 1=Lun, 2=Mar, 3=Mié, 4=Jue, 5=Vie').optional(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Formato HH:MM').optional(),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Formato HH:MM').optional(),
});

export type CreateScheduleDto = z.infer<typeof createScheduleSchema>;
export type UpdateScheduleDto = z.infer<typeof updateScheduleSchema>;
