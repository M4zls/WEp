import { describe, it, expect } from 'bun:test';
import { createGradeSchema, updateGradeSchema } from '../dtos/grade.dto.js';

describe('createGradeSchema', () => {
  it('should reject empty data', () => {
    const result = createGradeSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should reject grade out of range', () => {
    const result = createGradeSchema.safeParse({
      studentRut: '12345678',
      subject: 'Matemáticas',
      course: '3°A',
      grade: '8.0',
      evaluationType: 'prueba',
      date: '2026-03-15',
      professorRut: '11111111',
    });
    expect(result.success).toBe(false);
  });

  it('should reject grade below 1.0', () => {
    const result = createGradeSchema.safeParse({
      studentRut: '12345678',
      subject: 'Matemáticas',
      course: '3°A',
      grade: '0.5',
      evaluationType: 'prueba',
      date: '2026-03-15',
      professorRut: '11111111',
    });
    expect(result.success).toBe(false);
  });

  it('should accept valid data', () => {
    const result = createGradeSchema.safeParse({
      studentRut: '12345678',
      subject: 'Matemáticas',
      course: '3°A',
      grade: '6.5',
      evaluationType: 'prueba',
      date: '2026-03-15',
      professorRut: '11111111',
    });
    expect(result.success).toBe(true);
  });
});

describe('updateGradeSchema', () => {
  it('should allow partial update', () => {
    const result = updateGradeSchema.safeParse({ grade: '7.0' });
    expect(result.success).toBe(true);
  });

  it('should reject invalid grade on update', () => {
    const result = updateGradeSchema.safeParse({ grade: '10.0' });
    expect(result.success).toBe(false);
  });

  it('should accept empty object (partial)', () => {
    const result = updateGradeSchema.safeParse({});
    expect(result.success).toBe(true);
  });
});
