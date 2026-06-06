import { sign, verify } from 'hono/jwt';
import { AuthRepository } from '../repositories/AuthRepository.js';
import { UserPayload } from '../types/UserPayload.js';
import { AuthServiceContract } from './AuthServiceContract.js';
import { Utils } from '../common/Utils.js';
import { Consts } from '../common/Consts.js';
import { UserRegister } from '../types/UserRegister.js';

const repo = new AuthRepository();

/**
 * Servicio de autenticación que coordina login, registro, cierre y verificación de sesiones.
 */
export class AuthService implements AuthServiceContract {
  /**
   * Inicia sesión con email o RUT.
   * @param {string} identifier - Email o RUT del usuario.
   * @param {string} password - Contraseña del usuario.
   * @returns {Promise<UserPayload>} Información del usuario autenticado y token.
   */
  async login(identifier: string, password: string): Promise<UserPayload> {
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

    const expiresAt = new Date(Date.now() + Consts.JWT_EXPIRES_IN * 1000).toISOString();
    await repo.guardarSesion(usuario.id, token, expiresAt);

    return Utils.buildLoginResponse(token, usuario);
  }

  /**
   * Registra un usuario nuevo y crea su sesión inicial.
   * @param {UserRegister} data - Datos para crear el usuario.
   * @returns {Promise<any>} Respuesta de login con token y usuario.
   */
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

  /**
   * Cierra una sesión usando su token.
   * @param {string} token - Token de la sesión a cerrar.
   * @returns {Promise<void>} Resuelve cuando la sesión se elimina.
   */
  async logout(token: string) {
    await repo.deleteSesion(token);
  }

  /**
   * Verifica un token y confirma que la sesión siga activa.
   * @param {string} token - Token JWT a verificar.
   * @returns {Promise<any>} Payload del JWT verificado.
   */
  async verifyToken(token: string) {
    const payload = await verify(token, Consts.JWT_SECRET, {} as any);

    const sesion = await repo.findSesion(token);
    if (!sesion) throw new Error('Sesión no encontrada o cerrada');

    if (new Date(sesion.expiresAt) < new Date()) {
      await repo.deleteSesion(token);
      throw new Error('Sesión expirada');
    }

    return payload;
  }
}