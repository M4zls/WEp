import { eq } from 'drizzle-orm';
import { getDatabaseinstance } from '../models/data.js';
import { usuarios, sesiones } from '../models/schema.js';
export class AuthRepository {
    get db() {
        return getDatabaseinstance();
    }
    async findByEmail(email) {
        const result = await this.db
            .select()
            .from(usuarios)
            .where(eq(usuarios.email, email))
            .limit(1);
        return result[0] ?? null;
    }
    async findByRut(rut) {
        const result = await this.db
            .select()
            .from(usuarios)
            .where(eq(usuarios.rut, rut))
            .limit(1);
        return result[0] ?? null;
    }
    async findById(id) {
        const result = await this.db
            .select()
            .from(usuarios)
            .where(eq(usuarios.id, id))
            .limit(1);
        return result[0] ?? null;
    }
    async createUsuario(data) {
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
    async guardarSesion(usuarioId, token, expiresAt) {
        await this.db.insert(sesiones).values({ usuarioId, token, expiresAt });
    }
    async deleteSesion(token) {
        await this.db.delete(sesiones).where(eq(sesiones.token, token));
    }
    async findSesion(token) {
        const result = await this.db
            .select()
            .from(sesiones)
            .where(eq(sesiones.token, token))
            .limit(1);
        return result[0] ?? null;
    }
}
//# sourceMappingURL=AuthRepository.js.map