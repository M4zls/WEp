const MS_STUDENTS_SERVICE = process.env.MS_STUDENTS_SERVICE || 'http://localhost:3001';
const MS_TEACHERS_SERVICE = process.env.MS_TEACHERS_SERVICE || 'http://localhost:3004';
const MS_NOTIFICATIONS_SERVICE = process.env.MS_NOTIFICATIONS_SERVICE || 'http://localhost:3003';

export class GradesService {
  private async fetchStudentInfo(rut: string) {
    const response = await fetch(`${MS_STUDENTS_SERVICE}/estudiantes/${encodeURIComponent(rut)}`);
    if (!response.ok) return null;
    return response.json();
  }

  private async fetchProfesorInfo(rut: string) {
    const response = await fetch(`${MS_TEACHERS_SERVICE}/profesores/${encodeURIComponent(rut)}`);
    if (!response.ok) return null;
    return response.json();
  }

  private sendGradeNotification(grade: any, estudiante: any, profesor: any) {
    const payload: any = {
      subscriberId: grade.estudianteRut,
      estudianteRut: grade.estudianteRut,
      nombreAlumno: `${estudiante.nombre ?? ''} ${estudiante.apellido ?? ''}`.trim(),
      emailAlumno: estudiante.email ?? '',
      asignatura: grade.asignatura,
      nota: grade.nota,
      tipoEvaluacion: grade.tipoEvaluacion,
      nombreProfesor: profesor ? `${profesor.nombre ?? ''} ${profesor.apellido ?? ''}`.trim() : '',
      curso: grade.curso,
    };

    if (estudiante.apoderado) {
      payload.nombreApoderado = estudiante.apoderado;
    }
    if (estudiante.apoderadoEmail) {
      payload.emailApoderado = estudiante.apoderadoEmail;
    }

    fetch(`${MS_NOTIFICATIONS_SERVICE}/notificaciones/aviso-nota`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch((err: any) => {
      console.error('[grades] notification failed:', err.message);
    });
  }

  async handleGradeNotifications(grades: any[], profesorRut: string) {
    const uniqueRuts = [...new Set(grades.map((g: any) => g.estudianteRut))];
    const studentMap = new Map<string, any>();

    const studentResults = await Promise.allSettled(
      uniqueRuts.map((rut) => this.fetchStudentInfo(rut)),
    );

    uniqueRuts.forEach((rut, i) => {
      if (studentResults[i].status === 'fulfilled' && studentResults[i].value) {
        studentMap.set(rut, studentResults[i].value);
      }
    });

    const profesor = await this.fetchProfesorInfo(profesorRut);

    for (const grade of grades) {
      const estudiante = studentMap.get(grade.estudianteRut);
      if (estudiante) {
        this.sendGradeNotification(grade, estudiante, profesor);
      }
    }
  }
}
