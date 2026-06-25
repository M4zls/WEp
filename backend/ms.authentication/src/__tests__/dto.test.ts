import { describe, it, expect } from 'bun:test';
import { loginAuthSchema, registerSchema } from '../dtos/AuthDto.js';

describe('loginAuthSchema', () => {
  it('debe rechazar identifier vacío', () => {
    const result = loginAuthSchema.safeParse({ identifier: '', password: '123456' });
    expect(result.success).toBe(false);
  });

  it('debe rechazar contraseña vacía', () => {
    const result = loginAuthSchema.safeParse({ identifier: 'test@test.com', password: '' });
    expect(result.success).toBe(false);
  });

  it('debe rechazar email inválido', () => {
    const result = loginAuthSchema.safeParse({ identifier: 'invalido', password: '123456' });
    expect(result.success).toBe(false);
  });

  it('debe aceptar datos válidos', () => {
    const result = loginAuthSchema.safeParse({ identifier: 'test@test.com', password: '123456' });
    expect(result.success).toBe(true);
  });
});

describe('registerSchema', () => {
  it('debe rechazar datos vacíos', () => {
    const result = registerSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('debe rechazar RUT inválido', () => {
    const result = registerSchema.safeParse({
      rut: '123', dv: '5', nombre: 'Juan', apellido: 'Perez',
      email: 'test@test.com', password: '123456', rol: 'profesor',
    });
    expect(result.success).toBe(false);
  });

  it('debe rechazar contraseña corta', () => {
    const result = registerSchema.safeParse({
      rut: '12345678', dv: '5', nombre: 'Juan', apellido: 'Perez',
      email: 'test@test.com', password: '12', rol: 'profesor',
    });
    expect(result.success).toBe(false);
  });

  it('debe rechazar rol inválido', () => {
    const result = registerSchema.safeParse({
      rut: '12345678', dv: '5', nombre: 'Juan', apellido: 'Perez',
      email: 'test@test.com', password: '123456', rol: 'estudiante',
    });
    expect(result.success).toBe(false);
  });

  it('debe aceptar datos válidos', () => {
    const result = registerSchema.safeParse({
      rut: '12345678', dv: '5', nombre: 'Juan', apellido: 'Perez',
      email: 'test@test.com', password: '123456', rol: 'profesor',
    });
    expect(result.success).toBe(true);
  });
});
