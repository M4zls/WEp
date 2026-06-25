import { eq } from 'drizzle-orm';
import { getDatabaseInstance } from '../models/data.js';
import { subjects } from '../models/schema.js';
import type { Subject } from '../types/course.types.js';
import type { ISubjectsRepository } from './subjects.repository.interface.js';

export class SubjectsRepository implements ISubjectsRepository {
  private get db() {
    return getDatabaseInstance();
  }

  async findAll(): Promise<Subject[]> {
    return this.db.select().from(subjects);
  }

  async findById(id: number): Promise<Subject | null> {
    const result = await this.db.select().from(subjects).where(eq(subjects.id, id)).limit(1);
    return result[0] ?? null;
  }

  async create(data: Subject): Promise<Subject> {
    const result = await this.db.insert(subjects).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<Subject>): Promise<void> {
    await this.db.update(subjects).set(data).where(eq(subjects.id, id));
  }

  async delete(id: number): Promise<void> {
    await this.db.delete(subjects).where(eq(subjects.id, id));
  }
}
