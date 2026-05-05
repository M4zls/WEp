import { sign, verify } from 'hono/jwt';
import { AuthRepository } from '../repositories/AuthRepository.js';

const repo = new AuthRepository();
const JWT_SECRET = process.env.JWT_SECRET ?? 'colegio_ohiggins_secret_changeme';
const JWT_EXPIRES_IN = 60 * 60 * 24; // 24 horas

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function verifyPassword(plain: string, hashed: string): Promise<boolean> {
  return (await hashPassword(plain)) === hashed;
}

function buildPayload(usuario: { id: number; email: string; rut: string; rol: string; nombre: string; apellido: string }) {
  return {
    sub: usuario.id,
    email: usuario.email,
    rut: usuario.rut,
    rol: usuario.rol,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    exp: Math.floor(Date.now() / 1000) + JWT_EXPIRES_IN,
  };
}

export class AuthService {
  // Login con email o RUT
  async login(identifier: string, password: string) {
    // Detectar si es email o RUT
    const isEmail = identifier.includes('@');
    const usuario = isEmail
      ? await repo.findByEmail(identifier)
      : await repo.findByRut(identifier);

    if (!usuario) throw new Error('Credenciales inválidas');
    if (!usuario.activo) throw new Error('Usuario desactivado');

    const valid = await verifyPassword(password, usuario.password);
    if (!valid) throw new Error('Credenciales inválidas');

    const payload = buildPayload(usuario);
    const token = await sign(payload, JWT_SECRET);

    // Guardar sesión en DB
    const expiresAt = new Date(Date.now() + JWT_EXPIRES_IN * 1000).toISOString();
    await repo.guardarSesion(usuario.id, token, expiresAt);

    return {
      token,
      usuario: {
        id: usuario.id,
        rut: usuario.rut,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol,
      },
    };
  }

  async register(data: {
    rut: string;
    dv: string;
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    rol?: string;
  }) {
    const existeEmail = await repo.findByEmail(data.email);
    if (existeEmail) throw new Error('El email ya está registrado');

    const existeRut = await repo.findByRut(data.rut);
    if (existeRut) throw new Error('El RUT ya está registrado');

    const hashedPassword = await hashPassword(data.password);
    const usuario = await repo.createUsuario({ ...data, password: hashedPassword });

    const payload = buildPayload(usuario);
    const token = await sign(payload, JWT_SECRET);

    const expiresAt = new Date(Date.now() + JWT_EXPIRES_IN * 1000).toISOString();
    await repo.guardarSesion(usuario.id, token, expiresAt);

    return {
      token,
      usuario: {
        id: usuario.id,
        rut: usuario.rut,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol,
      },
    };
  }

  async logout(token: string) {
    await repo.deleteSesion(token);
  }

  async verifyToken(token: string) {
    // Verificar firma JWT
    // Pass an empty options object to satisfy the verify signature
    const payload = await verify(token, JWT_SECRET, {} as any);

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