import { getDatabaseInstance } from '../models/data.js';
import { notas } from '../models/schema.js';
import { eq, and } from 'drizzle-orm';
import type { INota } from '../types/Nota.js';

/** Repositorio de acceso a datos para las notas */
export class NotasRepository {
  private db = getDatabaseInstance();

  /** Obtiene todas las notas de un estudiante por su RUT */
  async findByStudentRut(rut: string): Promise<INota[]> {
    const resultado = await this.db
      .select()
      .from(notas)
      .where(eq(notas.estudianteRut, rut));
    return resultado;
  }

  /** Busca una nota por RUT de estudiante y asignatura */
  async findByStudentRutAndAsignatura(estudianteRut: string, asignatura: string): Promise<INota | null> {
    const resultado = await this.db
      .select()
      .from(notas)
      .where(and(eq(notas.estudianteRut, estudianteRut), eq(notas.asignatura, asignatura)));
    return resultado.length > 0 ? resultado[0] : null;
  }

  /** Obtiene todas las notas de un curso específico */
  async findByCurso(curso: string): Promise<INota[]> {
    const resultado = await this.db
      .select()
      .from(notas)
      .where(eq(notas.curso, curso));
    return resultado;
  }

  /** Obtiene todas las notas de un curso filtradas por profesor */
  async findByCursoAndProfesor(curso: string, profesorRut: string): Promise<INota[]> {
    const resultado = await this.db
      .select()
      .from(notas)
      .where(and(eq(notas.curso, curso), eq(notas.profesorRut, profesorRut)));
    return resultado;
  }

  /** Busca una nota por su ID */
  async findById(id: number): Promise<INota | null> {
    const resultado = await this.db
      .select()
      .from(notas)
      .where(eq(notas.id, id));
    return resultado.length > 0 ? resultado[0] : null;
  }

  /** Obtiene todas las notas registradas por un profesor */
  async findByProfesorRut(profesorRut: string): Promise<INota[]> {
    const resultado = await this.db
      .select()
      .from(notas)
      .where(eq(notas.profesorRut, profesorRut));
    return resultado;
  }

  /** Crea una nueva nota */
  async create(datos: INota): Promise<void> {
    await this.db.insert(notas).values({
      estudianteRut: datos.estudianteRut,
      asignatura: datos.asignatura,
      curso: datos.curso,
      nota: datos.nota,
      tipoEvaluacion: datos.tipoEvaluacion,
      fecha: datos.fecha,
      profesorRut: datos.profesorRut,
      coeficiente: datos.coeficiente ?? 1,
    });
  }

  /** Actualiza una nota existente */
  async update(id: number, datos: Partial<INota>): Promise<void> {
    await this.db
      .update(notas)
      .set(datos)
      .where(eq(notas.id, id));
  }

  /** Elimina una nota por su ID */
  async delete(id: number): Promise<void> {
    await this.db
      .delete(notas)
      .where(eq(notas.id, id));
  }
}
