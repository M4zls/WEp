import { describe, it, expect, mock, beforeEach } from 'bun:test';

const mockFetch = mock((url: string) => {
  if (url.includes('/students/12345678')) return Promise.resolve({ ok: true, json: () => Promise.resolve({ id: 5 }) });
  if (url.includes('/auth/users/87654321')) return Promise.resolve({ ok: true, json: () => Promise.resolve({ id: 3 }) });
  return Promise.resolve({ ok: false });
});
globalThis.fetch = mockFetch;

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
  notifications: {},
  estudiantes: {},
  usuarios: {},
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

const { NotificationsService } = await import('../services/notifications.service.js');

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(() => {
    service = new NotificationsService();
    mockTrigger.mockClear();
    mockDb.select = mock(() => ({
      from: mock(() => ({
        where: mock(() => ({
          limit: mock(() => Promise.resolve([])),
          orderBy: mock(() => Promise.resolve([])),
        })),
      })),
    }));
    mockDb.insert = mock(() => ({
      values: mock(() => Promise.resolve([])),
    }));
    mockDb.update = mock(() => ({
      set: mock(() => ({
        where: mock(() => Promise.resolve([])),
      })),
    }));
  });

  it('sendAttendanceNotice', async () => {
    const data = { subscriberId: 'sub-123', guardianName: 'Maria', studentName: 'Pedro', course: '1A', date: '2026-06-10', firstName: 'Maria', lastName: 'Gonzalez', email: 'maria@test.com' };
    await service.sendAttendanceNotice(data);
    expect(mockTrigger).toHaveBeenCalledTimes(1);
    expect(mockTrigger).toHaveBeenCalledWith({
      workflowId: 'aviso-inasistencia',
      to: { subscriberId: 'sub-123', firstName: 'Maria', lastName: 'Gonzalez', email: 'maria@test.com' },
      payload: { guardianName: 'Maria', studentName: 'Pedro', course: '1A', date: '2026-06-10' },
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
    const data = { subscriberId: 'sub-123', studentRut: '12345678', studentName: 'Pedro', studentEmail: 'pedro@test.com', subject: 'Matematicas', grade: '6.5', evaluationType: 'prueba', professorName: 'Profe', course: '1A' };
    await service.sendGradeNotice(data);
    expect(mockTrigger).toHaveBeenCalledTimes(1);
    expect(mockTrigger).toHaveBeenCalledWith(expect.objectContaining({ workflowId: 'aviso-nota' }));
  });

  it('getUserNotifications', async () => {
    mockDb.select.mockReturnValue({
      from: mock(() => ({
        where: mock(() => ({
          orderBy: mock(() => Promise.resolve([{ id: 1, message: 'test' }])),
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

  describe('sendMessageNotice', () => {
    it('should notify student recipient', async () => {
      mockDb.select.mockReturnValue({
        from: mock(() => ({
          where: mock(() => ({
            limit: mock(() => Promise.resolve([{ id: 5 }])),
          })),
        })),
      });
      const data = { recipientRut: '12345678', recipientRole: 'student', senderFirstName: 'Profe', senderLastName: 'Uno', contentPreview: 'Hola', conversationId: 1 };
      await service.sendMessageNotice(data);
      expect(mockDb.insert).toHaveBeenCalled();
    });

    it('should notify professor recipient', async () => {
      mockDb.select.mockReturnValue({
        from: mock(() => ({
          where: mock(() => ({
            limit: mock(() => Promise.resolve([{ id: 3 }])),
          })),
        })),
      });
      const data = { recipientRut: '87654321', recipientRole: 'teacher', senderFirstName: 'Alumno', senderLastName: 'Dos', contentPreview: 'Gracias', conversationId: 1 };
      await service.sendMessageNotice(data);
      expect(mockDb.insert).toHaveBeenCalled();
    });

    it('should skip notification when recipient not found', async () => {
      const data = { recipientRut: '00000000', recipientRole: 'student', senderFirstName: 'Profe', senderLastName: 'Uno', contentPreview: 'Hola', conversationId: 1 };
      await service.sendMessageNotice(data);
      expect(mockDb.insert).not.toHaveBeenCalled();
    });
  });
});
