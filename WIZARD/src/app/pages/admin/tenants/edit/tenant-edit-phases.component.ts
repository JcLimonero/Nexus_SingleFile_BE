import { Component, OnInit, computed, inject, signal } from '@angular/core';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { TenantSessionService } from '../../../../state/tenant-session.service';
import type { PhaseRow, SubStateRow } from '../../../../types/wizard-api';

/**
 * Edición de fases (expedient_state) + subfases (expedient_sub_state).
 * Las fases is_system=1 quedan locked (no se renombran ni se desactivan
 * desde acá) — sólo se editan flags secundarios.
 */
@Component({
  selector: 'wiz-tenant-edit-phases',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatButtonModule, MatIconModule, MatTableModule, MatFormFieldModule,
    MatInputModule, MatSlideToggleModule, MatProgressSpinnerModule,
    MatSnackBarModule, MatTooltipModule, MatChipsModule,
  ],
  template: `
    <div style="padding: 16px 0;">
      @if (loading()) {
        <mat-spinner [diameter]="24"></mat-spinner>
      } @else {
        <h3 style="margin: 0 0 8px;">Fases (expedient_state)</h3>
        <table mat-table [dataSource]="phases()" class="mat-elevation-z1" style="width:100%;">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef>ID</th>
            <td mat-cell *matCellDef="let r">{{ r.id }}</td>
          </ng-container>
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Nombre</th>
            <td mat-cell *matCellDef="let r">
              {{ r.name }}
              @if (r.is_system === 1) {
                <mat-chip highlighted style="font-size: 10px; margin-left: 8px;">SYSTEM</mat-chip>
              }
            </td>
          </ng-container>
          <ng-container matColumnDef="order">
            <th mat-header-cell *matHeaderCellDef>Orden</th>
            <td mat-cell *matCellDef="let r">{{ r.display_order }}</td>
          </ng-container>
          <ng-container matColumnDef="navigable">
            <th mat-header-cell *matHeaderCellDef matTooltip="Aparece en sidebar">Nav</th>
            <td mat-cell *matCellDef="let r">{{ r.is_navigable ? '✓' : '—' }}</td>
          </ng-container>
          <ng-container matColumnDef="upload">
            <th mat-header-cell *matHeaderCellDef matTooltip="Permite subir docs">Upload</th>
            <td mat-cell *matCellDef="let r">{{ r.allows_document_upload ? '✓' : '—' }}</td>
          </ng-container>
          <ng-container matColumnDef="voucher">
            <th mat-header-cell *matHeaderCellDef matTooltip="Requiere comprobante">Voucher</th>
            <td mat-cell *matCellDef="let r">{{ r.requires_payment_voucher ? '✓' : '—' }}</td>
          </ng-container>
          <ng-container matColumnDef="terminal">
            <th mat-header-cell *matHeaderCellDef matTooltip="Cierra workflow">Term</th>
            <td mat-cell *matCellDef="let r">{{ r.is_terminal ? '✓' : '—' }}</td>
          </ng-container>
          <ng-container matColumnDef="enabled">
            <th mat-header-cell *matHeaderCellDef>Activa</th>
            <td mat-cell *matCellDef="let r">
              <mat-slide-toggle
                [checked]="r.enabled === 1"
                (change)="toggle(r, $event.checked)"
                [disabled]="saving() || r.is_system === 1">
              </mat-slide-toggle>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="phaseCols"></tr>
          <tr mat-row *matRowDef="let row; columns: phaseCols;"></tr>
        </table>

        <h3 style="margin: 24px 0 8px;">Subfases (expedient_sub_state)</h3>
        @if (subStates().length === 0) {
          <p style="opacity:0.6;">Sin subfases configuradas.</p>
        } @else {
          <table mat-table [dataSource]="subStates()" class="mat-elevation-z1" style="width:100%;">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let r">{{ r.id }}</td>
            </ng-container>
            <ng-container matColumnDef="phase">
              <th mat-header-cell *matHeaderCellDef>Fase padre</th>
              <td mat-cell *matCellDef="let r">{{ phaseName(r.id_expedient_state) }} (#{{ r.id_expedient_state }})</td>
            </ng-container>
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Nombre</th>
              <td mat-cell *matCellDef="let r">{{ r.name }}</td>
            </ng-container>
            <ng-container matColumnDef="enabled">
              <th mat-header-cell *matHeaderCellDef>Activa</th>
              <td mat-cell *matCellDef="let r">{{ r.enabled === 1 ? '✓' : '—' }}</td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="subCols"></tr>
            <tr mat-row *matRowDef="let row; columns: subCols;"></tr>
          </table>
          <p style="font-size:12px; opacity:0.6; margin-top:8px;">
            La edición fina de subfases vive en el provisioning step "Fases". Acá sólo se listan para consulta.
          </p>
        }
      }
    </div>
  `,
})
export class TenantEditPhasesComponent implements OnInit {
  readonly session = inject(TenantSessionService);
  private readonly snack = inject(MatSnackBar);

  phaseCols = ['id', 'name', 'order', 'navigable', 'upload', 'voucher', 'terminal', 'enabled'];
  subCols = ['id', 'phase', 'name', 'enabled'];
  phases = signal<PhaseRow[]>([]);
  subStates = signal<SubStateRow[]>([]);
  loading = signal(false);
  saving = signal(false);

  async ngOnInit() { await this.refresh(); }

  async refresh() {
    const cfg = this.session.tenantDbCfg();
    if (!cfg) return;
    this.loading.set(true);
    const r = await window.wizardApi.tenant.listPhases(cfg);
    this.loading.set(false);
    if (r.ok && r.data) {
      this.phases.set(r.data.phases);
      this.subStates.set(r.data.subStates);
    } else {
      this.snack.open(r.message ?? 'Error', 'cerrar', { duration: 3000 });
    }
  }

  phaseName(id: number): string {
    return this.phases().find((p) => p.id === id)?.name ?? '?';
  }

  async toggle(r: PhaseRow, enabled: boolean) {
    const cfg = this.session.tenantDbCfg();
    if (!cfg) return;
    this.saving.set(true);
    const res = await window.wizardApi.tenant.togglePhaseEnabled(cfg, r.id, enabled ? 1 : 0, this.session.actorUserId());
    this.saving.set(false);
    if (res.ok) await this.refresh();
    else this.snack.open(res.message ?? 'Error', 'cerrar', { duration: 3000 });
  }
}
