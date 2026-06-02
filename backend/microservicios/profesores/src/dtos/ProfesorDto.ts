import { z } from 'zod';

export const crearProfesorSchema = z.object({
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
  email: z
    .string()
    .min(1, 'El email es obligatorio')
    .email('El email no tiene un formato válido'),
  password: z
    .string()
    .min(1, 'La contraseña es obligatoria')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  telefono: z.string().optional(),
  materia: z
    .string()
    .min(1, 'La materia es obligatoria'),
});

export const actualizarProfesorSchema = crearProfesorSchema.partial();

export type CrearProfesorDto = z.infer<typeof crearProfesorSchema>;
export type ActualizarProfesorDto = z.infer<typeof actualizarProfesorSchema>;
