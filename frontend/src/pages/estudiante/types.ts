export interface UserData {
  id?: number;
  rut?: string;
  nombre?: string;
  apellido?: string;
  email?: string;
  rol?: string;
  cursos?: string;
}

export interface CursoInfo {
  id: number;
  nombre: string;
  nivel: string;
  letra: string;
  materias: {
    id: number;
    asignatura_nombre: string;
    asignatura_codigo?: string;
    profesor_nombre: string;
    profesor_apellido?: string;
  }[];
}
