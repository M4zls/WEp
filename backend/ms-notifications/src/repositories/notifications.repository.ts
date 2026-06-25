import { eq, and } from 'drizzle-orm';
import { getDatabaseInstance } from '../models/data.js';
import { notifications, estudiantes, usuarios } from '../models/schema.js';
import type { INotificationsRepository } from './notifications.repository.interface.js';

export class NotificationsRepository implements INotificationsRepository {
  private get db() { return getDatabaseInstance(); }

  async findStudentByRut(rut: string) {
    const result = await this.db
      .select({ id: estudiantes.id })
      .from(estudiantes)
      .where(eq(estudiantes.rut, rut))
      .limit(1);
    return result[0] ?? null;
  }

  async findUserByRut(rut: string) {
    const result = await this.db
      .select({ id: usuarios.id })
      .from(usuarios)
      .where(eq(usuarios.rut, rut))
      .limit(1);
    return result[0] ?? null;
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
