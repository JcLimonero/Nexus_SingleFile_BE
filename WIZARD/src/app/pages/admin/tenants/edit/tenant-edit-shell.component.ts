import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { TenantSessionService } from '../../../../state/tenant-session.service';
import { TenantEditCompaniesComponent } from './tenant-edit-companies.component';
import { TenantEditAgenciesComponent } from './tenant-edit-agencies.component';
import { TenantEditUsersComponent } from './tenant-edit-users.component';
import { TenantEditPhasesComponent } from './tenant-edit-phases.component';
import { TenantEditBrandingComponent } from './tenant-edit-branding.component';
import { TenantEditIntegrationsComponent } from './tenant-edit-integrations.component';

/**
 * Shell de edición de un tenant. Tabs con un componente dedicado por sección.
 * No reusa los componentes del flow de provisioning porque trabajan con
 * inputs en memoria (drafts) sin DB; los edit son CRUD vivos contra el tenant.
 */
@Component({
  selector: 'wiz-tenant-edit-shell',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    MatCardModule, MatTabsModule, MatIconModule, MatButtonModule,
    MatProgressSpinnerModule, MatChipsModule,
    TenantEditCompaniesComponent, TenantEditAgenciesComponent,
    TenantEditUsersComponent, TenantEditPhasesComponent,
    TenantEditBrandingComponent, TenantEditIntegrationsComponent,
  ],
  template: `
    <mat-card>
      <mat-card-content>
        @if (loading()) {
          <div style="text-align:center; padding: 32px;">
            <mat-spinner [diameter]="32"></mat-spinner>
            <p style="margin-top: 12px; opacity: 0.7;">Abriendo tenant…</p>
          </div>
        } @else if (error()) {
          <p style="color: crimson;">❌ {{ error() }}</p>
          <a mat-button routerLink="/admin/tenants">
            <mat-icon>arrow_back</mat-icon> Volver a la lista
          </a>
        } @else {
          @if (session.selectedTenant(); as t) {
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:8px;">
              <a mat-icon-button routerLink="/admin/tenants" matTooltip="Volver">
                <mat-icon>arrow_back</mat-icon>
              </a>
              <div style="flex:1;">
                <h2 style="margin: 0;">{{ t.name }}</h2>
                <div style="font-size: 12px; opacity: 0.7; font-family: monospace;">
                  {{ t.slug }} · {{ t.tenantDb.host }}:{{ t.tenantDb.port }}/{{ t.tenantDb.database }}
                </div>
              </div>
              <mat-chip [color]="t.status === 'active' ? 'primary' : 'warn'" highlighted>
                {{ t.status }}
              </mat-chip>
              <button mat-stroked-button (click)="close()">
                <mat-icon>logout</mat-icon> Cerrar
              </button>
            </div>

            <mat-tab-group>
            <mat-tab label="Razones Sociales">
              <wiz-tenant-edit-companies></wiz-tenant-edit-companies>
            </mat-tab>
            <mat-tab label="Agencias">
              <wiz-tenant-edit-agencies></wiz-tenant-edit-agencies>
            </mat-tab>
            <mat-tab label="Usuarios">
              <wiz-tenant-edit-users></wiz-tenant-edit-users>
            </mat-tab>
            <mat-tab label="Fases">
              <wiz-tenant-edit-phases></wiz-tenant-edit-phases>
            </mat-tab>
            <mat-tab label="Branding">
              <wiz-tenant-edit-branding></wiz-tenant-edit-branding>
            </mat-tab>
            <mat-tab label="Integraciones">
              <wiz-tenant-edit-integrations></wiz-tenant-edit-integrations>
            </mat-tab>
          </mat-tab-group>
          }
        }
      </mat-card-content>
    </mat-card>
  `,
})
export class TenantEditShellComponent implements OnInit {
  readonly session = inject(TenantSessionService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  loading = signal(false);
  error = signal<string>('');

  async ngOnInit() {
    const idStr = this.route.snapshot.paramMap.get('id');
    if (!idStr) {
      this.error.set('Falta id de tenant en la ruta');
      return;
    }
    const id = Number(idStr);
    const existing = this.session.selectedTenant();
    if (existing && existing.id === id) return; // ya cargado por la lista

    if (!this.session.canBrowse()) {
      this.error.set('Sesión expirada. Volver a /admin para reconectar.');
      return;
    }
    this.loading.set(true);
    const r = await this.session.selectTenant(id);
    this.loading.set(false);
    if (!r.ok) this.error.set(r.message ?? 'No se pudo abrir el tenant');
  }

  close() {
    this.session.clearTenant();
    this.router.navigate(['/admin/tenants']);
  }
}
