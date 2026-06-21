import { describe, it, expect } from 'bun:test';
import { crearProfesorSchema } from '../dtos/ProfesorDto.js';

describe('crearProfesorSchema', () => {
  it('debe rechazar datos vacíos', () => {
    const result = crearProfesorSchema.safeParse({});
    expect(result.success).toBe(false);
  });
  it('debe rechazar RUT inválido', () => {
    const result = crearProfesorSchema.safeParse({ rut: '12', dv: '5', nombre: 'Pedro', apellido: 'Gomez', email: 'pedro@test.com', password: '123456', materia: 'Mat' });
    expect(result.success).toBe(false);
  });
  it('debe aceptar datos válidos', () => {
    const result = crearProfesorSchema.safeParse({ rut: '12345678', dv: '5', nombre: 'Pedro', apellido: 'Gomez', email: 'pedro@test.com', password: '123456', materia: 'Matematicas' });
    expect(result.success).toBe(true);
  });
});
