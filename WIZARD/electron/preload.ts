import { contextBridge, ipcRenderer } from 'electron';

/**
 * Surface a narrow API to the Angular renderer process. All node/electron
 * APIs are kept out of the renderer — the renderer only calls these
 * promises and gets plain JSON back.
 */
contextBridge.exposeInMainWorld('wizardApi', {
  db: {
    testConnection: (cfg: unknown) => ipcRenderer.invoke('db:test-connection', cfg),
    createDatabase: (cfg: unknown, dbName: string) => ipcRenderer.invoke('db:create-database', cfg, dbName),
    runMigrations: (cfg: unknown) => ipcRenderer.invoke('db:run-migrations', cfg),
    seedTable: (cfg: unknown, table: string, rows: unknown[]) =>
      ipcRenderer.invoke('db:seed-table', cfg, table, rows),
  },
  defaults: {
    load: (table: string) => ipcRenderer.invoke('defaults:load', table),
  },
  config: {
    loadCentral: () => ipcRenderer.invoke('config:load-central'),
  },
  admin: {
    login: (apiBase: string, email: string, password: string) =>
      ipcRenderer.invoke('admin:login', apiBase, email, password),
  },
  wizard: {
    provision: (payload: unknown) => ipcRenderer.invoke('wizard:provision', payload),
  },
  fs: {
    pickFile: (opts: unknown) => ipcRenderer.invoke('fs:pick-file', opts),
  },
});
