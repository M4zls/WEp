import type { Course } from '../types/course.types.js';

export interface ICoursesRepository {
  findAll(): Promise<Course[]>;
  findById(id: number): Promise<Course | null>;
  create(data: Course): Promise<Course>;
  update(id: number, data: Partial<Course>): Promise<void>;
  delete(id: number): Promise<void>;
}
