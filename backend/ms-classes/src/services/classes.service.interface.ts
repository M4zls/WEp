import type { Class, CreateClass, UpdateClass } from '../types/class.types.js';

export interface IClassesService {
  listClasses(courseSubjectId?: number): Promise<Class[]>;
  getClass(id: number): Promise<Class>;
  createClass(data: CreateClass): Promise<Class>;
  updateClass(id: number, data: UpdateClass): Promise<void>;
  deleteClass(id: number): Promise<void>;
}
