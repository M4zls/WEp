import { describe, it, expect, mock, beforeEach } from 'bun:test';

const mockTrigger = mock(() => undefined);

mock.module('../common/novu.js', () => ({
  novu: { trigger: mockTrigger },
}));

const { NotificacionesService } = await import('../services/NotificacionesService.js');

describe('NotificacionesService', () => {
  let service: NotificacionesService;

  beforeEach(() => {
    service = new NotificacionesService();
    mockTrigger.mockClear();
  });

  it('sendAttendanceNotice', async () => {
    const data = { subscriberId: 'sub-123', nombreApoderado: 'Maria', nombreAlumno: 'Pedro', curso: '1A', fecha: '2026-06-10', firstName: 'Maria', lastName: 'Gonzalez', email: 'maria@test.com' };
    await service.sendAttendanceNotice(data);
    expect(mockTrigger).toHaveBeenCalledTimes(1);
    expect(mockTrigger).toHaveBeenCalledWith({
      workflowId: 'aviso-inasistencia',
      to: { subscriberId: 'sub-123', firstName: 'Maria', lastName: 'Gonzalez', email: 'maria@test.com' },
      payload: { nombreApoderado: 'Maria', nombreAlumno: 'Pedro', curso: '1A', fecha: '2026-06-10' },
    });
  });
});
