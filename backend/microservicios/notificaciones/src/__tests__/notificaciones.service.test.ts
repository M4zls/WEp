import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockTrigger = vi.hoisted(() => vi.fn());

vi.mock('../common/novu.js', () => ({
  novu: { trigger: mockTrigger },
}));

import { NotificacionesService } from '../services/NotificacionesService.js';

describe('NotificacionesService', () => {
  let service: NotificacionesService;

  beforeEach(() => {
    service = new NotificacionesService();
    vi.clearAllMocks();
  });

  describe('sendAttendanceNotice', () => {
    it('should send attendance notice via novu', async () => {
      const data = {
        subscriberId: 'sub-123',
        nombreApoderado: 'Maria',
        nombreAlumno: 'Pedro',
        curso: '1A',
        fecha: '2026-06-10',
        firstName: 'Maria',
        lastName: 'Gonzalez',
        email: 'maria@test.com',
      };

      await service.sendAttendanceNotice(data);

      expect(mockTrigger).toHaveBeenCalledTimes(1);
      expect(mockTrigger).toHaveBeenCalledWith({
        workflowId: 'aviso-inasistencia',
        to: {
          subscriberId: 'sub-123',
          firstName: 'Maria',
          lastName: 'Gonzalez',
          email: 'maria@test.com',
        },
        payload: {
          nombreApoderado: 'Maria',
          nombreAlumno: 'Pedro',
          curso: '1A',
          fecha: '2026-06-10',
        },
      });
    });
  });
});
