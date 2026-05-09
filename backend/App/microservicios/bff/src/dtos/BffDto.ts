import { z } from 'zod';

export const loginBffSchema = z.object({
  email: z.string().min(1, 'El email es obligatorio').email('Email inválido'),
  password: z.string().min(1, 'La contraseña es obligatoria').min(6, 'Mínimo 6 caracteres'),
});

export const loginAuthBffSchema = z.object({
  identifier: z.string().min(1, 'El email es obligatorio').email('Email inválido'),
  password: z.string().min(1, 'La contraseña es obligatoria').min(6, 'Mínimo 6 caracteres'),
});

export const crearCursoBffSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  nivel: z.string().min(1, 'El nivel es obligatorio'),
  letra: z.string().length(1, 'La letra debe ser un carácter'),
  anio: z.string().optional(),
});

export const crearAsignaturaBffSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  codigo: z.string().min(1, 'El código es obligatorio'),
  descripcion: z.string().optional(),
});

export const asignarMateriaBffSchema = z.object({
  cursoId: z.number().int().positive(),
  asignaturaId: z.number().int().positive(),
  profesorId: z.number().int().positive().optional().nullable(),
});

export type LoginBffDto = z.infer<typeof loginBffSchema>;
export type LoginAuthBffDto = z.infer<typeof loginAuthBffSchema>;
export type CrearCursoBffDto = z.infer<typeof crearCursoBffSchema>;
export type CrearAsignaturaBffDto = z.infer<typeof crearAsignaturaBffSchema>;
export type AsignarMateriaBffDto = z.infer<typeof asignarMateriaBffSchema>;
