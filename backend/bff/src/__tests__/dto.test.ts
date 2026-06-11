import { describe, it, expect } from 'bun:test';
import { loginBffSchema, loginAuthBffSchema, crearCursoBffSchema, crearAsignaturaBffSchema, asignarMateriaBffSchema } from '../dtos/BffDto.js';

describe('loginBffSchema', () => {
  it('should accept valid login', () => {
    const result = loginBffSchema.safeParse({ email: 'test@test.com', password: '123456' });
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const result = loginBffSchema.safeParse({ email: 'bademail', password: '123456' });
    expect(result.success).toBe(false);
  });

  it('should reject short password', () => {
    const result = loginBffSchema.safeParse({ email: 'test@test.com', password: '12345' });
    expect(result.success).toBe(false);
  });
});

describe('loginAuthBffSchema', () => {
  it('should accept valid login', () => {
    const result = loginAuthBffSchema.safeParse({ identifier: 'test@test.com', password: '123456' });
    expect(result.success).toBe(true);
  });
});

describe('crearCursoBffSchema', () => {
  it('should accept valid course', () => {
    const result = crearCursoBffSchema.safeParse({ nombre: '1A', nivel: 'Primero', letra: 'A' });
    expect(result.success).toBe(true);
  });

  it('should accept optional year', () => {
    const result = crearCursoBffSchema.safeParse({ nombre: '1A', nivel: 'Primero', letra: 'A', anio: '2026' });
    expect(result.success).toBe(true);
  });

  it('should reject long letra', () => {
    const result = crearCursoBffSchema.safeParse({ nombre: '1A', nivel: 'Primero', letra: 'AB' });
    expect(result.success).toBe(false);
  });
});

describe('crearAsignaturaBffSchema', () => {
  it('should accept valid subject', () => {
    const result = crearAsignaturaBffSchema.safeParse({ nombre: 'Matematicas', codigo: 'MAT101' });
    expect(result.success).toBe(true);
  });

  it('should accept optional description', () => {
    const result = crearAsignaturaBffSchema.safeParse({ nombre: 'Matematicas', codigo: 'MAT101', descripcion: 'Algebra' });
    expect(result.success).toBe(true);
  });
});

describe('asignarMateriaBffSchema', () => {
  it('should accept valid assignment', () => {
    const result = asignarMateriaBffSchema.safeParse({ cursoId: 1, asignaturaId: 1 });
    expect(result.success).toBe(true);
  });

  it('should accept optional profesorId', () => {
    const result = asignarMateriaBffSchema.safeParse({ cursoId: 1, asignaturaId: 1, profesorId: 5 });
    expect(result.success).toBe(true);
  });

  it('should reject negative cursoId', () => {
    const result = asignarMateriaBffSchema.safeParse({ cursoId: -1, asignaturaId: 1 });
    expect(result.success).toBe(false);
  });
});
