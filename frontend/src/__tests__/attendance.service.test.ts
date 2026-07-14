vi.mock('../api/apiClient', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import attendanceService from '../pages/attendance/attendance.service';
import apiClient from '../api/apiClient';

describe('AttendanceService', () => {
  beforeEach(() => {
    vi.mocked(apiClient.get).mockReset();
    vi.mocked(apiClient.post).mockReset();
    vi.mocked(apiClient.put).mockReset();
  });

  it('should listByClass', async () => {
    vi.mocked(apiClient.get).mockResolvedValue([]);
    await attendanceService.listByClass(1);
    expect(apiClient.get).toHaveBeenCalledWith('/attendance/class/1');
  });

  it('should listByStudent', async () => {
    vi.mocked(apiClient.get).mockResolvedValue([]);
    await attendanceService.listByStudent('123-4');
    expect(apiClient.get).toHaveBeenCalledWith('/attendance/student/123-4');
  });

  it('should listByCourseSubject', async () => {
    vi.mocked(apiClient.get).mockResolvedValue([]);
    await attendanceService.listBySubject(5);
    expect(apiClient.get).toHaveBeenCalledWith('/attendance/course-subject/5');
  });

  it('should mark attendance', async () => {
    const dto = { classId: 1, courseSubjectId: 5, registros: [{ studentRut: '123-4', studentName: 'Juan Perez', present: true }] };
    vi.mocked(apiClient.post).mockResolvedValue([]);
    await attendanceService.mark(dto);
    expect(apiClient.post).toHaveBeenCalledWith('/attendance/mark', dto);
  });

  it('should update attendance', async () => {
    vi.mocked(apiClient.put).mockResolvedValue(undefined);
    await attendanceService.update(1, { present: false });
    expect(apiClient.put).toHaveBeenCalledWith('/attendance/1', { present: false });
  });
});
