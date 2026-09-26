import "server-only";
import postgres from "postgres";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

type Database = PostgresJsDatabase<typeof schema>;
type DbGlobal = typeof globalThis & { thinkZoneSql?: ReturnType<typeof postgres>; thinkZoneDb?: Database };
const globalForDb = globalThis as DbGlobal;

export function getDb(): Database {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured.");
  if (!globalForDb.thinkZoneSql) {
    globalForDb.thinkZoneSql = postgres(process.env.DATABASE_URL, { prepare: false, max: 5 });
    globalForDb.thinkZoneDb = drizzle(globalForDb.thinkZoneSql, { schema });
  }
  return globalForDb.thinkZoneDb!;
}
