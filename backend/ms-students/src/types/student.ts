export interface IStudent {
  id?: number;
  rut: string;
  dv: string;
  firstName: string;
  lastName: string;
  courses: string;
  email: string;
  password: string;
  phone?: string | null;
  guardian?: string | null;
  guardianEmail?: string | null;
  registrationDate?: string | null;
}
