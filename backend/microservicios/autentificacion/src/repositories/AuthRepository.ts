import { eq } from 'drizzle-orm';
import { getDatabaseInstance } from '../models/data.js';
import { usuarios, sesiones } from '../models/schema.js';
import type { DBNewUser, DBSession, DBUser } from '../models/AuthDatabaseTypes.js';

export class AuthRepository {
  private get db() {
    return getDatabaseInstance();
  }

  async findByEmail(email: string): Promise<DBUser | null> {
    const result = await this.db
      .select()
      .from(usuarios)
      .where(eq(usuarios.email, email))
      .limit(1);
    return result[0] ?? null;
  }

  async findByRut(rut: string): Promise<DBUser | null> {
    const result = await this.db
      .select()
      .from(usuarios)
      .where(eq(usuarios.rut, rut))
      .limit(1);
    return result[0] ?? null;
  }

  async findById(id: number): Promise<DBUser | null> {
    const result = await this.db
      .select()
      .from(usuarios)
      .where(eq(usuarios.id, id))
      .limit(1);
    return result[0] ?? null;
  }

  async createUsuario(data: DBNewUser): Promise<DBUser> {
    const result = await this.db
      .insert(usuarios)
      .values({
        rut: data.rut,
        dv: data.dv,
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        password: data.password,
        rol: data.rol ?? 'estudiante',
      })
      .returning();
    return result[0];
  }

  async guardarSesion(usuarioId: number, token: string, expiresAt: string): Promise<void> {
    await this.db.insert(sesiones).values({ usuarioId, token, expiresAt });
  }

  async deleteSesion(token: string): Promise<void> {
    await this.db.delete(sesiones).where(eq(sesiones.token, token));
  }

  async findSesion(token: string): Promise<DBSession | null> {
    const result = await this.db
      .select()
      .from(sesiones)
      .where(eq(sesiones.token, token))
      .limit(1);
    return result[0] ?? null;
  }
}