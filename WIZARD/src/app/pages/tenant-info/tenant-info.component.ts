import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { WizardStateService } from '../../state/wizard-state.service';

@Component({
  selector: 'wiz-tenant-info',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatProgressSpinnerModule,
  ],
  template: `
    <mat-card class="wiz-card">
      <mat-card-content>
        <h2>Datos del tenant</h2>
        <p>
          El slug se usa como subdomain (<code>{{ slug || 'vw' }}.nexfile.app</code>) y
          como sufijo del nombre de DB (<code>nexfile_tenant_{{ slug || 'vw' }}</code>).
        </p>
        <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 16px;">
          <mat-form-field appearance="outline">
            <mat-label>Slug</mat-label>
            <input matInput [(ngModel)]="slug" (ngModelChange)="onSlugChange($event)" placeholder="vw" />
            <mat-hint>letras minúsculas, números, guiones</mat-hint>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Nombre comercial</mat-label>
            <input matInput [(ngModel)]="name" placeholder="Volkswagen México" />
          </mat-form-field>
        </div>

        <h3 style="margin-top: 24px;">DB del tenant</h3>
        <p>Dónde se creará la base de datos del tenant. Puede ser el mismo servidor que central o uno separado.</p>

        <mat-checkbox [(ngModel)]="useSameAsCentral" (change)="onUseSameChange($event.checked)" style="margin-bottom: 12px;">
          Usar mismo servidor que la central DB
          @if (useSameAsCentral) {
            <span style="color:#666; font-size:13px; margin-left:8px;">
              ({{ state.central().host }}:{{ state.central().port }}, user: <code>{{ state.central().user }}</code>)
            </span>
          }
        </mat-checkbox>

        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 16px;">
          <mat-form-field appearance="outline">
            <mat-label>Host</mat-label>
            <input matInput [(ngModel)]="tdb.host" [readonly]="useSameAsCentral" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Puerto</mat-label>
            <input matInput type="number" [(ngModel)]="tdb.port" [readonly]="useSameAsCentral" />
          </mat-form-field>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <mat-form-field appearance="outline">
            <mat-label>Usuario</mat-label>
            <input matInput [(ngModel)]="tdb.user" [readonly]="useSameAsCentral" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Contraseña</mat-label>
            <input matInput type="password" [(ngModel)]="tdb.password" [readonly]="useSameAsCentral" />
          </mat-form-field>
        </div>
        <mat-form-field appearance="outline" style="width: 100%;">
          <mat-label>Nombre de la base del tenant</mat-label>
          <input matInput [(ngModel)]="tdb.database" />
        </mat-form-field>

        <mat-form-field appearance="outline" style="width: 100%;">
          <mat-label>TENANT_DB_ENCRYPTION_KEY (64 hex chars)</mat-label>
          <input matInput [(ngModel)]="encKey" />
          <mat-hint>Mismo valor que BE/.env y ADMIN_BE/.env</mat-hint>
        </mat-form-field>

        <div style="display: flex; gap: 12px; align-items: center;">
          <button mat-stroked-button (click)="test()" [disabled]="loading()">
            <mat-icon>cable</mat-icon> Probar conexión al tenant
          </button>
          @if (loading()) { <mat-spinner [diameter]="20"></mat-spinner> }
          @if (testResult()) {
            <span [style.color]="testResult()!.ok ? 'green' : 'crimson'">{{ testResult()!.message }}</span>
          }
        </div>

        @if (missingFields().length) {
          <div style="margin-top: 16px; padding: 12px; background: #fff8e1; color: #ff8f00; border-radius: 4px; font-size: 13px;">
            <b>Falta para habilitar Continuar:</b>
            <ul style="margin: 4px 0 0 16px; padding: 0;">
              @for (f of missingFields(); track f) { <li>{{ f }}</li> }
            </ul>
          </div>
        }

        <div class="wiz-step-actions">
          <a mat-button routerLink="/admin-login"><mat-icon>arrow_back</mat-icon> Atrás</a>
          <button mat-flat-button color="primary" (click)="next()" [disabled]="!canProceed()">
            Continuar <mat-icon iconPositionEnd>arrow_forward</mat-icon>
          </button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
})
export class TenantInfoComponent {
  readonly state = inject(WizardStateService);
  private readonly router = inject(Router);

  slug = this.state.tenantSlug();
  name = this.state.tenantName();
  tdb = { ...this.state.tenantDb() };
  encKey = this.state.encryptionKey();
  loading = signal(false);
  testResult = signal<{ ok: boolean; message?: string } | null>(null);

  /**
   * Default ON when central DB is configured AND tenant fields weren't
   * already manually filled. The user can uncheck to point at a different
   * MySQL server (cross-region, dedicated tenant tier, etc.).
   */
  useSameAsCentral = (() => {
    const c = this.state.central();
    const t = this.state.tenantDb();
    // If user already typed a host different from central, respect it
    if (t.host && t.host !== c.host) return false;
    return !!(c.host && c.user);
  })();

  constructor() {
    if (this.useSameAsCentral) this.copyFromCentral();
  }

  onUseSameChange(checked: boolean): void {
    this.useSameAsCentral = checked;
    if (checked) this.copyFromCentral();
  }

  private copyFromCentral(): void {
    const c = this.state.central();
    this.tdb.host     = c.host;
    this.tdb.port     = c.port;
    this.tdb.user     = c.user;
    this.tdb.password = c.password;
    // Preserve database name — that's per-tenant (nexfile_tenant_<slug>)
  }

  onSlugChange(v: string) {
    // Auto-normalize: lowercase + strip invalid chars on the fly so the user
    // can paste "VW" or "VW Test" and get "vw" / "vw-test" without thinking
    // about slug rules.
    const cleaned = (v || '').toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
    if (cleaned !== this.slug) this.slug = cleaned;
    if (!this.tdb.database || this.tdb.database.startsWith('nexfile_tenant_')) {
      this.tdb.database = `nexfile_tenant_${cleaned}`;
    }
  }

  canProceed(): boolean {
    return this.missingFields().length === 0;
  }

  /** Returns a human-readable list of what's still blocking the Continue button. */
  missingFields(): string[] {
    const out: string[] = [];
    if (!this.slug) out.push('Slug vacío');
    else if (!/^[a-z0-9_-]{2,50}$/.test(this.slug)) out.push('Slug inválido (solo minúsculas, números, _ y -, 2-50 chars)');
    if (!this.name) out.push('Nombre vacío');
    if (!this.tdb.host) out.push('Host del tenant DB vacío');
    if (!this.tdb.user) out.push('Usuario del tenant DB vacío');
    if (!this.tdb.database) out.push('Nombre del tenant DB vacío');
    if (!this.encKey) out.push('Encryption key vacía (revisa config/central.env)');
    else if (!/^[0-9a-fA-F]{64}$/.test(this.encKey)) out.push(`Encryption key debe ser 64 chars hex (actual: ${this.encKey.length})`);
    return out;
  }

  async test() {
    if (!window.wizardApi) {
      this.testResult.set({ ok: false, message: 'wizardApi no disponible' });
      return;
    }
    this.loading.set(true);
    this.testResult.set(null);
    // Test connection without specifying database (so it works before the DB exists)
    const r = await window.wizardApi.db.testConnection({ ...this.tdb, database: undefined });
    this.loading.set(false);
    this.testResult.set(r);
  }

  next() {
    this.state.tenantSlug.set(this.slug);
    this.state.tenantName.set(this.name);
    this.state.tenantDb.set({ ...this.tdb });
    this.state.encryptionKey.set(this.encKey);
    this.router.navigate(['/schema']);
  }
}
