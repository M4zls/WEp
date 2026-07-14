import { describe, it, expect } from 'bun:test';
import { loginAuthSchema, registerSchema } from '../dtos/AuthDto.js';

describe('loginAuthSchema', () => {
  it('should reject empty identifier', () => {
    const result = loginAuthSchema.safeParse({ identifier: '', password: '123456' });
    expect(result.success).toBe(false);
  });

  it('should reject empty password', () => {
    const result = loginAuthSchema.safeParse({ identifier: 'test@test.com', password: '' });
    expect(result.success).toBe(false);
  });

  it('should reject invalid email', () => {
    const result = loginAuthSchema.safeParse({ identifier: 'invalido', password: '123456' });
    expect(result.success).toBe(false);
  });

  it('should accept valid data', () => {
    const result = loginAuthSchema.safeParse({ identifier: 'test@test.com', password: '123456' });
    expect(result.success).toBe(true);
  });
});

describe('registerSchema', () => {
  it('should reject empty data', () => {
    const result = registerSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should reject invalid RUT', () => {
    const result = registerSchema.safeParse({
      rut: '123', dv: '5', firstName: 'Juan', lastName: 'Perez',
      email: 'test@test.com', password: '123456', role: 'teacher',
    });
    expect(result.success).toBe(false);
  });

  it('should reject short password', () => {
    const result = registerSchema.safeParse({
      rut: '12345678', dv: '5', firstName: 'Juan', lastName: 'Perez',
      email: 'test@test.com', password: '12', role: 'teacher',
    });
    expect(result.success).toBe(false);
  });

  it('should reject invalid role', () => {
    const result = registerSchema.safeParse({
      rut: '12345678', dv: '5', firstName: 'Juan', lastName: 'Perez',
      email: 'test@test.com', password: '123456', role: 'student',
    });
    expect(result.success).toBe(false);
  });

  it('should accept valid data', () => {
    const result = registerSchema.safeParse({
      rut: '12345678', dv: '5', firstName: 'Juan', lastName: 'Perez',
      email: 'test@test.com', password: '123456', role: 'teacher',
    });
    expect(result.success).toBe(true);
  });
});
