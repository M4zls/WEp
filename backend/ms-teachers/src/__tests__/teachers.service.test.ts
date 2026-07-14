import { describe, it, expect, mock, beforeEach } from 'bun:test';

const mockRepo = {
  getAllTeachers: mock(() => undefined),
  findTeacherByRut: mock(() => undefined),
  findTeacherByEmail: mock(() => undefined),
  createTeacher: mock(() => undefined),
  updateTeacher: mock(() => undefined),
  deleteTeacher: mock(() => undefined),
};

mock.module('../models/data.js', () => ({ getDatabaseInstance: () => ({}) }));
mock.module('../repositories/teachers.repository.js', () => ({
  TeachersRepository: function () { return mockRepo; },
}));

mock.module('../common/utils.js', () => ({
  hashPassword: mock((password: string) => {
    if (password === 'pass123') return '$2a$10$correct';
    return '$2a$10$wrong';
  }),
  comparePassword: mock((plain: string, hashed: string) => {
    return plain === 'pass123' && hashed === '$2a$10$correct';
  }),
}));

const { TeachersService } = await import('../services/teachers.service.js');

describe('TeachersService', () => {
  let service: TeachersService;

  beforeEach(() => {
    service = new TeachersService();
    for (const key of Object.keys(mockRepo) as (keyof typeof mockRepo)[]) {
      mockRepo[key].mockClear();
    }
  });

  describe('getAllTeachers', () => {
    it('should return all teachers', async () => {
      mockRepo.getAllTeachers.mockResolvedValue([{ rut: '12345678', name: 'Pedro' }]);
      const result = await service.getAllTeachers();
      expect(result).toHaveLength(1);
    });
  });

  describe('getTeacherByRut', () => {
    it('should return by RUT', async () => {
      mockRepo.findTeacherByRut.mockResolvedValue({ rut: '12345678', name: 'Pedro' });
      const result = await service.getTeacherByRut('12345678');
      expect(result).toBeDefined();
    });
    it('should throw on not found', async () => {
      mockRepo.findTeacherByRut.mockResolvedValue(null);
      await expect(service.getTeacherByRut('00000000')).rejects.toThrow('Profesor no encontrado');
    });
  });

  describe('authenticateTeacher', () => {
    it('should authenticate', async () => {
      const t = { email: 't@test.com', password: '$2a$10$correct', rut: '12345678', name: 'Pedro', lastName: 'Gomez' };
      mockRepo.findTeacherByEmail.mockResolvedValue(t);
      const r = await service.authenticateTeacher('t@test.com', 'pass123');
      expect(r).toBeDefined();
      expect(r).not.toHaveProperty('password');
    });
    it('should throw on wrong password', async () => {
      mockRepo.findTeacherByEmail.mockResolvedValue({ email: 't@test.com', password: '$2a$10$correct' });
      await expect(service.authenticateTeacher('t@test.com', 'wrong')).rejects.toThrow('Invalid password');
    });
  });

  describe('createTeacher', () => {
    const valid = { rut: '12345678', dv: '5', name: 'Pedro', lastName: 'Gomez', email: 'pedro@test.com', password: '123456', subject: 'Matematicas' };
    it('should create', async () => {
      await service.createTeacher(valid);
      expect(mockRepo.createTeacher).toHaveBeenCalledWith({ ...valid, password: '$2a$10$wrong' });
    });
  });

  describe('updateTeacher', () => {
    it('should update', async () => {
      await service.updateTeacher('12345678', { name: 'Nuevo' });
      expect(mockRepo.updateTeacher).toHaveBeenCalled();
    });
  });

  describe('deleteTeacher', () => {
    it('should delete', async () => {
      await service.deleteTeacher('12345678');
      expect(mockRepo.deleteTeacher).toHaveBeenCalled();
    });
  });
});
