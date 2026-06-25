import { describe, it, expect, mock, beforeEach } from 'bun:test';

const mockRepo = {
  findByStudentRut: mock(() => undefined),
  findByCursoAndProfesor: mock(() => undefined),
  findByProfesorRut: mock(() => undefined),
  findById: mock(() => undefined),
  findByStudentRutAndSubject: mock(() => undefined),
  create: mock(() => undefined),
  update: mock(() => undefined),
  delete: mock(() => undefined),
};

mock.module('../models/data.js', () => ({ getDatabaseInstance: () => ({}) }));
mock.module('../repositories/grades.repository.js', () => ({
  GradesRepository: function () { return mockRepo; },
}));

const { GradesService } = await import('../services/grades.service.js');

describe('GradesService', () => {
  let service: GradesService;

  beforeEach(() => {
    service = new GradesService();
    for (const key of Object.keys(mockRepo) as (keyof typeof mockRepo)[]) {
      mockRepo[key].mockClear();
    }
  });

  describe('getStudentGrades', () => {
    it('should return grouped grades', async () => {
      mockRepo.findByStudentRut.mockResolvedValue([
        { id: 1, studentRut: '12345678', subject: 'Matemáticas', curso: '3°A', grade: '6.5', evaluationType: 'prueba', date: '2026-03-15', professorRut: '11111111' },
        { id: 2, studentRut: '12345678', subject: 'Matemáticas', curso: '3°A', grade: '5.0', evaluationType: 'tarea', date: '2026-04-01', professorRut: '11111111' },
        { id: 3, studentRut: '12345678', subject: 'Lenguaje', curso: '3°A', grade: '6.0', evaluationType: 'prueba', date: '2026-03-20', professorRut: '22222222' },
      ]);
      const result = await service.getStudentGrades('12345678');
      expect(result).toBeDefined();
      expect(result!.subjects).toHaveLength(2);
      expect(result!.curso).toBe('3°A');
    });

    it('should throw error with empty RUT', async () => {
      await expect(service.getStudentGrades('')).rejects.toThrow('El RUT del estudiante es obligatorio');
    });

    it('should throw error if no grades found', async () => {
      mockRepo.findByStudentRut.mockResolvedValue([]);
      await expect(service.getStudentGrades('00000000')).rejects.toThrow('Estudiante no encontrado');
    });
  });

  describe('getCourseGrades', () => {
    it('should return course grades filtered by professor', async () => {
      mockRepo.findByCursoAndProfesor.mockResolvedValue([
        { id: 1, studentRut: '23232323', subject: 'Matemáticas', curso: '3°A', grade: '6.5', evaluationType: 'prueba', date: '2026-03-15', professorRut: '11111111' },
      ]);
      const result = await service.getCourseGrades('3°A', '11111111');
      expect(result).toHaveLength(1);
    });

    it('should throw error with empty course', async () => {
      await expect(service.getCourseGrades('', '11111111')).rejects.toThrow('El curso es requerido');
    });
  });

  describe('createGrade', () => {
    const valid = { studentRut: '12345678', subject: 'Matemáticas', curso: '3°A', grade: '6.5', evaluationType: 'prueba', date: '2026-03-15', professorRut: '11111111' };

    it('should create a valid grade', async () => {
      await service.createGrade(valid);
      expect(mockRepo.create).toHaveBeenCalledWith(valid);
    });

    it('should throw error with grade out of range', async () => {
      await expect(service.createGrade({ ...valid, grade: '10.0' })).rejects.toThrow('La nota debe estar entre 1.0 y 7.0');
    });
  });

  describe('updateGrade', () => {
    it('should update an existing grade', async () => {
      mockRepo.findById.mockResolvedValue({ id: 1 });
      await service.updateGrade(1, { grade: '7.0' });
      expect(mockRepo.update).toHaveBeenCalledWith(1, { grade: '7.0' });
    });

    it('should throw error if grade not found', async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.updateGrade(999, { grade: '7.0' })).rejects.toThrow('Nota no encontrada');
    });
  });

  describe('deleteGrade', () => {
    it('should delete an existing grade', async () => {
      mockRepo.findById.mockResolvedValue({ id: 1 });
      await service.deleteGrade(1);
      expect(mockRepo.delete).toHaveBeenCalledWith(1);
    });

    it('should throw error if grade not found', async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.deleteGrade(999)).rejects.toThrow('Nota no encontrada');
    });
  });

  describe('createGradesBatch', () => {
    it('should create multiple grades', async () => {
      const grades = [
        { studentRut: '11111111', subject: 'Matemáticas', curso: '3°A', grade: '6.5', evaluationType: 'prueba', date: '2026-03-15', professorRut: '22222222' },
        { studentRut: '33333333', subject: 'Lenguaje', curso: '3°A', grade: '5.0', evaluationType: 'tarea', date: '2026-04-01', professorRut: '22222222' },
      ];
      await service.createGradesBatch(grades);
      expect(mockRepo.create).toHaveBeenCalledTimes(2);
      expect(mockRepo.create).toHaveBeenCalledWith(grades[0]);
      expect(mockRepo.create).toHaveBeenCalledWith(grades[1]);
    });
  });

  describe('getTeacherGrades', () => {
    it('should return professor grades', async () => {
      mockRepo.findByProfesorRut.mockResolvedValue([{ id: 1 }]);
      const result = await service.getTeacherGrades('11111111');
      expect(result).toHaveLength(1);
    });

    it('should throw error with empty RUT', async () => {
      await expect(service.getTeacherGrades('')).rejects.toThrow('El RUT del profesor es obligatorio');
    });
  });
});
