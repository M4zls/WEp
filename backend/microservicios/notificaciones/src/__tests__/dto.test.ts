import { describe, it, expect } from 'vitest';
import { avisoInasistenciaSchema } from '../dtos/NotificacionDto.js';

describe('avisoInasistenciaSchema', () => {
  it('should accept valid data', () => {
    const result = avisoInasistenciaSchema.safeParse({
      subscriberId: 'sub_123', nombreApoderado: 'Carlos', nombreAlumno: 'Juan', curso: '1A', fecha: '2026-06-10',
    });
    expect(result.success).toBe(true);
  });

  it('should accept optional fields', () => {
    const result = avisoInasistenciaSchema.safeParse({
      subscriberId: 'sub_123', nombreApoderado: 'Carlos', nombreAlumno: 'Juan', curso: '1A', fecha: '2026-06-10',
      firstName: 'Carlos', lastName: 'Perez', email: 'carlos@test.com',
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const result = avisoInasistenciaSchema.safeParse({
      subscriberId: 'sub_123', nombreApoderado: 'Carlos', nombreAlumno: 'Juan', curso: '1A', fecha: '2026-06-10',
      email: 'notanemail',
    });
    expect(result.success).toBe(false);
  });

  it('should reject empty subscriberId', () => {
    const result = avisoInasistenciaSchema.safeParse({
      subscriberId: '', nombreApoderado: 'Carlos', nombreAlumno: 'Juan', curso: '1A', fecha: '2026-06-10',
    });
    expect(result.success).toBe(false);
  });

  it('should reject empty nombreApoderado', () => {
    const result = avisoInasistenciaSchema.safeParse({
      subscriberId: 'sub_123', nombreApoderado: '', nombreAlumno: 'Juan', curso: '1A', fecha: '2026-06-10',
    });
    expect(result.success).toBe(false);
  });

  it('should reject empty nombreAlumno', () => {
    const result = avisoInasistenciaSchema.safeParse({
      subscriberId: 'sub_123', nombreApoderado: 'Carlos', nombreAlumno: '', curso: '1A', fecha: '2026-06-10',
    });
    expect(result.success).toBe(false);
  });
});
