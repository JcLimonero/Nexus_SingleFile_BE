import { Injectable, signal } from '@angular/core';
import type { DbConfig } from '../types/wizard-api';

export interface CompanyInput { name: string; rfc?: string }
export interface AgencyInput { companyIndex: number; name: string; address?: string }
export interface ProcessRow {
  id?: number;
  name: string;
  display_order: number;
  requires_payment_voucher: number;
  enabled?: number;
}

/**
 * Una fila de expedient_state que se inserta al provisionar el tenant.
 * Las is_system=1 (Integración + Liquidación por convención) tienen
 * candado en UI — no se pueden borrar ni renombrar.
 */
export interface ExpedientPhaseRow {
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

/** Una subfase ligada a una fase parent por id_expedient_state. */
export interface ExpedientSubStateRow {
  id: number;
  id_expedient_state: number;
  name: string;
  enabled: number;
}

/**
 * In-memory aggregator across wizard steps. Cleared on app restart by design —
 * the wizard is a one-shot flow; partial state is intentionally non-persistent.
 */
@Injectable({ providedIn: 'root' })
export class WizardStateService {
  // Step 1: Central DB connection
  readonly central = signal<DbConfig>({
    host: '127.0.0.1',
    port: 3306,
    user: '',
    password: '',
    database: 'nexfile_central',
  });
  readonly centralOk = signal(false);

  // Step 2: Super-admin login (ADMIN_BE)
  readonly adminApiBase = signal('http://localhost:8087');
  readonly adminToken   = signal<string | null>(null);
  readonly adminUser    = signal<{ id: number; email: string; name?: string } | null>(null);
  /** Prefilled super-admin creds (from config/central.env) — set by CentralDb. */
  readonly adminPrefillEmail    = signal('');
  readonly adminPrefillPassword = signal('');

  // Step 3: Tenant identity + DB config
  readonly tenantSlug = signal('');
  readonly tenantName = signal('');
  readonly tenantDb = signal<DbConfig>({
    host: '127.0.0.1',
    port: 3306,
    user: '',
    password: '',
    database: '',
  });
  /** Shared encryption key (matches BE/.env TENANT_DB_ENCRYPTION_KEY). */
  readonly encryptionKey = signal('');

  // Step 4: Tenant DB schema applied
  readonly schemaReady = signal(false);

  // Step 5: client group
  readonly clientGroup = signal<{ name: string; description?: string }>({ name: '' });

  // Step 6: companies
  readonly companies = signal<CompanyInput[]>([]);

  // Step 7: agencies (per company by index)
  readonly agencies = signal<AgencyInput[]>([]);

  // Step 8: processes (with order + voucher flag) — DEPRECATED, mantener
  // por compat con db-ipc.ts que sigue leyendo `payload.processes` para
  // poblar client_group_sale_type. Migrar después.
  readonly processes = signal<ProcessRow[]>([]);

  // Step 8 (renamed "Fases"): expedient_state + expedient_sub_state.
  // El componente processes maneja AMBAS tablas en una sola UI dual
  // (tabla de fases + sub-tabla contextual de subfases).
  readonly expedientPhases    = signal<ExpedientPhaseRow[]>([]);
  readonly expedientSubStates = signal<ExpedientSubStateRow[]>([]);

  // Step 9: catalog seeds (table → rows, edited by admin from DEFAULTS)
  readonly catalogSeeds = signal<Record<string, any[]>>({});

  // Step 10: admin user
  readonly adminUserDraft = signal<{ email: string; password: string; name?: string }>({ email: '', password: '' });

  // Step 11: branding
  readonly branding = signal<{ appName?: string; primaryColor?: string; logoBase64?: string }>({});

  // Step 12: integrations
  readonly integrations = signal<{ backblaze?: Record<string, string>; ordersApi?: Record<string, string> }>({});

  // Step 13: provisioning result
  readonly provisionResult = signal<{ ok: boolean; tenantId?: number; log?: string[]; message?: string } | null>(null);

  reset(): void {
    this.centralOk.set(false);
    this.adminToken.set(null);
    this.adminUser.set(null);
    this.tenantSlug.set('');
    this.tenantName.set('');
    this.schemaReady.set(false);
    this.clientGroup.set({ name: '' });
    this.companies.set([]);
    this.agencies.set([]);
    this.processes.set([]);
    this.expedientPhases.set([]);
    this.expedientSubStates.set([]);
    this.catalogSeeds.set({});
    this.adminUserDraft.set({ email: '', password: '' });
    this.branding.set({});
    this.integrations.set({});
    this.provisionResult.set(null);
  }
}
