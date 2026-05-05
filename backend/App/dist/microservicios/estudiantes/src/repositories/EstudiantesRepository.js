import { getDatabaseinstance } from '../models/data.js';
import { estudiantes } from '../models/schema.js';
import { eq } from 'drizzle-orm';
export class EstudiantesRepository {
    db = getDatabaseinstance();
    async obtenerTodos() {
        const resultado = await this.db.select().from(estudiantes);
        return resultado;
    }
    async obtenerRut(rut) {
        const resultado = await this.db
            .select()
            .from(estudiantes)
            .where(eq(estudiantes.rut, rut));
        return resultado.length > 0 ? resultado[0] : null;
    }
    async obtenerPorEmail(email) {
        const resultado = await this.db
            .select()
            .from(estudiantes)
            .where(eq(estudiantes.email, email));
        return resultado.length > 0 ? resultado[0] : null;
    }
    async crear(datos) {
        await this.db.insert(estudiantes).values({
            rut: datos.rut,
            dv: datos.dv,
            nombre: datos.nombre,
            apellido: datos.apellido,
            cursos: datos.cursos,
            email: datos.email,
            password: datos.password,
            telefono: datos.telefono,
            apoderado: datos.apoderado,
            fechaRegistro: new Date().toISOString(),
        });
    }
    async actualizar(rut, datos) {
        await this.db
            .update(estudiantes)
            .set(datos)
            .where(eq(estudiantes.rut, rut));
    }
    async eliminar(rut) {
        await this.db
            .delete(estudiantes)
            .where(eq(estudiantes.rut, rut));
    }
    async obtenerCurso(curso) {
        const resultado = await this.db
            .select()
            .from(estudiantes)
            .where(eq(estudiantes.cursos, curso));
        return resultado;
    }
}
//# sourceMappingURL=EstudiantesRepository.js.map