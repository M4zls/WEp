import { describe, it, expect } from 'vitest';
import { loginAuthSchema, registerSchema } from '../dtos/AuthDto.js';

describe('loginAuthSchema', () => {
  it('should accept valid login data', () => {
    const result = loginAuthSchema.safeParse({ identifier: 'test@test.com', password: '123456' });
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const result = loginAuthSchema.safeParse({ identifier: 'notanemail', password: '123456' });
    expect(result.success).toBe(false);
  });

  it('should reject short password', () => {
    const result = loginAuthSchema.safeParse({ identifier: 'test@test.com', password: '12345' });
    expect(result.success).toBe(false);
  });

  it('should reject empty identifier', () => {
    const result = loginAuthSchema.safeParse({ identifier: '', password: '123456' });
    expect(result.success).toBe(false);
  });

  it('should reject empty password', () => {
    const result = loginAuthSchema.safeParse({ identifier: 'test@test.com', password: '' });
    expect(result.success).toBe(false);
  });
});

describe('registerSchema', () => {
  it('should accept valid register data', () => {
    const result = registerSchema.safeParse({
      rut: '12345678', dv: '5', nombre: 'Juan', apellido: 'Perez',
      email: 'juan@test.com', password: '123456', rol: 'profesor',
    });
    expect(result.success).toBe(true);
  });

  it('should accept admin role', () => {
    const result = registerSchema.safeParse({
      rut: '12345678', dv: '5', nombre: 'Juan', apellido: 'Perez',
      email: 'juan@test.com', password: '123456', rol: 'admin',
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid role', () => {
    const result = registerSchema.safeParse({
      rut: '12345678', dv: '5', nombre: 'Juan', apellido: 'Perez',
      email: 'juan@test.com', password: '123456', rol: 'estudiante',
    });
    expect(result.success).toBe(false);
  });

  it('should reject invalid RUT format', () => {
    const result = registerSchema.safeParse({
      rut: '123', dv: '5', nombre: 'Juan', apellido: 'Perez',
      email: 'juan@test.com', password: '123456', rol: 'profesor',
    });
    expect(result.success).toBe(false);
  });

  it('should reject invalid DV length', () => {
    const result = registerSchema.safeParse({
      rut: '12345678', dv: '55', nombre: 'Juan', apellido: 'Perez',
      email: 'juan@test.com', password: '123456', rol: 'profesor',
    });
    expect(result.success).toBe(false);
  });

  it('should reject empty email', () => {
    const result = registerSchema.safeParse({
      rut: '12345678', dv: '5', nombre: 'Juan', apellido: 'Perez',
      email: '', password: '123456', rol: 'profesor',
    });
    expect(result.success).toBe(false);
  });

  it('should reject short password', () => {
    const result = registerSchema.safeParse({
      rut: '12345678', dv: '5', nombre: 'Juan', apellido: 'Perez',
      email: 'juan@test.com', password: '12345', rol: 'profesor',
    });
    expect(result.success).toBe(false);
  });
});
