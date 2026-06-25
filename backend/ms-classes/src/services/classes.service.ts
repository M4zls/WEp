import type { IClassesRepository } from '../repositories/classes.repository.interface.js';
import { ClassesRepository } from '../repositories/classes.repository.js';
import type { Class, CreateClass, UpdateClass } from '../types/class.types.js';
import { CLASS_ERRORS } from '../common/consts.js';
import type { IClassesService } from './classes.service.interface.js';

export class ClassesService implements IClassesService {
  private repo: IClassesRepository;
  constructor(repo?: IClassesRepository) { this.repo = repo ?? new ClassesRepository(); }

  async listClasses(courseSubjectId?: number): Promise<Class[]> {
    return  this.repo.findAll(courseSubjectId);
  }

  async getClass(id: number): Promise<Class> {
    const cls = await this.repo.findById(id);
    if (!cls) throw new Error(CLASS_ERRORS.NOT_FOUND);
    return cls;
  }

  async createClass(data: CreateClass): Promise<Class> {
    return  this.repo.create(data);
  }

  async updateClass(id: number, data: UpdateClass): Promise<void> {
    const cls = await this.repo.findById(id);
    if (!cls) throw new Error(CLASS_ERRORS.NOT_FOUND);
    await this.repo.update(id, data);
  }

  async deleteClass(id: number): Promise<void> {
    const cls = await this.repo.findById(id);
    if (!cls) throw new Error(CLASS_ERRORS.NOT_FOUND);
    await this.repo.delete(id);
  }
}
