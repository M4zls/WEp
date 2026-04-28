import { getDatabaseinstance } from '../models/data.js';
import { estudiantes } from '../models/schema.js';
import { eq } from 'drizzle-orm';

export interface IEstudiante {
    id?: number;
    rut: string;
    dv: string;
    nombre: string;
    apellido: string;
    cursos: string;
    email?: string | null;
    telefono?: string | null;
    apoderado?: string | null;
    fechaRegistro?: string | null;
}

export class EstudiantesRepository {
    private db = getDatabaseinstance();

    async obtenerTodos(): Promise<IEstudiante[]> {
        const resultado = await this.db.select().from(estudiantes);
        return resultado;
    }

    async obtenerRut(rut: string): Promise<IEstudiante | null> {
        const resultado = await this.db
            .select()
            .from(estudiantes)
            .where(eq(estudiantes.rut, rut));

        return resultado.length > 0 ? resultado[0] : null;
    }

    async crear(datos: IEstudiante): Promise<void> {
        await this.db.insert(estudiantes).values({
            rut: datos.rut,
            dv: datos.dv,
            nombre: datos.nombre,
            apellido: datos.apellido,
            cursos: datos.cursos,
            email: datos.email,
            telefono: datos.telefono,
            apoderado: datos.apoderado,
            fechaRegistro: new Date().toISOString(),
        });
    }

    async actualizar(rut: string, datos: Partial<IEstudiante>): Promise<void> {
        await this.db
            .update(estudiantes)
            .set(datos)
            .where(eq(estudiantes.rut, rut));
    }

    async eliminar(rut: string): Promise<void> {
        await this.db
            .delete(estudiantes)
            .where(eq(estudiantes.rut, rut));
    }

    async obtenerCurso(curso: string): Promise<IEstudiante[]> {
        const resultado = await this.db
            .select()
            .from(estudiantes)
            .where(eq(estudiantes.cursos, curso));

        return resultado;
    }
}
