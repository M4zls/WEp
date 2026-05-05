import { eq } from 'drizzle-orm';
import { getDatabaseinstance } from '../models/data.js';
import { usuarios, sesiones } from '../models/schema.js';

export class AuthRepository {
  private get db() {
    return getDatabaseinstance();
  }

  async findByEmail(email: string) {
    const result = await this.db
      .select()
      .from(usuarios)
      .where(eq(usuarios.email, email))
      .limit(1);
    return result[0] ?? null;
  }

  async findByRut(rut: string) {
    const result = await this.db
      .select()
      .from(usuarios)
      .where(eq(usuarios.rut, rut))
      .limit(1);
    return result[0] ?? null;
  }

  async findById(id: number) {
    const result = await this.db
      .select()
      .from(usuarios)
      .where(eq(usuarios.id, id))
      .limit(1);
    return result[0] ?? null;
  }

  async createUsuario(data: {
    rut: string;
    dv: string;
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    rol?: string;
  }) {
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

  async guardarSesion(usuarioId: number, token: string, expiresAt: string) {
    await this.db.insert(sesiones).values({ usuarioId, token, expiresAt });
  }

  async deleteSesion(token: string) {
    await this.db.delete(sesiones).where(eq(sesiones.token, token));
  }

  async findSesion(token: string) {
    const result = await this.db
      .select()
      .from(sesiones)
      .where(eq(sesiones.token, token))
      .limit(1);
    return result[0] ?? null;
  }
}