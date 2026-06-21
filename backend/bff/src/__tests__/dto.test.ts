import { describe, it, expect } from 'bun:test';
import {
  loginBffSchema,
  loginAuthBffSchema,
  registerBffSchema,
  crearCursoBffSchema,
  crearAsignaturaBffSchema,
  asignarMateriaBffSchema,
  crearClaseBffSchema,
  crearHorarioBffSchema,
  marcarAsistenciaBffSchema,
  crearConversacionBffSchema,
  enviarMensajeBffSchema,
  crearNotaBffSchema,
  notasBatchBffSchema,
  avisoInasistenciaBffSchema,
  avisoNotaBffSchema,
} from '../dtos/BffDto.js';

describe('loginBffSchema', () => {
  it('should accept valid login', () => {
    const result = loginBffSchema.safeParse({ email: 'test@test.com', password: '123456' });
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const result = loginBffSchema.safeParse({ email: 'bademail', password: '123456' });
    expect(result.success).toBe(false);
  });

  it('should reject short password', () => {
    const result = loginBffSchema.safeParse({ email: 'test@test.com', password: '12345' });
    expect(result.success).toBe(false);
  });
});

describe('loginAuthBffSchema', () => {
  it('should accept valid login', () => {
    const result = loginAuthBffSchema.safeParse({ identifier: 'test@test.com', password: '123456' });
    expect(result.success).toBe(true);
  });
});

describe('registerBffSchema', () => {
  it('should accept valid register', () => {
    const result = registerBffSchema.safeParse({
      rut: '12345678',
      dv: 'k',
      nombre: 'Juan',
      apellido: 'Perez',
      email: 'juan@test.com',
      password: '123456',
      rol: 'profesor',
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid rut', () => {
    const result = registerBffSchema.safeParse({
      rut: '123',
      dv: 'k',
      nombre: 'Juan',
      apellido: 'Perez',
      email: 'juan@test.com',
      password: '123456',
      rol: 'profesor',
    });
    expect(result.success).toBe(false);
  });

  it('should reject invalid rol', () => {
    const result = registerBffSchema.safeParse({
      rut: '12345678',
      dv: 'k',
      nombre: 'Juan',
      apellido: 'Perez',
      email: 'juan@test.com',
      password: '123456',
      rol: 'estudiante',
    });
    expect(result.success).toBe(false);
  });
});

describe('crearCursoBffSchema', () => {
  it('should accept valid course', () => {
    const result = crearCursoBffSchema.safeParse({ nombre: '1A', nivel: 'Primero', letra: 'A' });
    expect(result.success).toBe(true);
  });

  it('should accept optional year', () => {
    const result = crearCursoBffSchema.safeParse({ nombre: '1A', nivel: 'Primero', letra: 'A', anio: '2026' });
    expect(result.success).toBe(true);
  });

  it('should reject long letra', () => {
    const result = crearCursoBffSchema.safeParse({ nombre: '1A', nivel: 'Primero', letra: 'AB' });
    expect(result.success).toBe(false);
  });
});

describe('crearAsignaturaBffSchema', () => {
  it('should accept valid subject', () => {
    const result = crearAsignaturaBffSchema.safeParse({ nombre: 'Matematicas', codigo: 'MAT101' });
    expect(result.success).toBe(true);
  });

  it('should accept optional description', () => {
    const result = crearAsignaturaBffSchema.safeParse({ nombre: 'Matematicas', codigo: 'MAT101', descripcion: 'Algebra' });
    expect(result.success).toBe(true);
  });
});

describe('asignarMateriaBffSchema', () => {
  it('should accept valid assignment', () => {
    const result = asignarMateriaBffSchema.safeParse({ cursoId: 1, asignaturaId: 1 });
    expect(result.success).toBe(true);
  });

  it('should accept optional profesorId', () => {
    const result = asignarMateriaBffSchema.safeParse({ cursoId: 1, asignaturaId: 1, profesorId: 5 });
    expect(result.success).toBe(true);
  });

  it('should reject negative cursoId', () => {
    const result = asignarMateriaBffSchema.safeParse({ cursoId: -1, asignaturaId: 1 });
    expect(result.success).toBe(false);
  });
});

describe('crearClaseBffSchema', () => {
  it('should accept valid class', () => {
    const result = crearClaseBffSchema.safeParse({
      curso_asignatura_id: 1,
      fecha: '2026-06-15',
      hora_inicio: '08:00',
      hora_fin: '08:45',
    });
    expect(result.success).toBe(true);
  });

  it('should reject negative id', () => {
    const result = crearClaseBffSchema.safeParse({
      curso_asignatura_id: -1,
      fecha: '2026-06-15',
      hora_inicio: '08:00',
      hora_fin: '08:45',
    });
    expect(result.success).toBe(false);
  });
});

describe('crearHorarioBffSchema', () => {
  it('should accept valid schedule', () => {
    const result = crearHorarioBffSchema.safeParse({
      curso_asignatura_id: 1,
      dia_semana: 1,
      hora_inicio: '08:00',
      hora_fin: '08:45',
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid dia_semana', () => {
    const result = crearHorarioBffSchema.safeParse({
      curso_asignatura_id: 1,
      dia_semana: 6,
      hora_inicio: '08:00',
      hora_fin: '08:45',
    });
    expect(result.success).toBe(false);
  });
});

describe('marcarAsistenciaBffSchema', () => {
  it('should accept valid attendance', () => {
    const result = marcarAsistenciaBffSchema.safeParse({
      clase_id: 1,
      estudiante_rut: '12345678',
      presente: true,
    });
    expect(result.success).toBe(true);
  });

  it('should reject negative clase_id', () => {
    const result = marcarAsistenciaBffSchema.safeParse({
      clase_id: -1,
      estudiante_rut: '12345678',
      presente: true,
    });
    expect(result.success).toBe(false);
  });
});

describe('crearConversacionBffSchema', () => {
  it('should accept valid conversation', () => {
    const result = crearConversacionBffSchema.safeParse({
      participantes: ['1', '2'],
    });
    expect(result.success).toBe(true);
  });

  it('should reject single participant', () => {
    const result = crearConversacionBffSchema.safeParse({
      participantes: ['1'],
    });
    expect(result.success).toBe(false);
  });
});

describe('enviarMensajeBffSchema', () => {
  it('should accept valid message', () => {
    const result = enviarMensajeBffSchema.safeParse({
      conversacion_id: 1,
      remitente_rut: '12345678',
      contenido: 'Hola',
    });
    expect(result.success).toBe(true);
  });

  it('should reject empty content', () => {
    const result = enviarMensajeBffSchema.safeParse({
      conversacion_id: 1,
      remitente_rut: '12345678',
      contenido: '',
    });
    expect(result.success).toBe(false);
  });
});

describe('crearNotaBffSchema', () => {
  it('should accept valid grade', () => {
    const result = crearNotaBffSchema.safeParse({
      estudianteRut: '12345678',
      asignatura: 'Matematicas',
      curso: '4-B',
      nota: '6.5',
      tipoEvaluacion: 'prueba',
      fecha: '2026-06-15',
      profesorRut: '11111111',
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid tipoEvaluacion', () => {
    const result = crearNotaBffSchema.safeParse({
      estudianteRut: '12345678',
      asignatura: 'Matematicas',
      curso: '4-B',
      nota: '6.5',
      tipoEvaluacion: 'examen',
      fecha: '2026-06-15',
      profesorRut: '11111111',
    });
    expect(result.success).toBe(false);
  });

  it('should apply default coeficiente', () => {
    const result = crearNotaBffSchema.safeParse({
      estudianteRut: '12345678',
      asignatura: 'Matematicas',
      curso: '4-B',
      nota: '6.5',
      tipoEvaluacion: 'prueba',
      fecha: '2026-06-15',
      profesorRut: '11111111',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.coeficiente).toBe(1);
    }
  });
});

describe('notasBatchBffSchema', () => {
  it('should accept batch of grades', () => {
    const result = notasBatchBffSchema.safeParse([{
      estudianteRut: '12345678',
      asignatura: 'Matematicas',
      curso: '4-B',
      nota: '6.5',
      tipoEvaluacion: 'prueba',
      fecha: '2026-06-15',
      profesorRut: '11111111',
    }]);
    expect(result.success).toBe(true);
  });

  it('should reject empty array', () => {
    const result = notasBatchBffSchema.safeParse([]);
    expect(result.success).toBe(false);
  });
});

describe('avisoInasistenciaBffSchema', () => {
  it('should accept valid absence notice', () => {
    const result = avisoInasistenciaBffSchema.safeParse({
      subscriberId: '123',
      nombreApoderado: 'Carlos Perez',
      nombreAlumno: 'Juan Perez',
      curso: '4-B',
      fecha: '2026-06-15',
    });
    expect(result.success).toBe(true);
  });

  it('should accept with optional fields', () => {
    const result = avisoInasistenciaBffSchema.safeParse({
      subscriberId: '123',
      nombreApoderado: 'Carlos Perez',
      nombreAlumno: 'Juan Perez',
      curso: '4-B',
      fecha: '2026-06-15',
      firstName: 'Carlos',
      lastName: 'Perez',
      email: 'carlos@test.com',
    });
    expect(result.success).toBe(true);
  });

  it('should reject missing required fields', () => {
    const result = avisoInasistenciaBffSchema.safeParse({
      subscriberId: '123',
    });
    expect(result.success).toBe(false);
  });

  it('should reject invalid email', () => {
    const result = avisoInasistenciaBffSchema.safeParse({
      subscriberId: '123',
      nombreApoderado: 'Carlos Perez',
      nombreAlumno: 'Juan Perez',
      curso: '4-B',
      fecha: '2026-06-15',
      email: 'bademail',
    });
    expect(result.success).toBe(false);
  });
});

describe('avisoNotaBffSchema', () => {
  it('should accept valid grade notice', () => {
    const result = avisoNotaBffSchema.safeParse({
      subscriberId: '123',
      estudianteRut: '12345678',
      nombreAlumno: 'Juan Perez',
      emailAlumno: 'juan@test.com',
      asignatura: 'Matematicas',
      nota: '6.5',
      tipoEvaluacion: 'prueba',
      nombreProfesor: 'Profesor Test',
      curso: '4-B',
    });
    expect(result.success).toBe(true);
  });

  it('should accept with optional apoderado fields', () => {
    const result = avisoNotaBffSchema.safeParse({
      subscriberId: '123',
      estudianteRut: '12345678',
      nombreAlumno: 'Juan Perez',
      emailAlumno: 'juan@test.com',
      nombreApoderado: 'Carlos Perez',
      emailApoderado: 'carlos@test.com',
      asignatura: 'Matematicas',
      nota: '6.5',
      tipoEvaluacion: 'prueba',
      nombreProfesor: 'Profesor Test',
      curso: '4-B',
    });
    expect(result.success).toBe(true);
  });

  it('should reject missing subscriberId', () => {
    const result = avisoNotaBffSchema.safeParse({
      estudianteRut: '12345678',
      nombreAlumno: 'Juan Perez',
      emailAlumno: 'juan@test.com',
      asignatura: 'Matematicas',
      nota: '6.5',
      tipoEvaluacion: 'prueba',
      nombreProfesor: 'Profesor Test',
      curso: '4-B',
    });
    expect(result.success).toBe(false);
  });

  it('should reject invalid emailAlumno', () => {
    const result = avisoNotaBffSchema.safeParse({
      subscriberId: '123',
      estudianteRut: '12345678',
      nombreAlumno: 'Juan Perez',
      emailAlumno: 'bademail',
      asignatura: 'Matematicas',
      nota: '6.5',
      tipoEvaluacion: 'prueba',
      nombreProfesor: 'Profesor Test',
      curso: '4-B',
    });
    expect(result.success).toBe(false);
  });
});
