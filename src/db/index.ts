import { drizzle } from 'drizzle-orm/node-postgres';
import { logger } from '@/handler/logger.js';

export const db = drizzle({
  connection: process.env.DATABASE_URL,
  casing: 'snake_case'
});

logger.info('Connected to database');
