export declare class AuthService {
    login(identifier: string, password: string): Promise<{
        token: string;
        usuario: {
            id: number;
            rut: string;
            nombre: string;
            apellido: string;
            email: string;
            rol: string;
        };
    }>;
    register(data: {
        rut: string;
        dv: string;
        nombre: string;
        apellido: string;
        email: string;
        password: string;
        rol?: string;
    }): Promise<{
        token: string;
        usuario: {
            id: number;
            rut: string;
            nombre: string;
            apellido: string;
            email: string;
            rol: string;
        };
    }>;
    logout(token: string): Promise<void>;
    verifyToken(token: string): Promise<import("hono/utils/jwt/types").JWTPayload>;
}
//# sourceMappingURL=AuthService.d.ts.map