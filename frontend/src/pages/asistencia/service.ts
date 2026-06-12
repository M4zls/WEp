import apiClient from '../../api/apiClient';
import type { Asistencia, MarcarAsistenciaDto } from './types';

class AsistenciaService {
  async listarPorClase(claseId: number): Promise<Asistencia[]> {
    return apiClient.get(`/asistencia/clase/${claseId}`);
  }

  async listarPorEstudiante(rut: string): Promise<Asistencia[]> {
    return apiClient.get(`/asistencia/estudiante/${rut}`);
  }

  async listarPorCursoAsignatura(cursoAsignaturaId: number): Promise<Asistencia[]> {
    return apiClient.get(`/asistencia/curso-asignatura/${cursoAsignaturaId}`);
  }

  async marcar(data: MarcarAsistenciaDto): Promise<Asistencia[]> {
    return apiClient.post('/asistencia/marcar', data);
  }

  async actualizar(id: number, data: { presente?: boolean; justificacion?: string }): Promise<void> {
    return apiClient.put(`/asistencia/${id}`, data);
  }
}

export default new AsistenciaService();
