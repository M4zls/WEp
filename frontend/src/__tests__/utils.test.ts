import { formatHour, formatDateDDMMYYYY } from '../common/utils';

describe('formatHour', () => {
  it('should return input unchanged', () => {
    expect(formatHour('10:30')).toBe('10:30');
    expect(formatHour('')).toBe('');
  });
});

describe('formatDateDDMMYYYY', () => {
  it('should return input unchanged', () => {
    expect(formatDateDDMMYYYY('2024-01-01')).toBe('2024-01-01');
    expect(formatDateDDMMYYYY('')).toBe('');
  });
});
