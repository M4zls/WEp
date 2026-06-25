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

export const avisoNotaSchema = z.object({
  subscriberId: z.string().min(1),
  estudianteRut: z.string().min(1),
  nombreAlumno: z.string().min(1),
  emailAlumno: z.string().email(),
  nombreApoderado: z.string().optional(),
  emailApoderado: z.string().email().optional(),
  asignatura: z.string().min(1),
  nota: z.string().min(1),
  tipoEvaluacion: z.string().min(1),
  nombreProfesor: z.string().min(1),
  curso: z.string().min(1),
});

export type AvisoNotaDto = z.infer<typeof avisoNotaSchema>;

export const avisoMensajeSchema = z.object({
  destinatarioRut: z.string().min(1),
  destinatarioRol: z.enum(['estudiante', 'profesor']),
  remitenteNombre: z.string().min(1),
  remitenteApellido: z.string().min(1),
  contenidoPreview: z.string().min(1),
  conversacionId: z.number(),
});

export type AvisoMensajeDto = z.infer<typeof avisoMensajeSchema>;