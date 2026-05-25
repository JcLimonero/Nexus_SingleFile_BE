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

/** Same resolution but for config/central.ini at the repo root. */
function centralIniPath(): string {
  const candidates = [
    path.join(__dirname, '..', '..', '..', 'config', 'central.ini'),
    path.join(process.resourcesPath || '', 'config', 'central.ini'),
  ];
  for (const c of candidates) {
    if (c && fs.existsSync(c)) return c;
  }
  return candidates[0];
}

/**
 * Minimal INI parser (sufficient for our simple [section] key = value format).
 * Returns { section: { key: value } }. Empty / commented (; or #) lines skipped.
 */
function parseIni(text: string): Record<string, Record<string, string>> {
  const out: Record<string, Record<string, string>> = {};
  let current = '_';
  out[current] = {};
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith(';') || line.startsWith('#')) continue;
    const sect = line.match(/^\[(.+)\]$/);
    if (sect) {
      current = sect[1].trim();
      out[current] = out[current] ?? {};
      continue;
    }
    const kv = line.match(/^([^=]+?)\s*=\s*(.*)$/);
    if (kv) {
      out[current][kv[1].trim()] = kv[2].trim();
    }
  }
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

      // 3. Create tenant DB + run schema migrations
      log.push(`Creando base de datos del tenant ${payload.tenant.db.database}…`);
      const dbResult = await createDatabase(payload.tenant.db, payload.tenant.db.database);
      if (!dbResult.ok) return { ok: false, log, message: dbResult.message };

      log.push('Aplicando esquema base…');
      const migResult = await executeBatch(payload.tenant.db, schemaMigrations);
      if (!migResult.ok) {
        return { ok: false, log, message: `Migración "${migResult.failed?.name}" falló: ${migResult.failed?.error}` };
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
   * Returns the central DB config from config/central.ini if present.
   * The renderer's CentralDb step uses this to pre-fill the form so ops
   * never types the password manually.
   */
  ipcMain.handle('config:load-central', () => {
    const p = centralIniPath();
    if (!fs.existsSync(p)) {
      return { ok: false, message: `central.ini not found at ${p}` };
    }
    try {
      const ini = parseIni(fs.readFileSync(p, 'utf8'));
      const db = ini['database'] ?? {};
      const adm = ini['admin_be'] ?? {};
      const enc = ini['encryption'] ?? {};
      return {
        ok: true,
        data: {
          central: {
            host: db['host'] ?? '',
            port: parseInt(db['port'] ?? '3306', 10) || 3306,
            user: db['user'] ?? '',
            password: db['password'] ?? '',
            database: db['name'] ?? 'nexfile_central',
          },
          adminApiBase: adm['api_url'] ?? 'http://localhost:8087',
          encryptionKey: enc['tenant_db_key'] ?? '',
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
