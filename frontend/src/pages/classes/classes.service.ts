import apiClient from '../../api/apiClient';
import type { Clase, CreateClaseDto, UpdateClaseDto } from './class.types';

class ClassesService {
  async list(cursoAsignaturaId?: number): Promise<Clase[]> {
    let endpoint = '/classes';
    if (cursoAsignaturaId) endpoint += `?curso_asignatura_id=${cursoAsignaturaId}`;
    return apiClient.get(endpoint);
  }

  async get(id: number): Promise<Clase> {
    return apiClient.get(`/classes/${id}`);
  }

  async create(data: CreateClaseDto): Promise<Clase> {
    return apiClient.post('/classes', data);
  }

  async update(id: number, data: UpdateClaseDto): Promise<void> {
    return apiClient.put(`/classes/${id}`, data);
  }

  async remove(id: number): Promise<void> {
    return apiClient.delete(`/classes/${id}`);
  }
}

export default new ClassesService();
