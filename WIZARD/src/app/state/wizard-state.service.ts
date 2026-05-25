import { Injectable, signal } from '@angular/core';
import type { DbConfig } from '../types/wizard-api';

/**
 * Shared state across wizard steps. Lives in memory only — refresh resets the wizard.
 */
@Injectable({ providedIn: 'root' })
export class WizardStateService {
  readonly dbConfig = signal<DbConfig>({
    host: '127.0.0.1',
    port: 3306,
    user: '',
    password: '',
    database: 'nexfile'
  });

  readonly schemaReady = signal(false);

  readonly clientGroup = signal<{ name: string; description?: string } | null>(null);
  readonly companies = signal<Array<{ name: string; rfc?: string; description?: string }>>([]);
  readonly agencies = signal<Array<{ companyName: string; name: string; address?: string }>>([]);

  readonly processes = signal<Array<{ id?: number; name: string; enabled: number; display_order: number; requires_payment_voucher?: boolean }>>([]);

  readonly admin = signal<{ email: string; passwordHash?: string; name?: string } | null>(null);
  readonly branding = signal<{ appName?: string; logoPath?: string; primaryColor?: string } | null>(null);
  readonly integrations = signal<{ backblaze?: Record<string, string>; ordersApi?: Record<string, string> } | null>(null);

  reset(): void {
    this.schemaReady.set(false);
    this.clientGroup.set(null);
    this.companies.set([]);
    this.agencies.set([]);
    this.processes.set([]);
    this.admin.set(null);
    this.branding.set(null);
    this.integrations.set(null);
  }
}
