/**
 * Shape of the IPC API exposed by electron/preload.ts to the renderer.
 * Keep in sync with electron/preload.ts. Renderer code reads (window as any).wizardApi.
 */
export interface DbConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database?: string;
}

export interface OpResult<T = unknown> {
  ok: boolean;
  message?: string;
  data?: T;
}

export interface WizardApi {
  db: {
    testConnection(cfg: DbConfig): Promise<OpResult>;
    createDatabase(cfg: DbConfig, dbName: string): Promise<OpResult>;
    runMigrations(cfg: DbConfig): Promise<{ ok: boolean; executed: number; failed?: { name: string; error: string } }>;
    seedTable(cfg: DbConfig, table: string, rows: unknown[]): Promise<OpResult & { inserted?: number }>;
    createHierarchy(cfg: DbConfig, payload: unknown): Promise<OpResult>;
    createAdminUser(cfg: DbConfig, admin: unknown): Promise<OpResult>;
    upsertConfig(cfg: DbConfig, entries: unknown[]): Promise<OpResult>;
  };
  defaults: {
    load(table: string): Promise<{ ok: boolean; rows?: any[]; message?: string }>;
  };
  fs: {
    pickFile(opts: unknown): Promise<OpResult>;
  };
}

declare global {
  interface Window {
    wizardApi: WizardApi;
  }
}
