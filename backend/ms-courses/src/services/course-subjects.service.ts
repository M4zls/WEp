import { CourseSubjectsRepository } from '../repositories/course-subjects.repository.js';
import type { ICourseSubjectsRepository } from '../repositories/course-subjects.repository.interface.js';
import type { ICourseSubjectsService } from './course-subjects.service.interface.js';
import type { CourseSubject } from '../types/course.types.js';

const MS_TEACHERS_SERVICE = process.env.MS_TEACHERS_SERVICE ?? 'http://ms-teachers:3004';

export class CourseSubjectsService implements ICourseSubjectsService {
  private repo: ICourseSubjectsRepository;
  constructor(repo?: ICourseSubjectsRepository) { this.repo = repo ?? new CourseSubjectsRepository(); }

  async getSubjectsByCourse(courseId: number): Promise<any[]> {
    const subjects = await this.repo.findByCourse(courseId);
    const profIds = [...new Set(subjects.map((s: any) => s.professorId).filter(Boolean))];
    const profMap: Record<number, any> = {};
    await Promise.all(profIds.map(async (id: number) => {
      try {
        const res = await fetch(`${MS_TEACHERS_SERVICE}/teachers/id/${id}`);
        if (res.ok) {
          const prof = await res.json();
          profMap[id] = prof;
        }
      } catch {}
    }));
    return subjects.map((s: any) => ({
      ...s,
      professorRut: profMap[s.professorId]?.rut ?? null,
      professorFirstName: profMap[s.professorId]?.firstName ?? null,
      professorLastName: profMap[s.professorId]?.lastName ?? null,
    }));
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
