export interface CursoInfo {
  id: number;
  nombre: string;
  nivel: string;
  letra: string;
  materias: { id: number; asignatura_nombre: string; asignatura_codigo?: string; estudiantes: number }[];
}

export interface FlatMateria {
  id: number;
  asignatura_nombre: string;
  asignatura_codigo?: string;
  curso_nombre: string;
  curso_id: number;
  estudiantes: number;
}
