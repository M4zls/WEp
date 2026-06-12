import { defineConfig } from 'drizzle-kit';

declare const process: { env: { DATABASE_URL?: string } };

export default defineConfig({
  schema: '../src/models/schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
  },
});
