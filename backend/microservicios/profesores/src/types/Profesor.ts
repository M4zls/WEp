export interface IProfesor {
  id?: number;
  rut: string;
  dv: string;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono?: string | null;
  materia: string;
  fechaIngreso?: string | null;
}