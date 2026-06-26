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
  tenants: {
    list(centralCfg: DbConfig): Promise<OpResult<TenantSummary[]>>;
    get(centralCfg: DbConfig, tenantId: number, encryptionKey: string): Promise<OpResult<TenantDetail>>;
  };
  tenant: {
    listCompanies(tenantDb: DbConfig): Promise<OpResult<CompanyRow[]>>;
    saveCompany(tenantDb: DbConfig, row: CompanyDraft, actorUserId: number): Promise<OpResult<{ id: number }>>;
    toggleCompanyEnabled(tenantDb: DbConfig, id: number, enabled: number, actorUserId: number): Promise<OpResult>;

    listAgencies(tenantDb: DbConfig): Promise<OpResult<AgencyRow[]>>;
    saveAgency(tenantDb: DbConfig, row: AgencyDraft, actorUserId: number): Promise<OpResult<{ id: number }>>;
    toggleAgencyEnabled(tenantDb: DbConfig, id: number, enabled: number, actorUserId: number): Promise<OpResult>;

    listUsers(tenantDb: DbConfig): Promise<OpResult<TenantUserRow[]>>;
    saveUser(tenantDb: DbConfig, row: TenantUserDraft, actorUserId: number): Promise<OpResult<{ id: number }>>;
    toggleUserEnabled(tenantDb: DbConfig, id: number, enabled: number, actorUserId: number): Promise<OpResult>;
    resetUserPassword(tenantDb: DbConfig, id: number, newPlain: string, actorUserId: number): Promise<OpResult>;
    listUserRoles(tenantDb: DbConfig): Promise<OpResult<Array<{ id: number; name: string }>>>;

    listPhases(tenantDb: DbConfig): Promise<OpResult<{ phases: PhaseRow[]; subStates: SubStateRow[] }>>;
    savePhase(tenantDb: DbConfig, row: PhaseDraft, actorUserId: number): Promise<OpResult>;
    togglePhaseEnabled(tenantDb: DbConfig, id: number, enabled: number, actorUserId: number): Promise<OpResult>;

    listConfig(centralCfg: DbConfig, tenantId: number, category?: string): Promise<OpResult<TenantConfigRow[]>>;
    saveConfig(centralCfg: DbConfig, tenantId: number, entries: TenantConfigDraft[]): Promise<OpResult>;
    deleteConfig(centralCfg: DbConfig, tenantId: number, configKey: string): Promise<OpResult>;
  };
}

export interface TenantSummary {
  id: number;
  slug: string;
  name: string;
  status: 'active' | 'grace' | 'readonly' | 'suspended' | 'terminated';
  db_host: string;
  db_port: number;
  db_name: string;
  db_username: string;
  created_at: string;
  updated_at: string;
}

export interface TenantDetail {
  id: number;
  slug: string;
  name: string;
  status: TenantSummary['status'];
  /** Credenciales descifradas — sólo viven en memoria del renderer. */
  tenantDb: DbConfig;
  /**
   * Id de un user del tenant válido para grabarlo en `id_last_user_update`
   * de cada INSERT/UPDATE. NO es el id del super-admin (que vive en central);
   * es un admin del tenant — resuelto por el backend al conectar.
   */
  actorUserId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyRow {
  id: number;
  name: string;
  id_client_group: number | null;
  enabled: number;
  agency_connection: string | null;
  registration_date: string | null;
  update_date: string | null;
}
export interface CompanyDraft {
  id?: number;
  name: string;
  id_client_group?: number;
  agency_connection?: string | null;
}

export interface AgencyRow {
  id: number;
  name: string;
  id_company: number | null;
  id_agency_dms: string | null;
  enabled: number;
  registration_date: string | null;
  update_date: string | null;
  company_name: string | null;
}
export interface AgencyDraft {
  id?: number;
  name: string;
  id_company?: number | null;
  id_agency_dms?: string | null;
}

export interface TenantUserRow {
  id: number;
  name: string | null;
  email: string | null;
  username: string | null;
  enabled: number;
  id_user_role: number;
  default_agency: number | null;
  last_login_at: string | null;
  role_name: string | null;
}
export interface TenantUserDraft {
  id?: number;
  email: string;
  name: string;
  username?: string | null;
  id_user_role: number;
  default_agency?: number | null;
}

export interface PhaseRow {
  id: number;
  name: string;
  display_order: number | null;
  enabled: number;
  requires_payment_voucher: number;
  is_navigable: number;
  allows_document_upload: number;
  is_terminal: number;
  is_system: number;
}
export interface SubStateRow {
  id: number;
  id_expedient_state: number;
  name: string;
  enabled: number;
}
export interface PhaseDraft {
  id: number;
  name: string;
  display_order?: number | null;
  requires_payment_voucher?: number;
  is_navigable?: number;
  allows_document_upload?: number;
  is_terminal?: number;
  is_system?: number;
}

export interface TenantConfigRow {
  config_key: string;
  config_value: string;
  category: string;
  sensitive: number;
}
export interface TenantConfigDraft {
  config_key: string;
  config_value: string;
  category: string;
  sensitive?: number;
}

declare global {
  interface Window {
    wizardApi: WizardApi;
  }
}
