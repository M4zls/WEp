import apiClient from '../../api/apiClient';

/** Representa un curso escolar (ej: 3°A, 4°B). */
export interface Curso {
  id: number;
  nombre: string;
  nivel: string;
  letra: string;
}

/** Representa una asignatura/materia (ej: Matemáticas, Lenguaje). */
export interface Asignatura {
  id: number;
  nombre: string;
  codigo: string;
  descripcion?: string;
}

/** Relación entre un curso y una asignatura, incluyendo el profesor asignado.
 * Los nombres de campo usan camelCase porque así los devuelve el microservicio de cursos. */
export interface CursoAsignatura {
  id: number;
  cursoId: number;
  asignaturaId: number;
  profesorId: number | null;
  profesorRut?: string;
  profesorNombre?: string;
  profesorApellido?: string;
  asignaturaNombre: string;
  asignaturaCodigo: string;
}

/** Servicio para interactuar con los endpoints de cursos y materias. */
class CourseService {
  /** Obtiene todos los cursos disponibles. */
  async obtenerCursos(): Promise<Curso[]> {
    return apiClient.get('/cursos');
  }

  /** Obtiene un curso por su ID incluyendo sus materias. */
  async obtenerCurso(id: number): Promise<Curso & { materias: CursoAsignatura[] }> {
    return apiClient.get(`/cursos/${id}`);
  }

  /** Obtiene las materias (con profesor asignado) de un curso. */
  async obtenerMaterias(cursoId: number): Promise<CursoAsignatura[]> {
    return apiClient.get(`/cursos/${cursoId}/materias`);
  }

  /** Obtiene el catálogo completo de asignaturas. */
  async obtenerAsignaturas(): Promise<Asignatura[]> {
    return apiClient.get('/cursos/asignaturas');
  }

  /** Obtiene los estudiantes matriculados en un curso por su nombre. */
  async obtenerEstudiantesPorCurso(cursoNombre: string): Promise<any[]> {
    return apiClient.get(`/estudiantes/curso/${encodeURIComponent(cursoNombre)}`);
  }
}

export default new CourseService();
