import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockRepo = vi.hoisted(() => ({
  getAllTeachers: vi.fn(),
  findTeacherByRut: vi.fn(),
  findTeacherByEmail: vi.fn(),
  createTeacher: vi.fn(),
  updateTeacher: vi.fn(),
  deleteTeacher: vi.fn(),
}));

vi.mock('../repositories/ProfesoresRepository.js', () => ({
  ProfesoresRepository: function () { return mockRepo; },
}));

import { ProfesoresService } from '../services/ProfesoresService.js';

describe('ProfesoresService', () => {
  let service: ProfesoresService;

  beforeEach(() => {
    service = new ProfesoresService();
    vi.clearAllMocks();
  });

  describe('getAllTeachers', () => {
    it('should return all teachers', async () => {
      mockRepo.getAllTeachers.mockResolvedValue([{ rut: '12345678', nombre: 'Pedro' }]);
      const result = await service.getAllTeachers();
      expect(result).toHaveLength(1);
    });
  });

  describe('getTeacherByRut', () => {
    it('should return teacher by RUT', async () => {
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
    it('should authenticate with valid credentials', async () => {
      const teacher = { email: 'teacher@test.com', password: 'pass123', rut: '12345678', nombre: 'Pedro', apellido: 'Gomez' };
      mockRepo.findTeacherByEmail.mockResolvedValue(teacher);
      const result = await service.authenticateTeacher('teacher@test.com', 'pass123');
      expect(result).toBeDefined();
      expect(result).not.toHaveProperty('password');
    });

    it('should throw on wrong password', async () => {
      mockRepo.findTeacherByEmail.mockResolvedValue({ email: 'teacher@test.com', password: 'pass123' });
      await expect(service.authenticateTeacher('teacher@test.com', 'wrongpass')).rejects.toThrow('Contraseña incorrecta');
    });

    it('should throw on empty email', async () => {
      await expect(service.authenticateTeacher('', 'pass123')).rejects.toThrow('El email es obligatorio');
    });
  });

  describe('createTeacher', () => {
    const validData = { rut: '12345678', dv: '5', nombre: 'Pedro', apellido: 'Gomez', email: 'pedro@test.com', password: '123456', materia: 'Matematicas' };

    it('should create teacher with valid data', async () => {
      await service.createTeacher(validData);
      expect(mockRepo.createTeacher).toHaveBeenCalledWith(validData);
    });

    it('should throw on missing RUT', async () => {
      await expect(service.createTeacher({ ...validData, rut: '' })).rejects.toThrow('El RUT es obligatorio');
    });

    it('should throw on missing DV', async () => {
      await expect(service.createTeacher({ ...validData, dv: '' })).rejects.toThrow('El dígito verificador es obligatorio');
    });

    it('should throw on missing name', async () => {
      await expect(service.createTeacher({ ...validData, nombre: '' })).rejects.toThrow('El nombre es obligatorio');
    });
  });

  describe('updateTeacher', () => {
    it('should update teacher', async () => {
      await service.updateTeacher('12345678', { nombre: 'Nuevo' });
      expect(mockRepo.updateTeacher).toHaveBeenCalledWith('12345678', { nombre: 'Nuevo' });
    });

    it('should throw on empty RUT', async () => {
      await expect(service.updateTeacher('', { nombre: 'Nuevo' })).rejects.toThrow('El RUT es requerido');
    });
  });

  describe('deleteTeacher', () => {
    it('should delete teacher', async () => {
      await service.deleteTeacher('12345678');
      expect(mockRepo.deleteTeacher).toHaveBeenCalledWith('12345678');
    });

    it('should throw on empty RUT', async () => {
      await expect(service.deleteTeacher('')).rejects.toThrow('El RUT es requerido');
    });
  });
});
