import apiClient from '../api/apiClient';
import type { Horario, CreateHorarioDto, UpdateHorarioDto } from './horario.types';

class HorarioService {
  async listar(cursoAsignaturaId?: number): Promise<Horario[]> {
    let endpoint = '/horarios';
    if (cursoAsignaturaId) endpoint += `?curso_asignatura_id=${cursoAsignaturaId}`;
    return apiClient.get(endpoint);
  }

  async obtener(id: number): Promise<Horario> {
    return apiClient.get(`/horarios/${id}`);
  }

  async crear(data: CreateHorarioDto): Promise<Horario> {
    return apiClient.post('/horarios', data);
  }

  async actualizar(id: number, data: UpdateHorarioDto): Promise<void> {
    return apiClient.put(`/horarios/${id}`, data);
  }

  async eliminar(id: number): Promise<void> {
    return apiClient.delete(`/horarios/${id}`);
  }
}

export default new HorarioService();
