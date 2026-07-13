import apiClient from '../../../api/apiClient';

export interface Grade {
  id: number;
  studentRut: string;
  subject: string;
  course: string;
  grade: string;
  evaluationType: string;
  date: string;
  professorRut: string;
  coefficient?: number;
}

export interface SubjectGrades {
  subject: string;
  grades: Grade[];
  average: string;
}

export interface StudentGrades {
  rut: string;
  firstName: string;
  lastName: string;
  course: string;
  subjects: SubjectGrades[];
}

export interface GradeInput {
  studentRut: string;
  subject: string;
  course: string;
  grade: string;
  evaluationType: string;
  date: string;
  professorRut: string;
  coefficient?: number;
}

class GradesService {
  async getStudentGrades(rut: string): Promise<StudentGrades> {
    return apiClient.get(`/grades/student/${encodeURIComponent(rut)}`);
  }

  async getCourseGrades(course: string, professorRut: string): Promise<Grade[]> {
    return apiClient.get(`/grades/course/${encodeURIComponent(course)}?professorRut=${encodeURIComponent(professorRut)}`);
  }

  async getTeacherGrades(rut: string): Promise<Grade[]> {
    return apiClient.get(`/grades/professor/${encodeURIComponent(rut)}`);
  }

  async createGrade(data: GradeInput): Promise<void> {
    return apiClient.post('/grades', data);
  }

  async createGradesBatch(grades: GradeInput[]): Promise<void> {
    return apiClient.post('/grades/batch', { grades });
  }

  async updateGrade(id: number, data: Partial<Grade>): Promise<void> {
    return apiClient.put(`/grades/${id}`, data);
  }

  async deleteGrade(id: number): Promise<void> {
    return apiClient.delete(`/grades/${id}`);
  }
}

export default new GradesService();
