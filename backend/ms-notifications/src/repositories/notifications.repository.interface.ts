import { notifications } from '../models/schema.js';

type Notification = typeof notifications.$inferSelect;

export interface INotificationsRepository {
  findStudentByRut(rut: string): Promise<{ id: number } | null>;
  findUserByRut(rut: string): Promise<{ id: number } | null>;
  insertNotification(values: { userId: number; title: string; message: string; type: string; url: string }): Promise<void>;
  findAllByUser(userId: number): Promise<Notification[]>;
  countUnreadByUser(userId: number): Promise<number>;
  markAsRead(id: number): Promise<void>;
}
