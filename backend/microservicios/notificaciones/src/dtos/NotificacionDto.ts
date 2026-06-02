import { z } from 'zod';

export const avisoInasistenciaSchema = z.object({
  subscriberId: z.string().min(1),
  nombreApoderado: z.string().min(1),
  nombreAlumno: z.string().min(1),
  curso: z.string().min(1),
  fecha: z.string().min(1),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
});

export type AvisoInasistenciaDto = z.infer<typeof avisoInasistenciaSchema>;