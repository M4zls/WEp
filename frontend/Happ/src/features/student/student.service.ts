const API_URL: string = 'http://localhost:3000/api';

interface StudentLoginResponse {
  rut?: string;
  email?: string;
  [key: string]: any;
}

interface StudentData {
  [key: string]: any;
}

class StudentService {
  async login(email: string, password: string): Promise<StudentLoginResponse> {
    try {
      const response = await fetch(`${API_URL}/estudiantes/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al iniciar sesión');
      }

      const data = await response.json();
      sessionStorage.setItem('studentToken', JSON.stringify(data));
      return data;
    } catch (error) {
      console.error('Error en login de estudiante:', error);
      throw error;
    }
  }

  async obtenerTodos(): Promise<any[]> {
    try {
      const response = await fetch(`${API_URL}/estudiantes/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener estudiantes');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener estudiantes:', error);
      throw error;
    }
  }

  async obtenerEstudiante(rut: string): Promise<StudentData> {
    try {
      const response = await fetch(`${API_URL}/estudiantes/${rut}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Estudiante no encontrado');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener estudiante:', error);
      throw error;
    }
  }

  async crearEstudiante(datos: StudentData): Promise<StudentData> {
    try {
      const response = await fetch(`${API_URL}/estudiantes/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al crear estudiante');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al crear estudiante:', error);
      throw error;
    }
  }

  async actualizarEstudiante(rut: string, datos: StudentData): Promise<StudentData> {
    try {
      const response = await fetch(`${API_URL}/estudiantes/${rut}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al actualizar estudiante');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al actualizar estudiante:', error);
      throw error;
    }
  }

  async eliminarEstudiante(rut: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/estudiantes/${rut}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al eliminar estudiante');
      }
    } catch (error) {
      console.error('Error al eliminar estudiante:', error);
      throw error;
    }
  }
}

export default new StudentService();
