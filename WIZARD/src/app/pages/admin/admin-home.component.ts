import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { WizardStateService } from '../../state/wizard-state.service';
import { TenantSessionService } from '../../state/tenant-session.service';

/**
 * Entry point del modo administración.
 *
 * Reusa los signals que ya populó el flow de provisioning (centralCfg,
 * encryptionKey, adminToken). Si el operador entró directo a /admin sin
 * pasar por central-db/admin-login, se le muestran cards guiando al setup.
 *
 * Al cargar, si todo está listo, copia las creds al TenantSessionService
 * y deja la navegación libre a /admin/tenants.
 */
@Component({
  selector: 'wiz-admin-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <mat-card>
      <mat-card-content>
        <h2 style="margin-top:0;">Modo administración</h2>
        <p style="opacity: 0.75;">
          Gestión de tenants ya deployados. Útil para agregar agencias/razones sociales
          (cobro por agencia → no se delega al cliente), resetear passwords, ajustar branding
          o integraciones, sin reprovisionar.
        </p>

        <div style="display: grid; gap: 12px; max-width: 720px; margin: 24px 0;">
          <div class="step-row" [class.ready]="centralReady()">
            <mat-icon>{{ centralReady() ? 'check_circle' : 'pending' }}</mat-icon>
            <div style="flex:1;">
              <div style="font-weight: 600;">1. Conexión a central DB</div>
              <div style="font-size: 13px; opacity: 0.75;">
                @if (centralReady()) {
                  Conectado a <code>{{ centralHost() }}</code>.
                } @else {
                  Pendiente — sin esto no se pueden listar tenants.
                }
              </div>
            </div>
            <a mat-stroked-button routerLink="/central-db">
              {{ centralReady() ? 'Cambiar' : 'Conectar' }}
            </a>
          </div>

          <div class="step-row" [class.ready]="adminReady()">
            <mat-icon>{{ adminReady() ? 'check_circle' : 'pending' }}</mat-icon>
            <div style="flex:1;">
              <div style="font-weight: 600;">2. Login super-admin</div>
              <div style="font-size: 13px; opacity: 0.75;">
                @if (adminReady()) {
                  Sesión activa: <code>{{ state.adminUser()?.email }}</code>.
                } @else {
                  Pendiente — login contra ADMIN_BE para audit trail.
                }
              </div>
            </div>
            <a mat-stroked-button routerLink="/admin-login" [disabled]="!centralReady()">
              {{ adminReady() ? 'Cambiar' : 'Iniciar sesión' }}
            </a>
          </div>

          <div class="step-row" [class.ready]="canBrowse()">
            <mat-icon>{{ canBrowse() ? 'check_circle' : 'pending' }}</mat-icon>
            <div style="flex:1;">
              <div style="font-weight: 600;">3. Tenants</div>
              <div style="font-size: 13px; opacity: 0.75;">
                @if (canBrowse()) {
                  Listo para listar y editar.
                } @else {
                  Completa los pasos anteriores primero.
                }
              </div>
            </div>
            <a mat-flat-button color="primary" routerLink="/admin/tenants" [disabled]="!canBrowse()">
              <mat-icon>list</mat-icon> Ir a Tenants
            </a>
          </div>
        </div>

        @if (warning()) {
          <p style="color: crimson; font-size: 13px;">⚠ {{ warning() }}</p>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .step-row {
      display: flex; align-items: center; gap: 12px;
      padding: 12px; border: 1px solid #e0e0e0; border-radius: 6px;
      background: #fafafa;
    }
    .step-row.ready { background: #e8f5e9; border-color: #c8e6c9; }
    .step-row mat-icon { color: #9e9e9e; }
    .step-row.ready mat-icon { color: #43a047; }
  `],
})
export class AdminHomeComponent implements OnInit {
  readonly state = inject(WizardStateService);
  readonly session = inject(TenantSessionService);
  private readonly router = inject(Router);

  warning = signal<string>('');

  centralReady = computed(() => this.state.centralOk() && !!this.state.encryptionKey());
  adminReady = computed(() => !!this.state.adminToken());
  canBrowse = computed(() => this.centralReady() && this.adminReady());
  centralHost = computed(() => this.state.central().host);

  ngOnInit() {
    this.syncSession();
  }

  /** Bridge: si el flow normal ya populó central+admin, copia a TenantSession. */
  private syncSession() {
    if (this.state.centralOk() && this.state.encryptionKey()) {
      this.session.setCentral(this.state.central(), this.state.encryptionKey());
    } else if (!this.state.encryptionKey()) {
      this.warning.set('Falta TENANT_DB_ENCRYPTION_KEY en config/central.env — el wizard no podrá descifrar credenciales de tenants.');
    }
    const token = this.state.adminToken();
    if (token) {
      this.session.setSuperAdminToken(token);
    }
  }
}
