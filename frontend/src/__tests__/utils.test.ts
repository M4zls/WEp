import { formatHour, formatDateDDMMYYYY } from '../common/utils';

describe('formatHour', () => {
  it('should return empty string', () => {
    expect(formatHour('10:30')).toBe('');
    expect(formatHour('')).toBe('');
  });
});

describe('formatDateDDMMYYYY', () => {
  it('should return empty string', () => {
    expect(formatDateDDMMYYYY('2024-01-01')).toBe('');
    expect(formatDateDDMMYYYY('')).toBe('');
  });
});
