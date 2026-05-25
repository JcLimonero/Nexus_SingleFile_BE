import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Tenant, TenantService } from '../../core/tenant.service';

@Component({
  selector: 'adm-tenants',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <mat-card class="adm-card">
      <mat-card-content>
        <div style="display:flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <div>
            <h2 style="margin: 0;">Tenants</h2>
            <p style="margin: 4px 0 0; color: #666; font-size: 14px;">Clientes del SaaS y su estado de licencia.</p>
          </div>
          <button mat-flat-button color="primary" disabled title="Próximamente">
            <mat-icon>add</mat-icon> Nuevo tenant
          </button>
        </div>

        @if (loading()) {
          <div style="text-align: center; padding: 48px;">
            <mat-spinner diameter="36" style="margin: 0 auto;"></mat-spinner>
          </div>
        } @else if (error()) {
          <div style="color: #c62828; padding: 16px; background: #ffebee; border-radius: 4px;">
            {{ error() }}
          </div>
        } @else {
          <table mat-table [dataSource]="tenants()" style="width: 100%;">
            <ng-container matColumnDef="slug">
              <th mat-header-cell *matHeaderCellDef>Slug</th>
              <td mat-cell *matCellDef="let t">{{ t.slug }}</td>
            </ng-container>
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Nombre</th>
              <td mat-cell *matCellDef="let t">{{ t.name }}</td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let t">
                <span class="adm-status-chip" [class]="'adm-status-chip adm-status-' + t.status">{{ t.status }}</span>
              </td>
            </ng-container>
            <ng-container matColumnDef="db">
              <th mat-header-cell *matHeaderCellDef>DB</th>
              <td mat-cell *matCellDef="let t" style="color: #666; font-size: 12px;">
                {{ t.db_host }}:{{ t.db_port }} / {{ t.db_name }}
              </td>
            </ng-container>
            <ng-container matColumnDef="acciones">
              <th mat-header-cell *matHeaderCellDef></th>
              <td mat-cell *matCellDef="let t">
                <a mat-icon-button [routerLink]="['/tenants', t.id]" aria-label="Detalle">
                  <mat-icon>chevron_right</mat-icon>
                </a>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="cols"></tr>
            <tr mat-row *matRowDef="let row; columns: cols"></tr>
          </table>
          @if (!tenants().length) {
            <div style="text-align: center; padding: 48px; color: #999;">
              <mat-icon style="font-size: 48px; height: 48px; width: 48px;">groups</mat-icon>
              <p>Aún no hay tenants. Provisiona uno desde el WIZARD desktop.</p>
            </div>
          }
        }
      </mat-card-content>
    </mat-card>
  `,
})
export class TenantsComponent {
  private readonly svc = inject(TenantService);

  readonly cols = ['slug', 'name', 'status', 'db', 'acciones'];
  readonly tenants = signal<Tenant[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  constructor() {
    this.svc.list().subscribe({
      next: (r) => {
        this.loading.set(false);
        this.tenants.set(r.data?.tenants ?? []);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message ?? 'No se pudo cargar la lista de tenants. ¿ADMIN_BE corriendo?');
      },
    });
  }
}
