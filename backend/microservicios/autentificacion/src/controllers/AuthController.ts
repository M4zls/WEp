import { Hono } from 'hono';
import { AuthService } from '../services/AuthService.js';
import { loginAuthSchema, registerSchema } from '../dtos/AuthDto.js';
import { ErrorBuilder } from '../common/ErrorBuilder.js';
import { HTTPStatusCode } from '../common/Consts.js';

/**
 * Controller HTTP de autenticación.
 * Expone rutas para login, registro, cierre de sesión y verificación de token.
 */
const auth = new Hono();
const service = new AuthService();

/**
 * Inicia sesión de un usuario usando email o RUT.
 * @route POST /auth/login
 * @param {import('hono').Context} c - Contexto HTTP de Hono.
 * @returns {Promise<Response>} Respuesta con el token y los datos del usuario.
 */
auth.post('/login', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = loginAuthSchema.safeParse(body);
    if (!parsed.success) {
        return c.json(ErrorBuilder.getEntityFromErrorParsed(parsed), { status: HTTPStatusCode.BAD_REQUEST });
    }
    const { identifier, password } = parsed.data;
    const result = await service.login(identifier, password);
       return c.json(result, { status: HTTPStatusCode.SUCCESS });
  } catch (err: any) {
       return c.json({ error: err.message }, { status: HTTPStatusCode.UNAUTHORIZED });
  }
});

/**
 * Registra un usuario nuevo y genera su sesión inicial.
 * @route POST /auth/register
 * @param {import('hono').Context} c - Contexto HTTP de Hono.
 * @returns {Promise<Response>} Respuesta con el token y los datos del usuario.
 */
auth.post('/register', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
        return c.json(ErrorBuilder.getEntityFromErrorParsed(parsed), { status: HTTPStatusCode.BAD_REQUEST });
    }

    const result = await service.register(parsed.data);
       return c.json(result, { status: HTTPStatusCode.CREATED });
  } catch (err: any) {
       return c.json({ error: err.message }, { status: HTTPStatusCode.BAD_REQUEST });
  }
});

/**
 * Cierra la sesión asociada al token enviado en el encabezado Authorization.
 * @route POST /auth/logout
 * @param {import('hono').Context} c - Contexto HTTP de Hono.
 * @returns {Promise<Response>} Confirmación de cierre de sesión.
 */
auth.post('/logout', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return c.json({ error: 'Token no proporcionado' }, { status: HTTPStatusCode.UNAUTHORIZED });
    }
    const token = authHeader.slice(7);
    await service.logout(token);
       return c.json({ message: 'Sesión cerrada correctamente' }, { status: HTTPStatusCode.SUCCESS });
  } catch (err: any) {
       return c.json({ error: err.message }, { status: HTTPStatusCode.BAD_REQUEST });
  }
});

/**
 * Verifica la validez de un token JWT y su sesión activa.
 * @route GET /auth/verify
 * @param {import('hono').Context} c - Contexto HTTP de Hono.
 * @returns {Promise<Response>} Resultado de verificación del token.
 */
auth.get('/verify', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return c.json({ error: 'Token no proporcionado' }, { status: HTTPStatusCode.UNAUTHORIZED });
    }
    const token = authHeader.slice(7);
    const payload = await service.verifyToken(token);
       return c.json({ valid: true, payload }, { status: HTTPStatusCode.SUCCESS });
  } catch (err: any) {
       return c.json({ valid: false, error: err.message }, { status: HTTPStatusCode.UNAUTHORIZED });
  }
});

export default auth;
