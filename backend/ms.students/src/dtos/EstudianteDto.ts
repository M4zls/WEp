import { z } from 'zod';

export const loginEstudianteSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es obligatorio')
    .email('El email no tiene un formato válido'),
  password: z
    .string()
    .min(1, 'La contraseña es obligatoria')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const crearEstudianteSchema = z.object({
  rut: z
    .string()
    .min(1, 'El RUT es obligatorio')
    .regex(/^\d{7,8}$/, 'El RUT debe tener entre 7 y 8 dígitos'),
  dv: z
    .string()
    .min(1, 'El dígito verificador es obligatorio')
    .length(1, 'El dígito verificador debe ser un solo carácter'),
  nombre: z
    .string()
    .min(1, 'El nombre es obligatorio'),
  apellido: z
    .string()
    .min(1, 'El apellido es obligatorio'),
  cursos: z
    .string()
    .min(1, 'El curso es obligatorio'),
  email: z
    .string()
    .min(1, 'El email es obligatorio')
    .email('El email no tiene un formato válido'),
  password: z
    .string()
    .min(1, 'La contraseña es obligatoria')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  telefono: z.string().optional(),
  apoderado: z.string().optional(),
});

export const actualizarEstudianteSchema = crearEstudianteSchema.partial();

export type LoginEstudianteDto = z.infer<typeof loginEstudianteSchema>;
export type CrearEstudianteDto = z.infer<typeof crearEstudianteSchema>;
export type ActualizarEstudianteDto = z.infer<typeof actualizarEstudianteSchema>;
