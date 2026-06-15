import '../drizzle/migrate.ts';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { mensajeriaController } from './controllers/MensajeriaController.js';

/** Punto de entrada del microservicio de mensajería. */
const app = new Hono();
app.use(cors());
app.route('/mensajeria', mensajeriaController);

const port = Number(process.env.PORT ?? '3009');

Bun.serve({
  fetch: app.fetch,
  port,
});

console.log(`Microservicio Mensajeria running on http://localhost:${port}`);
