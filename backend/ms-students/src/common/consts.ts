export const JWT_SECRET = process.env.JWT_SECRET ?? 'colegio_ohiggins_secret_changeme';
export const JWT_EXPIRES_IN = 60 * 60 * 24; // 24 horas

export const STUDENT_RUT_REGEX = /^\d{7,8}$/;

export const STUDENT_ERRORS = {
  RUT_REQUIRED: 'El RUT es obligatorio',
  DV_REQUIRED: 'El dígito verificador es obligatorio',
  RUT_INVALID: 'El RUT debe tener entre 7 y 8 dígitos numéricos',
  COURSE_REQUIRED: 'El curso es obligatorio',
  EMAIL_REQUIRED: 'El email es obligatorio',
  PASSWORD_REQUIRED: 'La contraseña es obligatoria',
  NOT_FOUND: 'Estudiante no encontrado',
  DUPLICATE_RUT: 'Ya existe un estudiante con ese RUT',
  RUT_REQUIRED_QUERY: 'El RUT es requerido',
  COURSE_REQUIRED_QUERY: 'El curso es obligatorio',
} as const;
