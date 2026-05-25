import type { IpcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { testConnection, createDatabase, executeBatch, withConnection, DbConnectionConfig } from './db-connector';
import { schemaMigrations } from './migrations';

/**
 * Resolves the DEFAULTS/ folder both in dev (sibling of WIZARD) and in production
 * (when packaged the JSONs ship as extraResources alongside the app).
 */
function defaultsRoot(): string {
  const candidates = [
    path.join(__dirname, '..', '..', '..', 'DEFAULTS'), // dev: WIZARD/dist-electron/.. → WIZARD → repo
    path.join(process.resourcesPath || '', 'DEFAULTS')   // packaged
  ];
  for (const c of candidates) {
    if (c && fs.existsSync(c)) return c;
  }
  return candidates[0];
}

export function registerDbHandlers(ipcMain: IpcMain): void {
  ipcMain.handle('db:test-connection', (_e, cfg: DbConnectionConfig) => testConnection(cfg));

  ipcMain.handle('db:create-database', (_e, cfg: DbConnectionConfig, dbName: string) =>
    createDatabase(cfg, dbName)
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
        const sql = `INSERT INTO \`${table}\` (${cols.map((c) => `\`${c}\``).join(', ')}) VALUES (${placeholders})`;
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

  // Placeholder handlers — filled out in later phases as we build steps 4-13.
  ipcMain.handle('db:create-hierarchy', () => ({ ok: false, message: 'TODO: phase 4-6' }));
  ipcMain.handle('db:create-admin-user', () => ({ ok: false, message: 'TODO: phase 9' }));
  ipcMain.handle('db:upsert-config', () => ({ ok: false, message: 'TODO: phase 11' }));
  ipcMain.handle('fs:pick-file', () => ({ ok: false, message: 'TODO: phase 10' }));
}
