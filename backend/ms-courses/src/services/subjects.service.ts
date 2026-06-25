import { SubjectsRepository } from '../repositories/subjects.repository.js';
import type { ISubjectsRepository } from '../repositories/subjects.repository.interface.js';
import type { ISubjectsService } from './subjects.service.interface.js';
import type { Subject } from '../types/course.types.js';

export class SubjectsService implements ISubjectsService {
  private repo: ISubjectsRepository;
  constructor(repo?: ISubjectsRepository) { this.repo = repo ?? new SubjectsRepository(); }

  async listSubjects(): Promise<Subject[]> {
    return this.repo.findAll();
  }

  async createSubject(data: Subject): Promise<any> {
    return this.repo.create(data);
  }

  async updateSubject(id: number, data: Partial<Subject>): Promise<void> {
    const subject = await this.repo.findById(id);
    if (!subject) throw new Error('Asignatura no encontrada');
    await this.repo.update(id, data);
  }

  async deleteSubject(id: number): Promise<void> {
    const subject = await this.repo.findById(id);
    if (!subject) throw new Error('Asignatura no encontrada');
    await this.repo.delete(id);
  }
}
