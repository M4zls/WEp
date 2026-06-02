

export interface CursoInfo {
  id: number;
  nombre: string;
  nivel: string;
  letra: string;
  materias: { id: number; asignatura_nombre: string; estudiantes: number }[];
}