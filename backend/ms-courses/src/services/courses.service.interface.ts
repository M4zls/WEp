import type { Course, Subject } from '../types/course.types.js';

export interface ICoursesService {
  listCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course & { subjects: Subject[] }>;
  createCourse(data: Course): Promise<any>;
  updateCourse(id: number, data: Partial<Course>): Promise<void>;
  deleteCourse(id: number): Promise<void>;
}
