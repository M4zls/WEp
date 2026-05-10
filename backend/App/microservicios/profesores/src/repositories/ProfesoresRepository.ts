import { getDatabaseinstance } from '../models/data.js';
import { profesores } from '../models/schema.js';
import { eq } from 'drizzle-orm';

export interface IProfesor {
    id?: number;
    rut: string;
    dv: string;
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    telefono?: string | null;
    materia: string;
    fechaIngreso?: string | null;
}
export class ProfesoresRepository {
    private db = getDatabaseinstance();
    async obtenerTodos(): Promise<IProfesor[]> {
        const resultado = await this.db.select().from(profesores);
        return resultado;
    }
    async obtenerRut(rut: string): Promise<IProfesor | null> {
        const resultado = await this.db
            .select()
            .from(profesores)
            .where(eq(profesores.rut, rut));
        return resultado.length > 0 ? resultado[0] : null;
    }
    async obtenerPorEmail(email: string): Promise<IProfesor | null> {
        const resultado = await this.db
            .select()
            .from(profesores)
            .where(eq(profesores.email, email));
        return resultado.length > 0 ? resultado[0] : null;
    }
    async crear(datos: IProfesor): Promise<void> {
        await this.db.insert(profesores).values({
            rut: datos.rut,
            dv: datos.dv,
            nombre: datos.nombre,
            apellido: datos.apellido,
            email: datos.email,
            password: datos.password,
            telefono: datos.telefono,
            materia: datos.materia,
            fechaIngreso: new Date().toISOString(),
        });
    }
    async actualizar(rut: string, datos: Partial<IProfesor>): Promise<void> {
        await this.db
            .update(profesores)
            .set(datos)
            .where(eq(profesores.rut, rut));
    }
    async eliminar(rut: string): Promise<void> {
        await this.db
        .delete(profesores)
        .where(eq(profesores.rut, rut));
    }
    async obtenerMateria(materia: string): Promise<string | null> {
        const resultado = await this.db
            .select()
            .from(profesores)
            .where(eq(profesores.materia, materia));
        return resultado.length > 0 ? resultado[0].materia : null;
    }
}