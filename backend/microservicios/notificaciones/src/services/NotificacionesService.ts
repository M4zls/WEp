import { novu } from '../common/novu.js';
import { NOTIFICATION_WORKFLOWS } from '../common/Consts.js';
import type { AvisoInasistenciaDto, AvisoNotaDto } from '../types/Notificacion.js';
import { getDatabaseInstance } from '../models/data.js';
import { notificaciones, estudiantes } from '../models/schema.js';
import { eq, and } from 'drizzle-orm';

/**
 * Servicio encargado de disparar notificaciones externas e internas.
 */
export class NotificacionesService {

  /**
   * Envía un aviso de inasistencia mediante Novu.
   */
  async sendAttendanceNotice(data: AvisoInasistenciaDto) {
    await novu.trigger({
      workflowId: NOTIFICATION_WORKFLOWS.ATTENDANCE_NOTICE,
      to: {
        subscriberId: data.subscriberId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      },
      payload: {
        nombreApoderado: data.nombreApoderado,
        nombreAlumno: data.nombreAlumno,
        curso: data.curso,
        fecha: data.fecha,
      },
    });
  }

  /**
   * Envía aviso de nueva calificación vía Novu y guarda notificación in-app.
   */
  async sendGradeNotice(data: AvisoNotaDto) {
    const to: any = {
      subscriberId: data.subscriberId,
      firstName: data.nombreAlumno,
      email: data.emailAlumno,
    };

    if (data.emailApoderado) {
      to.email = data.emailApoderado;
    }

    await novu.trigger({
      workflowId: NOTIFICATION_WORKFLOWS.GRADE_NOTICE,
      to,
      payload: {
        nombreAlumno: data.nombreAlumno,
        asignatura: data.asignatura,
        nota: data.nota,
        tipoEvaluacion: data.tipoEvaluacion,
        nombreProfesor: data.nombreProfesor,
        curso: data.curso,
        emailAlumno: data.emailAlumno,
        emailApoderado: data.emailApoderado ?? '',
        nombreApoderado: data.nombreApoderado ?? '',
      },
    });

    const db = getDatabaseInstance();
    let usuarioId = 0;

    try {
      const estudiante = await db
        .select({ id: estudiantes.id })
        .from(estudiantes)
        .where(eq(estudiantes.rut, data.estudianteRut))
        .limit(1);
      if (estudiante.length > 0) {
        usuarioId = estudiante[0].id;
      }
    } catch {
      // fallback a 0 si no se puede buscar
    }

    await db.insert(notificaciones).values({
      usuarioId,
      titulo: 'Nueva calificación',
      mensaje: `Has recibido una calificación de ${data.nota} en ${data.asignatura} (${data.tipoEvaluacion})`,
      tipo: 'nota',
      url: '/calificaciones',
    });
  }

  /**
   * Obtiene las notificaciones de un usuario.
   */
  async getUserNotifications(usuarioId: number) {
    const db = getDatabaseInstance();
    return await db
      .select()
      .from(notificaciones)
      .where(eq(notificaciones.usuarioId, usuarioId))
      .orderBy(notificaciones.id);
  }

  /**
   * Obtiene el conteo de notificaciones no leídas de un usuario.
   */
  async getUnreadCount(usuarioId: number) {
    const db = getDatabaseInstance();
    const result = await db
      .select()
      .from(notificaciones)
      .where(
        and(
          eq(notificaciones.usuarioId, usuarioId),
          eq(notificaciones.leida, false),
        ),
      );
    return { count: result.length };
  }

  /**
   * Marca una notificación como leída.
   */
  async markAsRead(id: number) {
    const db = getDatabaseInstance();
    await db
      .update(notificaciones)
      .set({ leida: true, fechaLectura: new Date().toISOString() })
      .where(eq(notificaciones.id, id));
  }

}