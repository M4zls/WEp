import { describe, it, expect, mock, beforeEach } from 'bun:test';

const mockRepo = {
  getAllStudents: mock(() => undefined),
  findStudentByRut: mock(() => undefined),
  findStudentByEmail: mock(() => undefined),
  createStudent: mock(() => undefined),
  updateStudent: mock(() => undefined),
  deleteStudent: mock(() => undefined),
  findStudentsByCourse: mock(() => undefined),
};

mock.module('../models/data.js', () => ({ getDatabaseInstance: () => ({}) }));
mock.module('../repositories/EstudiantesRepository.js', () => ({
  EstudiantesRepository: function () { return mockRepo; },
}));

const { EstudiantesService } = await import('../services/EstudiantesService.js');

describe('EstudiantesService', () => {
  let service: EstudiantesService;

  beforeEach(() => {
    service = new EstudiantesService();
    for (const key of Object.keys(mockRepo) as (keyof typeof mockRepo)[]) {
      mockRepo[key].mockClear();
    }
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
    it('should authenticate', async () => {
      const s = { email: 'test@test.com', password: 'pass123', rut: '12345678', nombre: 'Juan', apellido: 'Perez' };
      mockRepo.findStudentByEmail.mockResolvedValue(s);
      const result = await service.authenticateStudent('test@test.com', 'pass123');
      expect(result).toBeDefined();
      expect(result).not.toHaveProperty('password');
    });
    it('should throw on wrong password', async () => {
      mockRepo.findStudentByEmail.mockResolvedValue({ email: 'test@test.com', password: 'pass123' });
      await expect(service.authenticateStudent('test@test.com', 'wrongpass')).rejects.toThrow('Contraseña incorrecta');
    });
  });

  describe('createStudent', () => {
    const valid = { rut: '12345678', dv: '5', nombre: 'Carlos', apellido: 'Muñoz', cursos: '1A', email: 'carlos@test.com', password: '123456' };
    it('should create', async () => {
      mockRepo.findStudentByRut.mockResolvedValue(null);
      await service.createStudent(valid);
      expect(mockRepo.createStudent).toHaveBeenCalledWith(valid);
    });
    it('should throw on duplicate RUT', async () => {
      mockRepo.findStudentByRut.mockResolvedValue({ rut: '12345678' });
      await expect(service.createStudent(valid)).rejects.toThrow('Ya existe un estudiante con ese RUT');
    });
  });

  describe('updateStudent', () => {
    it('should update existing', async () => {
      mockRepo.findStudentByRut.mockResolvedValue({ rut: '12345678' });
      await service.updateStudent('12345678', { nombre: 'Nuevo' });
      expect(mockRepo.updateStudent).toHaveBeenCalled();
    });
    it('should throw on not found', async () => {
      mockRepo.findStudentByRut.mockResolvedValue(null);
      await expect(service.updateStudent('00000000', {})).rejects.toThrow('Estudiante no encontrado');
    });
  });

  describe('deleteStudent', () => {
    it('should delete existing', async () => {
      mockRepo.findStudentByRut.mockResolvedValue({ rut: '12345678' });
      await service.deleteStudent('12345678');
      expect(mockRepo.deleteStudent).toHaveBeenCalled();
    });
  });

  describe('getStudentsByCourse', () => {
    it('should return by course', async () => {
      mockRepo.findStudentsByCourse.mockResolvedValue([{ rut: '12345678' }]);
      const result = await service.getStudentsByCourse('1A');
      expect(result).toHaveLength(1);
    });
  });
});
