import { eq } from 'drizzle-orm';
import { getDatabaseInstance } from '../models/data.js';
import { horarios } from '../models/schema.js';
import type { Horario, CreateHorario, UpdateHorario } from '../types/HorarioTypes.js';

export class HorariosRepository {
  private get db() {
    return getDatabaseInstance();
  }

  async findAll(cursoAsignaturaId?: number): Promise<Horario[]> {
    if (cursoAsignaturaId) {
      return await this.db
        .select()
        .from(horarios)
        .where(eq(horarios.cursoAsignaturaId, cursoAsignaturaId))
        .orderBy(horarios.diaSemana, horarios.horaInicio);
    }
    return await this.db.select().from(horarios).orderBy(horarios.diaSemana, horarios.horaInicio);
  }

  async findById(id: number): Promise<Horario | null> {
    const result = await this.db.select().from(horarios).where(eq(horarios.id, id)).limit(1);
    return result[0] ?? null;
  }

  async create(data: CreateHorario): Promise<Horario> {
    const result = await this.db.insert(horarios).values(data).returning();
    return result[0];
  }

  async update(id: number, data: UpdateHorario): Promise<void> {
    await this.db.update(horarios).set(data).where(eq(horarios.id, id));
  }

  async delete(id: number): Promise<void> {
    await this.db.delete(horarios).where(eq(horarios.id, id));
  }
}
