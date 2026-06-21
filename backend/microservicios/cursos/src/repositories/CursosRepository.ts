import { eq } from 'drizzle-orm';
import { getDatabaseInstance } from '../models/data.js';
import { cursos, asignaturas, cursoAsignatura, profesores } from '../models/schema.js';
import type { Curso, Asignatura, CursoAsignatura } from '../types/CursoTypes.js';

export class CursosRepository {
  private get db() {
    return getDatabaseInstance();
  }

  // Cursos
  async findAllCursos(): Promise<Curso[]> {
    return await this.db.select().from(cursos);
  }

  async findCursoById(id: number): Promise<Curso | null> {
    const result = await this.db.select().from(cursos).where(eq(cursos.id, id)).limit(1);
    return result[0] ?? null;
  }

  async createCurso(data: Curso): Promise<Curso> {
    const result = await this.db.insert(cursos).values(data).returning();
    return result[0];
  }

  async updateCurso(id: number, data: Partial<Curso>): Promise<void> {
    await this.db.update(cursos).set(data).where(eq(cursos.id, id));
  }

  async deleteCurso(id: number): Promise<void> {
    await this.db.delete(cursos).where(eq(cursos.id, id));
  }

  // Asignaturas
  async findAllAsignaturas(): Promise<Asignatura[]> {
    return await this.db.select().from(asignaturas);
  }

  async findAsignaturaById(id: number): Promise<Asignatura | null> {
    const result = await this.db.select().from(asignaturas).where(eq(asignaturas.id, id)).limit(1);
    return result[0] ?? null;
  }

  async createAsignatura(data: Asignatura): Promise<Asignatura> {
    const result = await this.db.insert(asignaturas).values(data).returning();
    return result[0];
  }

  async updateAsignatura(id: number, data: Partial<Asignatura>): Promise<void> {
    await this.db.update(asignaturas).set(data).where(eq(asignaturas.id, id));
  }

  async deleteAsignatura(id: number): Promise<void> {
    await this.db.delete(asignaturas).where(eq(asignaturas.id, id));
  }

  // Curso-Asignatura
  async findAsignaturasByCurso(cursoId: number): Promise<any[]> {
    return await this.db
      .select({
        id: cursoAsignatura.id,
        cursoId: cursoAsignatura.cursoId,
        asignaturaId: cursoAsignatura.asignaturaId,
        profesorId: cursoAsignatura.profesorId,
        asignaturaNombre: asignaturas.nombre,
        asignaturaCodigo: asignaturas.codigo,
        profesorRut: profesores.rut,
        profesorNombre: profesores.nombre,
        profesorApellido: profesores.apellido,
      })
      .from(cursoAsignatura)
      .leftJoin(asignaturas, eq(cursoAsignatura.asignaturaId, asignaturas.id))
      .leftJoin(profesores, eq(cursoAsignatura.profesorId, profesores.id))
      .where(eq(cursoAsignatura.cursoId, cursoId));
  }

  async assignAsignatura(data: CursoAsignatura): Promise<CursoAsignatura> {
    const result = await this.db.insert(cursoAsignatura).values(data).returning();
    return result[0];
  }

  async updateCursoAsignatura(id: number, data: Partial<CursoAsignatura>): Promise<void> {
    await this.db.update(cursoAsignatura).set(data).where(eq(cursoAsignatura.id, id));
  }

  async removeAsignatura(id: number): Promise<void> {
    await this.db.delete(cursoAsignatura).where(eq(cursoAsignatura.id, id));
  }
}
