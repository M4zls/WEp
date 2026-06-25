import type { CourseSubject } from '../types/course.types.js';

export interface ICourseSubjectsRepository {
  findByCourse(courseId: number): Promise<any[]>;
  assign(data: CourseSubject): Promise<CourseSubject>;
  update(id: number, data: Partial<CourseSubject>): Promise<void>;
  remove(id: number): Promise<void>;
}
