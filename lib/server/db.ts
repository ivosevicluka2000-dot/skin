import postgres from "postgres";
import { runtimeSchemaStatements } from "@/db/runtime-schema";

type SqlValue = string | number | boolean | null | Date;

export type SqlResult<T = Record<string, unknown>> = {
  results: T[];
  success: boolean;
};

export interface SqlPreparedStatement {
  bind(...values: SqlValue[]): SqlPreparedStatement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  run<T = Record<string, unknown>>(): Promise<SqlResult<T>>;
  all<T = Record<string, unknown>>(): Promise<SqlResult<T>>;
}

export interface SqlDatabase {
  prepare(query: string): SqlPreparedStatement;
  batch<T = Record<string, unknown>>(
    statements: SqlPreparedStatement[],
  ): Promise<SqlResult<T>[]>;
}

export class DatabaseUnavailableError extends Error {
  constructor(message = "Database service is temporarily unavailable.") {
    super(message);
    this.name = "DatabaseUnavailableError";
  }
}

type SupabaseSql = ReturnType<typeof postgres>;

class SupabasePreparedStatement implements SqlPreparedStatement {
  readonly postgresQuery: string;
  readonly aliases: string[];

  constructor(
    readonly sql: SupabaseSql,
    query: string,
    readonly values: SqlValue[] = [],
  ) {
    this.postgresQuery = toPostgresPlaceholders(query);
    this.aliases = [...query.matchAll(/\bAS\s+([A-Za-z][A-Za-z0-9_]*)/gi)].map(
      (match) => match[1],
    );
  }

  bind(...values: SqlValue[]): SupabasePreparedStatement {
    return new SupabasePreparedStatement(this.sql, this.postgresQuery, values);
  }

  async all<T = Record<string, unknown>>(): Promise<SqlResult<T>> {
    const rows = await this.sql.unsafe(this.postgresQuery, this.values);
    return {
      results: rows.map((row) => restoreCamelCaseAliases(row, this.aliases)) as T[],
      success: true,
    };
  }

  async first<T = Record<string, unknown>>(): Promise<T | null> {
    const result = await this.all<T>();
    return result.results[0] ?? null;
  }

  async run<T = Record<string, unknown>>(): Promise<SqlResult<T>> {
    return this.all<T>();
  }
}

class SupabaseDatabase implements SqlDatabase {
  constructor(readonly sql: SupabaseSql) {}

  prepare(query: string): SupabasePreparedStatement {
    return new SupabasePreparedStatement(this.sql, query);
  }

  async batch<T = Record<string, unknown>>(
    statements: SqlPreparedStatement[],
  ): Promise<SqlResult<T>[]> {
    const prepared = statements.map((statement) => {
      if (!(statement instanceof SupabasePreparedStatement) || statement.sql !== this.sql) {
        throw new Error("Cannot batch statements from another database connection.");
      }
      return statement;
    });
    const rows = await this.sql.begin(async (transaction) => {
      const results: Record<string, unknown>[][] = [];
      for (const statement of prepared) {
        const result = await transaction.unsafe(
          statement.postgresQuery,
          statement.values,
        );
        results.push(
          result.map((row) => restoreCamelCaseAliases(row, statement.aliases)),
        );
      }
      return results;
    });
    return rows.map((result) => ({ results: result as T[], success: true }));
  }
}

let database: SupabaseDatabase | null = null;
let initialization: Promise<void> | null = null;

function databaseUrl(): string {
  const value = process.env.SUPABASE_DATABASE_URL ?? process.env.DATABASE_URL;
  if (!value) {
    throw new DatabaseUnavailableError(
      "Set SUPABASE_DATABASE_URL to the Supabase transaction-pooler connection string.",
    );
  }
  return value;
}

function getConnection(): SupabaseDatabase {
  database ??= new SupabaseDatabase(
    postgres(databaseUrl(), {
      prepare: false,
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      max_lifetime: 60 * 30,
    }),
  );
  return database;
}

export async function initializeDatabase(connection: SqlDatabase): Promise<void> {
  initialization ??= connection
    .batch(runtimeSchemaStatements.map((statement) => connection.prepare(statement)))
    .then(() => undefined)
    .catch((error) => {
      initialization = null;
      throw error;
    });

  await initialization;
}

export async function getDatabase(): Promise<SqlDatabase> {
  const connection = getConnection();

  try {
    await initializeDatabase(connection);
  } catch (error) {
    if (error instanceof DatabaseUnavailableError) throw error;
    console.error("Database initialization failed", error);
    throw new DatabaseUnavailableError("Database could not be initialized.");
  }

  return connection;
}

export function eventStatement(
  connection: SqlDatabase,
  eventType: string,
  subjectType: string | null,
  subjectId: string | null,
  payload: Record<string, unknown> = {},
): SqlPreparedStatement {
  return connection
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

function toPostgresPlaceholders(query: string): string {
  let index = 0;
  return query.replaceAll("?", () => `$${++index}`);
}

function restoreCamelCaseAliases(
  row: Record<string, unknown>,
  aliases: string[],
): Record<string, unknown> {
  const normalized = { ...row };
  for (const alias of aliases) {
    const postgresKey = alias.toLowerCase();
    if (alias !== postgresKey && postgresKey in normalized && !(alias in normalized)) {
      normalized[alias] = normalized[postgresKey];
      delete normalized[postgresKey];
    }
  }
  return normalized;
}
