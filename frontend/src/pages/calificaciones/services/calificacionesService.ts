import apiClient from '../../../api/apiClient';

export interface Calificacion {
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

export interface AsignaturaCalificaciones {
  asignatura: string;
  notas: Calificacion[];
  promedio: string;
}

export interface CalificacionesAlumno {
  rut: string;
  nombre: string;
  apellido: string;
  curso: string;
  asignaturas: AsignaturaCalificaciones[];
}

export interface NotaInput {
  estudianteRut: string;
  asignatura: string;
  curso: string;
  nota: string;
  tipoEvaluacion: string;
  fecha: string;
  profesorRut: string;
  coeficiente?: number;
}

class CalificacionesService {
  async obtenerCalificacionesAlumno(rut: string): Promise<CalificacionesAlumno> {
    return apiClient.get(`/notas/estudiante/${encodeURIComponent(rut)}`);
  }

  async obtenerNotasCurso(curso: string, profesorRut: string): Promise<Calificacion[]> {
    return apiClient.get(`/notas/curso/${encodeURIComponent(curso)}?profesorRut=${encodeURIComponent(profesorRut)}`);
  }

  async obtenerNotasProfesor(rut: string): Promise<Calificacion[]> {
    return apiClient.get(`/notas/profesor/${encodeURIComponent(rut)}`);
  }

  async crearNota(datos: NotaInput): Promise<void> {
    return apiClient.post('/notas', datos);
  }

  async crearNotasBatch(notas: NotaInput[]): Promise<void> {
    return apiClient.post('/notas/batch', { notas });
  }

  async actualizarNota(id: number, datos: Partial<Calificacion>): Promise<void> {
    return apiClient.put(`/notas/${id}`, datos);
  }

  async eliminarNota(id: number): Promise<void> {
    return apiClient.delete(`/notas/${id}`);
  }
}

export default new CalificacionesService();
