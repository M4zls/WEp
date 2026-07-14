import { describe, it, expect } from 'bun:test';
import { createTeacherSchema } from '../dtos/teacher.dto.js';

describe('createTeacherSchema', () => {
  it('should reject empty data', () => {
    const result = createTeacherSchema.safeParse({});
    expect(result.success).toBe(false);
  });
  it('should reject invalid RUT', () => {
    const result = createTeacherSchema.safeParse({ rut: '12', dv: '5', firstName: 'Pedro', lastName: 'Gomez', email: 'pedro@test.com', password: '123456', subject: 'Mat' });
    expect(result.success).toBe(false);
  });
  it('should accept valid data', () => {
    const result = createTeacherSchema.safeParse({ rut: '12345678', dv: '5', firstName: 'Pedro', lastName: 'Gomez', email: 'pedro@test.com', password: '123456', subject: 'Matematicas' });
    expect(result.success).toBe(true);
  });
});
