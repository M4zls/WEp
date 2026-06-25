import { novu } from '../common/novu.js';
import { NOTIFICATION_WORKFLOWS } from '../common/consts.js';
import type { AbsenceAlertDto, GradeAlertDto, MessageAlertDto } from '../types/notification.js';
import { NotificationsRepository } from '../repositories/notifications.repository.js';
import type { INotificationsRepository } from '../repositories/notifications.repository.interface.js';
import type { INotificationsService } from './notifications.service.interface.js';

export class NotificationsService implements INotificationsService {
  private repo: INotificationsRepository;
  constructor(repo?: INotificationsRepository) { this.repo = repo ?? new NotificationsRepository(); }

  async sendAttendanceNotice(data: AbsenceAlertDto) {
    await novu.trigger({
      workflowId: NOTIFICATION_WORKFLOWS.ATTENDANCE_NOTICE,
      to: {
        subscriberId: data.subscriberId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      },
      payload: {
        guardianName: data.guardianName,
        studentName: data.studentName,
        course: data.course,
        date: data.date,
      },
    });

    const estudiante = await this.repo.findStudentByRut(data.studentRut || '');
    if (estudiante) {
      await this.repo.insertNotification({
        userId: estudiante.id,
        title: `Inasistencia - ${data.course}`,
        message: `Se registró tu inasistencia a ${data.course} el ${data.date}`,
        type: 'asistencia',
        url: '/asistencia',
      });
    }
  }

  async sendGradeNotice(data: GradeAlertDto) {
    const to: any = {
      subscriberId: data.subscriberId,
      firstName: data.studentName,
      email: data.studentEmail,
    };

    if (data.guardianEmail) {
      to.email = data.guardianEmail;
    }

    try {
      await novu.trigger({
        workflowId: NOTIFICATION_WORKFLOWS.GRADE_NOTICE,
        to,
        payload: {
          studentName: data.studentName,
          subject: data.subject,
          grade: data.grade,
          evaluationType: data.evaluationType,
          professorName: data.professorName,
          course: data.course,
          studentEmail: data.studentEmail,
          guardianEmail: data.guardianEmail ?? '',
          guardianName: data.guardianName ?? '',
        },
      });
    } catch (err: any) {
      console.error('[sendGradeNotice] Novu trigger failed:', err.message);
    }

    const estudiante = await this.repo.findStudentByRut(data.studentRut);
    await this.repo.insertNotification({
      userId: estudiante?.id ?? 0,
      title: 'Nueva calificación',
      message: `Tienes una nueva calificación registrada en ${data.subject}`,
      type: 'nota',
      url: '/calificaciones',
    });
  }

  async getUserNotifications(usuarioId: number) {
    return this.repo.findAllByUser(usuarioId);
  }

  async getUnreadCount(usuarioId: number) {
    const count = await this.repo.countUnreadByUser(usuarioId);
    return { count };
  }

  async markAsRead(id: number) {
    await this.repo.markAsRead(id);
  }

  async sendMessageNotice(data: MessageAlertDto) {
    let userId = 0;

    if (data.recipientRole === 'estudiante') {
      const estudiante = await this.repo.findStudentByRut(data.recipientRut);
      if (estudiante) userId = estudiante.id;
    } else {
      const usuario = await this.repo.findUserByRut(data.recipientRut);
      if (usuario) userId = usuario.id;
    }

    if (userId === 0) return;

    await this.repo.insertNotification({
      userId,
      title: `Nuevo mensaje de ${data.senderName} ${data.senderLastName}`,
      message: 'Tienes un nuevo mensaje sin leer',
      type: 'mensaje',
      url: '/mensajeria',
    });
  }

}
