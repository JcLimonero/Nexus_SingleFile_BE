import type { IpcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { testConnection, createDatabase, executeBatch, withConnection, DbConnectionConfig } from './db-connector';
import { schemaMigrations } from './migrations';
import { encryptTenantPassword, bcryptHash } from './crypto';

/**
 * Resolves the DEFAULTS/ folder both in dev (sibling of WIZARD) and in production
 * (when packaged the JSONs ship as extraResources alongside the app).
 */
function defaultsRoot(): string {
  const candidates = [
    path.join(__dirname, '..', '..', '..', 'DEFAULTS'), // dev: WIZARD/dist-electron/.. → WIZARD → repo
    path.join(process.resourcesPath || '', 'DEFAULTS'), // packaged
  ];
  for (const c of candidates) {
    if (c && fs.existsSync(c)) return c;
  }
  return candidates[0];
}

/** Same resolution but for config/central.env at the repo root. */
function centralEnvPath(): string {
  const candidates = [
    path.join(__dirname, '..', '..', '..', 'config', 'central.env'),
    path.join(process.resourcesPath || '', 'config', 'central.env'),
  ];
  for (const c of candidates) {
    if (c && fs.existsSync(c)) return c;
  }
  return candidates[0];
}

/**
 * Minimal .env parser — handles `KEY = value` and `KEY=value`, ignores
 * empty / `#`-commented lines, strips surrounding quotes. Same shape the
 * CI4 .env loader accepts, so the file is interchangeable between the
 * WIZARD (here) and PHP backends.
 */
function parseEnv(text: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const kv = line.match(/^([A-Za-z_][A-Za-z0-9_.]*)\s*=\s*(.*)$/);
    if (!kv) continue;
    let value = kv[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    out[kv[1]] = value;
  }
  return out;
}

/**
 * Resolves the path to the baseline DB scripts (DB/baseline/v<version>/).
 * Defaults to v1.0; can be overridden via env BASELINE_VERSION in central.env
 * (lets ops roll forward to a v1.1 baseline without rebuilding the WIZARD).
 */
function baselineDir(): string | null {
  let version = '1.0';
  try {
    const p = centralEnvPath();
    if (fs.existsSync(p)) {
      const env = parseEnv(fs.readFileSync(p, 'utf8'));
      version = (env['BASELINE_VERSION'] ?? version).trim();
    }
  } catch { /* keep default */ }

  const candidates = [
    path.join(__dirname, '..', '..', '..', 'DB', 'baseline', 'v' + version),
    path.join(process.resourcesPath || '', 'DB', 'baseline', 'v' + version),
  ];
  for (const c of candidates) {
    if (c && fs.existsSync(c)) return c;
  }
  return null;
}

/**
 * Executes a multi-statement SQL script (schema.sql or data.sql) against
 * the target DB. Splits on `;` boundaries that aren't inside quoted strings,
 * preserves DDL/DML semantics. Each statement runs in its own query() call
 * because mysql2 multipleStatements: true is off by default for safety.
 */
async function executeSqlScript(cfg: DbConnectionConfig, scriptPath: string): Promise<{ ok: boolean; executed: number; viewsSkipped: number; failed?: { stmt: string; error: string } }> {
  const text = fs.readFileSync(scriptPath, 'utf8');
  const stmts = splitSqlStatements(text);
  let executed = 0;
  let viewsSkipped = 0;
  try {
    await withConnection(cfg, async (c) => {
      for (const s of stmts) {
        try {
          await c.query(s);
          executed++;
        } catch (e) {
          // VIEW/DROP VIEW failures are non-fatal — the source schema in
          // `nexfile` ships with stale view definitions that reference
          // tables already renamed by migration #038 (snake_case sweep).
          // Those views are broken in the source too; skip them and keep
          // applying real DDL.
          const head = s.replace(/^\s+/, '').toUpperCase();
          const isViewStmt = head.startsWith('CREATE ALGORITHM') || head.includes('VIEW ') || head.startsWith('DROP VIEW');
          if (isViewStmt) {
            viewsSkipped++;
            continue;
          }
          throw new Error(`stmt #${executed + 1} (${s.slice(0, 60).replace(/\s+/g, ' ')}…): ${(e as Error).message}`);
        }
      }
    });
    return { ok: true, executed, viewsSkipped };
  } catch (e) {
    const msg = (e as Error).message;
    return { ok: false, executed, viewsSkipped, failed: { stmt: msg.split(':')[0] ?? 'unknown', error: msg } };
  }
}

/** Simple SQL splitter that respects single-quoted string literals + escaped quotes. */
function splitSqlStatements(text: string): string[] {
  const out: string[] = [];
  let buf = '';
  let inSingle = false;
  let inDouble = false;
  let inBacktick = false;
  let inLineComment = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inLineComment) {
      if (ch === '\n') inLineComment = false;
      buf += ch;
      continue;
    }
    if (!inSingle && !inDouble && !inBacktick && ch === '-' && next === '-') {
      inLineComment = true;
      buf += ch;
      continue;
    }

    if (!inDouble && !inBacktick && ch === "'" && text[i - 1] !== '\\') {
      // handle escaped quote ''
      if (inSingle && next === "'") { buf += "''"; i++; continue; }
      inSingle = !inSingle;
    } else if (!inSingle && !inBacktick && ch === '"' && text[i - 1] !== '\\') {
      inDouble = !inDouble;
    } else if (!inSingle && !inDouble && ch === '`') {
      inBacktick = !inBacktick;
    }

    if (ch === ';' && !inSingle && !inDouble && !inBacktick) {
      // Always strip comment-only lines (--..., #...) from the buffer,
      // then keep the statement if anything non-comment remains.
      const cleaned = buf
        .split('\n')
        .filter((l) => !/^\s*(--|#)/.test(l))
        .join('\n')
        .trim();
      if (cleaned) out.push(cleaned);
      buf = '';
    } else {
      buf += ch;
    }
  }
  const tail = buf
    .split('\n')
    .filter((l) => !/^\s*(--|#)/.test(l))
    .join('\n')
    .trim();
  if (tail) out.push(tail);
  return out;
}


/** Payload for the final "create everything" step. */
interface ProvisionPayload {
  central: DbConnectionConfig;
  superAdminToken?: string; // for audit (created_by_super_admin); not required for MVP
  tenant: {
    slug: string;
    name: string;
    db: DbConnectionConfig & { database: string };
    encryptionKey: string; // hex32 — same one in BE/ and ADMIN_BE/ envs
  };
  clientGroup: { name: string; description?: string };
  companies: Array<{ name: string; rfc?: string }>;
  agencies: Array<{ companyIndex: number; name: string; address?: string }>;
  processes: Array<{ id?: number; name: string; display_order: number; requires_payment_voucher: number; enabled?: number }>;
  catalogSeeds: Record<string, any[]>; // table → rows (already edited by admin in step 8)
  admin: { email: string; password: string; name?: string };
  branding?: { appName?: string; primaryColor?: string; logoBase64?: string };
  integrations?: { backblaze?: Record<string, string>; ordersApi?: Record<string, string> };
}

export function registerDbHandlers(ipcMain: IpcMain): void {
  ipcMain.handle('db:test-connection', (_e, cfg: DbConnectionConfig) => testConnection(cfg));

  ipcMain.handle('db:create-database', (_e, cfg: DbConnectionConfig, dbName: string) =>
    createDatabase(cfg, dbName),
  );

  ipcMain.handle('db:run-migrations', async (_e, cfg: DbConnectionConfig) => {
    if (!cfg.database) return { ok: false, message: 'Falta el nombre de la base de datos.' };
    return executeBatch(cfg, schemaMigrations);
  });

  ipcMain.handle('db:seed-table', async (_e, cfg: DbConnectionConfig, table: string, rows: any[]) => {
    if (!cfg.database) return { ok: false, message: 'Falta el nombre de la base de datos.' };
    if (!Array.isArray(rows) || rows.length === 0) return { ok: true, inserted: 0 };
    if (!/^[A-Za-z0-9_]+$/.test(table)) return { ok: false, message: 'Tabla inválida.' };

    try {
      const inserted = await withConnection(cfg, async (c) => {
        const cols = Object.keys(rows[0]);
        const placeholders = cols.map(() => '?').join(', ');
        const sql = `INSERT INTO \`${table}\` (${cols.map((cc) => `\`${cc}\``).join(', ')}) VALUES (${placeholders})`;
        let total = 0;
        for (const r of rows) {
          await c.query(sql, cols.map((k) => r[k] ?? null));
          total++;
        }
        return total;
      });
      return { ok: true, inserted };
    } catch (e) {
      return { ok: false, message: (e as Error).message };
    }
  });

  ipcMain.handle('defaults:load', (_e, table: string) => {
    if (!/^[A-Za-z0-9_]+$/.test(table)) return { ok: false, message: 'Tabla inválida.' };
    const file = path.join(defaultsRoot(), `${table}.json`);
    if (!fs.existsSync(file)) return { ok: false, message: `No hay defaults para ${table}` };
    try {
      const raw = fs.readFileSync(file, 'utf8');
      return { ok: true, rows: JSON.parse(raw) };
    } catch (e) {
      return { ok: false, message: (e as Error).message };
    }
  });

  /** Super-admin login: POST to ADMIN_BE /api/admin/auth/login. */
  ipcMain.handle('admin:login', async (_e, apiBase: string, email: string, password: string) => {
    try {
      const res = await fetch(`${apiBase}/api/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json = (await res.json()) as any;
      if (!res.ok || !json?.success) {
        return { ok: false, message: json?.message ?? 'Login fallido' };
      }
      return { ok: true, token: json.data.access_token, user: json.data.user };
    } catch (e) {
      return { ok: false, message: (e as Error).message };
    }
  });

  /**
   * The big one: provisions a tenant end-to-end. Idempotent at the per-row
   * level — if anything fails the partial state is left for the admin to
   * inspect (no rollback across DBs because we can't transact two MySQLs).
   */
  ipcMain.handle('wizard:provision', async (_e, payload: ProvisionPayload) => {
    const log: string[] = [];

    try {
      // 1. Encrypt tenant DB password + insert tenant row in central
      log.push('Cifrando contraseña del tenant…');
      const encrypted = encryptTenantPassword(payload.tenant.db.password, payload.tenant.encryptionKey);

      log.push('Registrando tenant en central DB…');
      const tenantId = await withConnection(payload.central, async (c) => {
        const [r]: any = await c.query(
          'INSERT INTO tenant (slug, name, status, db_host, db_port, db_name, db_username, db_password_encrypted) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [
            payload.tenant.slug,
            payload.tenant.name,
            'active',
            payload.tenant.db.host,
            payload.tenant.db.port,
            payload.tenant.db.database,
            payload.tenant.db.user,
            encrypted,
          ],
        );
        // tenant_subscription baseline — 30 days
        const now = new Date();
        const next = new Date(now.getTime() + 30 * 86400_000);
        await c.query(
          'INSERT INTO tenant_subscription (id_tenant, plan, current_period_start, current_period_end, next_billing_at) VALUES (?, ?, ?, ?, ?)',
          [r.insertId, 'standard', now, next, next],
        );
        return r.insertId as number;
      });
      log.push(`tenant row id=${tenantId}`);

      // 2. Write integrations to tenant_config in central
      const cfgRows: Array<[string, string, string, number]> = [];
      const push = (key: string, val: string, cat: string, sens: number) => {
        if (val !== undefined && val !== null) cfgRows.push([key, String(val), cat, sens]);
      };
      const bb = payload.integrations?.backblaze ?? {};
      for (const [k, v] of Object.entries(bb)) push(k, v, 'backblaze', 1);
      const oa = payload.integrations?.ordersApi ?? {};
      for (const [k, v] of Object.entries(oa)) push(k, v, 'orders_api', /password|secret|key/i.test(k) ? 1 : 0);
      if (cfgRows.length) {
        log.push(`Guardando ${cfgRows.length} entradas de configuración…`);
        await withConnection(payload.central, async (c) => {
          for (const [key, val, cat, sens] of cfgRows) {
            await c.query(
              'INSERT INTO tenant_config (id_tenant, config_key, config_value, category, sensitive) VALUES (?, ?, ?, ?, ?)',
              [tenantId, key, val, cat, sens],
            );
          }
        });
      }

      // 3. Create tenant DB + apply baseline schema + data
      log.push(`Creando base de datos del tenant ${payload.tenant.db.database}…`);
      const dbResult = await createDatabase(payload.tenant.db, payload.tenant.db.database);
      if (!dbResult.ok) return { ok: false, log, message: dbResult.message };

      // Prefer applying the versioned baseline scripts (DB/baseline/v<N>/).
      // Falls back to the legacy curated migrations.ts only if the baseline
      // directory is missing (dev sandbox without the dump available).
      const baseDir = baselineDir();
      if (baseDir) {
        log.push(`Aplicando baseline desde ${path.basename(baseDir)}…`);
        const schemaFile = path.join(baseDir, 'schema.sql');
        const dataFile   = path.join(baseDir, 'data.sql');

        if (!fs.existsSync(schemaFile)) {
          return { ok: false, log, message: `schema.sql no encontrado en ${baseDir}` };
        }
        log.push('  → schema.sql (CREATE TABLE / VIEW)');
        const r1 = await executeSqlScript(payload.tenant.db, schemaFile);
        log.push(`    ${r1.executed} statements aplicados` +
                 (r1.viewsSkipped ? `, ${r1.viewsSkipped} views legacy omitidas` : ''));
        if (!r1.ok) {
          return { ok: false, log, message: `Schema falló en ${r1.failed?.error}` };
        }

        if (fs.existsSync(dataFile)) {
          log.push('  → data.sql (catálogos base)');
          const r2 = await executeSqlScript(payload.tenant.db, dataFile);
          log.push(`    ${r2.executed} statements aplicados`);
          if (!r2.ok) {
            return { ok: false, log, message: `Data falló en ${r2.failed?.error}` };
          }
        } else {
          log.push('  → data.sql no presente (skip seed base)');
        }
      } else {
        log.push('DB/baseline/v* no encontrado — usando subset curado de la WIZARD (no recomendado)…');
        const migResult = await executeBatch(payload.tenant.db, schemaMigrations);
        if (!migResult.ok) {
          return { ok: false, log, message: `Migración "${migResult.failed?.name}" falló: ${migResult.failed?.error}` };
        }
      }

      // 4. Seed catalog rows into tenant DB
      for (const [table, rows] of Object.entries(payload.catalogSeeds || {})) {
        if (!Array.isArray(rows) || !rows.length) continue;
        log.push(`Sembrando ${table} (${rows.length} filas)…`);
        const seed = await seedRows(payload.tenant.db, table, rows);
        if (!seed.ok) return { ok: false, log, message: seed.message };
      }

      // 5. Admin user FIRST — every other row's id_last_user_update FK points to user.id
      // Note: legacy `user` schema has no AUTO_INCREMENT on id, password lives in
      // `user_pass`, and id_user_rol defaults to 0 (FK to user_role would fail).
      // Assign id=1 (first user) and id_user_rol=7 (Administrador, seeded by data.sql).
      log.push('Creando usuario administrador del tenant…');
      const hash = await bcryptHash(payload.admin.password);
      const adminUserId = 1;
      const adminRoleId = 7;
      await withConnection(payload.tenant.db, async (c) => {
        await c.query('SET FOREIGN_KEY_CHECKS = 0');
        await c.query(
          'INSERT INTO `user` (id, mail, user_pass, name, id_user_rol, enabled, password_migrated) VALUES (?, ?, ?, ?, ?, 1, 1)',
          [adminUserId, payload.admin.email, hash, payload.admin.name ?? payload.admin.email, adminRoleId],
        );
        await c.query('SET FOREIGN_KEY_CHECKS = 1');
      });
      log.push(`  admin user id=${adminUserId} (rol=${adminRoleId} Administrador)`);

      // 6. Hierarchy: client_group → companies → agencies, then client_group_process.
      // Every INSERT explicitly passes id_last_user_update = adminUserId because the
      // source schema has DEFAULT '0' on that column + FK to user.id, and user(id=0)
      // doesn't exist → naked INSERTs trip the FK.
      log.push('Insertando jerarquía cliente_group → companies → agencias…');
      await withConnection(payload.tenant.db, async (c) => {
        await c.query('SET FOREIGN_KEY_CHECKS = 0');

        const [g]: any = await c.query(
          'INSERT INTO client_group (name, description, id_last_user_update) VALUES (?, ?, ?)',
          [payload.clientGroup.name, payload.clientGroup.description ?? null, adminUserId],
        );
        const clientGroupId = g.insertId;

        const companyIds: number[] = [];
        for (const co of payload.companies) {
          const [cr]: any = await c.query(
            'INSERT INTO company (name, id_client_group, id_last_user_update) VALUES (?, ?, ?)',
            [co.name, clientGroupId, adminUserId],
          );
          companyIds.push(cr.insertId);
        }

        for (const a of payload.agencies) {
          const idCompany = companyIds[a.companyIndex] ?? companyIds[0];
          await c.query(
            'INSERT INTO agency (name, id_company, id_last_user_update) VALUES (?, ?, ?)',
            [a.name, idCompany, adminUserId],
          );
        }

        // Per-group process assignment with display_order + voucher flag
        for (const p of payload.processes) {
          if (p.id) {
            await c.query(
              'INSERT INTO client_group_process (id_client_group, id_process, display_order, enabled) VALUES (?, ?, ?, ?)',
              [clientGroupId, p.id, p.display_order, p.enabled ?? 1],
            );
          }
        }

        await c.query('SET FOREIGN_KEY_CHECKS = 1');
      });

      log.push('✅ Tenant provisionado correctamente.');
      return { ok: true, tenantId, log };
    } catch (e) {
      log.push(`❌ Error: ${(e as Error).message}`);
      return { ok: false, log, message: (e as Error).message };
    }
  });

  ipcMain.handle('fs:pick-file', () => ({ ok: false, message: 'TODO: file picker for branding logo' }));

  /**
   * Returns the central DB config from config/central.env if present.
   * Same .env shape as BE/.env and ADMIN_BE/.env for consistency —
   * the renderer's CentralDb step uses this to pre-fill the form so
   * ops never types the password manually.
   */
  ipcMain.handle('config:load-central', () => {
    const p = centralEnvPath();
    if (!fs.existsSync(p)) {
      return { ok: false, message: `central.env not found at ${p}` };
    }
    try {
      const env = parseEnv(fs.readFileSync(p, 'utf8'));
      return {
        ok: true,
        data: {
          central: {
            host: env['CENTRAL_DB_HOST'] ?? '',
            port: parseInt(env['CENTRAL_DB_PORT'] ?? '3306', 10) || 3306,
            user: env['CENTRAL_DB_USER'] ?? '',
            password: env['CENTRAL_DB_PASSWORD'] ?? '',
            database: env['CENTRAL_DB_NAME'] ?? 'nexfile_central',
          },
          adminApiBase: env['ADMIN_BE_URL'] ?? 'http://localhost:8087',
          encryptionKey: env['TENANT_DB_ENCRYPTION_KEY'] ?? '',
          superAdminEmail:    env['SUPER_ADMIN_EMAIL']    ?? '',
          superAdminPassword: env['SUPER_ADMIN_PASSWORD'] ?? '',
        },
        path: p,
      };
    } catch (e) {
      return { ok: false, message: (e as Error).message };
    }
  });
}

async function seedRows(cfg: DbConnectionConfig, table: string, rows: any[]) {
  try {
    const inserted = await withConnection(cfg, async (c) => {
      // Check that the table exists in this DB — if not, skip silently so wizard
      // can be used against tenant DBs that only have a partial schema.
      const [check]: any = await c.query(
        'SELECT COUNT(*) AS n FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?',
        [table],
      );
      if (!check[0] || check[0].n === 0) return -1; // sentinel: skipped

      // Find which of the first row's columns actually exist on the target table
      const [tCols]: any = await c.query(
        'SELECT COLUMN_NAME AS col FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?',
        [table],
      );
      const tableCols: Set<string> = new Set(tCols.map((r: any) => r.col));
      const cols = Object.keys(rows[0]).filter((k) => rows[0][k] !== undefined && tableCols.has(k));
      if (!cols.length) return 0;

      // Replace-mode: TRUNCATE first so user's selections in Step 8 (catalogos)
      // override whatever data.sql seeded. With FK_CHECKS = 0 around it so
      // tables with incoming FKs from other catalog tables can still be wiped.
      await c.query('SET FOREIGN_KEY_CHECKS = 0');
      try {
        await c.query(`TRUNCATE TABLE \`${table}\``);
      } catch {
        // TRUNCATE may fail on some MySQL configs against tables with FKs;
        // fall back to DELETE (safe, just slower).
        await c.query(`DELETE FROM \`${table}\``);
      }

      const placeholders = cols.map(() => '?').join(', ');
      const sql = `INSERT INTO \`${table}\` (${cols.map((cc) => `\`${cc}\``).join(', ')}) VALUES (${placeholders})`;
      let total = 0;
      for (const r of rows) {
        await c.query(sql, cols.map((k) => r[k] ?? null));
        total++;
      }
      await c.query('SET FOREIGN_KEY_CHECKS = 1');
      return total;
    });
    if (inserted === -1) return { ok: true, inserted: 0, message: `skipped: table ${table} not in tenant DB` };
    return { ok: true, inserted };
  } catch (e) {
    return { ok: false, message: (e as Error).message };
  }
}
