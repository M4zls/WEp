export interface PerfilData {
  nombre: string;
  apellido: string;
  email: string;
  rut: string;
  telefono?: string | null;
  cursos?: string;
  apoderado?: string | null;
  materia?: string;
  fechaRegistro?: string;
  fechaIngreso?: string;
}

export interface PerfilPageProps {
  userData: { nombre?: string; apellido?: string; email?: string; rut?: string } | null;
  role: 'estudiante' | 'profesor';
}

export interface MensajeEstado {
  tipo: 'ok' | 'error';
  texto: string;
}
