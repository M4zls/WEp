import { describe, it, expect, mock, beforeEach } from 'bun:test';

const mockRepo = {
  findByStudentRut: mock(() => undefined),
  findByCursoAndProfesor: mock(() => undefined),
  findByProfesorRut: mock(() => undefined),
  findById: mock(() => undefined),
  findByStudentRutAndAsignatura: mock(() => undefined),
  create: mock(() => undefined),
  update: mock(() => undefined),
  delete: mock(() => undefined),
};

mock.module('../models/data.js', () => ({ getDatabaseInstance: () => ({}) }));
mock.module('../repositories/NotasRepository.js', () => ({
  NotasRepository: function () { return mockRepo; },
}));

const { NotasService } = await import('../services/NotasService.js');

describe('NotasService', () => {
  let service: NotasService;

  beforeEach(() => {
    service = new NotasService();
    for (const key of Object.keys(mockRepo) as (keyof typeof mockRepo)[]) {
      mockRepo[key].mockClear();
    }
  });

  describe('getStudentGrades', () => {
    it('debe retornar calificaciones agrupadas', async () => {
      mockRepo.findByStudentRut.mockResolvedValue([
        { id: 1, estudianteRut: '12345678', asignatura: 'Matemáticas', curso: '3°A', nota: '6.5', tipoEvaluacion: 'prueba', fecha: '2026-03-15', profesorRut: '11111111' },
        { id: 2, estudianteRut: '12345678', asignatura: 'Matemáticas', curso: '3°A', nota: '5.0', tipoEvaluacion: 'tarea', fecha: '2026-04-01', profesorRut: '11111111' },
        { id: 3, estudianteRut: '12345678', asignatura: 'Lenguaje', curso: '3°A', nota: '6.0', tipoEvaluacion: 'prueba', fecha: '2026-03-20', profesorRut: '22222222' },
      ]);
      const result = await service.getStudentGrades('12345678');
      expect(result).toBeDefined();
      expect(result!.asignaturas).toHaveLength(2);
      expect(result!.curso).toBe('3°A');
    });

    it('debe lanzar error con RUT vacío', async () => {
      await expect(service.getStudentGrades('')).rejects.toThrow('El RUT del estudiante es obligatorio');
    });

    it('debe lanzar error si no hay notas', async () => {
      mockRepo.findByStudentRut.mockResolvedValue([]);
      await expect(service.getStudentGrades('00000000')).rejects.toThrow('Estudiante no encontrado');
    });
  });

  describe('getCourseGrades', () => {
    it('debe retornar notas del curso filtradas por profesor', async () => {
      mockRepo.findByCursoAndProfesor.mockResolvedValue([
        { id: 1, estudianteRut: '23232323', asignatura: 'Matemáticas', curso: '3°A', nota: '6.5', tipoEvaluacion: 'prueba', fecha: '2026-03-15', profesorRut: '11111111' },
      ]);
      const result = await service.getCourseGrades('3°A', '11111111');
      expect(result).toHaveLength(1);
    });

    it('debe lanzar error con curso vacío', async () => {
      await expect(service.getCourseGrades('', '11111111')).rejects.toThrow('El curso es requerido');
    });
  });

  describe('createGrade', () => {
    const valid = { estudianteRut: '12345678', asignatura: 'Matemáticas', curso: '3°A', nota: '6.5', tipoEvaluacion: 'prueba', fecha: '2026-03-15', profesorRut: '11111111' };

    it('debe crear una nota válida', async () => {
      await service.createGrade(valid);
      expect(mockRepo.create).toHaveBeenCalledWith(valid);
    });

    it('debe lanzar error con nota fuera de rango', async () => {
      await expect(service.createGrade({ ...valid, nota: '10.0' })).rejects.toThrow('La nota debe estar entre 1.0 y 7.0');
    });
  });

  describe('updateGrade', () => {
    it('debe actualizar una nota existente', async () => {
      mockRepo.findById.mockResolvedValue({ id: 1 });
      await service.updateGrade(1, { nota: '7.0' });
      expect(mockRepo.update).toHaveBeenCalledWith(1, { nota: '7.0' });
    });

    it('debe lanzar error si la nota no existe', async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.updateGrade(999, { nota: '7.0' })).rejects.toThrow('Nota no encontrada');
    });
  });

  describe('deleteGrade', () => {
    it('debe eliminar una nota existente', async () => {
      mockRepo.findById.mockResolvedValue({ id: 1 });
      await service.deleteGrade(1);
      expect(mockRepo.delete).toHaveBeenCalledWith(1);
    });

    it('debe lanzar error si la nota no existe', async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.deleteGrade(999)).rejects.toThrow('Nota no encontrada');
    });
  });

  describe('getTeacherGrades', () => {
    it('debe retornar notas del profesor', async () => {
      mockRepo.findByProfesorRut.mockResolvedValue([{ id: 1 }]);
      const result = await service.getTeacherGrades('11111111');
      expect(result).toHaveLength(1);
    });

    it('debe lanzar error con RUT vacío', async () => {
      await expect(service.getTeacherGrades('')).rejects.toThrow('El RUT del profesor es obligatorio');
    });
  });
});
