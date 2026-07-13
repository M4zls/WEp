export type Role = 'student' | 'professor';

export interface LoginResponse {
  token: string;
  user: {
    firstName?: string;
    lastName?: string;
    email?: string;
    rut?: string;
  };
}

export interface StudentLoginResponse {
  rut: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  courses?: string;
  token?: string;
}
