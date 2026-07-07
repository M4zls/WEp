import { z } from 'zod';

export const loginAuthSchema = z.object({
  identifier: z
    .string()
    .min(1, 'El email es obligatorio')
    .email('El email no tiene un formato válido'),
  password: z
    .string()
    .min(1, 'La contraseña es obligatoria')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const registerSchema = z.object({
  rut: z
    .string()
    .min(1, 'El RUT es obligatorio')
    .regex(/^\d{7,8}$/, 'El RUT debe tener entre 7 y 8 dígitos'),
  dv: z
    .string()
    .min(1, 'El dígito verificador es obligatorio')
    .length(1, 'El dígito verificador debe ser un solo carácter'),
  firstName: z
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
  role: z
    .string()
    .min(1, 'El rol es obligatorio')
    .refine((val) => ['admin', 'teacher'].includes(val), 'El rol debe ser admin o teacher'),
});

export type LoginAuthDto = z.infer<typeof loginAuthSchema>;
export type RegisterDto = z.infer<typeof registerSchema>;
