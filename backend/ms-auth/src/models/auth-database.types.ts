export type DBUser = {
  id: number;
  rut: string;
  dv: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
  rol: string;
  activo: boolean | null;
  createdAt: string | null;
};

export type DBNewUser = {
  rut: string;
  dv: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
  rol?: string;
};

export type DBSession = {
  id: number;
  userId: number;
  token: string;
  expiresAt: string;
  createdAt: string | null;
};

export type PublicUser = Omit<DBUser, 'password'>;

export type LoginResponse = {
  token: string;
  user: PublicUser;
};
