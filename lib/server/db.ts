import { env } from "cloudflare:workers";
import { runtimeSchemaStatements } from "@/db/runtime-schema";

export class DatabaseUnavailableError extends Error {
  constructor(message = "Database service is temporarily unavailable.") {
    super(message);
    this.name = "DatabaseUnavailableError";
  }
}

const initializationByBinding = new WeakMap<object, Promise<void>>();

export function getD1(): D1Database {
  const binding = (env as unknown as { DB?: D1Database }).DB;

  if (!binding) {
    throw new DatabaseUnavailableError();
  }

  return binding;
}

export async function initializeDatabase(database: D1Database): Promise<void> {
  let initialization = initializationByBinding.get(database);

  if (!initialization) {
    initialization = database
      .batch(runtimeSchemaStatements.map((statement) => database.prepare(statement)))
      .then(() => undefined)
      .catch((error) => {
        initializationByBinding.delete(database);
        throw error;
      });
    initializationByBinding.set(database, initialization);
  }

  await initialization;
}

export async function getDatabase(): Promise<D1Database> {
  const database = getD1();

  try {
    await initializeDatabase(database);
  } catch (error) {
    if (error instanceof DatabaseUnavailableError) throw error;
    throw new DatabaseUnavailableError("Database could not be initialized.");
  }

  return database;
}

export function eventStatement(
  database: D1Database,
  eventType: string,
  subjectType: string | null,
  subjectId: string | null,
  payload: Record<string, unknown> = {},
): D1PreparedStatement {
  return database
    .prepare(
      `INSERT INTO event_log
        (id, event_type, subject_type, subject_id, payload_json)
       VALUES (?, ?, ?, ?, ?)`,
    )
    .bind(stableId("evt"), eventType, subjectType, subjectId, JSON.stringify(payload));
}

export function stableId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}
