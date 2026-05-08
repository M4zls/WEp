import { User } from "../types/User";
import { Consts } from "./Consts";

export class Utils {
    static async hashPassword(password: string): Promise<string> {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hashBuffer))
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('');
    }

    static async verifyPassword(plain: string, hashed: string): Promise<boolean> {
        return (await Utils.hashPassword(plain)) === hashed;
    }

    static buildPayload(usuario: { id: number; email: string; rut: string; rol: string; nombre: string; apellido: string }) {
        return {
            sub: usuario.id,
            email: usuario.email,
            rut: usuario.rut,
            rol: usuario.rol,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            exp: Math.floor(Date.now() / 1000) + Consts.JWT_EXPIRES_IN,
        };
    }

    static buildLoginResponse = (token: string, usuario: User) => ({
        token,
        usuario: {
            id: usuario.id,
            rut: usuario.rut,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            rol: usuario.rol,
        },
    })
}