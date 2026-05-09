import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema',
  casing: 'snake_case',
  dbCredentials: {
    url: process.env.DATABASE_URL!
  }
});
