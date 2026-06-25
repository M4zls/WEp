import { eq } from 'drizzle-orm';
import { getDatabaseInstance } from '../models/data.js';
import { courses } from '../models/schema.js';
import type { Course } from '../types/course.types.js';
import type { ICoursesRepository } from './courses.repository.interface.js';

export class CoursesRepository implements ICoursesRepository {
  private get db() {
    return getDatabaseInstance();
  }

  async findAll(): Promise<Course[]> {
    return this.db.select().from(courses);
  }

  async findById(id: number): Promise<Course | null> {
    const result = await this.db.select().from(courses).where(eq(courses.id, id)).limit(1);
    return result[0] ?? null;
  }

  async create(data: Course): Promise<Course> {
    const result = await this.db.insert(courses).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<Course>): Promise<void> {
    await this.db.update(courses).set(data).where(eq(courses.id, id));
  }

  async delete(id: number): Promise<void> {
    await this.db.delete(courses).where(eq(courses.id, id));
  }
}
