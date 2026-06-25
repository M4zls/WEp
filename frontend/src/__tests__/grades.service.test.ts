vi.mock('../api/apiClient', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import gradesService from '../pages/grades/services/grades.service';
import apiClient from '../api/apiClient';

describe('GradesService', () => {
  beforeEach(() => {
    vi.mocked(apiClient.get).mockReset();
    vi.mocked(apiClient.post).mockReset();
    vi.mocked(apiClient.put).mockReset();
    vi.mocked(apiClient.delete).mockReset();
  });

  it('should getStudentGrades', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ rut: '123-4', nombre: 'Juan', apellido: 'Perez', curso: '3A', asignaturas: [] });
    const result = await gradesService.getStudentGrades('123-4');
    expect(apiClient.get).toHaveBeenCalledWith('/grades/estudiante/123-4');
    expect(result.rut).toBe('123-4');
  });

  it('should getCourseGrades', async () => {
    vi.mocked(apiClient.get).mockResolvedValue([]);
    await gradesService.getCourseGrades('3A', 'teacher-1');
    expect(apiClient.get).toHaveBeenCalledWith('/grades/curso/3A?profesorRut=teacher-1');
  });

  it('should getTeacherGrades', async () => {
    vi.mocked(apiClient.get).mockResolvedValue([]);
    await gradesService.getTeacherGrades('teacher-1');
    expect(apiClient.get).toHaveBeenCalledWith('/grades/profesor/teacher-1');
  });

  it('should createGrade', async () => {
    const grade = { estudianteRut: '123-4', asignatura: 'Mat', curso: '3A', nota: '6.5', tipoEvaluacion: 'prueba', fecha: '2024-01-01', profesorRut: 't1' };
    vi.mocked(apiClient.post).mockResolvedValue(undefined);
    await gradesService.createGrade(grade);
    expect(apiClient.post).toHaveBeenCalledWith('/grades', grade);
  });

  it('should createGradesBatch', async () => {
    vi.mocked(apiClient.post).mockResolvedValue(undefined);
    await gradesService.createGradesBatch([]);
    expect(apiClient.post).toHaveBeenCalledWith('/grades/batch', { notas: [] });
  });

  it('should updateGrade', async () => {
    vi.mocked(apiClient.put).mockResolvedValue(undefined);
    await gradesService.updateGrade(1, { nota: '7.0' });
    expect(apiClient.put).toHaveBeenCalledWith('/grades/1', { nota: '7.0' });
  });

  it('should deleteGrade', async () => {
    vi.mocked(apiClient.delete).mockResolvedValue(undefined);
    await gradesService.deleteGrade(1);
    expect(apiClient.delete).toHaveBeenCalledWith('/grades/1');
  });
});
