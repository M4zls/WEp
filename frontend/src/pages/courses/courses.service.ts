import apiClient from '../../api/apiClient';

/** Representa un curso escolar (ej: 3°A, 4°B). */
export interface Course {
  id: number;
  name: string;
  level: string;
  letter: string;
}

/** Representa una asignatura/materia (ej: Matemáticas, Lenguaje). */
export interface Subject {
  id: number;
  name: string;
  code: string;
  description?: string;
}

/** Relación entre un curso y una asignatura, incluyendo el profesor asignado.
 * Los nombres de campo usan camelCase porque así los devuelve el microservicio de cursos. */
export interface CourseSubject {
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
  async getCourses(): Promise<Course[]> {
    return apiClient.get('/courses');
  }

  /** Obtiene un curso por su ID incluyendo sus materias. */
  async getCourse(id: number): Promise<Course & { materias: CourseSubject[] }> {
    return apiClient.get(`/courses/${id}`);
  }

  /** Obtiene las materias (con profesor asignado) de un curso. */
  async getSubjectsByCourse(courseId: number): Promise<CourseSubject[]> {
    return apiClient.get(`/courses/${courseId}/subjects`);
  }

  /** Obtiene el catálogo completo de asignaturas. */
  async getSubjects(): Promise<Subject[]> {
    return apiClient.get('/courses/subjects');
  }

  /** Obtiene los estudiantes matriculados en un curso por su nombre. */
  async getStudentsByCourse(courseName: string): Promise<any[]> {
    return apiClient.get(`/students/curso/${encodeURIComponent(courseName)}`);
  }
}

export default new CourseService();
