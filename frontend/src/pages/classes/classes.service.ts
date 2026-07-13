import apiClient from '../../api/apiClient';
import type { SchoolClass, CreateClassDto, UpdateClassDto } from './class.types';

class ClassesService {
  async list(courseSubjectId?: number): Promise<SchoolClass[]> {
    let endpoint = '/classes';
    if (courseSubjectId) endpoint += `?course_subject_id=${courseSubjectId}`;
    return apiClient.get(endpoint);
  }

  async get(id: number): Promise<SchoolClass> {
    return apiClient.get(`/classes/${id}`);
  }

  async create(data: CreateClassDto): Promise<SchoolClass> {
    return apiClient.post('/classes', data);
  }

  async update(id: number, data: UpdateClassDto): Promise<void> {
    return apiClient.put(`/classes/${id}`, data);
  }

  async remove(id: number): Promise<void> {
    return apiClient.delete(`/classes/${id}`);
  }
}

export default new ClassesService();
