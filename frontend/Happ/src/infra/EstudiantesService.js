/**
 * Servicio para comunicarse con el microservicio de Estudiantes
 * Maneja login y operaciones específicas de estudiantes
 */

const ESTUDIANTES_API_URL = process.env.REACT_APP_ESTUDIANTES_API_URL || 'http://localhost:3001/estudiantes';

class EstudiantesService {
  /**
   * Login de estudiante - valida email y contraseña contra el backend
   * @param {string} email - Email del estudiante
   * @param {string} password - Contraseña del estudiante
   * @returns {Promise} Datos del estudiante si las credenciales son válidas
   */
  async login(email, password) {
    try {
      const response = await fetch(`${ESTUDIANTES_API_URL}/login`, {
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

      // Guardar token/sesión
      sessionStorage.setItem('studentToken', JSON.stringify(data));
      
      return data;
    } catch (error) {
      console.error('Error en login de estudiante:', error);
      throw error;
    }
  }

  /**
   * Obtener todos los estudiantes
   */
  async obtenerTodos() {
    try {
      const response = await fetch(`${ESTUDIANTES_API_URL}/`, {
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

  /**
   * Obtener estudiante por RUT
   */
  async obtenerEstudiante(rut) {
    try {
      const response = await fetch(`${ESTUDIANTES_API_URL}/${rut}`, {
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

  /**
   * Crear nuevo estudiante
   */
  async crearEstudiante(datos) {
    try {
      const response = await fetch(`${ESTUDIANTES_API_URL}/`, {
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

  /**
   * Actualizar estudiante
   */
  async actualizarEstudiante(rut, datos) {
    try {
      const response = await fetch(`${ESTUDIANTES_API_URL}/${rut}`, {
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

  /**
   * Eliminar estudiante
   */
  async eliminarEstudiante(rut) {
    try {
      const response = await fetch(`${ESTUDIANTES_API_URL}/${rut}`, {
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

  /**
   * Obtener estudiantes por curso
   */
  async obtenerEstudiantesPorCurso(curso) {
    try {
      const response = await fetch(`${ESTUDIANTES_API_URL}/curso/${curso}`, {
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

  /**
   * Logout de estudiante
   */
  logout() {
    sessionStorage.removeItem('studentToken');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('role');
  }

  /**
   * Verificar si hay sesión activa de estudiante
   */
  isLoggedIn() {
    return !!sessionStorage.getItem('studentToken');
  }

  /**
   * Obtener datos del estudiante en sesión
   */
  getCurrentStudent() {
    const token = sessionStorage.getItem('studentToken');
    return token ? JSON.parse(token) : null;
  }
}

export default new EstudiantesService();
