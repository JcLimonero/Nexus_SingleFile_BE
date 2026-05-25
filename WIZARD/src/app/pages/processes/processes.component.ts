import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { WizardStateService, ProcessRow } from '../../state/wizard-state.service';

@Component({
  selector: 'wiz-processes',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatTableModule,
  ],
  template: `
    <mat-card class="wiz-card">
      <mat-card-content>
        <h2>Procesos (fases del flujo)</h2>
        <p>
          Carga los procesos desde defaults (Integración / Liquidación / Liberación / …) y
          marca cuál de ellos lleva comprobantes de pago. Reordena con las flechas.
        </p>

        <table mat-table [dataSource]="items()" style="width:100%;">
          <ng-container matColumnDef="order">
            <th mat-header-cell *matHeaderCellDef>Orden</th>
            <td mat-cell *matCellDef="let r; let i = index">
              <button mat-icon-button (click)="move(i, -1)" [disabled]="i === 0"><mat-icon>arrow_upward</mat-icon></button>
              <button mat-icon-button (click)="move(i, 1)" [disabled]="i === items().length - 1"><mat-icon>arrow_downward</mat-icon></button>
              <span style="margin-left: 4px; color:#666;">{{ i + 1 }}</span>
            </td>
          </ng-container>
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Nombre</th>
            <td mat-cell *matCellDef="let r">
              <mat-form-field appearance="outline" style="width: 100%;">
                <input matInput [(ngModel)]="r.name" />
              </mat-form-field>
            </td>
          </ng-container>
          <ng-container matColumnDef="voucher">
            <th mat-header-cell *matHeaderCellDef>Lleva comprobante</th>
            <td mat-cell *matCellDef="let r">
              <mat-checkbox [(ngModel)]="r.requires_payment_voucher_bool" (change)="onVoucherChange(r)"></mat-checkbox>
            </td>
          </ng-container>
          <ng-container matColumnDef="del">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let r; let i = index">
              <button mat-icon-button (click)="remove(i)"><mat-icon>delete</mat-icon></button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="cols"></tr>
          <tr mat-row *matRowDef="let row; columns: cols"></tr>
        </table>

        <div style="margin-top: 16px; display: flex; gap: 12px;">
          <button mat-stroked-button (click)="loadDefaults()" [disabled]="loadingDefaults()">
            <mat-icon>cloud_download</mat-icon> Cargar defaults
          </button>
          <button mat-stroked-button (click)="addBlank()">
            <mat-icon>add</mat-icon> Agregar proceso
          </button>
        </div>

        <div class="wiz-step-actions">
          <a mat-button routerLink="/agencies"><mat-icon>arrow_back</mat-icon> Atrás</a>
          <button mat-flat-button color="primary" (click)="next()" [disabled]="!items().length">
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
  cols = ['order', 'name', 'voucher', 'del'];
  loadingDefaults = signal(false);
  // Items are stored with a transient boolean field for ngModel binding to mat-checkbox
  items = signal<(ProcessRow & { requires_payment_voucher_bool: boolean })[]>(
    this.state.processes().map((p) => ({ ...p, requires_payment_voucher_bool: !!p.requires_payment_voucher })),
  );

  ngOnInit() {
    if (!this.items().length) {
      // Auto-load defaults on first visit
      this.loadDefaults();
    }
  }

  async loadDefaults() {
    if (!window.wizardApi) return;
    this.loadingDefaults.set(true);
    // expedient_state contains the actual workflow phases (Integración/Liquidación/etc.)
    const r = await window.wizardApi.defaults.load('expedient_state');
    this.loadingDefaults.set(false);
    if (!r.ok || !r.rows) return;
    const mapped = r.rows.map((row: any, i: number) => ({
      id: Number(row.id),
      name: row.name,
      display_order: i,
      requires_payment_voucher: Number(row.requires_payment_voucher ?? (Number(row.id) === 2 ? 1 : 0)),
      enabled: Number(row.enabled ?? 1),
      requires_payment_voucher_bool: Number(row.requires_payment_voucher ?? (Number(row.id) === 2 ? 1 : 0)) === 1,
    }));
    this.items.set(mapped);
  }

  addBlank() {
    this.items.update((it) => [...it, { name: '', display_order: it.length, requires_payment_voucher: 0, enabled: 1, requires_payment_voucher_bool: false }]);
  }
  remove(i: number) { this.items.update((it) => it.filter((_, idx) => idx !== i).map((r, idx) => ({ ...r, display_order: idx }))); }
  move(i: number, dir: number) {
    const arr = [...this.items()];
    const tgt = i + dir;
    if (tgt < 0 || tgt >= arr.length) return;
    [arr[i], arr[tgt]] = [arr[tgt], arr[i]];
    this.items.set(arr.map((r, idx) => ({ ...r, display_order: idx })));
  }
  onVoucherChange(_r: ProcessRow & { requires_payment_voucher_bool: boolean }) {
    // ngModel mutates the bool field; sync into the numeric one
    this.items.update((it) => it.map((r) => ({ ...r, requires_payment_voucher: r.requires_payment_voucher_bool ? 1 : 0 })));
  }
  next() {
    const cleaned = this.items().map(({ requires_payment_voucher_bool: _b, ...rest }) => rest);
    this.state.processes.set(cleaned);
    this.router.navigate(['/catalogs']);
  }
}
