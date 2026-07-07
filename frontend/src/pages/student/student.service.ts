import type { UserData } from './student.types';

export interface StudentLoginResponse {
  rut: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  courses?: string;
  token?: string;
}

const API_URL: string = 'http://localhost:3100/api';

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
        throw new Error(error.error || 'Error durante el inicio de sesión');
      }

      const data = await response.json();
      sessionStorage.setItem('studentToken', JSON.stringify(data));
      return data;
    } catch (error) {
      console.error('Error in student login:', error);
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
      console.error('Error fetching students:', error);
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
      console.error('Error fetching student:', error);
      throw error;
    }
  }

  async createStudent(data: UserData): Promise<UserData> {
    try {
      const response = await fetch(`${API_URL}/students/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al crear estudiante');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  }

  async updateStudent(rut: string, data: UserData): Promise<UserData> {
    try {
      const response = await fetch(`${API_URL}/students/${rut}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al actualizar estudiante');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating student:', error);
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
      console.error('Error deleting student:', error);
      throw error;
    }
  }
}

export default new StudentService();
