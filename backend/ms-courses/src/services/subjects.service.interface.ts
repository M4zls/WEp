import type { Subject } from '../types/course.types.js';

export interface ISubjectsService {
  listSubjects(): Promise<Subject[]>;
  createSubject(data: Subject): Promise<any>;
  updateSubject(id: number, data: Partial<Subject>): Promise<void>;
  deleteSubject(id: number): Promise<void>;
}
