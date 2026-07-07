import { eq, and } from 'drizzle-orm';
import { getDatabaseInstance } from '../models/data.js';
import { notifications } from '../models/schema.js';
import type { INotificationsRepository } from './notifications.repository.interface.js';

const MS_STUDENTS_SERVICE = process.env.MS_STUDENTS_SERVICE ?? 'http://ms-students-service:3001';
const MS_AUTH_SERVICE = process.env.MS_AUTH_SERVICE ?? 'http://ms-auth-service:3002';

export class NotificationsRepository implements INotificationsRepository {
  private get db() { return getDatabaseInstance(); }

  async findStudentByRut(rut: string) {
    try {
      const res = await fetch(`${MS_STUDENTS_SERVICE}/students/${rut}`);
      if (!res.ok) return null;
      const data = await res.json() as any;
      return { id: data.id };
    } catch {
      return null;
    }
  }

  async findUserByRut(rut: string) {
    try {
      const res = await fetch(`${MS_AUTH_SERVICE}/auth/users/${rut}`);
      if (!res.ok) return null;
      const data = await res.json() as any;
      return { id: data.id };
    } catch {
      return null;
    }
  }

  async insertNotification(values: { userId: number; title: string; message: string; type: string; url: string }) {
    await this.db.insert(notifications).values(values);
  }

  async findAllByUser(userId: number) {
    return this.db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(notifications.id);
  }

  async countUnreadByUser(userId: number) {
    const result = await this.db
      .select()
      .from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.read, false)));
    return result.length;
  }

  async markAsRead(id: number) {
    await this.db
      .update(notifications)
      .set({ read: true, readAt: new Date().toISOString() })
      .where(eq(notifications.id, id));
  }
}
