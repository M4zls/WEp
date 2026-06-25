import { describe, it, expect } from 'bun:test';
import { crearClaseSchema, actualizarClaseSchema } from '../dtos/ClaseDto.js';
import { crearHorarioSchema, actualizarHorarioSchema } from '../dtos/HorarioDto.js';

describe('crearClaseSchema', () => {
  it('debe rechazar vacío', () => expect(crearClaseSchema.safeParse({}).success).toBe(false));
  it('debe aceptar válido', () => {
    const r = crearClaseSchema.safeParse({ cursoAsignaturaId: 1, titulo: 'Clase 1', fecha: '2026-06-10', horaInicio: '10:00', horaTermino: '11:00' });
    expect(r.success).toBe(true);
  });
});

describe('actualizarClaseSchema', () => {
  it('debe aceptar parcial', () => expect(actualizarClaseSchema.safeParse({ titulo: 'Nuevo' }).success).toBe(true));
});

describe('crearHorarioSchema', () => {
  it('debe rechazar vacío', () => expect(crearHorarioSchema.safeParse({}).success).toBe(false));
  it('debe aceptar válido', () => {
    const r = crearHorarioSchema.safeParse({ cursoAsignaturaId: 1, diaSemana: 1, horaInicio: '08:00', horaTermino: '09:00' });
    expect(r.success).toBe(true);
  });
});

describe('actualizarHorarioSchema', () => {
  it('debe aceptar parcial', () => expect(actualizarHorarioSchema.safeParse({ diaSemana: 3 }).success).toBe(true));
});
