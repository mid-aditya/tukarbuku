import { env } from '$env/dynamic/private';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

let client: ReturnType<typeof postgres> | undefined;

export function getDb() {
  if (!env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured. Copy .env.example to .env before using database features.');
  }
  client ??= postgres(env.DATABASE_URL, { prepare: false, max: 10 });
  return drizzle(client, { schema });
}

export type Database = ReturnType<typeof getDb>;
