import { type IEstudiante } from '../repositories/EstudiantesRepository.js';
export declare class EstudiantesService {
    private repository;
    constructor();
    obtenerTodos(): Promise<IEstudiante[]>;
    obtenerEstudiante(rut: string): Promise<IEstudiante | null>;
    login(email: string, password: string): Promise<IEstudiante | null>;
    crearEstudiante(datos: IEstudiante): Promise<void>;
    actualizarEstudiante(rut: string, datos: Partial<IEstudiante>): Promise<void>;
    eliminarEstudiante(rut: string): Promise<void>;
    obtenerEstudiantesPorCurso(curso: string): Promise<IEstudiante[]>;
}
//# sourceMappingURL=EstudiantesService.d.ts.map