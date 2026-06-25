export type DBUser = {
  id: number;
  rut: string;
  dv: string;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rol: string;
  activo: boolean | null;
  fechaCreacion: string | null;
};

export type DBNewUser = {
  rut: string;
  dv: string;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rol?: string;
};

export type DBSession = {
  id: number;
  usuarioId: number;
  token: string;
  expiresAt: string;
  createdAt: string | null;
};

export type PublicUser = Omit<DBUser, 'password'>;

export type LoginResponse = {
  token: string;
  usuario: PublicUser;
};