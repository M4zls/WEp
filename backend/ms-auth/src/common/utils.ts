import bcrypt from 'bcryptjs';
import { User } from "../types/user";
import { Consts } from "./consts";

export class Utils {
    static async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    static async verifyPassword(plain: string, hashed: string): Promise<boolean> {
        return bcrypt.compare(plain, hashed);
    }

    static buildPayload(user: { id: number; email: string; rut: string; role: string; firstName: string; lastName: string }) {
        return {
            sub: user.id,
            email: user.email,
            rut: user.rut,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            exp: Math.floor(Date.now() / 1000) + Consts.JWT_EXPIRES_IN,
        };
    }

    static buildLoginResponse = (token: string, user: User) => ({
        token,
        user: {
            id: user.id,
            rut: user.rut,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        },
    })
}
