import type { CourseSubject } from '../types/course.types.js';

export interface ICourseSubjectsService {
  getSubjectsByCourse(courseId: number): Promise<any[]>;
  assignSubject(data: CourseSubject): Promise<any>;
  updateAssignment(id: number, data: Partial<CourseSubject>): Promise<void>;
  deleteAssignment(id: number): Promise<void>;
}
