import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../features/useAuthContext';
import EstudiantesService from '../infra/EstudiantesService';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: loginContext, isLoading, error, setError } = useAuthContext();
  
  const role = location.state?.role || sessionStorage.getItem('selectedRole') || 'estudiante';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (role === 'estudiante') {
        // Conectar con el microservicio de estudiantes
        const response = await EstudiantesService.login(email, password);
        if (response && response.rut) {
          // Usar el context para guardar estado global
          await loginContext(email, password, 'estudiante');
          sessionStorage.setItem('user', JSON.stringify(response));
          navigate('/dashboard');
        }
      } else {
        // Para profesores, usar el context
        await loginContext(email, password, 'profesor');
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    }
  };

  const handleBack = () => {
    sessionStorage.removeItem('selectedRole');
    navigate('/');
  };

  const getRoleColor = () => {
    return role === 'estudiante' ? 'from-blue-400 to-blue-600' : 'from-green-400 to-green-600';
  };

  const getRoleTitle = () => {
    return role === 'estudiante' ? 'Estudiante' : 'Profesor';
  };

  const getBtnColor = () => {
    return role === 'estudiante' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600';
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getRoleColor()} py-6 flex flex-col justify-center sm:py-12`}>
      <div className="relative py-3 sm:max-w-xl sm:mx-auto w-full px-4">
        <div className="absolute inset-0 bg-white shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-800">
                Login - {getRoleTitle()}
              </h1>
              <p className="text-gray-500 text-sm mt-1">Ingresa tus credenciales</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="relative">
                  <input
                    autoComplete="off"
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500"
                    placeholder="Email address"
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Email
                  </label>
                </div>

                <div className="relative">
                  <input
                    autoComplete="off"
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500"
                    placeholder="Password"
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Contraseña
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`flex-1 ${getBtnColor()} text-white rounded-md px-4 py-2 font-semibold transition-colors disabled:opacity-50`}
                  >
                    {isLoading ? 'Iniciando...' : 'Iniciar sesión'}
                  </button>
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 bg-gray-300 text-gray-800 rounded-md px-4 py-2 font-semibold hover:bg-gray-400 transition-colors"
                  >
                    Volver
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
