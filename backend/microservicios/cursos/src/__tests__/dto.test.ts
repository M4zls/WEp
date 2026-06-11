import { describe, it, expect } from 'bun:test';
import { crearCursoSchema, crearAsignaturaSchema, asignarMateriaSchema } from '../dtos/CursoDto.js';

describe('crearCursoSchema', () => {
  it('debe rechazar datos vacíos', () => {
    expect(crearCursoSchema.safeParse({}).success).toBe(false);
  });
  it('debe aceptar datos válidos', () => {
    expect(crearCursoSchema.safeParse({ nombre: '1A', nivel: 'Primero', letra: 'A' }).success).toBe(true);
  });
});

describe('crearAsignaturaSchema', () => {
  it('debe rechazar datos vacíos', () => {
    expect(crearAsignaturaSchema.safeParse({}).success).toBe(false);
  });
  it('debe aceptar datos válidos', () => {
    expect(crearAsignaturaSchema.safeParse({ nombre: 'Matematicas', codigo: 'MAT101' }).success).toBe(true);
  });
});

describe('asignarMateriaSchema', () => {
  it('debe rechazar datos vacíos', () => {
    expect(asignarMateriaSchema.safeParse({}).success).toBe(false);
  });
  it('debe aceptar datos válidos', () => {
    expect(asignarMateriaSchema.safeParse({ cursoId: 1, asignaturaId: 1 }).success).toBe(true);
  });
});
