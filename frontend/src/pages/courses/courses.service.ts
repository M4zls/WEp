import apiClient from '../../api/apiClient';

export interface Course {
  id: number;
  name: string;
  level: string;
  letter: string;
}

export interface Subject {
  id: number;
  name: string;
  code: string;
  description?: string;
}

export interface CourseSubject {
  id: number;
  courseId: number;
  subjectId: number;
  professorId: number | null;
  professorRut?: string;
  professorFirstName?: string;
  professorLastName?: string;
  subjectName: string;
  subjectCode: string;
}

class CourseService {
  async getCourses(): Promise<Course[]> {
    return apiClient.get('/courses');
  }

  async getCourse(id: number): Promise<Course & { subjects: CourseSubject[] }> {
    return apiClient.get(`/courses/${id}`);
  }

  async getSubjectsByCourse(courseId: number): Promise<CourseSubject[]> {
    return apiClient.get(`/courses/${courseId}/subjects`);
  }

  async getSubjects(): Promise<Subject[]> {
    return apiClient.get('/courses/subjects');
  }

  async getStudentsByCourse(courseName: string): Promise<any[]> {
    return apiClient.get(`/students/course/${encodeURIComponent(courseName)}`);
  }
}

export default new CourseService();
