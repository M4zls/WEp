import { novu } from '../common/novu.js';
import { NOTIFICATION_WORKFLOWS } from '../common/Consts.js';
import type { AvisoInasistenciaDto } from '../types/Notificacion.js';

/**
 * Servicio encargado de disparar notificaciones externas.
 */
export class NotificacionesService {

  /**
   * Envía un aviso de inasistencia mediante Novu.
   * @param {AvisoInasistenciaDto} data - Datos del aviso de inasistencia.
   * @returns {Promise<void>} Resuelve cuando la notificación es enviada.
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


}