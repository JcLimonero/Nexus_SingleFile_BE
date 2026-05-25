import { contextBridge, ipcRenderer } from 'electron';

/**
 * Surface a narrow API to the Angular renderer process.
 * All DB work happens in the main process via IPC — the renderer never imports mysql2 directly.
 */
contextBridge.exposeInMainWorld('wizardApi', {
  db: {
    testConnection: (cfg: unknown) => ipcRenderer.invoke('db:test-connection', cfg),
    createDatabase: (cfg: unknown, dbName: string) => ipcRenderer.invoke('db:create-database', cfg, dbName),
    runMigrations: (cfg: unknown) => ipcRenderer.invoke('db:run-migrations', cfg),
    seedTable: (cfg: unknown, table: string, rows: unknown[]) =>
      ipcRenderer.invoke('db:seed-table', cfg, table, rows),
    createHierarchy: (cfg: unknown, payload: unknown) =>
      ipcRenderer.invoke('db:create-hierarchy', cfg, payload),
    createAdminUser: (cfg: unknown, admin: unknown) =>
      ipcRenderer.invoke('db:create-admin-user', cfg, admin),
    upsertConfig: (cfg: unknown, entries: unknown[]) =>
      ipcRenderer.invoke('db:upsert-config', cfg, entries)
  },
  defaults: {
    load: (table: string) => ipcRenderer.invoke('defaults:load', table)
  },
  fs: {
    pickFile: (opts: unknown) => ipcRenderer.invoke('fs:pick-file', opts)
  }
});
