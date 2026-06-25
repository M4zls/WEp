import { z } from 'zod';

export const createTeacherSchema = z.object({
  rut: z
    .string()
    .min(1, 'El RUT es obligatorio')
    .regex(/^\d{7,8}$/, 'El RUT debe tener entre 7 y 8 dígitos'),
  dv: z
    .string()
    .min(1, 'El dígito verificador es obligatorio')
    .length(1, 'El dígito verificador debe ser un solo carácter'),
  name: z
    .string()
    .min(1, 'El nombre es obligatorio'),
  lastName: z
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
  phone: z.string().optional(),
  subject: z
    .string()
    .min(1, 'La materia es obligatoria'),
});

export const loginTeacherSchema = z.object({
  email: z.string().min(1, 'El email es obligatorio').email('El email no tiene un formato válido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
});

export const updateTeacherSchema = createTeacherSchema.partial();

export type CreateTeacherDto = z.infer<typeof createTeacherSchema>;
export type UpdateTeacherDto = z.infer<typeof updateTeacherSchema>;
export type LoginTeacherDto = z.infer<typeof loginTeacherSchema>;
