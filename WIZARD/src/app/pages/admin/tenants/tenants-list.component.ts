import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { TenantSessionService } from '../../../state/tenant-session.service';
import { WizardStateService } from '../../../state/wizard-state.service';

@Component({
  selector: 'wiz-tenants-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    MatCardModule, MatButtonModule, MatIconModule, MatTableModule,
    MatProgressSpinnerModule, MatTooltipModule, MatChipsModule,
  ],
  template: `
    <mat-card>
      <mat-card-content>
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
          <h2 style="margin:0; flex:1;">Tenants registrados</h2>
          <button mat-stroked-button (click)="refresh()" [disabled]="loading()">
            <mat-icon>refresh</mat-icon> Refrescar
          </button>
        </div>

        @if (!session.canBrowse()) {
          <p style="color: crimson;">
            ⚠ Falta sesión. <a routerLink="/admin">Volver al inicio admin</a>.
          </p>
        } @else if (loading()) {
          <mat-spinner [diameter]="32" style="margin: 32px auto;"></mat-spinner>
        } @else if (error()) {
          <p style="color: crimson;">❌ {{ error() }}</p>
        } @else if (session.tenants().length === 0) {
          <p style="opacity:0.6; padding: 32px; text-align: center;">No hay tenants registrados.</p>
        } @else {
          <table mat-table [dataSource]="session.tenants()" class="mat-elevation-z1" style="width:100%;">
            <ng-container matColumnDef="slug">
              <th mat-header-cell *matHeaderCellDef>Slug</th>
              <td mat-cell *matCellDef="let t"><code>{{ t.slug }}</code></td>
            </ng-container>
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Nombre</th>
              <td mat-cell *matCellDef="let t">{{ t.name }}</td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let t">
                <mat-chip [color]="t.status === 'active' ? 'primary' : 'warn'" highlighted style="font-size:11px;">
                  {{ t.status }}
                </mat-chip>
              </td>
            </ng-container>
            <ng-container matColumnDef="db">
              <th mat-header-cell *matHeaderCellDef>DB</th>
              <td mat-cell *matCellDef="let t" style="font-size:12px; font-family: monospace;">
                {{ t.db_host }}:{{ t.db_port }}/{{ t.db_name }}
              </td>
            </ng-container>
            <ng-container matColumnDef="created">
              <th mat-header-cell *matHeaderCellDef>Creado</th>
              <td mat-cell *matCellDef="let t" style="font-size:12px;">
                {{ t.created_at | date:'shortDate' }}
              </td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef></th>
              <td mat-cell *matCellDef="let t">
                <button mat-flat-button color="primary" (click)="open(t.id)" [disabled]="opening() === t.id">
                  @if (opening() === t.id) {
                    <mat-spinner [diameter]="16"></mat-spinner>
                  } @else {
                    <mat-icon>folder_open</mat-icon>
                  }
                  Abrir
                </button>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="cols"></tr>
            <tr mat-row *matRowDef="let row; columns: cols;"></tr>
          </table>
          @if (openError()) {
            <p style="color: crimson; margin-top: 8px;">❌ {{ openError() }}</p>
          }
        }
      </mat-card-content>
    </mat-card>
  `,
})
export class TenantsListComponent implements OnInit {
  readonly session = inject(TenantSessionService);
  private readonly state = inject(WizardStateService);
  private readonly router = inject(Router);

  cols = ['slug', 'name', 'status', 'db', 'created', 'actions'];
  loading = signal(false);
  error = signal<string>('');
  opening = signal<number | null>(null);
  openError = signal<string>('');

  async ngOnInit() {
    // Bridge final: si el operador entró acá directo desde el menú lateral
    // sin pasar por /admin, sincroniza la sesión desde el WizardStateService.
    if (!this.session.centralCfg() && this.state.centralOk()) {
      this.session.setCentral(this.state.central(), this.state.encryptionKey());
    }
    if (!this.session.superAdminToken() && this.state.adminToken()) {
      this.session.setSuperAdminToken(this.state.adminToken());
    }
    if (this.session.canBrowse()) {
      await this.refresh();
    }
  }

  async refresh() {
    this.loading.set(true);
    this.error.set('');
    const r = await this.session.refreshTenantsList();
    this.loading.set(false);
    if (!r.ok) this.error.set(r.message ?? 'Error');
  }

  async open(id: number) {
    this.opening.set(id);
    this.openError.set('');
    const r = await this.session.selectTenant(id);
    this.opening.set(null);
    if (!r.ok) {
      this.openError.set(r.message ?? 'Error abriendo tenant');
      return;
    }
    this.router.navigate(['/admin/tenants', id]);
  }
}
