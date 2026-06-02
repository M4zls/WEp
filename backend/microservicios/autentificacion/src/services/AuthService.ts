import { sign, verify } from 'hono/jwt';
import { AuthRepository } from '../repositories/AuthRepository.js';
import { UserPayload } from '../types/UserPayload.js';
import { AuthServiceInterface } from './AuthService.interface.js';
import { Utils } from '../common/Utils.js';
import { Consts } from '../common/Consts.js';
import { UserRegister } from '../types/UserRegister.js';

const repo = new AuthRepository();

export class AuthService implements AuthServiceInterface {
  async login(identifier: string, password: string): Promise<UserPayload> {
    // Detectar si es email o RUT
    const isEmail = identifier.includes('@');
    const usuario = isEmail
      ? await repo.findByEmail(identifier)
      : await repo.findByRut(identifier);

    if (!usuario) throw new Error('Credenciales inválidas');
    if (!usuario.activo) throw new Error('Usuario desactivado');

    const valid = await Utils.verifyPassword(password, usuario.password);
    if (!valid) throw new Error('Credenciales inválidas');

    const payload = Utils.buildPayload(usuario);
    const token = await sign(payload, Consts.JWT_SECRET);

    // Guardar sesión en DB
    const expiresAt = new Date(Date.now() + Consts.JWT_EXPIRES_IN * 1000).toISOString();
    await repo.guardarSesion(usuario.id, token, expiresAt);

    return Utils.buildLoginResponse(token, usuario);
  }

  async register(data: UserRegister) {
    const existeEmail = await repo.findByEmail(data.email);
    if (existeEmail) throw new Error('El email ya está registrado');

    const existeRut = await repo.findByRut(data.rut);
    if (existeRut) throw new Error('El RUT ya está registrado');

    const hashedPassword = await Utils.hashPassword(data.password);
    const usuario = await repo.createUsuario({ ...data, password: hashedPassword });

    const payload = Utils.buildPayload(usuario);
    const token = await sign(payload, Consts.JWT_SECRET);

    const expiresAt = new Date(Date.now() + Consts.JWT_EXPIRES_IN * 1000).toISOString();
    await repo.guardarSesion(usuario.id, token, expiresAt);

    return Utils.buildLoginResponse(token, usuario);
  }

  async logout(token: string) {
    await repo.deleteSesion(token);
  }

  async verifyToken(token: string) {
    // Verificar firma JWT
    // Pass an empty options object to satisfy the verify signature
    const payload = await verify(token, Consts.JWT_SECRET, {} as any);

    // Verificar que la sesión exista en DB (no fue cerrada)
    const sesion = await repo.findSesion(token);
    if (!sesion) throw new Error('Sesión no encontrada o cerrada');

    // Verificar expiración de sesión en DB
    if (new Date(sesion.expiresAt) < new Date()) {
      await repo.deleteSesion(token);
      throw new Error('Sesión expirada');
    }

    return payload;
  }
}