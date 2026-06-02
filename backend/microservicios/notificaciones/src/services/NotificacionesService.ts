import { novu } from '../common/novu.js';
import type { AvisoInasistenciaDto } from '../dtos/NotificacionDto.js';

export class NotificacionesService {

  async triggerAvisoInasistencia(data: AvisoInasistenciaDto) {
  await novu.trigger({
    workflowId: 'aviso-inasistencia',
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