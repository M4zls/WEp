import apiClient from '../../api/apiClient';
import type { Schedule, CreateScheduleDto, UpdateScheduleDto } from './schedule.types';

class ScheduleService {
  async list(courseSubjectId?: number): Promise<Schedule[]> {
    let endpoint = '/schedule';
    if (courseSubjectId) endpoint += `?course_subject_id=${courseSubjectId}`;
    return apiClient.get(endpoint);
  }

  async get(id: number): Promise<Schedule> {
    return apiClient.get(`/schedule/${id}`);
  }

  async create(data: CreateScheduleDto): Promise<Schedule> {
    return apiClient.post('/schedule', data);
  }

  async update(id: number, data: UpdateScheduleDto): Promise<void> {
    return apiClient.put(`/schedule/${id}`, data);
  }

  async remove(id: number): Promise<void> {
    return apiClient.delete(`/schedule/${id}`);
  }
}

export default new ScheduleService();
