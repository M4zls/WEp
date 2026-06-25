const MS_STUDENTS_SERVICE = process.env.MS_STUDENTS_SERVICE || 'http://localhost:3001';
const MS_TEACHERS_SERVICE = process.env.MS_TEACHERS_SERVICE || 'http://localhost:3004';
const MS_NOTIFICATIONS_SERVICE = process.env.MS_NOTIFICATIONS_SERVICE || 'http://localhost:3003';

export class GradesService {
  private async fetchStudentInfo(rut: string) {
    const response = await fetch(`${MS_STUDENTS_SERVICE}/students/${encodeURIComponent(rut)}`);
    if (!response.ok) return null;
    return response.json();
  }

  private async fetchProfesorInfo(rut: string) {
    const response = await fetch(`${MS_TEACHERS_SERVICE}/teachers/${encodeURIComponent(rut)}`);
    if (!response.ok) return null;
    return response.json();
  }

  private sendGradeNotification(grade: any, estudiante: any, profesor: any) {
    const payload: any = {
      subscriberId: grade.estudianteRut,
      studentRut: grade.estudianteRut,
      studentName: `${estudiante.nombre ?? ''} ${estudiante.apellido ?? ''}`.trim(),
      studentEmail: estudiante.email ?? '',
      subject: grade.asignatura,
      grade: grade.nota,
      evaluationType: grade.tipoEvaluacion,
      professorName: profesor ? `${profesor.nombre ?? ''} ${profesor.apellido ?? ''}`.trim() : '',
      course: grade.curso,
    };

    if (estudiante.apoderado) {
      payload.guardianName = estudiante.apoderado;
    }
    if (estudiante.apoderadoEmail) {
      payload.guardianEmail = estudiante.apoderadoEmail;
    }

    fetch(`${MS_NOTIFICATIONS_SERVICE}/notifications/aviso-nota`, {
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
