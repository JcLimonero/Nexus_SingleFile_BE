import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TenantSessionService } from '../../../../state/tenant-session.service';
import type { CompanyRow } from '../../../../types/wizard-api';

@Component({
  selector: 'wiz-tenant-edit-companies',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatButtonModule, MatIconModule, MatTableModule, MatFormFieldModule,
    MatInputModule, MatSlideToggleModule, MatProgressSpinnerModule, MatSnackBarModule,
  ],
  template: `
    <div style="padding: 16px 0;">
      <div style="display:flex; gap:12px; align-items:flex-end; margin-bottom:12px;">
        <mat-form-field appearance="outline" style="flex:1; max-width: 360px;">
          <mat-label>Nueva razón social</mat-label>
          <input matInput [(ngModel)]="draftName" (keyup.enter)="addNew()" />
        </mat-form-field>
        <mat-form-field appearance="outline" style="flex:1; max-width: 360px;">
          <mat-label>Agency connection (opcional)</mat-label>
          <input matInput [(ngModel)]="draftConn" />
        </mat-form-field>
        <button mat-flat-button color="primary" (click)="addNew()" [disabled]="!draftName.trim() || saving()">
          <mat-icon>add</mat-icon> Agregar
        </button>
      </div>

      @if (loading()) {
        <mat-spinner [diameter]="24"></mat-spinner>
      } @else if (rows().length === 0) {
        <p style="opacity:0.6;">Sin razones sociales.</p>
      } @else {
        <table mat-table [dataSource]="rows()" class="mat-elevation-z1" style="width:100%;">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef>ID</th>
            <td mat-cell *matCellDef="let r">{{ r.id }}</td>
          </ng-container>
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Nombre</th>
            <td mat-cell *matCellDef="let r">
              @if (editingId() === r.id) {
                <input matInput [(ngModel)]="editName" style="width:100%;" />
              } @else {
                {{ r.name }}
              }
            </td>
          </ng-container>
          <ng-container matColumnDef="conn">
            <th mat-header-cell *matHeaderCellDef>Agency connection</th>
            <td mat-cell *matCellDef="let r" style="font-family: monospace; font-size: 12px;">
              @if (editingId() === r.id) {
                <input matInput [(ngModel)]="editConn" style="width:100%;" />
              } @else {
                {{ r.agency_connection || '—' }}
              }
            </td>
          </ng-container>
          <ng-container matColumnDef="enabled">
            <th mat-header-cell *matHeaderCellDef>Habilitada</th>
            <td mat-cell *matCellDef="let r">
              <mat-slide-toggle
                [checked]="r.enabled === 1"
                (change)="toggle(r, $event.checked)"
                [disabled]="saving()">
              </mat-slide-toggle>
            </td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let r">
              @if (editingId() === r.id) {
                <button mat-icon-button color="primary" (click)="saveEdit(r)" [disabled]="saving()">
                  <mat-icon>save</mat-icon>
                </button>
                <button mat-icon-button (click)="cancelEdit()" [disabled]="saving()">
                  <mat-icon>close</mat-icon>
                </button>
              } @else {
                <button mat-icon-button (click)="startEdit(r)" [disabled]="saving() || editingId() !== null">
                  <mat-icon>edit</mat-icon>
                </button>
              }
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="cols"></tr>
          <tr mat-row *matRowDef="let row; columns: cols;"></tr>
        </table>
      }
    </div>
  `,
})
export class TenantEditCompaniesComponent implements OnInit {
  readonly session = inject(TenantSessionService);
  private readonly snack = inject(MatSnackBar);

  cols = ['id', 'name', 'conn', 'enabled', 'actions'];
  rows = signal<CompanyRow[]>([]);
  loading = signal(false);
  saving = signal(false);
  editingId = signal<number | null>(null);

  draftName = '';
  draftConn = '';
  editName = '';
  editConn = '';

  async ngOnInit() { await this.refresh(); }

  async refresh() {
    const cfg = this.session.tenantDbCfg();
    if (!cfg) return;
    this.loading.set(true);
    const r = await window.wizardApi.tenant.listCompanies(cfg);
    this.loading.set(false);
    if (r.ok && r.data) this.rows.set(r.data);
    else this.snack.open(r.message ?? 'Error cargando', 'cerrar', { duration: 3000 });
  }

  async addNew() {
    const cfg = this.session.tenantDbCfg();
    const name = this.draftName.trim();
    if (!cfg || !name) return;
    this.saving.set(true);
    const r = await window.wizardApi.tenant.saveCompany(cfg, {
      name,
      agency_connection: this.draftConn.trim() || null,
    }, this.session.actorUserId());
    this.saving.set(false);
    if (r.ok) {
      this.draftName = '';
      this.draftConn = '';
      await this.refresh();
      this.snack.open('Razón social agregada', 'cerrar', { duration: 2000 });
    } else {
      this.snack.open(r.message ?? 'Error', 'cerrar', { duration: 3000 });
    }
  }

  startEdit(r: CompanyRow) {
    this.editingId.set(r.id);
    this.editName = r.name;
    this.editConn = r.agency_connection ?? '';
  }
  cancelEdit() {
    this.editingId.set(null);
  }
  async saveEdit(r: CompanyRow) {
    const cfg = this.session.tenantDbCfg();
    if (!cfg) return;
    this.saving.set(true);
    const res = await window.wizardApi.tenant.saveCompany(cfg, {
      id: r.id,
      name: this.editName.trim(),
      agency_connection: this.editConn.trim() || null,
    }, this.session.actorUserId());
    this.saving.set(false);
    if (res.ok) {
      this.editingId.set(null);
      await this.refresh();
    } else {
      this.snack.open(res.message ?? 'Error', 'cerrar', { duration: 3000 });
    }
  }

  async toggle(r: CompanyRow, enabled: boolean) {
    const cfg = this.session.tenantDbCfg();
    if (!cfg) return;
    this.saving.set(true);
    const res = await window.wizardApi.tenant.toggleCompanyEnabled(
      cfg, r.id, enabled ? 1 : 0, this.session.actorUserId(),
    );
    this.saving.set(false);
    if (res.ok) await this.refresh();
    else this.snack.open(res.message ?? 'Error', 'cerrar', { duration: 3000 });
  }
}
