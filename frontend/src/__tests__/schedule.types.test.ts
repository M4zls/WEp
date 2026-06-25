import { WEEK_DAYS } from '../pages/schedule/schedule.types';

describe('WEEK_DAYS', () => {
  it('should have days 1-5', () => {
    expect(WEEK_DAYS[1]).toBe('Lunes');
    expect(WEEK_DAYS[2]).toBe('Martes');
    expect(WEEK_DAYS[3]).toBe('Miércoles');
    expect(WEEK_DAYS[4]).toBe('Jueves');
    expect(WEEK_DAYS[5]).toBe('Viernes');
  });

  it('should not have weekend days', () => {
    expect(WEEK_DAYS[6]).toBeUndefined();
    expect(WEEK_DAYS[0]).toBeUndefined();
  });
});
