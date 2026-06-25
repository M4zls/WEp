import { Hono } from 'hono';
import { cors } from 'hono/cors';
import studentsRoutes from './routes/students.routes.js';
import teachersRoutes from './routes/teachers.routes.js';
import authRoutes from './routes/auth.routes.js';
import coursesRoutes from './routes/courses.routes.js';
import classesRoutes from './routes/classes.routes.js';
import scheduleRoutes from './routes/schedule.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
import messagingRoutes from './routes/messaging.routes.js';
import gradesRoutes from './routes/grades.routes.js';
import notificationsRoutes from './routes/notifications.routes.js';
import openapiRoutes from './openapi.js';
import { authMiddleware } from './middleware/auth.js'


const app = new Hono();

app.use('*', cors());
app.use('/api/*', authMiddleware);
app.route('/docs', openapiRoutes);

app.route('/api/students', studentsRoutes);
app.route('/api/teachers', teachersRoutes);
app.route('/api/auth', authRoutes);
app.route('/api/courses', coursesRoutes);
app.route('/api/classes', classesRoutes);
app.route('/api/schedule', scheduleRoutes);
app.route('/api/attendance', attendanceRoutes);
app.route('/api/messaging', messagingRoutes);
app.route('/api/grades', gradesRoutes);
app.route('/api/notifications', notificationsRoutes);

app.get('/health', (c) => {
  return c.json({ status: 'BFF is running' });
});

const port = Number(process.env.PORT ?? '3000');

Bun.serve({
  fetch: app.fetch,
  port,
});

console.log(`BFF running on http://localhost:${port}`);
