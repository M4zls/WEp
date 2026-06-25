import type { Class, CreateClass, UpdateClass } from '../types/class.types.js';

export interface IClassesRepository {
  findAll(courseSubjectId?: number): Promise<Class[]>;
  findById(id: number): Promise<Class | null>;
  create(data: CreateClass): Promise<Class>;
  update(id: number, data: UpdateClass): Promise<void>;
  delete(id: number): Promise<void>;
}
