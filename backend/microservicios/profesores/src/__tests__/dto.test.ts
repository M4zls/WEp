import { describe, it, expect } from 'vitest';
import { crearProfesorSchema, actualizarProfesorSchema } from '../dtos/ProfesorDto.js';

describe('crearProfesorSchema', () => {
  const validData = {
    rut: '12345678', dv: '5', nombre: 'Pedro', apellido: 'Gomez',
    email: 'pedro@test.com', password: '123456', materia: 'Matematicas',
  };

  it('should accept valid teacher data', () => {
    const result = crearProfesorSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should accept optional telefono', () => {
    const result = crearProfesorSchema.safeParse({ ...validData, telefono: '987654321' });
    expect(result.success).toBe(true);
  });

  it('should reject invalid RUT', () => {
    const result = crearProfesorSchema.safeParse({ ...validData, rut: '123' });
    expect(result.success).toBe(false);
  });

  it('should reject invalid email', () => {
    const result = crearProfesorSchema.safeParse({ ...validData, email: 'notemail' });
    expect(result.success).toBe(false);
  });

  it('should reject short password', () => {
    const result = crearProfesorSchema.safeParse({ ...validData, password: '12345' });
    expect(result.success).toBe(false);
  });

  it('should reject empty materia', () => {
    const result = crearProfesorSchema.safeParse({ ...validData, materia: '' });
    expect(result.success).toBe(false);
  });

  it('should reject invalid DV', () => {
    const result = crearProfesorSchema.safeParse({ ...validData, dv: '55' });
    expect(result.success).toBe(false);
  });
});

describe('actualizarProfesorSchema', () => {
  it('should accept partial update', () => {
    const result = actualizarProfesorSchema.safeParse({ nombre: 'Nuevo' });
    expect(result.success).toBe(true);
  });

  it('should accept empty object', () => {
    const result = actualizarProfesorSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('should reject invalid email in partial', () => {
    const result = actualizarProfesorSchema.safeParse({ email: 'bademail' });
    expect(result.success).toBe(false);
  });
});
