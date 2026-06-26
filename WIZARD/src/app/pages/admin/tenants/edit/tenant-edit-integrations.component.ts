import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { TenantSessionService } from '../../../../state/tenant-session.service';
import type { TenantConfigRow } from '../../../../types/wizard-api';

/**
 * Integraciones (Backblaze + Orders API) — pares key/value en central.tenant_config.
 * Soporta agregar, editar y borrar entradas individuales. Valores sensibles
 * (claves/passwords) se enmascaran en la tabla salvo que el operador haga "ver".
 */
@Component({
  selector: 'wiz-tenant-edit-integrations',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatButtonModule, MatIconModule, MatTableModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatProgressSpinnerModule,
    MatSnackBarModule, MatChipsModule,
  ],
  template: `
    <div style="padding: 16px 0;">
      <div style="display:flex; gap:12px; align-items:flex-end; margin-bottom:12px; flex-wrap: wrap;">
        <mat-form-field appearance="outline" style="min-width: 160px;">
          <mat-label>Categoría</mat-label>
          <mat-select [(ngModel)]="draft.category">
            <mat-option value="backblaze">backblaze</mat-option>
            <mat-option value="orders_api">orders_api</mat-option>
            <mat-option value="otra">otra</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" style="min-width: 200px;">
          <mat-label>Key</mat-label>
          <input matInput [(ngModel)]="draft.config_key" />
        </mat-form-field>
        <mat-form-field appearance="outline" style="flex: 1; min-width: 240px;">
          <mat-label>Value</mat-label>
          <input matInput [(ngModel)]="draft.config_value" />
        </mat-form-field>
        <button mat-flat-button color="primary" (click)="addNew()" [disabled]="!canAdd() || saving()">
          <mat-icon>add</mat-icon> Agregar / actualizar
        </button>
      </div>

      @if (loading()) {
        <mat-spinner [diameter]="24"></mat-spinner>
      } @else if (rows().length === 0) {
        <p style="opacity:0.6;">Sin integraciones configuradas.</p>
      } @else {
        <table mat-table [dataSource]="rows()" class="mat-elevation-z1" style="width:100%;">
          <ng-container matColumnDef="category">
            <th mat-header-cell *matHeaderCellDef>Categoría</th>
            <td mat-cell *matCellDef="let r">
              <mat-chip highlighted style="font-size:11px;">{{ r.category }}</mat-chip>
            </td>
          </ng-container>
          <ng-container matColumnDef="key">
            <th mat-header-cell *matHeaderCellDef>Key</th>
            <td mat-cell *matCellDef="let r" style="font-family: monospace; font-size: 12px;">{{ r.config_key }}</td>
          </ng-container>
          <ng-container matColumnDef="value">
            <th mat-header-cell *matHeaderCellDef>Value</th>
            <td mat-cell *matCellDef="let r" style="font-family: monospace; font-size: 12px;">
              @if (r.sensitive === 1 && !revealed().has(r.config_key)) {
                ••••••••
                <button mat-icon-button (click)="reveal(r.config_key)">
                  <mat-icon style="font-size:16px; height:16px; width:16px;">visibility</mat-icon>
                </button>
              } @else {
                {{ r.config_value }}
              }
            </td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let r">
              <button mat-icon-button matTooltip="Editar" (click)="loadIntoDraft(r)" [disabled]="saving()">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button matTooltip="Eliminar" color="warn" (click)="remove(r)" [disabled]="saving()">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="cols"></tr>
          <tr mat-row *matRowDef="let row; columns: cols;"></tr>
        </table>
      }
    </div>
  `,
})
export class TenantEditIntegrationsComponent implements OnInit {
  readonly session = inject(TenantSessionService);
  private readonly snack = inject(MatSnackBar);

  cols = ['category', 'key', 'value', 'actions'];
  rows = signal<TenantConfigRow[]>([]);
  loading = signal(false);
  saving = signal(false);
  revealed = signal<Set<string>>(new Set());

  draft = { category: 'backblaze', config_key: '', config_value: '' };

  async ngOnInit() { await this.refresh(); }

  canAdd() { return !!this.draft.category && !!this.draft.config_key.trim(); }

  async refresh() {
    const cfg = this.session.centralCfg();
    const t = this.session.selectedTenant();
    if (!cfg || !t) return;
    this.loading.set(true);
    // Filtra fuera la categoría 'branding' para no mezclar — esa va en su propio tab.
    const r = await window.wizardApi.tenant.listConfig(cfg, t.id);
    this.loading.set(false);
    if (r.ok && r.data) {
      this.rows.set(r.data.filter((x) => x.category !== 'branding'));
    } else {
      this.snack.open(r.message ?? 'Error', 'cerrar', { duration: 3000 });
    }
  }

  async addNew() {
    const cfg = this.session.centralCfg();
    const t = this.session.selectedTenant();
    if (!cfg || !t || !this.canAdd()) return;
    this.saving.set(true);
    const res = await window.wizardApi.tenant.saveConfig(cfg, t.id, [{
      config_key: this.draft.config_key.trim(),
      config_value: this.draft.config_value,
      category: this.draft.category,
    }]);
    this.saving.set(false);
    if (res.ok) {
      this.draft.config_key = '';
      this.draft.config_value = '';
      await this.refresh();
      this.snack.open('Guardado', 'cerrar', { duration: 2000 });
    } else {
      this.snack.open(res.message ?? 'Error', 'cerrar', { duration: 3000 });
    }
  }

  loadIntoDraft(r: TenantConfigRow) {
    this.draft = {
      category: r.category,
      config_key: r.config_key,
      config_value: r.config_value,
    };
  }

  async remove(r: TenantConfigRow) {
    if (!confirm(`¿Eliminar ${r.config_key}?`)) return;
    const cfg = this.session.centralCfg();
    const t = this.session.selectedTenant();
    if (!cfg || !t) return;
    this.saving.set(true);
    const res = await window.wizardApi.tenant.deleteConfig(cfg, t.id, r.config_key);
    this.saving.set(false);
    if (res.ok) await this.refresh();
    else this.snack.open(res.message ?? 'Error', 'cerrar', { duration: 3000 });
  }

  reveal(key: string) {
    const s = new Set(this.revealed());
    s.add(key);
    this.revealed.set(s);
  }
}
