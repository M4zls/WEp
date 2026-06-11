import { describe, it, expect } from 'bun:test';
import { avisoInasistenciaSchema } from '../dtos/NotificacionDto.js';

describe('avisoInasistenciaSchema', () => {
  it('debe rechazar vacío', () => expect(avisoInasistenciaSchema.safeParse({}).success).toBe(false));
  it('debe aceptar datos válidos', () => {
    const r = avisoInasistenciaSchema.safeParse({ subscriberId: 's1', nombreApoderado: 'Maria', nombreAlumno: 'Pedro', curso: '1A', fecha: '2026-06-10' });
    expect(r.success).toBe(true);
  });
});
