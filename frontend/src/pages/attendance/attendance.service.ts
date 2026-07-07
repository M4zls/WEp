import apiClient from '../../api/apiClient';
import type { Attendance, MarkAttendanceDto } from './attendance.types';

class AttendanceService {
  async listByClass(classId: number): Promise<Attendance[]> {
    return apiClient.get(`/attendance/class/${classId}`);
  }

  async listByStudent(rut: string): Promise<Attendance[]> {
    return apiClient.get(`/attendance/student/${rut}`);
  }

  async listBySubject(courseSubjectId: number): Promise<Attendance[]> {
    return apiClient.get(`/attendance/course-subject/${courseSubjectId}`);
  }

  async mark(data: MarkAttendanceDto): Promise<Attendance[]> {
    return apiClient.post('/attendance/mark', data);
  }

  async update(id: number, data: { present?: boolean; justification?: string }): Promise<void> {
    return apiClient.put(`/attendance/${id}`, data);
  }
}

export default new AttendanceService();
