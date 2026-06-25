import { sign, verify } from 'hono/jwt';
import { AuthRepository } from '../repositories/AuthRepository.js';
import type { IAuthRepository } from '../repositories/auth.repository.interface.js';
import { UserPayload } from '../types/user.payload.js';
import { AuthServiceContract } from './auth-service.contract.js';
import { Utils } from '../common/utils.js';
import { Consts } from '../common/consts.js';
import { UserRegister } from '../types/user.register.js';

/**
 * Servicio de autenticación que coordina login, registro, cierre y verificación de sesiones.
 */
export class AuthService implements AuthServiceContract {
  private repo: IAuthRepository;
  constructor(repo?: IAuthRepository) { this.repo = repo ?? new AuthRepository(); }
  /**
   * Inicia sesión con email o RUT.
   * @param {string} identifier - Email o RUT del usuario.
   * @param {string} password - Contraseña del usuario.
   * @returns {Promise<UserPayload>} Información del usuario autenticado y token.
   */
  async login(identifier: string, password: string): Promise<UserPayload> {
    const isEmail = identifier.includes('@');
    const user = isEmail
      ? await this.repo.findByEmail(identifier)
      : await this.repo.findByRut(identifier);

    if (!user) throw new Error('Credenciales inválidas');
    if (!user.activo) throw new Error('Usuario desactivado');

    const valid = await Utils.verifyPassword(password, user.password);
    if (!valid) throw new Error('Credenciales inválidas');

    const payload = Utils.buildPayload(user);
    const token = await sign(payload, Consts.JWT_SECRET);

    const expiresAt = new Date(Date.now() + Consts.JWT_EXPIRES_IN * 1000).toISOString();
    await this.repo.saveSession(user.id, token, expiresAt);

    return Utils.buildLoginResponse(token, user);
  }

  /**
   * Registra un usuario nuevo y crea su sesión inicial.
   * @param {UserRegister} data - Datos para crear el usuario.
   * @returns {Promise<any>} Respuesta de login con token y usuario.
   */
  async register(data: UserRegister) {
    const existeEmail = await this.repo.findByEmail(data.email);
    if (existeEmail) throw new Error('El email ya está registrado');

    const existeRut = await this.repo.findByRut(data.rut);
    if (existeRut) throw new Error('El RUT ya está registrado');

    const hashedPassword = await Utils.hashPassword(data.password);
    const user = await this.repo.createUser({ ...data, password: hashedPassword });

    const payload = Utils.buildPayload(user);
    const token = await sign(payload, Consts.JWT_SECRET);

    const expiresAt = new Date(Date.now() + Consts.JWT_EXPIRES_IN * 1000).toISOString();
    await this.repo.saveSession(user.id, token, expiresAt);

    return Utils.buildLoginResponse(token, user);
  }

  /**
   * Cierra una sesión usando su token.
   * @param {string} token - Token de la sesión a cerrar.
   * @returns {Promise<void>} Resuelve cuando la sesión se elimina.
   */
  async logout(token: string) {
    await this.repo.deleteSession(token);
  }

  /**
   * Verifica un token y confirma que la sesión siga activa.
   * @param {string} token - Token JWT a verificar.
   * @returns {Promise<any>} Payload del JWT verificado.
   */
  async verifyToken(token: string) {
    const payload = await verify(token, Consts.JWT_SECRET, {} as any);

    const session = await this.repo.findSession(token);
    if (!session) throw new Error('Sesión no encontrada o cerrada');

    if (new Date(session.expiresAt) < new Date()) {
      await this.repo.deleteSession(token);
      throw new Error('Sesión expirada');
    }

    return payload;
  }
}
