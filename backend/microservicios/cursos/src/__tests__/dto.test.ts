import { describe, it, expect } from 'vitest';
import { crearCursoSchema, crearAsignaturaSchema, asignarMateriaSchema } from '../dtos/CursoDto.js';

describe('crearCursoSchema', () => {
  it('should accept valid course data', () => {
    const result = crearCursoSchema.safeParse({ nombre: '1A', nivel: 'Primero', letra: 'A' });
    expect(result.success).toBe(true);
  });

  it('should accept optional year', () => {
    const result = crearCursoSchema.safeParse({ nombre: '1A', nivel: 'Primero', letra: 'A', anio: '2026' });
    expect(result.success).toBe(true);
  });

  it('should reject empty name', () => {
    const result = crearCursoSchema.safeParse({ nombre: '', nivel: 'Primero', letra: 'A' });
    expect(result.success).toBe(false);
  });

  it('should reject long letra', () => {
    const result = crearCursoSchema.safeParse({ nombre: '1A', nivel: 'Primero', letra: 'AB' });
    expect(result.success).toBe(false);
  });
});

describe('crearAsignaturaSchema', () => {
  it('should accept valid subject data', () => {
    const result = crearAsignaturaSchema.safeParse({ nombre: 'Matematicas', codigo: 'MAT101' });
    expect(result.success).toBe(true);
  });

  it('should accept optional description', () => {
    const result = crearAsignaturaSchema.safeParse({ nombre: 'Matematicas', codigo: 'MAT101', descripcion: 'Algebra' });
    expect(result.success).toBe(true);
  });

  it('should reject empty name', () => {
    const result = crearAsignaturaSchema.safeParse({ nombre: '', codigo: 'MAT101' });
    expect(result.success).toBe(false);
  });

  it('should reject empty code', () => {
    const result = crearAsignaturaSchema.safeParse({ nombre: 'Matematicas', codigo: '' });
    expect(result.success).toBe(false);
  });
});

describe('asignarMateriaSchema', () => {
  it('should accept valid assignment', () => {
    const result = asignarMateriaSchema.safeParse({ cursoId: 1, asignaturaId: 1 });
    expect(result.success).toBe(true);
  });

  it('should accept optional profesorId', () => {
    const result = asignarMateriaSchema.safeParse({ cursoId: 1, asignaturaId: 1, profesorId: 5 });
    expect(result.success).toBe(true);
  });

  it('should accept null profesorId', () => {
    const result = asignarMateriaSchema.safeParse({ cursoId: 1, asignaturaId: 1, profesorId: null });
    expect(result.success).toBe(true);
  });

  it('should reject negative cursoId', () => {
    const result = asignarMateriaSchema.safeParse({ cursoId: -1, asignaturaId: 1 });
    expect(result.success).toBe(false);
  });

  it('should reject non-integer IDs', () => {
    const result = asignarMateriaSchema.safeParse({ cursoId: 1.5, asignaturaId: 1 });
    expect(result.success).toBe(false);
  });
});
