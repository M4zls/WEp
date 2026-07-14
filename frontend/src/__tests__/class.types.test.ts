import { CLASS_STATUSES } from '../pages/classes/class.types';

describe('CLASS_STATUSES', () => {
  it('should have PENDING', () => {
    expect(CLASS_STATUSES.PENDING).toBe('pending');
  });

  it('should have COMPLETED', () => {
    expect(CLASS_STATUSES.COMPLETED).toBe('completed');
  });

  it('should have CANCELLED', () => {
    expect(CLASS_STATUSES.CANCELLED).toBe('cancelled');
  });
});
