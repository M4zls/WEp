import { eq, desc } from 'drizzle-orm';
import { getDatabaseInstance } from '../models/data.js';
import { classes } from '../models/schema.js';
import type { Class, CreateClass, UpdateClass } from '../types/class.types.js';
import type { IClassesRepository } from './classes.repository.interface.js';

export class ClassesRepository implements IClassesRepository {
  private get db() {
    return getDatabaseInstance();
  }

  async findAll(courseSubjectId?: number): Promise<Class[]> {
    if (courseSubjectId) {
      return  this.db
        .select()
        .from(classes)
        .where(eq(classes.courseSubjectId, courseSubjectId))
        .orderBy(desc(classes.date));
    }
    return  this.db.select().from(classes).orderBy(desc(classes.date));
  }

  async findById(id: number): Promise<Class | null> {
    const result = await this.db.select().from(classes).where(eq(classes.id, id)).limit(1);
    return result[0] ?? null;
  }

  async create(data: CreateClass): Promise<Class> {
    const result = await this.db.insert(classes).values(data).returning();
    return result[0];
  }

  async update(id: number, data: UpdateClass): Promise<void> {
    await this.db.update(classes).set(data).where(eq(classes.id, id));
  }

  async delete(id: number): Promise<void> {
    await this.db.delete(classes).where(eq(classes.id, id));
  }
}
