import { describe, it, expect } from 'bun:test';
import { loginEstudianteSchema, crearEstudianteSchema } from '../dtos/EstudianteDto.js';

describe('loginEstudianteSchema', () => {
  it('debe rechazar email vacío', () => {
    const result = loginEstudianteSchema.safeParse({ email: '', password: '123456' });
    expect(result.success).toBe(false);
  });
  it('debe aceptar datos válidos', () => {
    const result = loginEstudianteSchema.safeParse({ email: 'test@test.com', password: '123456' });
    expect(result.success).toBe(true);
  });
});

describe('crearEstudianteSchema', () => {
  it('debe rechazar datos vacíos', () => {
    const result = crearEstudianteSchema.safeParse({});
    expect(result.success).toBe(false);
  });
  it('debe rechazar RUT inválido', () => {
    const result = crearEstudianteSchema.safeParse({ rut: '123', dv: '5', nombre: 'Juan', apellido: 'Perez', cursos: '1A', email: 'test@test.com', password: '123456' });
    expect(result.success).toBe(false);
  });
  it('debe aceptar datos válidos', () => {
    const result = crearEstudianteSchema.safeParse({ rut: '12345678', dv: '5', nombre: 'Juan', apellido: 'Perez', cursos: '1A', email: 'test@test.com', password: '123456' });
    expect(result.success).toBe(true);
  });
});
