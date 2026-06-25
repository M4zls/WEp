import { CourseSubjectsRepository } from '../repositories/course-subjects.repository.js';
import type { ICourseSubjectsRepository } from '../repositories/course-subjects.repository.interface.js';
import type { ICourseSubjectsService } from './course-subjects.service.interface.js';
import type { CourseSubject } from '../types/course.types.js';

export class CourseSubjectsService implements ICourseSubjectsService {
  private repo: ICourseSubjectsRepository;
  constructor(repo?: ICourseSubjectsRepository) { this.repo = repo ?? new CourseSubjectsRepository(); }

  async getSubjectsByCourse(courseId: number): Promise<any[]> {
    return this.repo.findByCourse(courseId);
  }

  async assignSubject(data: CourseSubject): Promise<any> {
    return this.repo.assign(data);
  }

  async updateAssignment(id: number, data: Partial<CourseSubject>): Promise<void> {
    await this.repo.update(id, data);
  }

  async deleteAssignment(id: number): Promise<void> {
    await this.repo.remove(id);
  }
}
