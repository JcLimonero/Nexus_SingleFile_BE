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

  // Step 8: processes (with order + voucher flag)
  readonly processes = signal<ProcessRow[]>([]);

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
    this.catalogSeeds.set({});
    this.adminUserDraft.set({ email: '', password: '' });
    this.branding.set({});
    this.integrations.set({});
    this.provisionResult.set(null);
  }
}
