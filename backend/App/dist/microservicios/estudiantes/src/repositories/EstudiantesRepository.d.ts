export interface IEstudiante {
    id?: number;
    rut: string;
    dv: string;
    nombre: string;
    apellido: string;
    cursos: string;
    email: string;
    password: string;
    telefono?: string | null;
    apoderado?: string | null;
    fechaRegistro?: string | null;
}
export declare class EstudiantesRepository {
    private db;
    obtenerTodos(): Promise<IEstudiante[]>;
    obtenerRut(rut: string): Promise<IEstudiante | null>;
    obtenerPorEmail(email: string): Promise<IEstudiante | null>;
    crear(datos: IEstudiante): Promise<void>;
    actualizar(rut: string, datos: Partial<IEstudiante>): Promise<void>;
    eliminar(rut: string): Promise<void>;
    obtenerCurso(curso: string): Promise<IEstudiante[]>;
}
//# sourceMappingURL=EstudiantesRepository.d.ts.map