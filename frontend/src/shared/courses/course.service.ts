import apiClient from '../api/apiClient';

export interface Curso {
  id: number;
  nombre: string;
  nivel: string;
  letra: string;
}

export interface Asignatura {
  id: number;
  nombre: string;
  codigo: string;
  descripcion?: string;
}

export interface CursoAsignatura {
  id: number;
  curso_id: number;
  asignatura_id: number;
  profesor_id: number | null;
  asignatura_nombre: string;
  asignatura_codigo: string;
}

class CourseService {
  async obtenerCursos(): Promise<Curso[]> {
    return apiClient.get('/cursos');
  }

  async obtenerCurso(id: number): Promise<Curso & { materias: CursoAsignatura[] }> {
    return apiClient.get(`/cursos/${id}`);
  }

  async obtenerMaterias(cursoId: number): Promise<CursoAsignatura[]> {
    return apiClient.get(`/cursos/${cursoId}/materias`);
  }

  async obtenerAsignaturas(): Promise<Asignatura[]> {
    return apiClient.get('/cursos/asignaturas');
  }
}

export default new CourseService();
