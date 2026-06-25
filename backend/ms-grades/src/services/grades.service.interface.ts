import type { IGrade, IStudentGrades } from '../types/grade.js';

export interface IGradesService {
  getStudentGrades(rut: string): Promise<IStudentGrades | null>;
  getCourseGrades(curso: string, professorRut: string): Promise<IGrade[]>;
  getTeacherGrades(professorRut: string): Promise<IGrade[]>;
  createGrade(datos: IGrade): Promise<void>;
  updateGrade(id: number, datos: Partial<IGrade>): Promise<void>;
  createGradesBatch(gradesData: IGrade[]): Promise<void>;
  deleteGrade(id: number): Promise<void>;
}
