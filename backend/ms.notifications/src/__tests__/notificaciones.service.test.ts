import { describe, it, expect, mock, beforeEach } from 'bun:test';

const mockTrigger = mock(() => undefined);
const mockDb = {
  select: mock(() => ({
    from: mock(() => ({
      where: mock(() => ({
        limit: mock(() => Promise.resolve([])),
        orderBy: mock(() => Promise.resolve([])),
      })),
    })),
  })),
  insert: mock(() => ({
    values: mock(() => Promise.resolve([])),
  })),
  update: mock(() => ({
    set: mock(() => ({
      where: mock(() => Promise.resolve([])),
    })),
  })),
};

mock.module('../common/novu.js', () => ({
  novu: { trigger: mockTrigger },
}));
mock.module('../models/data.js', () => ({
  getDatabaseInstance: () => mockDb,
}));
mock.module('../models/schema.js', () => ({
  notificaciones: {},
  estudiantes: {},
}));
mock.module('drizzle-orm', () => ({
  eq: () => undefined,
  and: (...args: any[]) => args,
  sql: () => undefined,
}));
mock.module('drizzle-orm/pg-core', () => ({
  pgSchema: () => ({
    table: () => ({}),
  }),
  serial: () => undefined,
  integer: () => undefined,
  text: () => undefined,
  boolean: () => undefined,
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

  it('sendGradeNotice', async () => {
    mockDb.select.mockReturnValue({
      from: mock(() => ({
        where: mock(() => ({
          limit: mock(() => Promise.resolve([{ id: 1 }])),
        })),
      })),
    });
    const data = { subscriberId: 'sub-123', estudianteRut: '12345678', nombreAlumno: 'Pedro', emailAlumno: 'pedro@test.com', asignatura: 'Matematicas', nota: '6.5', tipoEvaluacion: 'prueba', nombreProfesor: 'Profe', curso: '1A' };
    await service.sendGradeNotice(data);
    expect(mockTrigger).toHaveBeenCalledTimes(1);
    expect(mockTrigger).toHaveBeenCalledWith(expect.objectContaining({ workflowId: 'aviso-nota' }));
  });

  it('getUserNotifications', async () => {
    mockDb.select.mockReturnValue({
      from: mock(() => ({
        where: mock(() => ({
          orderBy: mock(() => Promise.resolve([{ id: 1, mensaje: 'test' }])),
        })),
      })),
    });
    const result = await service.getUserNotifications(1);
    expect(result).toHaveLength(1);
  });

  it('getUnreadCount', async () => {
    mockDb.select.mockReturnValue({
      from: mock(() => ({
        where: mock(() => Promise.resolve([{ id: 1 }, { id: 2 }])),
      })),
    });
    const result = await service.getUnreadCount(1);
    expect(result.count).toBe(2);
  });

  it('markAsRead', async () => {
    await service.markAsRead(1);
    expect(mockDb.update).toHaveBeenCalled();
  });
});
