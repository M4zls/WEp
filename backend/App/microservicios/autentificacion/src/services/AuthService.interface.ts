import { JWTPayload } from "hono/utils/jwt/types";
import { UserPayload } from "../types/UserPayload";
import { UserRegister } from "../types/UserRegister";

export interface AuthServiceInterface {
    /**
     * Login con email o RUT
     * Funcion para iniciar sesión, requiere...
     * @param identifier 
     * @param password 
     */
    login(identifier: string, password: string): Promise<UserPayload>

    register(data: UserRegister): Promise<UserPayload>

    logout(token: string): Promise<void>

    verifyToken(token: string): Promise<JWTPayload>
}