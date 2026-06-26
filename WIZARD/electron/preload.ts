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
  // Admin mode: edición de tenants ya deployados.
  tenants: {
    list: (centralCfg: unknown) => ipcRenderer.invoke('tenants:list', centralCfg),
    get: (centralCfg: unknown, tenantId: number, encryptionKey: string) =>
      ipcRenderer.invoke('tenants:get', centralCfg, tenantId, encryptionKey),
  },
  tenant: {
    // companies
    listCompanies: (tenantDb: unknown) => ipcRenderer.invoke('tenant:list-companies', tenantDb),
    saveCompany: (tenantDb: unknown, row: unknown, actorUserId: number) =>
      ipcRenderer.invoke('tenant:save-company', tenantDb, row, actorUserId),
    toggleCompanyEnabled: (tenantDb: unknown, id: number, enabled: number, actorUserId: number) =>
      ipcRenderer.invoke('tenant:toggle-company-enabled', tenantDb, id, enabled, actorUserId),
    // agencies
    listAgencies: (tenantDb: unknown) => ipcRenderer.invoke('tenant:list-agencies', tenantDb),
    saveAgency: (tenantDb: unknown, row: unknown, actorUserId: number) =>
      ipcRenderer.invoke('tenant:save-agency', tenantDb, row, actorUserId),
    toggleAgencyEnabled: (tenantDb: unknown, id: number, enabled: number, actorUserId: number) =>
      ipcRenderer.invoke('tenant:toggle-agency-enabled', tenantDb, id, enabled, actorUserId),
    // users
    listUsers: (tenantDb: unknown) => ipcRenderer.invoke('tenant:list-users', tenantDb),
    saveUser: (tenantDb: unknown, row: unknown, actorUserId: number) =>
      ipcRenderer.invoke('tenant:save-user', tenantDb, row, actorUserId),
    toggleUserEnabled: (tenantDb: unknown, id: number, enabled: number, actorUserId: number) =>
      ipcRenderer.invoke('tenant:toggle-user-enabled', tenantDb, id, enabled, actorUserId),
    resetUserPassword: (tenantDb: unknown, id: number, newPlain: string, actorUserId: number) =>
      ipcRenderer.invoke('tenant:reset-user-password', tenantDb, id, newPlain, actorUserId),
    listUserRoles: (tenantDb: unknown) => ipcRenderer.invoke('tenant:list-user-roles', tenantDb),
    // phases
    listPhases: (tenantDb: unknown) => ipcRenderer.invoke('tenant:list-phases', tenantDb),
    savePhase: (tenantDb: unknown, row: unknown, actorUserId: number) =>
      ipcRenderer.invoke('tenant:save-phase', tenantDb, row, actorUserId),
    togglePhaseEnabled: (tenantDb: unknown, id: number, enabled: number, actorUserId: number) =>
      ipcRenderer.invoke('tenant:toggle-phase-enabled', tenantDb, id, enabled, actorUserId),
    // branding + integrations (central.tenant_config)
    listConfig: (centralCfg: unknown, tenantId: number, category?: string) =>
      ipcRenderer.invoke('tenant:list-config', centralCfg, tenantId, category),
    saveConfig: (centralCfg: unknown, tenantId: number, entries: unknown[]) =>
      ipcRenderer.invoke('tenant:save-config', centralCfg, tenantId, entries),
    deleteConfig: (centralCfg: unknown, tenantId: number, configKey: string) =>
      ipcRenderer.invoke('tenant:delete-config', centralCfg, tenantId, configKey),
  },
});
