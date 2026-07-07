export interface ITeacher {
  id?: number;
  rut: string;
  dv: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string | null;
  subject: string;
  createdAt?: string | null;
}
