vi.mock('../api/apiClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import scheduleService from '../pages/schedule/schedule.service';
import apiClient from '../api/apiClient';

describe('ScheduleService', () => {
  beforeEach(() => {
    vi.mocked(apiClient.get).mockReset();
    vi.mocked(apiClient.post).mockReset();
    vi.mocked(apiClient.put).mockReset();
    vi.mocked(apiClient.delete).mockReset();
  });

  it('should list schedules without filter', async () => {
    vi.mocked(apiClient.get).mockResolvedValue([]);
    await scheduleService.list();
    expect(apiClient.get).toHaveBeenCalledWith('/schedule');
  });

  it('should list schedules filtered by courseSubjectId', async () => {
    vi.mocked(apiClient.get).mockResolvedValue([]);
    await scheduleService.list(3);
    expect(apiClient.get).toHaveBeenCalledWith('/schedule?course_subject_id=3');
  });

  it('should fetch a single schedule by id', async () => {
    const mockSchedule = { id: 1, courseSubjectId: 1, weekDay: 1, startTime: '08:00', endTime: '09:00' };
    vi.mocked(apiClient.get).mockResolvedValue(mockSchedule);

    const result = await scheduleService.get(1);
    expect(apiClient.get).toHaveBeenCalledWith('/schedule/1');
    expect(result).toEqual(mockSchedule);
  });

  it('should create a schedule', async () => {
    const dto = { courseSubjectId: 1, weekDay: 2, startTime: '09:00', endTime: '10:00' };
    vi.mocked(apiClient.post).mockResolvedValue({ id: 1, ...dto });

    const result = await scheduleService.create(dto);
    expect(apiClient.post).toHaveBeenCalledWith('/schedule', dto);
    expect(result).toMatchObject({ id: 1 });
  });

  it('should update a schedule', async () => {
    vi.mocked(apiClient.put).mockResolvedValue(undefined);
    await scheduleService.update(1, { startTime: '10:00' });
    expect(apiClient.put).toHaveBeenCalledWith('/schedule/1', { startTime: '10:00' });
  });

  it('should delete a schedule', async () => {
    vi.mocked(apiClient.delete).mockResolvedValue(undefined);
    await scheduleService.remove(1);
    expect(apiClient.delete).toHaveBeenCalledWith('/schedule/1');
  });
});
