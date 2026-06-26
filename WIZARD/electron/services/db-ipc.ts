import type { IpcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { testConnection, createDatabase, executeBatch, withConnection, DbConnectionConfig } from './db-connector';
import { schemaMigrations } from './migrations';
import { encryptTenantPassword, decryptTenantPassword, bcryptHash } from './crypto';

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
  /** Fases del workflow (expedient_state). Si está vacío, no se siembran. */
  expedientPhases?: Array<{
    id: number;
    name: string;
    display_order: number | null;
    enabled: number;
    requires_payment_voucher: number;
    is_navigable: number;
    allows_document_upload: number;
    is_terminal: number;
    is_system: number;
  }>;
  /** Subfases (expedient_sub_state) ligadas a fases por id_expedient_state. */
  expedientSubStates?: Array<{
    id: number;
    id_expedient_state: number;
    name: string;
    enabled: number;
  }>;
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
   * Atomic provision with auto-rollback. If anything between "central INSERT"
   * and the final success fails, we DROP the tenant DB and DELETE the central
   * tenant row (cascades to subscription/config/history via FK ON DELETE CASCADE).
   * The user can fix the cause and retry from Step 14 with a clean slate.
   *
   * Pre-checks: refuse if the tenant DB already exists (we won't overwrite
   * customer data) or if the slug is already registered in central.
   */
  ipcMain.handle('wizard:provision', async (_e, payload: ProvisionPayload) => {
    const log: string[] = [];
    let tenantId: number | null = null;
    let tenantDbCreated = false;

    // === Rollback helper ===
    const rollback = async (reason: string) => {
      log.push(`❌ ${reason}`);
      log.push('🧹 Rollback automático…');
      try {
        if (tenantDbCreated && payload.tenant.db.database) {
          await withConnection({ ...payload.central, database: undefined }, async (c) => {
            await c.query(`DROP DATABASE IF EXISTS \`${payload.tenant.db.database}\``);
          });
          log.push(`  · tenant DB \`${payload.tenant.db.database}\` eliminada`);
        }
        if (tenantId !== null) {
          await withConnection(payload.central, async (c) => {
            // tenant_subscription / tenant_config / tenant_status_history cascade
            await c.query('DELETE FROM tenant WHERE id = ?', [tenantId]);
          });
          log.push(`  · central tenant id=${tenantId} eliminada (cascade)`);
        }
        log.push('✔ Rollback completo. Puedes corregir el problema y reintentar.');
      } catch (e) {
        log.push(`  ⚠ Rollback parcial: ${(e as Error).message}`);
      }
    };

    try {
      // === Pre-checks ===
      log.push('Validando que el tenant no exista previamente…');
      const conflict = await withConnection(payload.central, async (c) => {
        const [rs]: any = await c.query('SELECT id FROM tenant WHERE slug = ? LIMIT 1', [payload.tenant.slug]);
        return rs[0]?.id ?? null;
      });
      if (conflict) {
        return { ok: false, log: [...log, `❌ El slug \`${payload.tenant.slug}\` ya está registrado en central (id=${conflict}). Borra ese tenant o elige otro slug.`], message: 'slug_conflict' };
      }
      const dbExists = await withConnection({ ...payload.central, database: undefined }, async (c) => {
        const [rs]: any = await c.query('SELECT SCHEMA_NAME FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = ?', [payload.tenant.db.database]);
        return rs.length > 0;
      });
      if (dbExists) {
        return { ok: false, log: [...log, `❌ La base \`${payload.tenant.db.database}\` ya existe en el servidor. Borra esa DB o elige otro nombre para no sobrescribir datos.`], message: 'db_exists' };
      }

      // 1. Encrypt tenant DB password + insert tenant row in central
      log.push('Cifrando contraseña del tenant…');
      const encrypted = encryptTenantPassword(payload.tenant.db.password, payload.tenant.encryptionKey);

      log.push('Registrando tenant en central DB…');
      tenantId = await withConnection(payload.central, async (c) => {
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
      if (!dbResult.ok) {
        await rollback(dbResult.message ?? 'No se pudo crear la base de datos');
        return { ok: false, log, message: dbResult.message };
      }
      tenantDbCreated = true;

      // Prefer applying the versioned baseline scripts (DB/baseline/v<N>/).
      // Falls back to the legacy curated migrations.ts only if the baseline
      // directory is missing (dev sandbox without the dump available).
      const baseDir = baselineDir();
      if (baseDir) {
        log.push(`Aplicando baseline desde ${path.basename(baseDir)}…`);
        const schemaFile = path.join(baseDir, 'schema.sql');
        const dataFile   = path.join(baseDir, 'data.sql');

        if (!fs.existsSync(schemaFile)) {
          const msg = `schema.sql no encontrado en ${baseDir}`;
          await rollback(msg);
          return { ok: false, log, message: msg };
        }
        log.push('  → schema.sql (CREATE TABLE / VIEW)');
        const r1 = await executeSqlScript(payload.tenant.db, schemaFile);
        log.push(`    ${r1.executed} statements aplicados` +
                 (r1.viewsSkipped ? `, ${r1.viewsSkipped} views legacy omitidas` : ''));
        if (!r1.ok) {
          const msg = `Schema falló en ${r1.failed?.error}`;
          await rollback(msg);
          return { ok: false, log, message: msg };
        }

        if (fs.existsSync(dataFile)) {
          log.push('  → data.sql (catálogos base)');
          const r2 = await executeSqlScript(payload.tenant.db, dataFile);
          log.push(`    ${r2.executed} statements aplicados`);
          if (!r2.ok) {
            const msg = `Data falló en ${r2.failed?.error}`;
            await rollback(msg);
            return { ok: false, log, message: msg };
          }
        } else {
          log.push('  → data.sql no presente (skip seed base)');
        }
      } else {
        log.push('DB/baseline/v* no encontrado — usando subset curado de la WIZARD (no recomendado)…');
        const migResult = await executeBatch(payload.tenant.db, schemaMigrations);
        if (!migResult.ok) {
          const msg = `Migración "${migResult.failed?.name}" falló: ${migResult.failed?.error}`;
          await rollback(msg);
          return { ok: false, log, message: msg };
        }
      }

      // 4. Seed catalog rows into tenant DB
      for (const [table, rows] of Object.entries(payload.catalogSeeds || {})) {
        if (!Array.isArray(rows) || !rows.length) continue;
        log.push(`Sembrando ${table} (${rows.length} filas)…`);
        const seed = await seedRows(payload.tenant.db, table, rows);
        if (!seed.ok) {
          await rollback(seed.message ?? `Seed de ${table} falló`);
          return { ok: false, log, message: seed.message };
        }
      }

      // 4.5 Seed expedient_state + expedient_sub_state (catálogo de fases).
      // Va antes del admin user porque las FK id_last_user_update aceptan NULL
      // o 0 con FOREIGN_KEY_CHECKS=0. TRUNCATE primero por seguridad —
      // si el baseline data.sql empieza a sembrar estas tablas en el futuro
      // (no lo hace hoy), nuestro INSERT manda.
      if (payload.expedientPhases?.length) {
        log.push(`Sembrando expedient_state (${payload.expedientPhases.length} fases)…`);
        await withConnection(payload.tenant.db, async (c) => {
          await c.query('SET FOREIGN_KEY_CHECKS = 0');
          await c.query('TRUNCATE TABLE expedient_state');
          for (const p of payload.expedientPhases!) {
            await c.query(
              `INSERT INTO expedient_state
                 (id, name, enabled, requires_payment_voucher, is_navigable,
                  allows_document_upload, is_terminal, is_system, display_order)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                p.id,
                p.name,
                p.enabled ?? 1,
                p.requires_payment_voucher ?? 0,
                p.is_navigable ?? 1,
                p.allows_document_upload ?? 0,
                p.is_terminal ?? 0,
                p.is_system ?? 0,
                p.display_order ?? null,
              ],
            );
          }

          if (payload.expedientSubStates?.length) {
            log.push(`Sembrando expedient_sub_state (${payload.expedientSubStates.length} subfases)…`);
            await c.query('TRUNCATE TABLE expedient_sub_state');
            for (const s of payload.expedientSubStates!) {
              await c.query(
                `INSERT INTO expedient_sub_state (id, id_expedient_state, name, enabled)
                 VALUES (?, ?, ?, ?)`,
                [s.id, s.id_expedient_state, s.name, s.enabled ?? 1],
              );
            }
          }
          await c.query('SET FOREIGN_KEY_CHECKS = 1');
        });
      }

      // 5. Admin user FIRST — every other row's id_last_user_update FK points to user.id
      // Note: legacy `user` schema has no AUTO_INCREMENT on id and id_user_role
      // defaults to 0 (FK to user_role would fail). Assign id=1 + id_user_role=7
      // (Administrador, seeded by data.sql).
      //
      // The bcrypt hash MUST go in `user.pass` — that's where AuthModel.php
      // (line 95) reads from for `password_verify()`. The `user_pass` column
      // is for a legacy "usuario,contraseña" fallback format. We populate both
      // for forward-compat with anything that still reads `user_pass`.
      log.push('Creando usuario administrador del tenant…');
      const hash = await bcryptHash(payload.admin.password);
      const adminUserId = 1;
      const adminRoleId = 7;
      await withConnection(payload.tenant.db, async (c) => {
        await c.query('SET FOREIGN_KEY_CHECKS = 0');
        await c.query(
          'INSERT INTO `user` (id, email, pass, user_pass, name, id_user_role, enabled, password_migrated) VALUES (?, ?, ?, ?, ?, ?, 1, 1)',
          [adminUserId, payload.admin.email, hash, hash, payload.admin.name ?? payload.admin.email, adminRoleId],
        );
        await c.query('SET FOREIGN_KEY_CHECKS = 1');
      });
      log.push(`  admin user id=${adminUserId} (rol=${adminRoleId} Administrador)`);

      // 6. Hierarchy: client_group → companies → agencies, then client_group_sale_type.
      // Every INSERT explicitly passes id_last_user_update = adminUserId because the
      // source schema has DEFAULT '0' on that column + FK to user.id, and user(id=0)
      // doesn't exist → naked INSERTs trip the FK.
      log.push('Insertando jerarquía cliente_group → companies → agencias…');
      await withConnection(payload.tenant.db, async (c) => {
        await c.query('SET FOREIGN_KEY_CHECKS = 0');

        // enabled=1 explícito en las 3 — el schema legacy tiene
        // `agency.enabled DEFAULT 0` y el BE filtra todos los listados con
        // `WHERE enabled = 1`, así que sin esto la agencia recién creada no
        // aparece en ningún módulo. client_group/company se setean también
        // por consistencia (aunque su DEFAULT es 1).
        const [g]: any = await c.query(
          'INSERT INTO client_group (name, description, enabled, id_last_user_update) VALUES (?, ?, 1, ?)',
          [payload.clientGroup.name, payload.clientGroup.description ?? null, adminUserId],
        );
        const clientGroupId = g.insertId;

        const companyIds: number[] = [];
        for (const co of payload.companies) {
          const [cr]: any = await c.query(
            'INSERT INTO company (name, id_client_group, enabled, id_last_user_update) VALUES (?, ?, 1, ?)',
            [co.name, clientGroupId, adminUserId],
          );
          companyIds.push(cr.insertId);
        }

        for (const a of payload.agencies) {
          const idCompany = companyIds[a.companyIndex] ?? companyIds[0];
          await c.query(
            'INSERT INTO agency (name, id_company, enabled, id_last_user_update) VALUES (?, ?, 1, ?)',
            [a.name, idCompany, adminUserId],
          );
        }

        // Per-group sale-type assignment with display_order + voucher flag
        for (const p of payload.processes) {
          if (p.id) {
            await c.query(
              'INSERT INTO client_group_sale_type (id_client_group, id_sale_type, display_order, enabled) VALUES (?, ?, ?, ?)',
              [clientGroupId, p.id, p.display_order, p.enabled ?? 1],
            );
          }
        }

        // client_group_phase: asignar las fases navegables al grupo (sidebar
        // order). Solo las is_navigable=1 — terminales no se ven en sidebar.
        // El display_order acá lo mantenemos sincronizado con el global
        // (expedient_state.display_order) — el admin puede divergirlos después
        // editando solo por-grupo desde el FE.
        const navigablePhases = (payload.expedientPhases ?? []).filter(
          (p) => p.is_navigable === 1,
        );
        for (const p of navigablePhases) {
          await c.query(
            `INSERT INTO client_group_phase
               (id_client_group, id_expedient_state, display_order, enabled)
             VALUES (?, ?, ?, ?)`,
            [clientGroupId, p.id, p.display_order ?? 0, p.enabled ?? 1],
          );
        }
        if (navigablePhases.length) {
          log.push(`  client_group_phase: ${navigablePhases.length} fases asignadas al grupo`);
        }

        await c.query('SET FOREIGN_KEY_CHECKS = 1');
      });

      log.push('✅ Tenant provisionado correctamente.');
      return { ok: true, tenantId, log };
    } catch (e) {
      const msg = (e as Error).message;
      await rollback(msg);
      return { ok: false, log, message: msg };
    }
  });

  ipcMain.handle('fs:pick-file', () => ({ ok: false, message: 'TODO: file picker for branding logo' }));

  // ====================================================================
  // ADMIN MODE — edición de tenants ya deployados.
  //
  // tenants:* operan contra la central DB (lista, descifrar creds).
  // tenant:* operan contra la DB del tenant (companies, agencies, users,
  // phases) o contra tenant_config en central (branding, integrations).
  //
  // Convención de respuesta: { ok: boolean, data?: T, message?: string }.
  // Cualquier excepción se atrapa y devuelve { ok: false, message }.
  // ====================================================================

  /** Lista tenants registrados en central. Sin descifrar passwords. */
  ipcMain.handle('tenants:list', async (_e, centralCfg: DbConnectionConfig) => {
    try {
      const rows = await withConnection(centralCfg, async (c) => {
        const [rs]: any = await c.query(
          `SELECT id, slug, name, status, db_host, db_port, db_name, db_username,
                  created_at, updated_at
             FROM tenant
            ORDER BY name`,
        );
        return rs;
      });
      return { ok: true, data: rows };
    } catch (e) {
      return { ok: false, message: (e as Error).message };
    }
  });

  /**
   * Devuelve el tenant + sus credenciales DESCIFRADAS (host/port/db/user/password).
   * El password descifrado vive sólo en memoria del proceso main durante esta
   * llamada y en el signal del renderer; nunca se persiste a disco.
   *
   * Además resuelve un `actorUserId` válido para el tenant: id del primer
   * admin user (rol 7/8/15) habilitado. Necesario porque cada INSERT/UPDATE
   * graba `id_last_user_update` con FK a `user.id` del tenant — el id del
   * super-admin (que vive en central) NO existe en el tenant y rompería la FK.
   * Si no hay admin disponible cae a MIN(id) y como último recurso 1.
   */
  ipcMain.handle('tenants:get', async (_e, centralCfg: DbConnectionConfig, tenantId: number, encryptionKey: string) => {
    try {
      const row = await withConnection(centralCfg, async (c) => {
        const [rs]: any = await c.query(
          `SELECT id, slug, name, status, db_host, db_port, db_name, db_username,
                  db_password_encrypted, created_at, updated_at
             FROM tenant
            WHERE id = ?
            LIMIT 1`,
          [tenantId],
        );
        return rs[0] ?? null;
      });
      if (!row) return { ok: false, message: `Tenant id=${tenantId} no existe` };
      const plain = decryptTenantPassword(row.db_password_encrypted, encryptionKey);
      const tenantDb: DbConnectionConfig = {
        host: row.db_host,
        port: row.db_port,
        user: row.db_username,
        password: plain,
        database: row.db_name,
      };

      // Resolver actorUserId válido en el tenant — preferir admin activo,
      // si no hay caer al menor id existente, y como último recurso 1.
      let actorUserId = 1;
      try {
        await withConnection(tenantDb, async (c) => {
          const [admins]: any = await c.query(
            'SELECT id FROM `user` WHERE enabled = 1 AND id_user_role IN (7, 8, 15) ORDER BY id LIMIT 1',
          );
          if (admins.length) {
            actorUserId = admins[0].id;
            return;
          }
          const [anyUser]: any = await c.query('SELECT MIN(id) AS id FROM `user`');
          if (anyUser[0]?.id) actorUserId = anyUser[0].id;
        });
      } catch {
        // tenant inalcanzable: devolvemos los datos igual; el front mostrará el
        // error real cuando intente listar. No bloqueamos el get por esto.
      }

      return {
        ok: true,
        data: {
          id: row.id,
          slug: row.slug,
          name: row.name,
          status: row.status,
          tenantDb,
          actorUserId,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        },
      };
    } catch (e) {
      return { ok: false, message: (e as Error).message };
    }
  });

  // -------- companies --------
  ipcMain.handle('tenant:list-companies', async (_e, tenantDb: DbConnectionConfig) => {
    try {
      const rows = await withConnection(tenantDb, async (c) => {
        const [rs]: any = await c.query(
          `SELECT id, name, id_client_group, enabled, agency_connection,
                  registration_date, update_date
             FROM company
            ORDER BY name`,
        );
        return rs;
      });
      return { ok: true, data: rows };
    } catch (e) {
      return { ok: false, message: (e as Error).message };
    }
  });

  /**
   * Upsert manual: si llega `id`, UPDATE; si no, INSERT. Asume que el
   * client_group ya existe (lo dejamos heredar del existente si el caller
   * no manda id_client_group — coge el primero).
   */
  ipcMain.handle('tenant:save-company', async (_e, tenantDb: DbConnectionConfig, row: {
    id?: number; name: string; id_client_group?: number; agency_connection?: string | null;
  }, actorUserId: number) => {
    try {
      const data = await withConnection(tenantDb, async (c) => {
        if (row.id) {
          await c.query(
            'UPDATE company SET name = ?, agency_connection = ?, id_last_user_update = ?, update_date = NOW() WHERE id = ?',
            [row.name, row.agency_connection ?? null, actorUserId, row.id],
          );
          return { id: row.id };
        }
        // INSERT: si no viene id_client_group, usa el primero existente
        let idGroup = row.id_client_group;
        if (!idGroup) {
          const [gr]: any = await c.query('SELECT id FROM client_group ORDER BY id LIMIT 1');
          idGroup = gr[0]?.id;
          if (!idGroup) throw new Error('No hay client_group en este tenant; crea uno primero.');
        }
        const [r]: any = await c.query(
          'INSERT INTO company (name, id_client_group, enabled, agency_connection, id_last_user_update, registration_date, update_date) VALUES (?, ?, 1, ?, ?, NOW(), NOW())',
          [row.name, idGroup, row.agency_connection ?? null, actorUserId],
        );
        return { id: r.insertId as number };
      });
      return { ok: true, data };
    } catch (e) {
      return { ok: false, message: (e as Error).message };
    }
  });

  ipcMain.handle('tenant:toggle-company-enabled', async (_e, tenantDb: DbConnectionConfig, id: number, enabled: number, actorUserId: number) => {
    try {
      await withConnection(tenantDb, async (c) => {
        await c.query(
          'UPDATE company SET enabled = ?, id_last_user_update = ?, update_date = NOW() WHERE id = ?',
          [enabled ? 1 : 0, actorUserId, id],
        );
      });
      return { ok: true };
    } catch (e) {
      return { ok: false, message: (e as Error).message };
    }
  });

  // -------- agencies --------
  ipcMain.handle('tenant:list-agencies', async (_e, tenantDb: DbConnectionConfig) => {
    try {
      const rows = await withConnection(tenantDb, async (c) => {
        const [rs]: any = await c.query(
          `SELECT a.id, a.name, a.id_company, a.id_agency_dms, a.enabled,
                  a.registration_date, a.update_date, c.name AS company_name
             FROM agency a
        LEFT JOIN company c ON c.id = a.id_company
            ORDER BY a.name`,
        );
        return rs;
      });
      return { ok: true, data: rows };
    } catch (e) {
      return { ok: false, message: (e as Error).message };
    }
  });

  ipcMain.handle('tenant:save-agency', async (_e, tenantDb: DbConnectionConfig, row: {
    id?: number; name: string; id_company?: number | null; id_agency_dms?: string | null;
  }, actorUserId: number) => {
    try {
      const data = await withConnection(tenantDb, async (c) => {
        if (row.id) {
          await c.query(
            'UPDATE agency SET name = ?, id_company = ?, id_agency_dms = ?, id_last_user_update = ?, update_date = NOW() WHERE id = ?',
            [row.name, row.id_company ?? null, row.id_agency_dms ?? null, actorUserId, row.id],
          );
          return { id: row.id };
        }
        const [r]: any = await c.query(
          'INSERT INTO agency (name, id_company, id_agency_dms, enabled, id_last_user_update, registration_date, update_date) VALUES (?, ?, ?, 1, ?, NOW(), NOW())',
          [row.name, row.id_company ?? null, row.id_agency_dms ?? null, actorUserId],
        );
        return { id: r.insertId as number };
      });
      return { ok: true, data };
    } catch (e) {
      return { ok: false, message: (e as Error).message };
    }
  });

  ipcMain.handle('tenant:toggle-agency-enabled', async (_e, tenantDb: DbConnectionConfig, id: number, enabled: number, actorUserId: number) => {
    try {
      await withConnection(tenantDb, async (c) => {
        await c.query(
          'UPDATE agency SET enabled = ?, id_last_user_update = ?, update_date = NOW() WHERE id = ?',
          [enabled ? 1 : 0, actorUserId, id],
        );
      });
      return { ok: true };
    } catch (e) {
      return { ok: false, message: (e as Error).message };
    }
  });

  // -------- users --------
  // Lista lectura completa; password reset bcrypt para soporte.
  ipcMain.handle('tenant:list-users', async (_e, tenantDb: DbConnectionConfig) => {
    try {
      const rows = await withConnection(tenantDb, async (c) => {
        const [rs]: any = await c.query(
          `SELECT u.id, u.name, u.email, u.username, u.enabled, u.id_user_role,
                  u.default_agency, u.last_login_at, r.name AS role_name
             FROM \`user\` u
        LEFT JOIN user_role r ON r.id = u.id_user_role
            ORDER BY u.name`,
        );
        return rs;
      });
      return { ok: true, data: rows };
    } catch (e) {
      return { ok: false, message: (e as Error).message };
    }
  });

  ipcMain.handle('tenant:save-user', async (_e, tenantDb: DbConnectionConfig, row: {
    id?: number; email: string; name: string; username?: string | null;
    id_user_role: number; default_agency?: number | null;
  }, actorUserId: number) => {
    try {
      const data = await withConnection(tenantDb, async (c) => {
        if (row.id) {
          await c.query(
            'UPDATE `user` SET email = ?, name = ?, username = ?, id_user_role = ?, default_agency = ?, id_last_user_update = ?, update_date = NOW() WHERE id = ?',
            [row.email, row.name, row.username ?? null, row.id_user_role, row.default_agency ?? null, actorUserId, row.id],
          );
          return { id: row.id };
        }
        // user.id no es AUTO_INCREMENT — calcular MAX(id)+1
        const [maxRow]: any = await c.query('SELECT COALESCE(MAX(id), 0) + 1 AS next FROM `user`');
        const newId = maxRow[0].next as number;
        await c.query(
          'INSERT INTO `user` (id, email, name, username, id_user_role, default_agency, enabled, password_migrated, id_last_user_update, registration_date, update_date) VALUES (?, ?, ?, ?, ?, ?, 1, 1, ?, NOW(), NOW())',
          [newId, row.email, row.name, row.username ?? null, row.id_user_role, row.default_agency ?? null, actorUserId],
        );
        return { id: newId };
      });
      return { ok: true, data };
    } catch (e) {
      return { ok: false, message: (e as Error).message };
    }
  });

  ipcMain.handle('tenant:toggle-user-enabled', async (_e, tenantDb: DbConnectionConfig, id: number, enabled: number, actorUserId: number) => {
    try {
      await withConnection(tenantDb, async (c) => {
        await c.query(
          'UPDATE `user` SET enabled = ?, id_last_user_update = ?, update_date = NOW() WHERE id = ?',
          [enabled ? 1 : 0, actorUserId, id],
        );
      });
      return { ok: true };
    } catch (e) {
      return { ok: false, message: (e as Error).message };
    }
  });

  /** Reset bcrypt — para cuando un cliente perdió su contraseña. */
  ipcMain.handle('tenant:reset-user-password', async (_e, tenantDb: DbConnectionConfig, id: number, newPlain: string, actorUserId: number) => {
    try {
      const hash = await bcryptHash(newPlain);
      await withConnection(tenantDb, async (c) => {
        await c.query(
          'UPDATE `user` SET pass = ?, user_pass = ?, password_migrated = 1, id_last_user_update = ?, update_date = NOW() WHERE id = ?',
          [hash, hash, actorUserId, id],
        );
      });
      return { ok: true };
    } catch (e) {
      return { ok: false, message: (e as Error).message };
    }
  });

  // -------- phases (expedient_state + expedient_sub_state, ambas en tenant DB) --------
  ipcMain.handle('tenant:list-phases', async (_e, tenantDb: DbConnectionConfig) => {
    try {
      const data = await withConnection(tenantDb, async (c) => {
        const [phases]: any = await c.query(
          `SELECT id, name, display_order, enabled, requires_payment_voucher,
                  is_navigable, allows_document_upload, is_terminal, is_system
             FROM expedient_state
            ORDER BY display_order IS NULL, display_order, id`,
        );
        const [subs]: any = await c.query(
          `SELECT id, id_expedient_state, name, enabled
             FROM expedient_sub_state
            ORDER BY id_expedient_state, id`,
        );
        return { phases, subStates: subs };
      });
      return { ok: true, data };
    } catch (e) {
      return { ok: false, message: (e as Error).message };
    }
  });

  ipcMain.handle('tenant:save-phase', async (_e, tenantDb: DbConnectionConfig, row: {
    id: number; name: string; display_order?: number | null;
    requires_payment_voucher?: number; is_navigable?: number;
    allows_document_upload?: number; is_terminal?: number; is_system?: number;
  }, actorUserId: number) => {
    try {
      await withConnection(tenantDb, async (c) => {
        // UPSERT: si existe el id, UPDATE; si no, INSERT.
        const [exist]: any = await c.query('SELECT id FROM expedient_state WHERE id = ?', [row.id]);
        if (exist.length) {
          await c.query(
            `UPDATE expedient_state
                SET name = ?, display_order = ?, requires_payment_voucher = ?,
                    is_navigable = ?, allows_document_upload = ?, is_terminal = ?,
                    is_system = ?, id_last_user_update = ?, update_date = NOW()
              WHERE id = ?`,
            [row.name, row.display_order ?? null, row.requires_payment_voucher ?? 0,
             row.is_navigable ?? 1, row.allows_document_upload ?? 0, row.is_terminal ?? 0,
             row.is_system ?? 0, actorUserId, row.id],
          );
        } else {
          await c.query(
            `INSERT INTO expedient_state
               (id, name, display_order, enabled, requires_payment_voucher,
                is_navigable, allows_document_upload, is_terminal, is_system,
                id_last_user_update, registration_date, update_date)
             VALUES (?, ?, ?, 1, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [row.id, row.name, row.display_order ?? null,
             row.requires_payment_voucher ?? 0, row.is_navigable ?? 1,
             row.allows_document_upload ?? 0, row.is_terminal ?? 0,
             row.is_system ?? 0, actorUserId],
          );
        }
      });
      return { ok: true };
    } catch (e) {
      return { ok: false, message: (e as Error).message };
    }
  });

  ipcMain.handle('tenant:toggle-phase-enabled', async (_e, tenantDb: DbConnectionConfig, id: number, enabled: number, actorUserId: number) => {
    try {
      await withConnection(tenantDb, async (c) => {
        await c.query(
          'UPDATE expedient_state SET enabled = ?, id_last_user_update = ?, update_date = NOW() WHERE id = ?',
          [enabled ? 1 : 0, actorUserId, id],
        );
      });
      return { ok: true };
    } catch (e) {
      return { ok: false, message: (e as Error).message };
    }
  });

  // -------- branding + integrations (viven en central.tenant_config) --------
  ipcMain.handle('tenant:list-config', async (_e, centralCfg: DbConnectionConfig, tenantId: number, category?: string) => {
    try {
      const rows = await withConnection(centralCfg, async (c) => {
        const sql = category
          ? 'SELECT config_key, config_value, category, sensitive FROM tenant_config WHERE id_tenant = ? AND category = ? ORDER BY config_key'
          : 'SELECT config_key, config_value, category, sensitive FROM tenant_config WHERE id_tenant = ? ORDER BY category, config_key';
        const params = category ? [tenantId, category] : [tenantId];
        const [rs]: any = await c.query(sql, params);
        return rs;
      });
      return { ok: true, data: rows };
    } catch (e) {
      return { ok: false, message: (e as Error).message };
    }
  });

  /**
   * Upsert por (id_tenant, config_key) — usa UNIQUE KEY existente.
   * `sensitive` se infiere si el caller no lo manda: claves con
   * password/secret/key (case-insensitive) → 1.
   */
  ipcMain.handle('tenant:save-config', async (_e, centralCfg: DbConnectionConfig, tenantId: number, entries: Array<{
    config_key: string; config_value: string; category: string; sensitive?: number;
  }>) => {
    try {
      await withConnection(centralCfg, async (c) => {
        for (const e of entries) {
          const sens = e.sensitive ?? (/password|secret|key/i.test(e.config_key) ? 1 : 0);
          await c.query(
            `INSERT INTO tenant_config (id_tenant, config_key, config_value, category, sensitive)
             VALUES (?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE config_value = VALUES(config_value),
                                     category = VALUES(category),
                                     sensitive = VALUES(sensitive)`,
            [tenantId, e.config_key, e.config_value, e.category, sens],
          );
        }
      });
      return { ok: true };
    } catch (e) {
      return { ok: false, message: (e as Error).message };
    }
  });

  ipcMain.handle('tenant:delete-config', async (_e, centralCfg: DbConnectionConfig, tenantId: number, configKey: string) => {
    try {
      await withConnection(centralCfg, async (c) => {
        await c.query('DELETE FROM tenant_config WHERE id_tenant = ? AND config_key = ?', [tenantId, configKey]);
      });
      return { ok: true };
    } catch (e) {
      return { ok: false, message: (e as Error).message };
    }
  });

  // Helper para tab Agencies: lista user_role del tenant.
  ipcMain.handle('tenant:list-user-roles', async (_e, tenantDb: DbConnectionConfig) => {
    try {
      const rows = await withConnection(tenantDb, async (c) => {
        const [rs]: any = await c.query('SELECT id, name FROM user_role ORDER BY id');
        return rs;
      });
      return { ok: true, data: rows };
    } catch (e) {
      return { ok: false, message: (e as Error).message };
    }
  });

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
