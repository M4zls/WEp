import { getDatabaseInstance } from '../models/data.js';
import { grades } from '../models/schema.js';
import { eq, and } from 'drizzle-orm';
import type { IGrade } from '../types/grade.js';
import type { IGradesRepository } from './grades.repository.interface.js';

/** Repositorio de acceso a datos para las notas */
export class GradesRepository implements IGradesRepository {
  private db = getDatabaseInstance();

  /** Obtiene todas las notas de un estudiante por su RUT */
  async findByStudentRut(rut: string): Promise<IGrade[]> {
    const resultado = await this.db
      .select()
      .from(grades)
      .where(eq(grades.studentRut, rut));
    return resultado;
  }

  /** Busca una nota por RUT de estudiante y asignatura */
  async findByStudentRutAndSubject(studentRut: string, subject: string): Promise<IGrade | null> {
    const resultado = await this.db
      .select()
      .from(grades)
      .where(and(eq(grades.studentRut, studentRut), eq(grades.subject, subject)));
    return resultado.length > 0 ? resultado[0] : null;
  }

  /** Obtiene todas las notas de un curso específico */
  async findByCurso(curso: string): Promise<IGrade[]> {
    const resultado = await this.db
      .select()
      .from(grades)
      .where(eq(grades.curso, curso));
    return resultado;
  }

  /** Obtiene todas las notas de un curso filtradas por profesor */
  async findByCursoAndProfesor(curso: string, professorRut: string): Promise<IGrade[]> {
    const resultado = await this.db
      .select()
      .from(grades)
      .where(and(eq(grades.curso, curso), eq(grades.professorRut, professorRut)));
    return resultado;
  }

  /** Busca una nota por su ID */
  async findById(id: number): Promise<IGrade | null> {
    const resultado = await this.db
      .select()
      .from(grades)
      .where(eq(grades.id, id));
    return resultado.length > 0 ? resultado[0] : null;
  }

  /** Obtiene todas las notas registradas por un profesor */
  async findByProfesorRut(professorRut: string): Promise<IGrade[]> {
    const resultado = await this.db
      .select()
      .from(grades)
      .where(eq(grades.professorRut, professorRut));
    return resultado;
  }

  /** Crea una nueva nota */
  async create(datos: IGrade): Promise<void> {
    await this.db.insert(grades).values({
      studentRut: datos.studentRut,
      subject: datos.subject,
      curso: datos.curso,
      grade: datos.grade,
      evaluationType: datos.evaluationType,
      date: datos.date,
      professorRut: datos.professorRut,
      coefficient: datos.coefficient ?? 1,
    });
  }

  /** Actualiza una nota existente */
  async update(id: number, datos: Partial<IGrade>): Promise<void> {
    await this.db
      .update(grades)
      .set(datos)
      .where(eq(grades.id, id));
  }

  /** Elimina una nota por su ID */
  async delete(id: number): Promise<void> {
    await this.db
      .delete(grades)
      .where(eq(grades.id, id));
  }
}
