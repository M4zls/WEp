const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

class StudentService {
  async login(email, password) {
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

  async obtenerTodos() {
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

  async obtenerEstudiante(rut) {
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

  async crearEstudiante(datos) {
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

  async actualizarEstudiante(rut, datos) {
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

  async eliminarEstudiante(rut) {
    try {
      const response = await fetch(`${API_URL}/estudiantes/${rut}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al eliminar estudiante');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al eliminar estudiante:', error);
      throw error;
    }
  }

  async obtenerEstudiantesPorCurso(curso) {
    try {
      const response = await fetch(`${API_URL}/estudiantes/curso/${curso}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al obtener estudiantes por curso');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener estudiantes por curso:', error);
      throw error;
    }
  }

  logout() {
    sessionStorage.removeItem('studentToken');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('role');
  }

  isLoggedIn() {
    return !!sessionStorage.getItem('studentToken');
  }

  getCurrentStudent() {
    const token = sessionStorage.getItem('studentToken');
    return token ? JSON.parse(token) : null;
  }
}

export default new StudentService();
