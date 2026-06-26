import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TenantSessionService } from '../../../../state/tenant-session.service';
import type { TenantConfigRow } from '../../../../types/wizard-api';

/**
 * Branding del tenant: appName, primaryColor, logoBase64.
 * Vive en central.tenant_config con category='branding'.
 */
@Component({
  selector: 'wiz-tenant-edit-branding',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule,
    MatProgressSpinnerModule, MatSnackBarModule,
  ],
  template: `
    <div style="padding: 16px 0; max-width: 600px;">
      @if (loading()) {
        <mat-spinner [diameter]="24"></mat-spinner>
      } @else {
        <mat-form-field appearance="outline" style="width: 100%;">
          <mat-label>Nombre de la app (appName)</mat-label>
          <input matInput [(ngModel)]="form.appName" />
        </mat-form-field>
        <mat-form-field appearance="outline" style="width: 100%;">
          <mat-label>Color primario (hex)</mat-label>
          <input matInput [(ngModel)]="form.primaryColor" placeholder="#3f51b5" />
        </mat-form-field>
        <mat-form-field appearance="outline" style="width: 100%;">
          <mat-label>Logo (base64 PNG/SVG)</mat-label>
          <textarea matInput rows="4" [(ngModel)]="form.logoBase64"></textarea>
        </mat-form-field>
        <p style="font-size:12px; opacity:0.6;">
          Para reemplazar el logo, pega aquí el data URI completo (<code>data:image/png;base64,…</code>).
        </p>
        <button mat-flat-button color="primary" (click)="save()" [disabled]="saving()">
          <mat-icon>save</mat-icon> Guardar branding
        </button>
      }
    </div>
  `,
})
export class TenantEditBrandingComponent implements OnInit {
  readonly session = inject(TenantSessionService);
  private readonly snack = inject(MatSnackBar);

  loading = signal(false);
  saving = signal(false);
  form = { appName: '', primaryColor: '', logoBase64: '' };

  async ngOnInit() { await this.refresh(); }

  async refresh() {
    const cfg = this.session.centralCfg();
    const t = this.session.selectedTenant();
    if (!cfg || !t) return;
    this.loading.set(true);
    const r = await window.wizardApi.tenant.listConfig(cfg, t.id, 'branding');
    this.loading.set(false);
    if (r.ok && r.data) this.fillForm(r.data);
    else this.snack.open(r.message ?? 'Error', 'cerrar', { duration: 3000 });
  }

  private fillForm(rows: TenantConfigRow[]) {
    const lookup = (k: string) => rows.find((x) => x.config_key === k)?.config_value ?? '';
    this.form = {
      appName: lookup('appName'),
      primaryColor: lookup('primaryColor'),
      logoBase64: lookup('logoBase64'),
    };
  }

  async save() {
    const cfg = this.session.centralCfg();
    const t = this.session.selectedTenant();
    if (!cfg || !t) return;
    this.saving.set(true);
    const res = await window.wizardApi.tenant.saveConfig(cfg, t.id, [
      { config_key: 'appName', config_value: this.form.appName, category: 'branding', sensitive: 0 },
      { config_key: 'primaryColor', config_value: this.form.primaryColor, category: 'branding', sensitive: 0 },
      { config_key: 'logoBase64', config_value: this.form.logoBase64, category: 'branding', sensitive: 0 },
    ]);
    this.saving.set(false);
    if (res.ok) this.snack.open('Branding guardado', 'cerrar', { duration: 2000 });
    else this.snack.open(res.message ?? 'Error', 'cerrar', { duration: 3000 });
  }
}
