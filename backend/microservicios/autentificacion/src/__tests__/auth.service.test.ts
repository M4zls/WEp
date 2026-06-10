import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockRepo = vi.hoisted(() => ({
  findByEmail: vi.fn(),
  findByRut: vi.fn(),
  createUsuario: vi.fn(),
  guardarSesion: vi.fn(),
  deleteSesion: vi.fn(),
  findSesion: vi.fn(),
}));

vi.mock('../repositories/AuthRepository.js', () => ({
  AuthRepository: function () { return mockRepo; },
}));

vi.mock('hono/jwt', () => ({
  sign: vi.fn(() => 'mock-token'),
  verify: vi.fn(() => ({ sub: 1, email: 'test@test.com' })),
}));

vi.mock('../common/Utils.js', () => ({
  Utils: {
    verifyPassword: vi.fn(() => true),
    hashPassword: vi.fn(() => 'hashed'),
    buildPayload: vi.fn(() => ({ sub: 1, email: 'test@test.com', rut: '12345678', rol: 'profesor' })),
    buildLoginResponse: vi.fn((token: string, usuario: any) => ({ token, usuario })),
  },
}));

import { AuthService } from '../services/AuthService.js';

describe('AuthService', () => {
  let service: AuthService;
  const mockUser = { id: 1, rut: '12345678', email: 'test@test.com', password: 'hashedpass', rol: 'profesor', nombre: 'Juan', apellido: 'Perez', activo: true };

  beforeEach(() => {
    service = new AuthService();
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should login with email', async () => {
      mockRepo.findByEmail.mockResolvedValue(mockUser);
      mockRepo.guardarSesion.mockResolvedValue(undefined);

      const result = await service.login('test@test.com', '123456');
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('usuario');
      expect(mockRepo.findByEmail).toHaveBeenCalledWith('test@test.com');
    });

    it('should login with RUT', async () => {
      mockRepo.findByRut.mockResolvedValue(mockUser);
      mockRepo.guardarSesion.mockResolvedValue(undefined);

      const result = await service.login('12345678', '123456');
      expect(result).toHaveProperty('token');
      expect(mockRepo.findByRut).toHaveBeenCalledWith('12345678');
    });

    it('should throw on invalid credentials', async () => {
      mockRepo.findByEmail.mockResolvedValue(null);
      await expect(service.login('bad@test.com', '123456')).rejects.toThrow('Credenciales inválidas');
    });

    it('should throw on inactive user', async () => {
      mockRepo.findByEmail.mockResolvedValue({ ...mockUser, activo: false });
      await expect(service.login('test@test.com', '123456')).rejects.toThrow('Usuario desactivado');
    });
  });

  describe('register', () => {
    const data = { rut: '12345678', dv: '5', nombre: 'Juan', apellido: 'Perez', email: 'new@test.com', password: '123456', rol: 'profesor' };

    it('should register a new user', async () => {
      mockRepo.findByEmail.mockResolvedValue(null);
      mockRepo.findByRut.mockResolvedValue(null);
      mockRepo.createUsuario.mockResolvedValue(mockUser);
      mockRepo.guardarSesion.mockResolvedValue(undefined);

      const result = await service.register(data);
      expect(result).toHaveProperty('token');
      expect(mockRepo.createUsuario).toHaveBeenCalled();
    });

    it('should throw on duplicate email', async () => {
      mockRepo.findByEmail.mockResolvedValue({ id: 1, email: 'existing@test.com' });
      await expect(service.register(data)).rejects.toThrow('El email ya está registrado');
    });

    it('should throw on duplicate RUT', async () => {
      mockRepo.findByEmail.mockResolvedValue(null);
      mockRepo.findByRut.mockResolvedValue({ id: 1, rut: '12345678' });
      await expect(service.register(data)).rejects.toThrow('El RUT ya está registrado');
    });
  });

  describe('logout', () => {
    it('should delete session', async () => {
      await service.logout('some-token');
      expect(mockRepo.deleteSesion).toHaveBeenCalledWith('some-token');
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', async () => {
      mockRepo.findSesion.mockResolvedValue({ expiresAt: new Date(Date.now() + 3600000).toISOString() });
      const result = await service.verifyToken('valid-token');
      expect(result).toHaveProperty('sub');
    });

    it('should throw on expired session', async () => {
      mockRepo.findSesion.mockResolvedValue({ expiresAt: new Date(Date.now() - 3600000).toISOString() });
      await expect(service.verifyToken('expired-token')).rejects.toThrow('Sesión expirada');
    });
  });
});
