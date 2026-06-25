import type { UserData } from './student.types';

export interface StudentLoginResponse {
  rut: string;
  nombre?: string;
  apellido?: string;
  email?: string;
  cursos?: string;
  token?: string;
}

const API_URL: string = 'http://localhost:3000/api';

class StudentService {
  async login(email: string, password: string): Promise<StudentLoginResponse> {
    try {
      const response = await fetch(`${API_URL}/students/login`, {
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

  async getAll(): Promise<any[]> {
    try {
      const response = await fetch(`${API_URL}/students/`, {
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

  async getStudent(rut: string): Promise<UserData> {
    try {
      const response = await fetch(`${API_URL}/students/${rut}`, {
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

  async createStudent(datos: UserData): Promise<UserData> {
    try {
      const response = await fetch(`${API_URL}/students/`, {
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

  async updateStudent(rut: string, datos: UserData): Promise<UserData> {
    try {
      const response = await fetch(`${API_URL}/students/${rut}`, {
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

  async deleteStudent(rut: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/students/${rut}`, {
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
