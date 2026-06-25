import apiClient from '../../../api/apiClient';

export interface Grade {
  id: number;
  estudianteRut: string;
  asignatura: string;
  curso: string;
  nota: string;
  tipoEvaluacion: string;
  fecha: string;
  profesorRut: string;
  coeficiente?: number;
}

export interface SubjectGrades {
  asignatura: string;
  notas: Grade[];
  promedio: string;
}

export interface StudentGrades {
  rut: string;
  nombre: string;
  apellido: string;
  curso: string;
  asignaturas: SubjectGrades[];
}

export interface GradeInput {
  estudianteRut: string;
  asignatura: string;
  curso: string;
  nota: string;
  tipoEvaluacion: string;
  fecha: string;
  profesorRut: string;
  coeficiente?: number;
}

class GradesService {
  async getStudentGrades(rut: string): Promise<StudentGrades> {
    return apiClient.get(`/grades/estudiante/${encodeURIComponent(rut)}`);
  }

  async getCourseGrades(curso: string, profesorRut: string): Promise<Grade[]> {
    return apiClient.get(`/grades/curso/${encodeURIComponent(curso)}?profesorRut=${encodeURIComponent(profesorRut)}`);
  }

  async getTeacherGrades(rut: string): Promise<Grade[]> {
    return apiClient.get(`/grades/profesor/${encodeURIComponent(rut)}`);
  }

  async createGrade(datos: GradeInput): Promise<void> {
    return apiClient.post('/grades', datos);
  }

  async createGradesBatch(notas: GradeInput[]): Promise<void> {
    return apiClient.post('/grades/batch', { notas });
  }

  async updateGrade(id: number, datos: Partial<Grade>): Promise<void> {
    return apiClient.put(`/grades/${id}`, datos);
  }

  async deleteGrade(id: number): Promise<void> {
    return apiClient.delete(`/grades/${id}`);
  }
}

export default new GradesService();
