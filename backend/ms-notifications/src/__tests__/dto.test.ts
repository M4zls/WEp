import { describe, it, expect } from 'bun:test';
import { absenceAlertSchema } from '../dtos/notification.dto.js';

describe('absenceAlertSchema', () => {
  it('should reject empty', () => expect(absenceAlertSchema.safeParse({}).success).toBe(false));
  it('should accept valid data', () => {
    const r = absenceAlertSchema.safeParse({ subscriberId: 's1', guardianName: 'Maria', studentName: 'Pedro', course: '1A', date: '2026-06-10' });
    expect(r.success).toBe(true);
  });
});
