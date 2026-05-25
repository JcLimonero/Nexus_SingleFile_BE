import mysql, { Connection, ConnectionOptions } from 'mysql2/promise';

export interface DbConnectionConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  /** Optional — once the wizard creates the DB, subsequent ops set this. */
  database?: string;
}

export interface OperationResult {
  ok: boolean;
  message?: string;
  data?: unknown;
}

/**
 * Open a mysql2 connection. Caller is responsible for end()-ing it.
 */
export async function open(cfg: DbConnectionConfig): Promise<Connection> {
  const opts: ConnectionOptions = {
    host: cfg.host,
    port: cfg.port || 3306,
    user: cfg.user,
    password: cfg.password,
    multipleStatements: false,
    connectTimeout: 10_000
  };
  if (cfg.database) opts.database = cfg.database;
  return mysql.createConnection(opts);
}

export async function withConnection<T>(cfg: DbConnectionConfig, fn: (c: Connection) => Promise<T>): Promise<T> {
  const conn = await open(cfg);
  try {
    return await fn(conn);
  } finally {
    await conn.end();
  }
}

export async function testConnection(cfg: DbConnectionConfig): Promise<OperationResult> {
  try {
    await withConnection(cfg, async (c) => {
      const [rows] = await c.query('SELECT VERSION() AS v');
      return rows;
    });
    return { ok: true, message: 'Conexión OK' };
  } catch (e) {
    return { ok: false, message: (e as Error).message };
  }
}

export async function createDatabase(cfg: DbConnectionConfig, dbName: string): Promise<OperationResult> {
  if (!/^[A-Za-z0-9_]+$/.test(dbName)) {
    return { ok: false, message: 'nombre de DB inválido (solo alfanumérico + underscore).' };
  }
  try {
    await withConnection({ ...cfg, database: undefined }, async (c) => {
      await c.query(
        `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
      );
    });
    return { ok: true, message: `Base de datos "${dbName}" lista.` };
  } catch (e) {
    return { ok: false, message: (e as Error).message };
  }
}

/**
 * Execute a list of SQL statements sequentially inside a single connection.
 * Stops at the first failure and returns the partial result.
 */
export async function executeBatch(
  cfg: DbConnectionConfig,
  statements: Array<{ name: string; sql: string }>
): Promise<{ ok: boolean; executed: number; failed?: { name: string; error: string } }> {
  let executed = 0;
  try {
    await withConnection(cfg, async (c) => {
      for (const stmt of statements) {
        try {
          await c.query(stmt.sql);
          executed++;
        } catch (e) {
          throw new Error(`[${stmt.name}] ${(e as Error).message}`);
        }
      }
    });
    return { ok: true, executed };
  } catch (e) {
    const msg = (e as Error).message;
    const match = msg.match(/^\[(.+?)\]\s+(.*)$/);
    return {
      ok: false,
      executed,
      failed: { name: match ? match[1] : 'unknown', error: match ? match[2] : msg }
    };
  }
}
