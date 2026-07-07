export type DBUser = {
  id: number;
  rut: string;
  dv: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  active: boolean | null;
  createdAt: string | null;
};

export type DBNewUser = {
  rut: string;
  dv: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
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
