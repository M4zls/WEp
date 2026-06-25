import { describe, it, expect, mock, beforeEach } from 'bun:test';

const mockRepo = {
  findByEmail: mock(() => undefined),
  findByRut: mock(() => undefined),
  createUser: mock(() => undefined),
  saveSession: mock(() => undefined),
  deleteSession: mock(() => undefined),
  findSession: mock(() => undefined),
};

mock.module('../models/data.js', () => ({
  getDatabaseInstance: () => ({}),
}));

mock.module('../repositories/AuthRepository.js', () => ({
  AuthRepository: function () { return mockRepo; },
}));

mock.module('hono/jwt', () => ({
  sign: mock(() => 'mock-token'),
  verify: mock(() => ({ sub: 1, email: 'test@test.com' })),
}));

mock.module('../common/utils.js', () => ({
  Utils: {
    verifyPassword: mock(() => true),
    hashPassword: mock(() => 'hashed'),
    buildPayload: mock(() => ({ sub: 1, email: 'test@test.com', rut: '12345678', rol: 'profesor' })),
    buildLoginResponse: mock((token: string, usuario: any) => ({ token, usuario })),
  },
}));

const { AuthService } = await import('../services/AuthService.js');

describe('AuthService', () => {
  let service: AuthService;
  const mockUser = { id: 1, rut: '12345678', email: 'test@test.com', password: 'hashedpass', rol: 'profesor', name: 'Juan', lastName: 'Perez', activo: true };

  beforeEach(() => {
    service = new AuthService();
    for (const key of Object.keys(mockRepo) as (keyof typeof mockRepo)[]) {
      mockRepo[key].mockClear();
    }
  });

  describe('login', () => {
    it('should login with email', async () => {
      mockRepo.findByEmail.mockResolvedValue(mockUser);
      mockRepo.saveSession.mockResolvedValue(undefined);

      const result = await service.login('test@test.com', '123456');
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('usuario');
      expect(mockRepo.findByEmail).toHaveBeenCalledWith('test@test.com');
    });

    it('should login with RUT', async () => {
      mockRepo.findByRut.mockResolvedValue(mockUser);
      mockRepo.saveSession.mockResolvedValue(undefined);

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
    const data = { rut: '12345678', dv: '5', name: 'Juan', lastName: 'Perez', email: 'new@test.com', password: '123456', rol: 'profesor' };

    it('should register a new user', async () => {
      mockRepo.findByEmail.mockResolvedValue(null);
      mockRepo.findByRut.mockResolvedValue(null);
      mockRepo.createUser.mockResolvedValue(mockUser);
      mockRepo.saveSession.mockResolvedValue(undefined);

      const result = await service.register(data);
      expect(result).toHaveProperty('token');
      expect(mockRepo.createUser).toHaveBeenCalled();
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
      expect(mockRepo.deleteSession).toHaveBeenCalledWith('some-token');
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', async () => {
      mockRepo.findSession.mockResolvedValue({ expiresAt: new Date(Date.now() + 3600000).toISOString() });
      const result = await service.verifyToken('valid-token');
      expect(result).toHaveProperty('sub');
    });

    it('should throw on expired session', async () => {
      mockRepo.findSession.mockResolvedValue({ expiresAt: new Date(Date.now() - 3600000).toISOString() });
      await expect(service.verifyToken('expired-token')).rejects.toThrow('Sesión expirada');
    });
  });
});
