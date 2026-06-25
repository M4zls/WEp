import apiClient from '../../api/apiClient';
import type { Asistencia, MarcarAsistenciaDto } from './attendance.types';

class AttendanceService {
  async listByClass(claseId: number): Promise<Asistencia[]> {
    return apiClient.get(`/attendance/clase/${claseId}`);
  }

  async listByStudent(rut: string): Promise<Asistencia[]> {
    return apiClient.get(`/attendance/estudiante/${rut}`);
  }

  async listBySubject(cursoAsignaturaId: number): Promise<Asistencia[]> {
    return apiClient.get(`/attendance/curso-asignatura/${cursoAsignaturaId}`);
  }

  async mark(data: MarcarAsistenciaDto): Promise<Asistencia[]> {
    return apiClient.post('/attendance/marcar', data);
  }

  async update(id: number, data: { presente?: boolean; justificacion?: string }): Promise<void> {
    return apiClient.put(`/attendance/${id}`, data);
  }
}

export default new AttendanceService();
