import { Hono } from 'hono';
import openapiSpec from './openapi.json' with { type: 'json' };

const app = new Hono();

app.get('/health', (c) => c.json({ status: 'ok' }));

app.get('/openapi.json', (c) => c.json(openapiSpec));

app.get('/docs', (c) => {
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>API Docs — Portal Educativo</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  <style>
    html { box-sizing: border-box; overflow-y: scroll; }
    *, *::before, *::after { box-sizing: inherit; }
    body { margin: 0; background: #fafafa; }
    .topbar { display: none; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    SwaggerUIBundle({
      url: '/openapi.json',
      dom_id: '#swagger-ui',
      deepLinking: true,
      defaultModelsExpandDepth: -1,
      tryItOutEnabled: false,
    });
  </script>
</body>
</html>`;
  return c.html(html);
});

const port = Number(process.env.PORT ?? '3011');
Bun.serve({ fetch: app.fetch, port });

console.log(`[docs] Swagger UI en http://localhost:${port}/docs`);
