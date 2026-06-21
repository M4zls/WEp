import apiClient from '../../api/apiClient';
import type { Clase, CreateClaseDto, UpdateClaseDto } from './types';

class ClaseService {
  async listar(cursoAsignaturaId?: number): Promise<Clase[]> {
    let endpoint = '/clases';
    if (cursoAsignaturaId) endpoint += `?curso_asignatura_id=${cursoAsignaturaId}`;
    return apiClient.get(endpoint);
  }

  async obtener(id: number): Promise<Clase> {
    return apiClient.get(`/clases/${id}`);
  }

  async crear(data: CreateClaseDto): Promise<Clase> {
    return apiClient.post('/clases', data);
  }

  async actualizar(id: number, data: UpdateClaseDto): Promise<void> {
    return apiClient.put(`/clases/${id}`, data);
  }

  async eliminar(id: number): Promise<void> {
    return apiClient.delete(`/clases/${id}`);
  }
}

export default new ClaseService();
