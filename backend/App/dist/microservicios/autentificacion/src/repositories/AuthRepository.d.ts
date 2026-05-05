export declare class AuthRepository {
    private get db();
    findByEmail(email: string): Promise<{
        id: number;
        rut: string;
        dv: string;
        nombre: string;
        apellido: string;
        email: string;
        password: string;
        rol: string;
        activo: boolean | null;
        fechaCreacion: string | null;
    }>;
    findByRut(rut: string): Promise<{
        id: number;
        rut: string;
        dv: string;
        nombre: string;
        apellido: string;
        email: string;
        password: string;
        rol: string;
        activo: boolean | null;
        fechaCreacion: string | null;
    }>;
    findById(id: number): Promise<{
        id: number;
        rut: string;
        dv: string;
        nombre: string;
        apellido: string;
        email: string;
        password: string;
        rol: string;
        activo: boolean | null;
        fechaCreacion: string | null;
    }>;
    createUsuario(data: {
        rut: string;
        dv: string;
        nombre: string;
        apellido: string;
        email: string;
        password: string;
        rol?: string;
    }): Promise<{
        id: number;
        rut: string;
        dv: string;
        nombre: string;
        apellido: string;
        email: string;
        password: string;
        rol: string;
        activo: boolean | null;
        fechaCreacion: string | null;
    }>;
    guardarSesion(usuarioId: number, token: string, expiresAt: string): Promise<void>;
    deleteSesion(token: string): Promise<void>;
    findSesion(token: string): Promise<{
        id: number;
        usuarioId: number;
        token: string;
        expiresAt: string;
        createdAt: string | null;
    }>;
}
//# sourceMappingURL=AuthRepository.d.ts.map