import { describe, it, expect } from 'bun:test';
import { loginStudentSchema, createStudentSchema } from '../dtos/student.dto.js';

describe('loginStudentSchema', () => {
  it('should reject empty email', () => {
    const result = loginStudentSchema.safeParse({ email: '', password: '123456' });
    expect(result.success).toBe(false);
  });
  it('should accept valid data', () => {
    const result = loginStudentSchema.safeParse({ email: 'test@test.com', password: '123456' });
    expect(result.success).toBe(true);
  });
});

describe('createStudentSchema', () => {
  it('should reject empty data', () => {
    const result = createStudentSchema.safeParse({});
    expect(result.success).toBe(false);
  });
  it('should reject invalid RUT', () => {
    const result = createStudentSchema.safeParse({ rut: '123', dv: '5', firstName: 'Juan', lastName: 'Perez', courses: '1A', email: 'test@test.com', password: '123456' });
    expect(result.success).toBe(false);
  });
  it('should accept valid data', () => {
    const result = createStudentSchema.safeParse({ rut: '12345678', dv: '5', firstName: 'Juan', lastName: 'Perez', courses: '1A', email: 'test@test.com', password: '123456' });
    expect(result.success).toBe(true);
  });
});
