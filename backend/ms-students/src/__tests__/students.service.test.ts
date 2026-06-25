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
mock.module('../repositories/students.repository.js', () => ({
  StudentsRepository: function () { return mockRepo; },
}));

mock.module('../common/utils.js', () => ({
  hashPassword: mock((password: string) => {
    if (password === 'pass123') return '$2a$10$correct';
    return '$2a$10$wrong';
  }),
}));

const { StudentsService } = await import('../services/students.service.js');

describe('StudentsService', () => {
  let service: StudentsService;

  beforeEach(() => {
    service = new StudentsService();
    for (const key of Object.keys(mockRepo) as (keyof typeof mockRepo)[]) {
      mockRepo[key].mockClear();
    }
  });

  describe('getAllStudents', () => {
    it('should return all students', async () => {
      mockRepo.getAllStudents.mockResolvedValue([{ rut: '12345678', name: 'Juan' }]);
      const result = await service.getAllStudents();
      expect(result).toHaveLength(1);
    });
  });

  describe('getStudentByRut', () => {
    it('should return student by RUT', async () => {
      mockRepo.findStudentByRut.mockResolvedValue({ rut: '12345678', name: 'Juan' });
      const result = await service.getStudentByRut('12345678');
      expect(result).toBeDefined();
    });
    it('should throw on not found', async () => {
      mockRepo.findStudentByRut.mockResolvedValue(null);
      await expect(service.getStudentByRut('00000000')).rejects.toThrow('Estudiante no encontrado');
    });
  });

  describe('authenticateStudent', () => {
    it('should authenticate', async () => {
      const s = { email: 'test@test.com', password: '$2a$10$correct', rut: '12345678', name: 'Juan', lastName: 'Perez' };
      mockRepo.findStudentByEmail.mockResolvedValue(s);
      const result = await service.authenticateStudent('test@test.com', 'pass123');
      expect(result.estudiante).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.estudiante).not.toHaveProperty('password');
    });
    it('should throw on wrong password', async () => {
      mockRepo.findStudentByEmail.mockResolvedValue({ email: 'test@test.com', password: '$2a$10$correct' });
      await expect(service.authenticateStudent('test@test.com', 'wrongpass')).rejects.toThrow('Contraseña incorrecta');
    });
  });

  describe('createStudent', () => {
    const valid = { rut: '12345678', dv: '5', name: 'Carlos', lastName: 'Muñoz', courses: '1A', email: 'carlos@test.com', password: '123456' };
    it('should create', async () => {
      mockRepo.findStudentByRut.mockResolvedValue(null);
      await service.createStudent(valid);
      expect(mockRepo.createStudent).toHaveBeenCalledWith({ ...valid, password: '$2a$10$wrong' });
    });
    it('should throw on duplicate RUT', async () => {
      mockRepo.findStudentByRut.mockResolvedValue({ rut: '12345678' });
      await expect(service.createStudent(valid)).rejects.toThrow('Ya existe un estudiante con ese RUT');
    });
  });

  describe('updateStudent', () => {
    it('should update existing', async () => {
      mockRepo.findStudentByRut.mockResolvedValue({ rut: '12345678' });
      await service.updateStudent('12345678', { name: 'Nuevo' });
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
