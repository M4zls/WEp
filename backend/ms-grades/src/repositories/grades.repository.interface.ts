import type { IGrade } from '../types/grade.js';

export interface IGradesRepository {
  findByStudentRut(rut: string): Promise<IGrade[]>;
  findByStudentRutAndSubject(studentRut: string, subject: string): Promise<IGrade | null>;
  findByCurso(curso: string): Promise<IGrade[]>;
  findByCursoAndProfesor(curso: string, professorRut: string): Promise<IGrade[]>;
  findById(id: number): Promise<IGrade | null>;
  findByProfesorRut(professorRut: string): Promise<IGrade[]>;
  create(datos: IGrade): Promise<void>;
  update(id: number, datos: Partial<IGrade>): Promise<void>;
  delete(id: number): Promise<void>;
}
