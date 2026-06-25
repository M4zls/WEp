import { JWTPayload } from 'hono/utils/jwt/types';
import { UserPayload } from '../types/user.payload.js';
import { UserRegister } from '../types/user.register.js';

export interface AuthServiceContract {
  login(identifier: string, password: string): Promise<UserPayload>;
  register(data: UserRegister): Promise<UserPayload>;
  logout(token: string): Promise<void>;
  verifyToken(token: string): Promise<JWTPayload>;
}
