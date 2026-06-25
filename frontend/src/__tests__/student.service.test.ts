import studentService from '../pages/student/student.service';

describe('StudentService', () => {
  const mockFetch = vi.fn();

  beforeAll(() => {
    vi.stubGlobal('fetch', mockFetch);
  });

  beforeEach(() => {
    mockFetch.mockReset();
    sessionStorage.clear();
  });

  it('should login successfully', async () => {
    const mockResponse = { rut: '12345678-9', nombre: 'Juan', token: 'abc' };
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await studentService.login('juan@alumnocbo.cl', '123456');

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/students/login',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'juan@alumnocbo.cl', password: '123456' }),
      }),
    );
    expect(result).toEqual(mockResponse);
    expect(JSON.parse(sessionStorage.getItem('studentToken')!)).toEqual(mockResponse);
  });

  it('should throw on login error', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'Credenciales inválidas' }),
    });

    await expect(studentService.login('bad@test.com', 'wrong'))
      .rejects.toThrow('Credenciales inválidas');
  });

  it('should fetch all students', async () => {
    const mockStudents = [{ rut: '1', nombre: 'Juan' }];
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockStudents),
    });

    const result = await studentService.getAll();
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/students/',
      expect.objectContaining({ method: 'GET' }),
    );
    expect(result).toEqual(mockStudents);
  });

  it('should fetch student by rut', async () => {
    const mockStudent = { rut: '12345678-9', nombre: 'Juan' };
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockStudent),
    });

    const result = await studentService.getStudent('12345678-9');
    expect(result).toEqual(mockStudent);
  });

  it('should throw on student not found', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
    });

    await expect(studentService.getStudent('nonexistent'))
      .rejects.toThrow('Estudiante no encontrado');
  });

  it('should create a student', async () => {
    const datos = { rut: '12345678-9', nombre: 'Juan' } as any;
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(datos),
    });

    const result = await studentService.createStudent(datos);
    expect(result).toEqual(datos);
  });

  it('should throw on create error', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'RUT duplicado' }),
    });

    await expect(studentService.createStudent({} as any))
      .rejects.toThrow('RUT duplicado');
  });

  it('should update a student', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ rut: '12345678-9', nombre: 'Updated' }),
    });

    const result = await studentService.updateStudent('12345678-9', { nombre: 'Updated' } as any);
    expect(result).toMatchObject({ nombre: 'Updated' });
  });

  it('should delete a student', async () => {
    mockFetch.mockResolvedValue({ ok: true });

    await studentService.deleteStudent('12345678-9');
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/students/12345678-9',
      expect.objectContaining({ method: 'DELETE' }),
    );
  });

  it('should throw on delete error', async () => {
    mockFetch.mockResolvedValue({ ok: false });
    await expect(studentService.deleteStudent('x')).rejects.toThrow('Error al eliminar estudiante');
  });
});
