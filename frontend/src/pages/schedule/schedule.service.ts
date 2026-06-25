import apiClient from '../../api/apiClient';
import type { Horario, CreateHorarioDto, UpdateHorarioDto } from './schedule.types';

class ScheduleService {
  async list(cursoAsignaturaId?: number): Promise<Horario[]> {
    let endpoint = '/schedule';
    if (cursoAsignaturaId) endpoint += `?curso_asignatura_id=${cursoAsignaturaId}`;
    return apiClient.get(endpoint);
  }

  async get(id: number): Promise<Horario> {
    return apiClient.get(`/schedule/${id}`);
  }

  async create(data: CreateHorarioDto): Promise<Horario> {
    return apiClient.post('/schedule', data);
  }

  async update(id: number, data: UpdateHorarioDto): Promise<void> {
    return apiClient.put(`/schedule/${id}`, data);
  }

  async remove(id: number): Promise<void> {
    return apiClient.delete(`/schedule/${id}`);
  }
}

export default new ScheduleService();
