import { eq, desc } from 'drizzle-orm';
import { getDatabaseInstance } from '../models/data.js';
import { clases } from '../models/schema.js';
import type { Clase, CreateClase, UpdateClase } from '../types/ClaseTypes.js';

export class ClasesRepository {
  private get db() {
    return getDatabaseInstance();
  }

  async findAll(cursoAsignaturaId?: number): Promise<Clase[]> {
    if (cursoAsignaturaId) {
      return await this.db
        .select()
        .from(clases)
        .where(eq(clases.cursoAsignaturaId, cursoAsignaturaId))
        .orderBy(desc(clases.fecha));
    }
    return await this.db.select().from(clases).orderBy(desc(clases.fecha));
  }

  async findById(id: number): Promise<Clase | null> {
    const result = await this.db.select().from(clases).where(eq(clases.id, id)).limit(1);
    return result[0] ?? null;
  }

  async create(data: CreateClase): Promise<Clase> {
    const result = await this.db.insert(clases).values(data).returning();
    return result[0];
  }

  async update(id: number, data: UpdateClase): Promise<void> {
    await this.db.update(clases).set(data).where(eq(clases.id, id));
  }

  async delete(id: number): Promise<void> {
    await this.db.delete(clases).where(eq(clases.id, id));
  }
}
