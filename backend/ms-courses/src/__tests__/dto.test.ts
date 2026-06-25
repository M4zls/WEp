import { describe, it, expect } from 'bun:test';
import { createCourseSchema, createSubjectSchema, assignSubjectSchema } from '../dtos/course.dto.js';

describe('createCourseSchema', () => {
  it('should reject empty data', () => {
    expect(createCourseSchema.safeParse({}).success).toBe(false);
  });
  it('should accept valid data', () => {
    expect(createCourseSchema.safeParse({ name: '1A', level: 'Primero', letter: 'A' }).success).toBe(true);
  });
});

describe('createSubjectSchema', () => {
  it('should reject empty data', () => {
    expect(createSubjectSchema.safeParse({}).success).toBe(false);
  });
  it('should accept valid data', () => {
    expect(createSubjectSchema.safeParse({ name: 'Matematicas', code: 'MAT101' }).success).toBe(true);
  });
});

describe('assignSubjectSchema', () => {
  it('should reject empty data', () => {
    expect(assignSubjectSchema.safeParse({}).success).toBe(false);
  });
  it('should accept valid data', () => {
    expect(assignSubjectSchema.safeParse({ courseId: 1, subjectId: 1 }).success).toBe(true);
  });
});
