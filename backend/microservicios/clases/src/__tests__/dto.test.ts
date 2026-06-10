import { describe, it, expect } from 'vitest';
import { crearClaseSchema, actualizarClaseSchema } from '../dtos/ClaseDto.js';
import { crearHorarioSchema, actualizarHorarioSchema } from '../dtos/HorarioDto.js';

describe('crearClaseSchema', () => {
  const validData = {
    cursoAsignaturaId: 1, titulo: 'Clase 1', fecha: '2026-06-10',
    horaInicio: '10:00', horaTermino: '11:00',
  };

  it('should accept valid class data', () => {
    const result = crearClaseSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should accept optional fields', () => {
    const result = crearClaseSchema.safeParse({ ...validData, descripcion: 'Desc', estado: 'pendiente' });
    expect(result.success).toBe(true);
  });

  it('should default estado to pendiente', () => {
    const result = crearClaseSchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.estado).toBe('pendiente');
  });

  it('should reject invalid horaInicio format', () => {
    const result = crearClaseSchema.safeParse({ ...validData, horaInicio: '10:00:00' });
    expect(result.success).toBe(false);
  });

  it('should reject invalid estado', () => {
    const result = crearClaseSchema.safeParse({ ...validData, estado: 'invalido' });
    expect(result.success).toBe(false);
  });

  it('should accept realizado estado', () => {
    const result = crearClaseSchema.safeParse({ ...validData, estado: 'realizada' });
    expect(result.success).toBe(true);
  });

  it('should accept cancelado estado', () => {
    const result = crearClaseSchema.safeParse({ ...validData, estado: 'cancelada' });
    expect(result.success).toBe(true);
  });
});

describe('actualizarClaseSchema', () => {
  it('should accept partial update', () => {
    const result = actualizarClaseSchema.safeParse({ titulo: 'Nuevo titulo' });
    expect(result.success).toBe(true);
  });

  it('should accept empty object', () => {
    const result = actualizarClaseSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('should reject invalid horaInicio in partial', () => {
    const result = actualizarClaseSchema.safeParse({ horaInicio: '8:00' });
    expect(result.success).toBe(false);
  });
});

describe('crearHorarioSchema', () => {
  it('should accept valid schedule data', () => {
    const result = crearHorarioSchema.safeParse({
      cursoAsignaturaId: 1, diaSemana: 1, horaInicio: '08:00', horaTermino: '09:00',
    });
    expect(result.success).toBe(true);
  });

  it('should accept all valid days', () => {
    for (const day of [1, 2, 3, 4, 5]) {
      const result = crearHorarioSchema.safeParse({
        cursoAsignaturaId: 1, diaSemana: day, horaInicio: '08:00', horaTermino: '09:00',
      });
      expect(result.success).toBe(true);
    }
  });

  it('should reject invalid day', () => {
    const result = crearHorarioSchema.safeParse({
      cursoAsignaturaId: 1, diaSemana: 6, horaInicio: '08:00', horaTermino: '09:00',
    });
    expect(result.success).toBe(false);
  });

  it('should reject invalid hora format', () => {
    const result = crearHorarioSchema.safeParse({
      cursoAsignaturaId: 1, diaSemana: 1, horaInicio: '8:00', horaTermino: '09:00',
    });
    expect(result.success).toBe(false);
  });

  it('should reject invalid hora format with extra chars', () => {
    const result = crearHorarioSchema.safeParse({
      cursoAsignaturaId: 1, diaSemana: 1, horaInicio: '08:00:00', horaTermino: '09:00',
    });
    expect(result.success).toBe(false);
  });
});

describe('actualizarHorarioSchema', () => {
  it('should accept partial update', () => {
    const result = actualizarHorarioSchema.safeParse({ diaSemana: 3 });
    expect(result.success).toBe(true);
  });

  it('should accept empty object', () => {
    const result = actualizarHorarioSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('should reject invalid day', () => {
    const result = actualizarHorarioSchema.safeParse({ diaSemana: 7 });
    expect(result.success).toBe(false);
  });
});
