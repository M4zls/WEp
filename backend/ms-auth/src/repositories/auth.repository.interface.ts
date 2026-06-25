import type { DBNewUser, DBSession, DBUser } from '../models/auth-database.types.js';

export interface IAuthRepository {
  findByEmail(email: string): Promise<DBUser | null>;
  findByRut(rut: string): Promise<DBUser | null>;
  findById(id: number): Promise<DBUser | null>;
  createUser(data: DBNewUser): Promise<DBUser>;
  saveSession(userId: number, token: string, expiresAt: string): Promise<void>;
  deleteSession(token: string): Promise<void>;
  findSession(token: string): Promise<DBSession | null>;
}
