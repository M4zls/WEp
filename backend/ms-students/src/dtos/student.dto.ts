import { z } from 'zod';

export const loginStudentSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es obligatorio')
    .email('El email no tiene un formato válido'),
  password: z
    .string()
    .min(1, 'La contraseña es obligatoria')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const createStudentSchema = z.object({
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
  courses: z
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
  phone: z.string().optional(),
  guardian: z.string().optional(),
});

export const updateStudentSchema = createStudentSchema.partial();

export type LoginStudentDto = z.infer<typeof loginStudentSchema>;
export type CreateStudentDto = z.infer<typeof createStudentSchema>;
export type UpdateStudentDto = z.infer<typeof updateStudentSchema>;
