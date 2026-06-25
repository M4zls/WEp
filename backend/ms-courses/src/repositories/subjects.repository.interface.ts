import type { Subject } from '../types/course.types.js';

export interface ISubjectsRepository {
  findAll(): Promise<Subject[]>;
  findById(id: number): Promise<Subject | null>;
  create(data: Subject): Promise<Subject>;
  update(id: number, data: Partial<Subject>): Promise<void>;
  delete(id: number): Promise<void>;
}
