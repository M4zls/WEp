import { eq } from 'drizzle-orm';
import { getDatabaseInstance } from '../models/data.js';
import { courseSubject, subjects, professors } from '../models/schema.js';
import type { CourseSubject } from '../types/course.types.js';
import type { ICourseSubjectsRepository } from './course-subjects.repository.interface.js';

export class CourseSubjectsRepository implements ICourseSubjectsRepository {
  private get db() {
    return getDatabaseInstance();
  }

  async findByCourse(courseId: number): Promise<any[]> {
    return this.db
      .select({
        id: courseSubject.id,
        courseId: courseSubject.courseId,
        subjectId: courseSubject.subjectId,
        professorId: courseSubject.professorId,
        subjectName: subjects.name,
        subjectCode: subjects.code,
        professorRut: professors.rut,
        professorName: professors.name,
        professorLastName: professors.lastName,
      })
      .from(courseSubject)
      .leftJoin(subjects, eq(courseSubject.subjectId, subjects.id))
      .leftJoin(professors, eq(courseSubject.professorId, professors.id))
      .where(eq(courseSubject.courseId, courseId));
  }

  async assign(data: CourseSubject): Promise<CourseSubject> {
    const result = await this.db.insert(courseSubject).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<CourseSubject>): Promise<void> {
    await this.db.update(courseSubject).set(data).where(eq(courseSubject.id, id));
  }

  async remove(id: number): Promise<void> {
    await this.db.delete(courseSubject).where(eq(courseSubject.id, id));
  }
}
