import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TenantSessionService } from '../../../../state/tenant-session.service';
import type { AgencyRow, CompanyRow } from '../../../../types/wizard-api';

@Component({
  selector: 'wiz-tenant-edit-agencies',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatButtonModule, MatIconModule, MatTableModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatSlideToggleModule, MatProgressSpinnerModule, MatSnackBarModule,
  ],
  template: `
    <div style="padding: 16px 0;">
      <div style="display:flex; gap:12px; align-items:flex-end; margin-bottom:12px; flex-wrap: wrap;">
        <mat-form-field appearance="outline" style="flex:1; min-width: 240px; max-width: 360px;">
          <mat-label>Nueva agencia</mat-label>
          <input matInput [(ngModel)]="draftName" />
        </mat-form-field>
        <mat-form-field appearance="outline" style="min-width: 200px;">
          <mat-label>Razón social</mat-label>
          <mat-select [(ngModel)]="draftCompany">
            <mat-option [value]="null">— sin asignar —</mat-option>
            @for (c of companies(); track c.id) {
              <mat-option [value]="c.id">{{ c.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" style="max-width: 180px;">
          <mat-label>ID DMS (opcional)</mat-label>
          <input matInput [(ngModel)]="draftDms" />
        </mat-form-field>
        <button mat-flat-button color="primary" (click)="addNew()" [disabled]="!draftName.trim() || saving()">
          <mat-icon>add</mat-icon> Agregar
        </button>
      </div>

      @if (loading()) {
        <mat-spinner [diameter]="24"></mat-spinner>
      } @else if (rows().length === 0) {
        <p style="opacity:0.6;">Sin agencias.</p>
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
          <ng-container matColumnDef="company">
            <th mat-header-cell *matHeaderCellDef>Razón social</th>
            <td mat-cell *matCellDef="let r">
              @if (editingId() === r.id) {
                <mat-select [(ngModel)]="editCompany" style="width:100%;">
                  <mat-option [value]="null">— sin —</mat-option>
                  @for (c of companies(); track c.id) {
                    <mat-option [value]="c.id">{{ c.name }}</mat-option>
                  }
                </mat-select>
              } @else {
                {{ r.company_name || '—' }}
              }
            </td>
          </ng-container>
          <ng-container matColumnDef="dms">
            <th mat-header-cell *matHeaderCellDef>ID DMS</th>
            <td mat-cell *matCellDef="let r" style="font-family: monospace; font-size: 12px;">
              @if (editingId() === r.id) {
                <input matInput [(ngModel)]="editDms" style="width:100%;" />
              } @else {
                {{ r.id_agency_dms || '—' }}
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
export class TenantEditAgenciesComponent implements OnInit {
  readonly session = inject(TenantSessionService);
  private readonly snack = inject(MatSnackBar);

  cols = ['id', 'name', 'company', 'dms', 'enabled', 'actions'];
  rows = signal<AgencyRow[]>([]);
  companies = signal<CompanyRow[]>([]);
  loading = signal(false);
  saving = signal(false);
  editingId = signal<number | null>(null);

  draftName = '';
  draftCompany: number | null = null;
  draftDms = '';
  editName = '';
  editCompany: number | null = null;
  editDms = '';

  async ngOnInit() {
    await Promise.all([this.refresh(), this.loadCompanies()]);
  }

  async loadCompanies() {
    const cfg = this.session.tenantDbCfg();
    if (!cfg) return;
    const r = await window.wizardApi.tenant.listCompanies(cfg);
    if (r.ok && r.data) this.companies.set(r.data.filter((c) => c.enabled === 1));
  }

  async refresh() {
    const cfg = this.session.tenantDbCfg();
    if (!cfg) return;
    this.loading.set(true);
    const r = await window.wizardApi.tenant.listAgencies(cfg);
    this.loading.set(false);
    if (r.ok && r.data) this.rows.set(r.data);
    else this.snack.open(r.message ?? 'Error cargando', 'cerrar', { duration: 3000 });
  }

  async addNew() {
    const cfg = this.session.tenantDbCfg();
    const name = this.draftName.trim();
    if (!cfg || !name) return;
    this.saving.set(true);
    const r = await window.wizardApi.tenant.saveAgency(cfg, {
      name,
      id_company: this.draftCompany ?? null,
      id_agency_dms: this.draftDms.trim() || null,
    }, this.session.actorUserId());
    this.saving.set(false);
    if (r.ok) {
      this.draftName = '';
      this.draftDms = '';
      this.draftCompany = null;
      await this.refresh();
      this.snack.open('Agencia agregada', 'cerrar', { duration: 2000 });
    } else {
      this.snack.open(r.message ?? 'Error', 'cerrar', { duration: 3000 });
    }
  }

  startEdit(r: AgencyRow) {
    this.editingId.set(r.id);
    this.editName = r.name;
    this.editCompany = r.id_company;
    this.editDms = r.id_agency_dms ?? '';
  }
  cancelEdit() { this.editingId.set(null); }
  async saveEdit(r: AgencyRow) {
    const cfg = this.session.tenantDbCfg();
    if (!cfg) return;
    this.saving.set(true);
    const res = await window.wizardApi.tenant.saveAgency(cfg, {
      id: r.id,
      name: this.editName.trim(),
      id_company: this.editCompany,
      id_agency_dms: this.editDms.trim() || null,
    }, this.session.actorUserId());
    this.saving.set(false);
    if (res.ok) {
      this.editingId.set(null);
      await this.refresh();
    } else {
      this.snack.open(res.message ?? 'Error', 'cerrar', { duration: 3000 });
    }
  }

  async toggle(r: AgencyRow, enabled: boolean) {
    const cfg = this.session.tenantDbCfg();
    if (!cfg) return;
    this.saving.set(true);
    const res = await window.wizardApi.tenant.toggleAgencyEnabled(
      cfg, r.id, enabled ? 1 : 0, this.session.actorUserId(),
    );
    this.saving.set(false);
    if (res.ok) await this.refresh();
    else this.snack.open(res.message ?? 'Error', 'cerrar', { duration: 3000 });
  }
}
