export interface User {
  id?: number;
  rut?: string;
  nombre?: string;
  apellido?: string;
  email: string;
  role: 'estudiante' | 'profesor';
}
