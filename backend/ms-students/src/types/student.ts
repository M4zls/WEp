export interface IStudent {
  id?: number;
  rut: string;
  dv: string;
  name: string;
  lastName: string;
  courses: string;
  email: string;
  password: string;
  phone?: string | null;
  guardian?: string | null;
  guardianEmail?: string | null;
  fechaRegistro?: string | null;
}
