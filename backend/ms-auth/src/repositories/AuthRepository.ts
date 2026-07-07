import { eq } from 'drizzle-orm';
import { getDatabaseInstance } from '../models/data.js';
import { users, sessions } from '../models/schema.js';
import type { DBNewUser, DBSession, DBUser } from '../models/auth-database.types.js';
import type { IAuthRepository } from './auth.repository.interface.js';

export class AuthRepository implements IAuthRepository {
  private get db() {
    return getDatabaseInstance();
  }

  async findByEmail(email: string): Promise<DBUser | null> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return result[0] ?? null;
  }

  async findByRut(rut: string): Promise<DBUser | null> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.rut, rut))
      .limit(1);
    return result[0] ?? null;
  }

  async findById(id: number): Promise<DBUser | null> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return result[0] ?? null;
  }

  async createUser(data: DBNewUser): Promise<DBUser> {
    const result = await this.db
      .insert(users)
      .values({
        rut: data.rut,
        dv: data.dv,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        role: data.role ?? 'student',
      })
      .returning();
    return result[0];
  }

  async saveSession(userId: number, token: string, expiresAt: string): Promise<void> {
    await this.db.insert(sessions).values({ userId, token, expiresAt });
  }

  async deleteSession(token: string): Promise<void> {
    await this.db.delete(sessions).where(eq(sessions.token, token));
  }

  async findSession(token: string): Promise<DBSession | null> {
    const result = await this.db
      .select()
      .from(sessions)
      .where(eq(sessions.token, token))
      .limit(1);
    return result[0] ?? null;
  }
}
