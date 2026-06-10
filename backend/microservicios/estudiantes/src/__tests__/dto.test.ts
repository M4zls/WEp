import { describe, it, expect } from 'vitest';
import { loginEstudianteSchema, crearEstudianteSchema, actualizarEstudianteSchema } from '../dtos/EstudianteDto.js';

describe('loginEstudianteSchema', () => {
  it('should accept valid login', () => {
    const result = loginEstudianteSchema.safeParse({ email: 'alumno@test.com', password: '123456' });
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const result = loginEstudianteSchema.safeParse({ email: 'notemail', password: '123456' });
    expect(result.success).toBe(false);
  });

  it('should reject short password', () => {
    const result = loginEstudianteSchema.safeParse({ email: 'alumno@test.com', password: '12345' });
    expect(result.success).toBe(false);
  });
});

describe('crearEstudianteSchema', () => {
  const validData = {
    rut: '12345678', dv: '5', nombre: 'Carlos', apellido: 'Muñoz',
    cursos: '1A', email: 'carlos@test.com', password: '123456',
  };

  it('should accept valid student data', () => {
    const result = crearEstudianteSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should accept optional fields', () => {
    const result = crearEstudianteSchema.safeParse({ ...validData, telefono: '123456789', apoderado: 'Pedro' });
    expect(result.success).toBe(true);
  });

  it('should reject invalid RUT', () => {
    const result = crearEstudianteSchema.safeParse({ ...validData, rut: '123' });
    expect(result.success).toBe(false);
  });

  it('should reject empty email', () => {
    const result = crearEstudianteSchema.safeParse({ ...validData, email: '' });
    expect(result.success).toBe(false);
  });

  it('should reject short password', () => {
    const result = crearEstudianteSchema.safeParse({ ...validData, password: '12345' });
    expect(result.success).toBe(false);
  });

  it('should reject empty course', () => {
    const result = crearEstudianteSchema.safeParse({ ...validData, cursos: '' });
    expect(result.success).toBe(false);
  });
});

describe('actualizarEstudianteSchema', () => {
  it('should accept partial update', () => {
    const result = actualizarEstudianteSchema.safeParse({ nombre: 'Nuevo Nombre' });
    expect(result.success).toBe(true);
  });

  it('should accept empty object', () => {
    const result = actualizarEstudianteSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('should reject invalid email in partial', () => {
    const result = actualizarEstudianteSchema.safeParse({ email: 'bademail' });
    expect(result.success).toBe(false);
  });
});
