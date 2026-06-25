import type { AbsenceAlertDto, GradeAlertDto, MessageAlertDto } from '../types/notification.js';
import { notifications } from '../models/schema.js';

type Notification = typeof notifications.$inferSelect;

export interface INotificationsService {
  sendAttendanceNotice(data: AbsenceAlertDto): Promise<void>;
  sendGradeNotice(data: GradeAlertDto): Promise<void>;
  getUserNotifications(usuarioId: number): Promise<Notification[]>;
  getUnreadCount(usuarioId: number): Promise<{ count: number }>;
  markAsRead(id: number): Promise<void>;
  sendMessageNotice(data: MessageAlertDto): Promise<void>;
}
