import { describe, it, expect } from 'bun:test';
import { createClassSchema, updateClassSchema } from '../dtos/class.dto.js';

describe('createClassSchema', () => {
  it('debe rechazar vacío', () => expect(createClassSchema.safeParse({}).success).toBe(false));
  it('debe aceptar válido', () => {
    const r = createClassSchema.safeParse({ courseSubjectId: 1, title: 'Clase 1', date: '2026-06-10', startTime: '10:00', endTime: '11:00' });
    expect(r.success).toBe(true);
  });
});

describe('updateClassSchema', () => {
  it('debe aceptar parcial', () => expect(updateClassSchema.safeParse({ title: 'Nuevo' }).success).toBe(true));
});
