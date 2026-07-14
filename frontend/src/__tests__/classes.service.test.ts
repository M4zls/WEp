vi.mock('../api/apiClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import classesService from '../pages/classes/classes.service';
import apiClient from '../api/apiClient';

describe('ClassesService', () => {
  beforeEach(() => {
    vi.mocked(apiClient.get).mockReset();
    vi.mocked(apiClient.post).mockReset();
    vi.mocked(apiClient.put).mockReset();
    vi.mocked(apiClient.delete).mockReset();
  });

  it('should list clases without filter', async () => {
    vi.mocked(apiClient.get).mockResolvedValue([]);
    await classesService.list();
    expect(apiClient.get).toHaveBeenCalledWith('/classes');
  });

  it('should list clases filtered by courseSubjectId', async () => {
    vi.mocked(apiClient.get).mockResolvedValue([]);
    await classesService.list(5);
    expect(apiClient.get).toHaveBeenCalledWith('/classes?course_subject_id=5');
  });

  it('should fetch a single class by id', async () => {
    const mockClass = { id: 1, title: 'Test', fecha: '2024-01-01', startTime: '10:00', endTime: '11:00', estado: 'pending', courseSubjectId: 1 };
    vi.mocked(apiClient.get).mockResolvedValue(mockClass);

    const result = await classesService.get(1);
    expect(apiClient.get).toHaveBeenCalledWith('/classes/1');
    expect(result).toEqual(mockClass);
  });

  it('should create a class', async () => {
    const dto = { courseSubjectId: 1, title: 'New', fecha: '2024-01-01', startTime: '10:00', endTime: '11:00' };
    vi.mocked(apiClient.post).mockResolvedValue({ id: 1, ...dto });

    const result = await classesService.create(dto);
    expect(apiClient.post).toHaveBeenCalledWith('/classes', dto);
    expect(result).toMatchObject({ id: 1 });
  });

  it('should update a class', async () => {
    vi.mocked(apiClient.put).mockResolvedValue(undefined);
    await classesService.update(1, { title: 'Updated' });
    expect(apiClient.put).toHaveBeenCalledWith('/classes/1', { title: 'Updated' });
  });

  it('should delete a class', async () => {
    vi.mocked(apiClient.delete).mockResolvedValue(undefined);
    await classesService.remove(1);
    expect(apiClient.delete).toHaveBeenCalledWith('/classes/1');
  });
});
