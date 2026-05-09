export interface Curso {
  id?: number;
  nombre: string;
  nivel: string;
  letra: string;
  anio?: string | null;
  fechaCreacion?: string | null;
}

export interface Asignatura {
  id?: number;
  nombre: string;
  codigo: string;
  descripcion?: string | null;
  fechaCreacion?: string | null;
}

export interface CursoAsignatura {
  id?: number;
  cursoId: number;
  asignaturaId: number;
  profesorId?: number | null;
  fechaCreacion?: string | null;
}
