import { JWTPayload } from 'hono/utils/jwt/types';
import { UserPayload } from '../types/UserPayload.js';
import { UserRegister } from '../types/UserRegister.js';

export interface AuthServiceContract {
  login(identifier: string, password: string): Promise<UserPayload>;
  register(data: UserRegister): Promise<UserPayload>;
  logout(token: string): Promise<void>;
  verifyToken(token: string): Promise<JWTPayload>;
}