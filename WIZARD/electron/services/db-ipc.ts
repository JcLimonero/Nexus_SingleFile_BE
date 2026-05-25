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
 * Reads REFERENCE_DB_NAME from config/central.env. Returns the empty string
 * if the file or key is missing — caller then falls back to the curated
 * migrations.ts subset.
 */
function getReferenceDbName(): string {
  try {
    const p = centralEnvPath();
    if (!fs.existsSync(p)) return '';
    const env = parseEnv(fs.readFileSync(p, 'utf8'));
    return (env['REFERENCE_DB_NAME'] ?? '').trim();
  } catch {
    return '';
  }
}

/**
 * Clones every base table + view from `sourceDbName` (on the same MySQL
 * server as `cfg`) into the database `cfg.database`. Mirrors what the
 * PHP spark db:clone-schema does. Skip-on-exists semantics.
 *
 * Returns { ok, baseCreated, viewsCreated, baseSkipped, viewsSkipped, failed }.
 */
async function cloneFullSchema(
  cfg: DbConnectionConfig,
  sourceDbName: string,
): Promise<{ ok: boolean; baseCreated: number; viewsCreated: number; baseSkipped: number; viewsSkipped: number; failed: Array<{ name: string; error: string }> }> {
  if (!cfg.database) throw new Error('Target DB required');
  if (!/^[A-Za-z0-9_]+$/.test(sourceDbName)) throw new Error('Invalid source DB name');

  const failed: Array<{ name: string; error: string }> = [];
  let baseCreated = 0, viewsCreated = 0, baseSkipped = 0, viewsSkipped = 0;

  // We need 2 connections: one to source (no database in cfg → manual SELECT)
  // and one to target. Opening them in sequence keeps things simple.
  await withConnection({ ...cfg, database: undefined }, async (conn) => {
    await conn.query('SET FOREIGN_KEY_CHECKS = 0');

    // Discover base tables vs views via information_schema
    const [rows]: any = await conn.query(
      "SELECT TABLE_NAME, TABLE_TYPE FROM information_schema.TABLES WHERE TABLE_SCHEMA = ?",
      [sourceDbName],
    );
    const baseTables: string[] = [];
    const views: string[] = [];
    for (const r of rows) {
      if (r.TABLE_TYPE === 'VIEW') views.push(r.TABLE_NAME);
      else baseTables.push(r.TABLE_NAME);
    }

    // Check which already exist on target
    const [existingRows]: any = await conn.query(
      "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ?",
      [cfg.database],
    );
    const existing: Set<string> = new Set(existingRows.map((r: any) => r.TABLE_NAME));

    // 1) Base tables
    for (const t of baseTables) {
      if (existing.has(t)) { baseSkipped++; continue; }
      try {
        const [r]: any = await conn.query(`SHOW CREATE TABLE \`${sourceDbName}\`.\`${t}\``);
        const ddl = r[0]?.['Create Table'];
        if (!ddl) { failed.push({ name: t, error: 'no DDL' }); continue; }
        // Target the new DB — SHOW CREATE TABLE returns the bare CREATE TABLE
        // statement without DB qualifier, which is what we want.
        await conn.query(`USE \`${cfg.database}\``);
        await conn.query(ddl);
        baseCreated++;
        await conn.query(`USE \`${sourceDbName}\``); // restore for next SHOW CREATE
      } catch (e) {
        failed.push({ name: t, error: (e as Error).message });
      }
    }

    // 2) Views — strip DEFINER + rewrite source-DB-qualified refs to target DB
    for (const v of views) {
      if (existing.has(v)) { viewsSkipped++; continue; }
      try {
        const [r]: any = await conn.query(`SHOW CREATE VIEW \`${sourceDbName}\`.\`${v}\``);
        let ddl = r[0]?.['Create View'];
        if (!ddl) { failed.push({ name: v, error: 'no view DDL' }); continue; }
        ddl = ddl.replace(/DEFINER\s*=\s*`[^`]+`@`[^`]+`\s*/i, '');
        ddl = ddl.replace(/SQL\s+SECURITY\s+DEFINER\s*/i, 'SQL SECURITY INVOKER ');
        ddl = ddl.split(`\`${sourceDbName}\`.`).join(`\`${cfg.database}\`.`);
        await conn.query(`USE \`${cfg.database}\``);
        await conn.query(ddl);
        viewsCreated++;
      } catch (e) {
        failed.push({ name: `view ${v}`, error: (e as Error).message });
      }
    }

    await conn.query('SET FOREIGN_KEY_CHECKS = 1');
  });

  return { ok: failed.length === 0, baseCreated, viewsCreated, baseSkipped, viewsSkipped, failed };
}

/**
 * Phase 0b rename + Phase A additions, idempotent. Run AFTER cloneFullSchema
 * so the target has file_status / file_sub_status from the source (which then
 * get renamed) and the catalog tables exist (so the ALTERs work).
 */
async function applyTenantSchemaUpgrades(cfg: DbConnectionConfig): Promise<{ ok: boolean; log: string[]; message?: string }> {
  const log: string[] = [];
  try {
    await withConnection(cfg, async (c) => {
      const tableExists = async (name: string): Promise<boolean> => {
        const [r]: any = await c.query(
          "SELECT COUNT(*) AS n FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?",
          [name],
        );
        return (r[0]?.n ?? 0) > 0;
      };
      const colExists = async (table: string, col: string): Promise<boolean> => {
        const [r]: any = await c.query(
          "SELECT COUNT(*) AS n FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?",
          [table, col],
        );
        return (r[0]?.n ?? 0) > 0;
      };

      await c.query('SET FOREIGN_KEY_CHECKS = 0');

      // Phase 0b — rename file_status → file_state, file_sub_status → file_sub_state
      if ((await tableExists('file_status')) && !(await tableExists('file_state'))) {
        await c.query('RENAME TABLE `file_status` TO `file_state`');
        log.push('rename file_status → file_state');
      }
      if ((await tableExists('file_sub_status')) && !(await tableExists('file_sub_state'))) {
        await c.query('RENAME TABLE `file_sub_status` TO `file_sub_state`');
        log.push('rename file_sub_status → file_sub_state');
      }

      // Phase A — client_group + junctions + ALTERs
      if (!(await tableExists('client_group'))) {
        await c.query(`CREATE TABLE client_group (
          id BIGINT NOT NULL AUTO_INCREMENT,
          name VARCHAR(200) NOT NULL,
          description TEXT NULL,
          enabled TINYINT(1) NOT NULL DEFAULT 1,
          registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
          update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          id_last_user_update BIGINT NULL,
          PRIMARY KEY (id),
          UNIQUE KEY uq_client_group_name (name)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
        log.push('+ client_group');
      }
      if (!(await tableExists('client_group_process'))) {
        await c.query(`CREATE TABLE client_group_process (
          id BIGINT NOT NULL AUTO_INCREMENT,
          id_client_group BIGINT NOT NULL,
          id_process BIGINT NOT NULL,
          display_order INT DEFAULT 0,
          enabled TINYINT(1) DEFAULT 1,
          registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
          update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          UNIQUE KEY uq_cgp (id_client_group, id_process)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
        log.push('+ client_group_process');
      }
      if (!(await tableExists('client_group_phase'))) {
        await c.query(`CREATE TABLE client_group_phase (
          id BIGINT NOT NULL AUTO_INCREMENT,
          id_client_group BIGINT NOT NULL,
          id_file_state BIGINT NOT NULL,
          display_order INT DEFAULT 0,
          enabled TINYINT(1) DEFAULT 1,
          registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
          update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          UNIQUE KEY uq_cgph (id_client_group, id_file_state)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
        log.push('+ client_group_phase');
      }
      if ((await tableExists('company')) && !(await colExists('company', 'id_client_group'))) {
        await c.query('ALTER TABLE `company` ADD COLUMN `id_client_group` BIGINT NULL AFTER `id`');
        await c.query('CREATE INDEX `idx_company_client_group` ON `company` (`id_client_group`)');
        log.push('+ company.id_client_group');
      }
      if ((await tableExists('file_state')) && !(await colExists('file_state', 'requires_payment_voucher'))) {
        await c.query('ALTER TABLE `file_state` ADD COLUMN `requires_payment_voucher` TINYINT(1) NOT NULL DEFAULT 0 AFTER `enabled`');
        await c.query('UPDATE `file_state` SET `requires_payment_voucher` = 1 WHERE `id` = 2');
        log.push('+ file_state.requires_payment_voucher (Liquidación backfilled)');
      }

      await c.query('SET FOREIGN_KEY_CHECKS = 1');
    });
    return { ok: true, log };
  } catch (e) {
    return { ok: false, log, message: (e as Error).message };
  }
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

      // 3. Create tenant DB + apply full schema
      log.push(`Creando base de datos del tenant ${payload.tenant.db.database}…`);
      const dbResult = await createDatabase(payload.tenant.db, payload.tenant.db.database);
      if (!dbResult.ok) return { ok: false, log, message: dbResult.message };

      // Prefer cloning the FULL schema from a reference DB (configured via
      // REFERENCE_DB_NAME in config/central.env). Falls back to the curated
      // 17-table subset only if no reference is set.
      const refDb = getReferenceDbName();
      if (refDb) {
        log.push(`Clonando schema completo desde \`${refDb}\`…`);
        const clone = await cloneFullSchema(payload.tenant.db, refDb);
        log.push(`  base: +${clone.baseCreated} created, ${clone.baseSkipped} skipped`);
        log.push(`  views: +${clone.viewsCreated} created, ${clone.viewsSkipped} skipped`);
        if (clone.failed.length) {
          // Views with missing-table errors are expected (they get re-created
          // when their tables exist on next run); only base-table failures abort.
          const blocking = clone.failed.filter((f) => !f.name.startsWith('view '));
          if (blocking.length) {
            return { ok: false, log, message: `Schema clone falló: ${blocking.map((f) => f.name + ': ' + f.error).join('; ')}` };
          }
          log.push(`  views con FK pendientes: ${clone.failed.length} (no bloquea — los re-crearemos al final si aplica)`);
        }

        log.push('Aplicando rename file_status → file_state + Phase A…');
        const up = await applyTenantSchemaUpgrades(payload.tenant.db);
        up.log.forEach((l) => log.push(`  ${l}`));
        if (!up.ok) {
          return { ok: false, log, message: `Schema upgrades fallaron: ${up.message}` };
        }
      } else {
        log.push('REFERENCE_DB_NAME no configurado — usando subset curado de 17 tablas (no recomendado para producción)…');
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

      // 5. Insert client_group + companies + agencies + processes assignment
      log.push('Insertando jerarquía cliente_group → companies → agencias…');
      await withConnection(payload.tenant.db, async (c) => {
        const [g]: any = await c.query(
          'INSERT INTO client_group (name, description) VALUES (?, ?)',
          [payload.clientGroup.name, payload.clientGroup.description ?? null],
        );
        const clientGroupId = g.insertId;

        const companyIds: number[] = [];
        for (const co of payload.companies) {
          // company in tenant DB might use different columns; we try common shape with id_client_group
          const [cr]: any = await c.query(
            'INSERT INTO company (name, id_client_group) VALUES (?, ?)',
            [co.name, clientGroupId],
          );
          companyIds.push(cr.insertId);
        }

        for (const a of payload.agencies) {
          const idCompany = companyIds[a.companyIndex] ?? companyIds[0];
          await c.query(
            'INSERT INTO agency (name, id_company) VALUES (?, ?)',
            [a.name, idCompany],
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
      });

      // 6. Admin user
      log.push('Creando usuario administrador del tenant…');
      const hash = await bcryptHash(payload.admin.password);
      await withConnection(payload.tenant.db, async (c) => {
        await c.query(
          'INSERT INTO `user` (mail, password, name, enabled) VALUES (?, ?, ?, 1)',
          [payload.admin.email, hash, payload.admin.name ?? payload.admin.email],
        );
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

      const placeholders = cols.map(() => '?').join(', ');
      const sql = `INSERT INTO \`${table}\` (${cols.map((cc) => `\`${cc}\``).join(', ')}) VALUES (${placeholders})`;
      let total = 0;
      for (const r of rows) {
        await c.query(sql, cols.map((k) => r[k] ?? null));
        total++;
      }
      return total;
    });
    if (inserted === -1) return { ok: true, inserted: 0, message: `skipped: table ${table} not in tenant DB` };
    return { ok: true, inserted };
  } catch (e) {
    return { ok: false, message: (e as Error).message };
  }
}
