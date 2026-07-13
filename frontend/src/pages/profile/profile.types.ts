export interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  rut: string;
  phone?: string | null;
  courses?: string;
  guardian?: string | null;
  subject?: string;
  registrationDate?: string;
  admissionDate?: string;
}

export interface ProfilePageProps {
  userData: { firstName?: string; lastName?: string; email?: string; rut?: string } | null;
  role: 'student' | 'professor';
}

export interface StatusMessage {
  type: 'ok' | 'error';
  text: string;
}
