export interface IEstudiante {
  id?: number;
  rut: string;
  dv: string;
  nombre: string;
  apellido: string;
  cursos: string;
  email: string;
  password: string;
  telefono?: string | null;
  apoderado?: string | null;
  apoderadoEmail?: string | null;
  fechaRegistro?: string | null;
}