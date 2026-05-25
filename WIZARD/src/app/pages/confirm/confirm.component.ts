import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { WizardStateService } from '../../state/wizard-state.service';

@Component({
  selector: 'wiz-confirm',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatProgressBarModule],
  template: `
    <mat-card class="wiz-card">
      <mat-card-content>
        <h2>Confirmar y crear tenant</h2>
        <p>Revisa los datos. Al ejecutar, todo se aplica en orden contra la central DB y la DB del tenant.</p>

        <div style="background:#f8f9fb; padding: 16px; border-radius: 4px; font-size: 14px;">
          <div><b>Slug:</b> {{ state.tenantSlug() }} → {{ state.tenantSlug() }}.nexfile.app</div>
          <div><b>Nombre:</b> {{ state.tenantName() }}</div>
          <div><b>DB tenant:</b> {{ state.tenantDb().host }}:{{ state.tenantDb().port }}/{{ state.tenantDb().database }}</div>
          <div><b>Grupo:</b> {{ state.clientGroup().name }}</div>
          <div><b>Razones sociales:</b> {{ state.companies().length }}</div>
          <div><b>Agencias:</b> {{ state.agencies().length }}</div>
          <div><b>Procesos:</b> {{ state.processes().length }} ({{ voucherPhase() }} lleva comprobante)</div>
          <div><b>Catálogos:</b> {{ catalogSummary() }}</div>
          <div><b>Admin:</b> {{ state.adminUserDraft().email }}</div>
          <div><b>Integraciones:</b> {{ integrationsSummary() }}</div>
        </div>

        @if (running()) {
          <mat-progress-bar mode="indeterminate" style="margin: 24px 0;"></mat-progress-bar>
        }
        @if (log().length) {
          <div style="margin-top: 16px; background:#0f172a; color:#e2e8f0; font-family: monospace; padding: 12px; border-radius: 4px; max-height: 240px; overflow:auto;">
            @for (line of log(); track $index) {
              <div>{{ line }}</div>
            }
          </div>
        }
        @if (errorMsg()) {
          <div style="margin-top: 16px; color: crimson;">❌ {{ errorMsg() }}</div>
        }

        <div class="wiz-step-actions">
          <a mat-button routerLink="/integrations" [disabled]="running()"><mat-icon>arrow_back</mat-icon> Atrás</a>
          @if (!done()) {
            <button mat-flat-button color="primary" (click)="run()" [disabled]="running()">
              <mat-icon>rocket_launch</mat-icon> Crear tenant
            </button>
          } @else {
            <button mat-flat-button color="primary" (click)="next()">
              Ir al final <mat-icon iconPositionEnd>arrow_forward</mat-icon>
            </button>
          }
        </div>
      </mat-card-content>
    </mat-card>
  `,
})
export class ConfirmComponent {
  readonly state = inject(WizardStateService);
  private readonly router = inject(Router);
  running = signal(false);
  done = signal(false);
  log = signal<string[]>([]);
  errorMsg = signal<string | null>(null);

  voucherPhase(): string {
    return this.state.processes().find((p) => p.requires_payment_voucher === 1)?.name ?? 'ninguno';
  }
  catalogSummary(): string {
    const entries = Object.entries(this.state.catalogSeeds()).map(([k, v]) => `${k}: ${v.length}`);
    return entries.length ? entries.join(', ') : '—';
  }
  integrationsSummary(): string {
    const i = this.state.integrations();
    const bb = Object.keys(i.backblaze ?? {}).length;
    const oa = Object.keys(i.ordersApi ?? {}).length;
    return `Backblaze ${bb} keys, Orders ${oa} keys`;
  }

  async run() {
    if (!window.wizardApi) {
      this.errorMsg.set('wizardApi no disponible');
      return;
    }
    this.running.set(true);
    this.errorMsg.set(null);
    this.log.set([]);
    const payload = {
      central: this.state.central(),
      superAdminToken: this.state.adminToken() ?? undefined,
      tenant: {
        slug: this.state.tenantSlug(),
        name: this.state.tenantName(),
        db: this.state.tenantDb() as Required<typeof this.state.tenantDb extends () => infer T ? T : never>,
        encryptionKey: this.state.encryptionKey(),
      },
      clientGroup: this.state.clientGroup(),
      companies: this.state.companies(),
      agencies: this.state.agencies(),
      processes: this.state.processes(),
      catalogSeeds: this.state.catalogSeeds(),
      admin: this.state.adminUserDraft(),
      branding: this.state.branding(),
      integrations: this.state.integrations(),
    };
    const r = await window.wizardApi.wizard.provision(payload);
    this.log.set(r.log ?? []);
    this.running.set(false);
    if (!r.ok) {
      this.errorMsg.set(r.message ?? 'Falló');
      return;
    }
    this.state.provisionResult.set(r);
    this.done.set(true);
  }

  next() { this.router.navigate(['/done']); }
}
