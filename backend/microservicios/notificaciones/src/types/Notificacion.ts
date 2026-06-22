export type AvisoInasistenciaDto = {
  subscriberId: string;
  nombreApoderado: string;
  nombreAlumno: string;
  curso: string;
  fecha: string;
  firstName?: string;
  lastName?: string;
  email?: string;
};

export type AvisoNotaDto = {
  subscriberId: string;
  estudianteRut: string;
  nombreAlumno: string;
  emailAlumno: string;
  nombreApoderado?: string;
  emailApoderado?: string;
  asignatura: string;
  nota: string;
  tipoEvaluacion: string;
  nombreProfesor: string;
  curso: string;
};

export type AvisoMensajeDto = {
  destinatarioRut: string;
  destinatarioRol: 'estudiante' | 'profesor';
  remitenteNombre: string;
  remitenteApellido: string;
  contenidoPreview: string;
  conversacionId: number;
};