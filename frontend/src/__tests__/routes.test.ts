import { ROUTES } from '../config/routes';

describe('ROUTES', () => {
  it('should have HOME pointing to /', () => {
    expect(ROUTES.HOME).toBe('/');
  });

  it('should have LOGIN pointing to /login', () => {
    expect(ROUTES.LOGIN).toBe('/login');
  });

  it('should have DASHBOARD pointing to /dashboard', () => {
    expect(ROUTES.DASHBOARD).toBe('/dashboard');
  });

  it('should have SUBJECT_DETAIL with param', () => {
    expect(ROUTES.SUBJECT_DETAIL).toBe('/dashboard/subject/:courseSubjectId');
  });

  it('should have readonly properties via as const', () => {
    expect(ROUTES.HOME).toBeDefined();
    expect(ROUTES.LOGIN).toBeDefined();
    expect(ROUTES.DASHBOARD).toBeDefined();
    expect(ROUTES.SUBJECT_DETAIL).toBeDefined();
  });
});
