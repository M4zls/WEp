export interface Horario {
  id?: number;
  cursoAsignaturaId: number;
  diaSemana: number;
  horaInicio: string;
  horaTermino: string;
  createdAt?: string | null;
}

export interface CreateHorario {
  cursoAsignaturaId: number;
  diaSemana: number;
  horaInicio: string;
  horaTermino: string;
}

export interface UpdateHorario {
  cursoAsignaturaId?: number;
  diaSemana?: number;
  horaInicio?: string;
  horaTermino?: string;
}
