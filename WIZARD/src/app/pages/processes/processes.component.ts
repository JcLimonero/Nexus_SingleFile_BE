import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import {
  WizardStateService,
  ExpedientPhaseRow,
  ExpedientSubStateRow,
} from '../../state/wizard-state.service';

/**
 * Auto-derivación de flags para fases custom (las que el admin agrega manualmente).
 * Heurística por nombre: terminales contienen "liberado/cancelado/excepción",
 * navegables todo lo demás. Liquidación marca requires_payment_voucher.
 */
function deriveFlagsFromName(name: string): Partial<ExpedientPhaseRow> {
  const n = name.toLowerCase();
  const terminal = /liberado|cancelado|excepci[oó]n/.test(n);
  return {
    is_terminal: terminal ? 1 : 0,
    is_navigable: terminal ? 0 : 1,
    allows_document_upload: terminal ? 0 : /integrac|liquidac/.test(n) ? 1 : 0,
    is_system: 0,
    requires_payment_voucher: /liquidac/.test(n) ? 1 : 0,
  };
}

@Component({
  selector: 'wiz-processes',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatCheckboxModule, MatRadioModule, MatTableModule,
    MatTooltipModule, MatChipsModule,
  ],
  template: `
    <mat-card class="wiz-card">
      <mat-card-content>
        <h2>Fases del flujo</h2>
        <p>
          Configura las fases del expediente (expedient_state) y las subfases (expedient_sub_state).
          Las fases marcadas con <mat-icon style="font-size:14px;height:14px;width:14px;vertical-align:middle;">lock</mat-icon>
          son del sistema y no se pueden borrar ni renombrar. Reordena con las flechas.
        </p>

        <!-- ====== Tabla de fases ====== -->
        <table mat-table [dataSource]="phases()" style="width:100%;">
          <ng-container matColumnDef="order">
            <th mat-header-cell *matHeaderCellDef>Orden</th>
            <td mat-cell *matCellDef="let r; let i = index">
              <button mat-icon-button (click)="movePhase(i, -1)" [disabled]="i === 0">
                <mat-icon>arrow_upward</mat-icon>
              </button>
              <button mat-icon-button (click)="movePhase(i, 1)" [disabled]="i === phases().length - 1">
                <mat-icon>arrow_downward</mat-icon>
              </button>
              <span style="margin-left:4px;color:#666;">{{ r.display_order ?? '—' }}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="lock">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let r">
              <mat-icon *ngIf="r.is_system === 1" matTooltip="Fase del sistema — no editable">lock</mat-icon>
            </td>
          </ng-container>

          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Nombre</th>
            <td mat-cell *matCellDef="let r">
              <mat-form-field appearance="outline" style="width:100%;">
                <input matInput [(ngModel)]="r.name" [readonly]="r.is_system === 1"
                       (ngModelChange)="onNameChange(r)" />
              </mat-form-field>
            </td>
          </ng-container>

          <ng-container matColumnDef="voucher">
            <th mat-header-cell *matHeaderCellDef matTooltip="Esta fase recibe comprobantes de pago">
              Comprobante
            </th>
            <td mat-cell *matCellDef="let r">
              <mat-checkbox [(ngModel)]="r.requires_payment_voucher_bool"
                            (change)="onVoucherChange(r)"></mat-checkbox>
            </td>
          </ng-container>

          <ng-container matColumnDef="flags">
            <th mat-header-cell *matHeaderCellDef>Tipo</th>
            <td mat-cell *matCellDef="let r">
              <mat-chip-set>
                <mat-chip *ngIf="r.is_navigable === 1" color="primary" highlighted
                          matTooltip="Aparece en sidebar">NAV</mat-chip>
                <mat-chip *ngIf="r.allows_document_upload === 1" color="accent" highlighted
                          matTooltip="Permite cargar documentos">U</mat-chip>
                <mat-chip *ngIf="r.is_terminal === 1" matTooltip="Estado terminal">TERM</mat-chip>
              </mat-chip-set>
            </td>
          </ng-container>

          <ng-container matColumnDef="select">
            <th mat-header-cell *matHeaderCellDef matTooltip="Fase activa para ver/editar subfases">
              Subfases
            </th>
            <td mat-cell *matCellDef="let r">
              <mat-radio-button [value]="r.id" [checked]="selectedPhaseId() === r.id"
                                (change)="selectedPhaseId.set(r.id)"></mat-radio-button>
            </td>
          </ng-container>

          <ng-container matColumnDef="del">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let r; let i = index">
              <button mat-icon-button [disabled]="r.is_system === 1"
                      [matTooltip]="r.is_system === 1 ? 'Fase del sistema — no se puede borrar' : 'Eliminar fase'"
                      (click)="removePhase(i)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="phaseCols"></tr>
          <tr mat-row *matRowDef="let row; columns: phaseCols"></tr>
        </table>

        <div style="margin-top:12px;display:flex;gap:12px;">
          <button mat-stroked-button (click)="loadDefaults()" [disabled]="loadingDefaults()">
            <mat-icon>cloud_download</mat-icon> Cargar defaults
          </button>
          <button mat-stroked-button (click)="addPhase()">
            <mat-icon>add</mat-icon> Agregar fase
          </button>
        </div>

        <!-- ====== Sub-tabla de subfases ====== -->
        <div *ngIf="selectedPhase() as selected" style="margin-top:32px;">
          <h3>
            Subfases de "{{ selected.name }}"
            <span style="font-weight:normal;color:#666;font-size:14px;">
              ({{ subStatesOfSelected().length }})
            </span>
          </h3>
          <p style="color:#666;font-size:13px;">
            Las subfases pertenecen a esta fase específica.
            Los tipos de documento pueden asociarse a una subfase para validación más granular.
          </p>

          <table mat-table [dataSource]="subStatesOfSelected()" style="width:100%;"
                 *ngIf="subStatesOfSelected().length > 0">
            <ng-container matColumnDef="sub_name">
              <th mat-header-cell *matHeaderCellDef>Nombre</th>
              <td mat-cell *matCellDef="let r">
                <mat-form-field appearance="outline" style="width:100%;">
                  <input matInput [(ngModel)]="r.name" />
                </mat-form-field>
              </td>
            </ng-container>

            <ng-container matColumnDef="sub_enabled">
              <th mat-header-cell *matHeaderCellDef>Activa</th>
              <td mat-cell *matCellDef="let r">
                <mat-checkbox [(ngModel)]="r.enabled_bool"
                              (change)="onSubEnabledChange(r)"></mat-checkbox>
              </td>
            </ng-container>

            <ng-container matColumnDef="sub_del">
              <th mat-header-cell *matHeaderCellDef></th>
              <td mat-cell *matCellDef="let r">
                <button mat-icon-button (click)="removeSubState(r.id)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="subCols"></tr>
            <tr mat-row *matRowDef="let row; columns: subCols"></tr>
          </table>

          <p *ngIf="subStatesOfSelected().length === 0" style="color:#999;font-style:italic;">
            Esta fase no tiene subfases configuradas.
          </p>

          <div style="margin-top:12px;">
            <button mat-stroked-button (click)="addSubState(selected.id)">
              <mat-icon>add</mat-icon> Agregar subfase
            </button>
          </div>
        </div>

        <div *ngIf="!selectedPhase()" style="margin-top:24px;color:#999;font-style:italic;">
          Selecciona una fase arriba (columna "Subfases") para ver/editar sus subfases.
        </div>

        <div class="wiz-step-actions">
          <a mat-button routerLink="/agencies"><mat-icon>arrow_back</mat-icon> Atrás</a>
          <button mat-flat-button color="primary" (click)="next()" [disabled]="!canContinue()">
            Continuar <mat-icon iconPositionEnd>arrow_forward</mat-icon>
          </button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
})
export class ProcessesComponent implements OnInit {
  private readonly state = inject(WizardStateService);
  private readonly router = inject(Router);

  phaseCols = ['order', 'lock', 'name', 'voucher', 'flags', 'select', 'del'];
  subCols   = ['sub_name', 'sub_enabled', 'sub_del'];
  loadingDefaults = signal(false);

  /** ngModel bridge: agrega un boolean transitorio para el checkbox. */
  phases = signal<(ExpedientPhaseRow & { requires_payment_voucher_bool: boolean })[]>(
    this.state.expedientPhases().map((p) => ({
      ...p,
      requires_payment_voucher_bool: !!p.requires_payment_voucher,
    })),
  );
  subStates = signal<(ExpedientSubStateRow & { enabled_bool: boolean })[]>(
    this.state.expedientSubStates().map((s) => ({ ...s, enabled_bool: !!s.enabled })),
  );

  selectedPhaseId = signal<number | null>(null);
  selectedPhase = computed(() => {
    const id = this.selectedPhaseId();
    return id === null ? null : this.phases().find((p) => p.id === id) ?? null;
  });
  subStatesOfSelected = computed(() => {
    const id = this.selectedPhaseId();
    return id === null ? [] : this.subStates().filter((s) => s.id_expedient_state === id);
  });

  canContinue = computed(() => {
    const phases = this.phases();
    if (!phases.length) return false;
    // Al menos una fase navegable activa
    return phases.some((p) => p.is_navigable === 1 && p.enabled === 1);
  });

  ngOnInit() {
    if (!this.phases().length) {
      this.loadDefaults();
    } else if (this.selectedPhaseId() === null) {
      // Auto-seleccionar la primera con uploads (típicamente Liberación o Integración)
      this.autoSelectPhase();
    }
  }

  async loadDefaults() {
    if (!window.wizardApi) return;
    this.loadingDefaults.set(true);
    try {
      const [phasesR, subsR] = await Promise.all([
        window.wizardApi.defaults.load('expedient_state'),
        window.wizardApi.defaults.load('expedient_sub_state'),
      ]);

      if (phasesR.ok && phasesR.rows) {
        const mapped = phasesR.rows.map((row: any) => ({
          id: Number(row.id),
          name: String(row.name),
          display_order: row.display_order === null || row.display_order === undefined
            ? null
            : Number(row.display_order),
          enabled: Number(row.enabled ?? 1),
          requires_payment_voucher: Number(row.requires_payment_voucher ?? 0),
          is_navigable: Number(row.is_navigable ?? 1),
          allows_document_upload: Number(row.allows_document_upload ?? 0),
          is_terminal: Number(row.is_terminal ?? 0),
          is_system: Number(row.is_system ?? 0),
          requires_payment_voucher_bool: Number(row.requires_payment_voucher ?? 0) === 1,
        }));
        this.phases.set(mapped);
      }

      if (subsR.ok && subsR.rows) {
        const mapped = subsR.rows.map((row: any) => ({
          id: Number(row.id),
          id_expedient_state: Number(row.id_expedient_state),
          name: String(row.name),
          enabled: Number(row.enabled ?? 1),
          enabled_bool: Number(row.enabled ?? 1) === 1,
        }));
        this.subStates.set(mapped);
      }

      this.autoSelectPhase();
    } finally {
      this.loadingDefaults.set(false);
    }
  }

  private autoSelectPhase() {
    // Preferir la fase que tenga subfases configuradas (típicamente Liberación)
    const phases = this.phases();
    const subs = this.subStates();
    const withSubs = phases.find((p) => subs.some((s) => s.id_expedient_state === p.id));
    this.selectedPhaseId.set(withSubs?.id ?? phases[0]?.id ?? null);
  }

  // ===== Phases CRUD =====

  addPhase() {
    const nextId = Math.max(0, ...this.phases().map((p) => p.id)) + 1;
    const nextOrder = Math.max(0, ...this.phases().filter((p) => p.display_order !== null).map((p) => p.display_order!)) + 10;
    const flags = deriveFlagsFromName('');
    this.phases.update((arr) => [
      ...arr,
      {
        id: nextId,
        name: '',
        display_order: nextOrder,
        enabled: 1,
        requires_payment_voucher: flags.requires_payment_voucher ?? 0,
        is_navigable: flags.is_navigable ?? 1,
        allows_document_upload: flags.allows_document_upload ?? 0,
        is_terminal: flags.is_terminal ?? 0,
        is_system: 0,
        requires_payment_voucher_bool: false,
      },
    ]);
  }

  removePhase(i: number) {
    const r = this.phases()[i];
    if (r.is_system === 1) return;
    // Borrar también todas las subfases ligadas
    this.subStates.update((arr) => arr.filter((s) => s.id_expedient_state !== r.id));
    this.phases.update((arr) => arr.filter((_, idx) => idx !== i));
    if (this.selectedPhaseId() === r.id) this.selectedPhaseId.set(null);
  }

  movePhase(i: number, dir: number) {
    const arr = [...this.phases()];
    const tgt = i + dir;
    if (tgt < 0 || tgt >= arr.length) return;
    [arr[i], arr[tgt]] = [arr[tgt], arr[i]];
    // Re-asignar display_order solo a las navegables (incrementos de 10)
    let order = 10;
    const reordered = arr.map((r) => {
      if (r.is_navigable === 1 && r.is_terminal === 0) {
        const newR = { ...r, display_order: order };
        order += 10;
        return newR;
      }
      return { ...r, display_order: null };
    });
    this.phases.set(reordered);
  }

  onNameChange(r: ExpedientPhaseRow & { requires_payment_voucher_bool: boolean }) {
    // Re-deriva flags solo si NO es system (system tiene flags fijos)
    if (r.is_system === 1) return;
    const derived = deriveFlagsFromName(r.name);
    this.phases.update((arr) =>
      arr.map((p) =>
        p.id === r.id
          ? {
              ...p,
              is_terminal: derived.is_terminal ?? p.is_terminal,
              is_navigable: derived.is_navigable ?? p.is_navigable,
              allows_document_upload: derived.allows_document_upload ?? p.allows_document_upload,
              requires_payment_voucher: derived.requires_payment_voucher ?? p.requires_payment_voucher,
              requires_payment_voucher_bool: (derived.requires_payment_voucher ?? p.requires_payment_voucher) === 1,
              display_order: derived.is_navigable === 1 ? (p.display_order ?? 100) : null,
            }
          : p,
      ),
    );
  }

  onVoucherChange(r: ExpedientPhaseRow & { requires_payment_voucher_bool: boolean }) {
    this.phases.update((arr) =>
      arr.map((p) =>
        p.id === r.id
          ? { ...p, requires_payment_voucher: r.requires_payment_voucher_bool ? 1 : 0 }
          : p,
      ),
    );
  }

  // ===== SubStates CRUD =====

  addSubState(idPhase: number) {
    const nextId = Math.max(0, ...this.subStates().map((s) => s.id)) + 1;
    this.subStates.update((arr) => [
      ...arr,
      {
        id: nextId,
        id_expedient_state: idPhase,
        name: '',
        enabled: 1,
        enabled_bool: true,
      },
    ]);
  }

  removeSubState(id: number) {
    this.subStates.update((arr) => arr.filter((s) => s.id !== id));
  }

  onSubEnabledChange(r: ExpedientSubStateRow & { enabled_bool: boolean }) {
    this.subStates.update((arr) =>
      arr.map((s) => (s.id === r.id ? { ...s, enabled: r.enabled_bool ? 1 : 0 } : s)),
    );
  }

  // ===== Continue =====

  next() {
    const phases = this.phases().map(({ requires_payment_voucher_bool: _b, ...rest }) => rest);
    const subs = this.subStates().map(({ enabled_bool: _b, ...rest }) => rest);
    this.state.expedientPhases.set(phases);
    this.state.expedientSubStates.set(subs);

    // Mantener compat: db-ipc.ts hoy lee `processes` para client_group_sale_type.
    // Mapeamos las navegables a la shape ProcessRow para no romper provisioning.
    const legacyProcesses = phases
      .filter((p) => p.is_navigable === 1)
      .map((p, i) => ({
        id: p.id,
        name: p.name,
        display_order: i,
        requires_payment_voucher: p.requires_payment_voucher,
        enabled: p.enabled,
      }));
    this.state.processes.set(legacyProcesses);

    this.router.navigate(['/catalogs']);
  }
}
