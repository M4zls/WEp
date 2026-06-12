import '../drizzle/migrate.js';
import '../drizzle/seed.js';
import { Hono } from 'hono'
import { cors } from 'hono/cors';
import { estudianteController } from './controllers/EstudiantesController.js';

const app = new Hono()

app.use(cors());
app.route('/estudiantes', estudianteController)

const port = Number(process.env.PORT ?? '3001');

Bun.serve({
  fetch: app.fetch,
  port,
});

console.log(`Microservicio Estudiantes running on http://localhost:${port}`)
