import { CLASS_STATUSES } from '../pages/classes/class.types';

describe('CLASS_STATUSES', () => {
  it('should have PENDING', () => {
    expect(CLASS_STATUSES.PENDING).toBe('pendiente');
  });

  it('should have COMPLETED', () => {
    expect(CLASS_STATUSES.COMPLETED).toBe('realizada');
  });

  it('should have CANCELLED', () => {
    expect(CLASS_STATUSES.CANCELLED).toBe('cancelada');
  });
});
