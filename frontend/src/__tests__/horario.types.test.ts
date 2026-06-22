import { DIAS_SEMANA } from '../pages/horario/types';

describe('DIAS_SEMANA', () => {
  it('should have days 1-5', () => {
    expect(DIAS_SEMANA[1]).toBe('Lunes');
    expect(DIAS_SEMANA[2]).toBe('Martes');
    expect(DIAS_SEMANA[3]).toBe('Miércoles');
    expect(DIAS_SEMANA[4]).toBe('Jueves');
    expect(DIAS_SEMANA[5]).toBe('Viernes');
  });

  it('should not have weekend days', () => {
    expect(DIAS_SEMANA[6]).toBeUndefined();
    expect(DIAS_SEMANA[0]).toBeUndefined();
  });
});
