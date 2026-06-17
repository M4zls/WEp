import { describe, it, expect } from 'bun:test';
import { crearNotaSchema, actualizarNotaSchema } from '../dtos/NotaDto.js';

describe('crearNotaSchema', () => {
  it('debe rechazar datos vacíos', () => {
    const result = crearNotaSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('debe rechazar nota fuera de rango', () => {
    const result = crearNotaSchema.safeParse({
      estudianteRut: '12345678',
      asignatura: 'Matemáticas',
      curso: '3°A',
      nota: '8.0',
      tipoEvaluacion: 'prueba',
      fecha: '2026-03-15',
      profesorRut: '11111111',
    });
    expect(result.success).toBe(false);
  });

  it('debe rechazar nota menor a 1.0', () => {
    const result = crearNotaSchema.safeParse({
      estudianteRut: '12345678',
      asignatura: 'Matemáticas',
      curso: '3°A',
      nota: '0.5',
      tipoEvaluacion: 'prueba',
      fecha: '2026-03-15',
      profesorRut: '11111111',
    });
    expect(result.success).toBe(false);
  });

  it('debe aceptar datos válidos', () => {
    const result = crearNotaSchema.safeParse({
      estudianteRut: '12345678',
      asignatura: 'Matemáticas',
      curso: '3°A',
      nota: '6.5',
      tipoEvaluacion: 'prueba',
      fecha: '2026-03-15',
      profesorRut: '11111111',
    });
    expect(result.success).toBe(true);
  });
});

describe('actualizarNotaSchema', () => {
  it('debe permitir actualización parcial', () => {
    const result = actualizarNotaSchema.safeParse({ nota: '7.0' });
    expect(result.success).toBe(true);
  });

  it('debe rechazar nota inválida en actualización', () => {
    const result = actualizarNotaSchema.safeParse({ nota: '10.0' });
    expect(result.success).toBe(false);
  });

  it('debe aceptar objeto vacío (partial)', () => {
    const result = actualizarNotaSchema.safeParse({});
    expect(result.success).toBe(true);
  });
});
