import { Hono } from 'hono';
import { cors } from 'hono/cors';
import estudiantesRoutes from './routes/ms.studentsRoutes.js';
import profesoresRoutes from './routes/ms.teachersRoutes.js';
import autentificacionRoutes from './routes/ms.authenticationRoutes.js';
import cursosRoutes from './routes/ms.coursesRoutes.js';
import clasesRoutes from './routes/ms.classesRoutes.js';
import asistenciaRoutes from './routes/ms.attendanceRoutes.js';
import horariosRoutes from './routes/ms.scheduleRoutes.js';
import mensajeriaRoutes from './routes/ms.messagingRoutes.js';
import notasRoutes from './routes/ms.notesRoutes.js';
import notificacionesRoutes from './routes/ms.notificationsRoutes.js';
import openapiRoutes from './openapi.js';
import { authMiddleware } from './middleware/auth.js'


const app = new Hono();

app.use('*', cors());
app.use('/api/*', authMiddleware);
app.route('/docs', openapiRoutes);

app.route('/api/estudiantes', estudiantesRoutes);
app.route('/api/profesores', profesoresRoutes);
app.route('/api/auth', autentificacionRoutes);
app.route('/api/cursos', cursosRoutes);
app.route('/api/clases', clasesRoutes);
app.route('/api/horarios', horariosRoutes);
app.route('/api/asistencia', asistenciaRoutes);
app.route('/api/mensajeria', mensajeriaRoutes);
app.route('/api/notas', notasRoutes);
app.route('/api/notificaciones', notificacionesRoutes);

app.get('/health', (c) => {
  return c.json({ status: 'BFF is running' });
});

const port = Number(process.env.PORT ?? '3000');

Bun.serve({
  fetch: app.fetch,
  port,
});

console.log(`BFF running on http://localhost:${port}`);
