export interface Clase {
  id: number;
  cursoAsignaturaId: number;
  titulo: string;
  descripcion?: string | null;
  fecha: string;
  horaInicio: string;
  horaTermino: string;
  estado: string;
  createdAt?: string | null;
}

export interface CreateClaseDto {
  cursoAsignaturaId: number;
  titulo: string;
  descripcion?: string;
  fecha: string;
  horaInicio: string;
  horaTermino: string;
  estado?: string;
}

export interface UpdateClaseDto {
  titulo?: string;
  descripcion?: string;
  fecha?: string;
  horaInicio?: string;
  horaTermino?: string;
  estado?: string;
}

export const CLASS_STATUSES = {
  PENDING: 'pendiente',
  COMPLETED: 'realizada',
  CANCELLED: 'cancelada',
} as const;
