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
mock.module('../repositories/ProfesoresRepository.js', () => ({
  ProfesoresRepository: function () { return mockRepo; },
}));

const { ProfesoresService } = await import('../services/ProfesoresService.js');

describe('ProfesoresService', () => {
  let service: ProfesoresService;

  beforeEach(() => {
    service = new ProfesoresService();
    for (const key of Object.keys(mockRepo) as (keyof typeof mockRepo)[]) {
      mockRepo[key].mockClear();
    }
  });

  describe('getAllTeachers', () => {
    it('should return all teachers', async () => {
      mockRepo.getAllTeachers.mockResolvedValue([{ rut: '12345678', nombre: 'Pedro' }]);
      const result = await service.getAllTeachers();
      expect(result).toHaveLength(1);
    });
  });

  describe('getTeacherByRut', () => {
    it('should return by RUT', async () => {
      mockRepo.findTeacherByRut.mockResolvedValue({ rut: '12345678', nombre: 'Pedro' });
      const result = await service.getTeacherByRut('12345678');
      expect(result).toBeDefined();
    });
    it('should throw on empty RUT', async () => {
      await expect(service.getTeacherByRut('')).rejects.toThrow('El RUT es requerido');
    });
    it('should throw on not found', async () => {
      mockRepo.findTeacherByRut.mockResolvedValue(null);
      await expect(service.getTeacherByRut('00000000')).rejects.toThrow('Profesor no encontrado');
    });
  });

  describe('authenticateTeacher', () => {
    it('should authenticate', async () => {
      const t = { email: 't@test.com', password: 'pass123', rut: '12345678', nombre: 'Pedro', apellido: 'Gomez' };
      mockRepo.findTeacherByEmail.mockResolvedValue(t);
      const r = await service.authenticateTeacher('t@test.com', 'pass123');
      expect(r).toBeDefined();
      expect(r).not.toHaveProperty('password');
    });
    it('should throw on wrong password', async () => {
      mockRepo.findTeacherByEmail.mockResolvedValue({ email: 't@test.com', password: 'pass123' });
      await expect(service.authenticateTeacher('t@test.com', 'wrong')).rejects.toThrow('Contraseña incorrecta');
    });
  });

  describe('createTeacher', () => {
    const valid = { rut: '12345678', dv: '5', nombre: 'Pedro', apellido: 'Gomez', email: 'pedro@test.com', password: '123456', materia: 'Matematicas' };
    it('should create', async () => {
      await service.createTeacher(valid);
      expect(mockRepo.createTeacher).toHaveBeenCalledWith(valid);
    });
    it('should throw on missing RUT', async () => {
      await expect(service.createTeacher({ ...valid, rut: '' })).rejects.toThrow('El RUT es obligatorio');
    });
  });

  describe('updateTeacher', () => {
    it('should update', async () => {
      await service.updateTeacher('12345678', { nombre: 'Nuevo' });
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
