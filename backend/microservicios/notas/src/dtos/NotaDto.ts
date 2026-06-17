import { z } from 'zod';

/** @const Esquema Zod para crear una nota */
export const crearNotaSchema = z.object({
  estudianteRut: z.string().min(1, 'El RUT del estudiante es obligatorio'),
  asignatura: z.string().min(1, 'La asignatura es obligatoria'),
  curso: z.string().min(1, 'El curso es obligatorio'),
  nota: z
    .string()
    .min(1, 'El valor de la nota es obligatorio')
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num >= 1.0 && num <= 7.0;
      },
      { message: 'La nota debe estar entre 1.0 y 7.0' },
    ),
  tipoEvaluacion: z.string().min(1, 'El tipo de evaluación es obligatorio'),
  fecha: z.string().min(1, 'La fecha es obligatoria'),
  profesorRut: z.string().min(1, 'El RUT del profesor es obligatorio'),
  coeficiente: z.union([z.literal(1), z.literal(2)]).optional().default(1),
});

/** @const Esquema Zod para actualizar una nota (todos los campos opcionales) */
export const actualizarNotaSchema = crearNotaSchema.partial();

/** @const Esquema Zod para crear múltiples notas en batch */
export const crearNotasBatchSchema = z.object({
  notas: z.array(crearNotaSchema).min(1, 'Debe incluir al menos una nota'),
});

/** @const Esquema Zod para consultar notas por RUT de estudiante */
export const notasEstudianteSchema = z.object({
  rut: z.string().min(1, 'El RUT es obligatorio'),
});

/** @const Esquema Zod para consultar notas por curso */
export const notasCursoSchema = z.object({
  curso: z.string().min(1, 'El curso es obligatorio'),
  profesorRut: z.string().min(1, 'El RUT del profesor es obligatorio'),
});

export type CrearNotaDto = z.infer<typeof crearNotaSchema>;
export type ActualizarNotaDto = z.infer<typeof actualizarNotaSchema>;
export type CrearNotasBatchDto = z.infer<typeof crearNotasBatchSchema>;
export type NotasEstudianteDto = z.infer<typeof notasEstudianteSchema>;
export type NotasCursoDto = z.infer<typeof notasCursoSchema>;
