import { ESTADOS_CLASE } from '../shared/clases/clase.types';

describe('ESTADOS_CLASE', () => {
  it('should have PENDIENTE', () => {
    expect(ESTADOS_CLASE.PENDIENTE).toBe('pendiente');
  });

  it('should have REALIZADA', () => {
    expect(ESTADOS_CLASE.REALIZADA).toBe('realizada');
  });

  it('should have CANCELADA', () => {
    expect(ESTADOS_CLASE.CANCELADA).toBe('cancelada');
  });

  it('should have all values as strings', () => {
    expect(typeof ESTADOS_CLASE.PENDIENTE).toBe('string');
    expect(typeof ESTADOS_CLASE.REALIZADA).toBe('string');
    expect(typeof ESTADOS_CLASE.CANCELADA).toBe('string');
  });
});
