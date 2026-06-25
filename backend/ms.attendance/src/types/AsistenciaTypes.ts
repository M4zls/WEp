export interface Asistencia {
  id?: number;
  claseId: number;
  cursoAsignaturaId: number;
  estudianteRut: string;
  estudianteNombre: string;
  presente: boolean;
  justificacion?: string | null;
  fecha?: string | null;
  createdAt?: string | null;
}

export interface CreateAsistencia {
  claseId: number;
  cursoAsignaturaId: number;
  estudianteRut: string;
  estudianteNombre: string;
  presente: boolean;
  justificacion?: string;
}

export interface UpdateAsistencia {
  presente?: boolean;
  justificacion?: string;
}

export interface MarcarAsistenciaBatchDto {
  claseId: number;
  cursoAsignaturaId: number;
  registros: {
    estudianteRut: string;
    estudianteNombre: string;
    presente: boolean;
    justificacion?: string;
  }[];
}
