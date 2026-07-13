export interface User {
  id?: number;
  rut?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: 'student' | 'professor';
}
