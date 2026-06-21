export type Role = 'estudiante' | 'profesor';

export interface LoginResponse {
  token: string;
  usuario: {
    nombre?: string;
    apellido?: string;
    email?: string;
    rut?: string;
  };
}

export interface StudentLoginResponse {
  rut: string;
  nombre?: string;
  apellido?: string;
  email?: string;
  cursos?: string;
  token?: string;
}
