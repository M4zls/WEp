import { eq, and } from 'drizzle-orm';
import { getDatabaseInstance } from '../models/data.js';
import { asistencia } from '../models/schema.js';
import type { Asistencia, CreateAsistencia, UpdateAsistencia } from '../types/AsistenciaTypes.js';

export class AsistenciaRepository {
  private get db() { return getDatabaseInstance(); }

  async findByClaseId(claseId: number): Promise<Asistencia[]> {
    return await this.db.select().from(asistencia)
      .where(eq(asistencia.claseId, claseId))
      .orderBy(asistencia.estudianteNombre);
  }

  async findByEstudianteRut(estudianteRut: string): Promise<Asistencia[]> {
    return await this.db.select().from(asistencia)
      .where(eq(asistencia.estudianteRut, estudianteRut))
      .orderBy(asistencia.fecha);
  }

  async findByCursoAsignaturaId(cursoAsignaturaId: number): Promise<Asistencia[]> {
    return await this.db.select().from(asistencia)
      .where(eq(asistencia.cursoAsignaturaId, cursoAsignaturaId))
      .orderBy(asistencia.fecha, asistencia.estudianteNombre);
  }

  async findOne(claseId: number, estudianteRut: string): Promise<Asistencia | null> {
    const result = await this.db.select().from(asistencia)
      .where(and(eq(asistencia.claseId, claseId), eq(asistencia.estudianteRut, estudianteRut)))
      .limit(1);
    return result[0] ?? null;
  }

  async upsert(data: CreateAsistencia): Promise<Asistencia> {
    const existing = await this.findOne(data.claseId, data.estudianteRut);
    if (existing) {
      await this.db.update(asistencia)
        .set({ presente: data.presente, justificacion: data.justificacion })
        .where(eq(asistencia.id, existing.id!));
      return { ...existing, ...data };
    }
    const result = await this.db.insert(asistencia).values(data).returning();
    return result[0];
  }

  async update(id: number, data: UpdateAsistencia): Promise<void> {
    await this.db.update(asistencia).set(data).where(eq(asistencia.id, id));
  }

  async delete(id: number): Promise<void> {
    await this.db.delete(asistencia).where(eq(asistencia.id, id));
  }

  async deleteByClaseId(claseId: number): Promise<void> {
    await this.db.delete(asistencia).where(eq(asistencia.claseId, claseId));
  }
}
