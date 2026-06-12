export interface Clase {
  id?: number;
  cursoAsignaturaId: number;
  titulo: string;
  descripcion?: string | null;
  fecha: string;
  horaInicio: string;
  horaTermino: string;
  estado?: string | null;
  createdAt?: string | null;
}

export interface CreateClase {
  cursoAsignaturaId: number;
  titulo: string;
  descripcion?: string;
  fecha: string;
  horaInicio: string;
  horaTermino: string;
  estado?: string;
}

export interface UpdateClase {
  titulo?: string;
  descripcion?: string;
  fecha?: string;
  horaInicio?: string;
  horaTermino?: string;
  estado?: string;
}
