import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockRepo = vi.hoisted(() => ({
  getAllStudents: vi.fn(),
  findStudentByRut: vi.fn(),
  findStudentByEmail: vi.fn(),
  createStudent: vi.fn(),
  updateStudent: vi.fn(),
  deleteStudent: vi.fn(),
  findStudentsByCourse: vi.fn(),
}));

vi.mock('../repositories/EstudiantesRepository.js', () => ({
  EstudiantesRepository: function () { return mockRepo; },
}));

import { EstudiantesService } from '../services/EstudiantesService.js';

describe('EstudiantesService', () => {
  let service: EstudiantesService;

  beforeEach(() => {
    service = new EstudiantesService();
    vi.clearAllMocks();
  });

  describe('getAllStudents', () => {
    it('should return all students', async () => {
      mockRepo.getAllStudents.mockResolvedValue([{ rut: '12345678', nombre: 'Juan' }]);
      const result = await service.getAllStudents();
      expect(result).toHaveLength(1);
    });
  });

  describe('getStudentByRut', () => {
    it('should return student by RUT', async () => {
      mockRepo.findStudentByRut.mockResolvedValue({ rut: '12345678', nombre: 'Juan' });
      const result = await service.getStudentByRut('12345678');
      expect(result).toBeDefined();
    });

    it('should throw on empty RUT', async () => {
      await expect(service.getStudentByRut('')).rejects.toThrow('El RUT es requerido');
    });

    it('should throw on not found', async () => {
      mockRepo.findStudentByRut.mockResolvedValue(null);
      await expect(service.getStudentByRut('00000000')).rejects.toThrow('Estudiante no encontrado');
    });
  });

  describe('authenticateStudent', () => {
    it('should authenticate with valid credentials', async () => {
      const student = { email: 'test@test.com', password: 'pass123', rut: '12345678', nombre: 'Juan', apellido: 'Perez' };
      mockRepo.findStudentByEmail.mockResolvedValue(student);
      const result = await service.authenticateStudent('test@test.com', 'pass123');
      expect(result).toBeDefined();
      expect(result).not.toHaveProperty('password');
    });

    it('should throw on wrong password', async () => {
      mockRepo.findStudentByEmail.mockResolvedValue({ email: 'test@test.com', password: 'pass123' });
      await expect(service.authenticateStudent('test@test.com', 'wrongpass')).rejects.toThrow('Contraseña incorrecta');
    });

    it('should throw on empty email', async () => {
      await expect(service.authenticateStudent('', 'pass123')).rejects.toThrow('El email es obligatorio');
    });
  });

  describe('createStudent', () => {
    const validData = { rut: '12345678', dv: '5', nombre: 'Carlos', apellido: 'Muñoz', cursos: '1A', email: 'carlos@test.com', password: '123456' };

    it('should create student with valid data', async () => {
      mockRepo.findStudentByRut.mockResolvedValue(null);
      await service.createStudent(validData);
      expect(mockRepo.createStudent).toHaveBeenCalledWith(validData);
    });

    it('should throw on missing RUT', async () => {
      await expect(service.createStudent({ ...validData, rut: '' })).rejects.toThrow('El RUT es obligatorio');
    });

    it('should throw on missing DV', async () => {
      await expect(service.createStudent({ ...validData, dv: '' })).rejects.toThrow('El dígito verificador es obligatorio');
    });

    it('should throw on invalid RUT format', async () => {
      await expect(service.createStudent({ ...validData, rut: '123' })).rejects.toThrow('El RUT debe tener entre 7 y 8 dígitos numéricos');
    });

    it('should throw on duplicate RUT', async () => {
      mockRepo.findStudentByRut.mockResolvedValue({ rut: '12345678' });
      await expect(service.createStudent(validData)).rejects.toThrow('Ya existe un estudiante con ese RUT');
    });
  });

  describe('updateStudent', () => {
    it('should update existing student', async () => {
      mockRepo.findStudentByRut.mockResolvedValue({ rut: '12345678' });
      await service.updateStudent('12345678', { nombre: 'Nuevo' });
      expect(mockRepo.updateStudent).toHaveBeenCalledWith('12345678', { nombre: 'Nuevo' });
    });

    it('should throw on not found', async () => {
      mockRepo.findStudentByRut.mockResolvedValue(null);
      await expect(service.updateStudent('00000000', { nombre: 'Nuevo' })).rejects.toThrow('Estudiante no encontrado');
    });
  });

  describe('deleteStudent', () => {
    it('should delete existing student', async () => {
      mockRepo.findStudentByRut.mockResolvedValue({ rut: '12345678' });
      await service.deleteStudent('12345678');
      expect(mockRepo.deleteStudent).toHaveBeenCalledWith('12345678');
    });

    it('should throw on not found', async () => {
      mockRepo.findStudentByRut.mockResolvedValue(null);
      await expect(service.deleteStudent('00000000')).rejects.toThrow('Estudiante no encontrado');
    });
  });

  describe('getStudentsByCourse', () => {
    it('should return students by course', async () => {
      mockRepo.findStudentsByCourse.mockResolvedValue([{ rut: '12345678', cursos: '1A' }]);
      const result = await service.getStudentsByCourse('1A');
      expect(result).toHaveLength(1);
    });

    it('should throw on empty course', async () => {
      await expect(service.getStudentsByCourse('')).rejects.toThrow('El curso es obligatorio');
    });
  });
});
