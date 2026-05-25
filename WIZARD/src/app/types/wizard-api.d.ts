/**
 * Renderer-side mirror of the IPC API exposed by electron/preload.ts.
 * Keep in sync with that file.
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
  };
  defaults: {
    load(table: string): Promise<{ ok: boolean; rows?: any[]; message?: string }>;
  };
  config: {
    loadCentral(): Promise<{
      ok: boolean;
      message?: string;
      path?: string;
      data?: {
        central: DbConfig;
        adminApiBase: string;
        encryptionKey: string;
        superAdminEmail: string;
        superAdminPassword: string;
      };
    }>;
  };
  admin: {
    login(apiBase: string, email: string, password: string): Promise<{
      ok: boolean;
      token?: string;
      user?: { id: number; email: string; name?: string };
      message?: string;
    }>;
  };
  wizard: {
    provision(payload: unknown): Promise<{
      ok: boolean;
      tenantId?: number;
      log?: string[];
      message?: string;
    }>;
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
