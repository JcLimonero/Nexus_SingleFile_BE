import { Component, OnInit, inject, signal } from '@angular/core';
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
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { TenantSessionService } from '../../../../state/tenant-session.service';
import type { TenantUserRow } from '../../../../types/wizard-api';

@Component({
  selector: 'wiz-tenant-edit-users',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatButtonModule, MatIconModule, MatTableModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatSlideToggleModule,
    MatProgressSpinnerModule, MatSnackBarModule, MatDialogModule,
  ],
  template: `
    <div style="padding: 16px 0;">
      <div style="display:flex; gap:12px; align-items:flex-end; margin-bottom:12px; flex-wrap: wrap;">
        <mat-form-field appearance="outline" style="min-width: 220px;">
          <mat-label>Email</mat-label>
          <input matInput [(ngModel)]="draft.email" />
        </mat-form-field>
        <mat-form-field appearance="outline" style="min-width: 220px;">
          <mat-label>Nombre</mat-label>
          <input matInput [(ngModel)]="draft.name" />
        </mat-form-field>
        <mat-form-field appearance="outline" style="min-width: 180px;">
          <mat-label>Username</mat-label>
          <input matInput [(ngModel)]="draft.username" />
        </mat-form-field>
        <mat-form-field appearance="outline" style="min-width: 160px;">
          <mat-label>Rol</mat-label>
          <mat-select [(ngModel)]="draft.id_user_role">
            @for (r of roles(); track r.id) {
              <mat-option [value]="r.id">{{ r.name }} (#{{ r.id }})</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <button mat-flat-button color="primary" (click)="addNew()" [disabled]="!canAdd() || saving()">
          <mat-icon>add</mat-icon> Agregar
        </button>
      </div>
      <p style="font-size:12px; opacity:0.6; margin: 0 0 12px;">
        Nota: usuarios nuevos quedan sin contraseña — usa "Reset password" después para asignarles una.
      </p>

      @if (loading()) {
        <mat-spinner [diameter]="24"></mat-spinner>
      } @else if (rows().length === 0) {
        <p style="opacity:0.6;">Sin usuarios.</p>
      } @else {
        <table mat-table [dataSource]="rows()" class="mat-elevation-z1" style="width:100%;">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef>ID</th>
            <td mat-cell *matCellDef="let r">{{ r.id }}</td>
          </ng-container>
          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>Email</th>
            <td mat-cell *matCellDef="let r" style="font-size: 12px;">{{ r.email }}</td>
          </ng-container>
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Nombre</th>
            <td mat-cell *matCellDef="let r">{{ r.name }}</td>
          </ng-container>
          <ng-container matColumnDef="role">
            <th mat-header-cell *matHeaderCellDef>Rol</th>
            <td mat-cell *matCellDef="let r" style="font-size: 12px;">{{ r.role_name }} <span style="opacity:0.5;">(#{{ r.id_user_role }})</span></td>
          </ng-container>
          <ng-container matColumnDef="last">
            <th mat-header-cell *matHeaderCellDef>Último login</th>
            <td mat-cell *matCellDef="let r" style="font-size: 12px;">{{ r.last_login_at | date:'short' }}</td>
          </ng-container>
          <ng-container matColumnDef="enabled">
            <th mat-header-cell *matHeaderCellDef>Activo</th>
            <td mat-cell *matCellDef="let r">
              <mat-slide-toggle [checked]="r.enabled === 1" (change)="toggle(r, $event.checked)" [disabled]="saving()"></mat-slide-toggle>
            </td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let r">
              <button mat-icon-button matTooltip="Reset password" (click)="resetPw(r)" [disabled]="saving()">
                <mat-icon>password</mat-icon>
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
export class TenantEditUsersComponent implements OnInit {
  readonly session = inject(TenantSessionService);
  private readonly snack = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  cols = ['id', 'email', 'name', 'role', 'last', 'enabled', 'actions'];
  rows = signal<TenantUserRow[]>([]);
  roles = signal<Array<{ id: number; name: string }>>([]);
  loading = signal(false);
  saving = signal(false);

  draft = { email: '', name: '', username: '', id_user_role: 7 as number };

  async ngOnInit() {
    await Promise.all([this.refresh(), this.loadRoles()]);
  }

  canAdd() { return this.draft.email.trim() && this.draft.name.trim() && this.draft.id_user_role > 0; }

  async loadRoles() {
    const cfg = this.session.tenantDbCfg();
    if (!cfg) return;
    const r = await window.wizardApi.tenant.listUserRoles(cfg);
    if (r.ok && r.data) this.roles.set(r.data);
  }

  async refresh() {
    const cfg = this.session.tenantDbCfg();
    if (!cfg) return;
    this.loading.set(true);
    const r = await window.wizardApi.tenant.listUsers(cfg);
    this.loading.set(false);
    if (r.ok && r.data) this.rows.set(r.data);
    else this.snack.open(r.message ?? 'Error', 'cerrar', { duration: 3000 });
  }

  async addNew() {
    const cfg = this.session.tenantDbCfg();
    if (!cfg || !this.canAdd()) return;
    this.saving.set(true);
    const r = await window.wizardApi.tenant.saveUser(cfg, {
      email: this.draft.email.trim(),
      name: this.draft.name.trim(),
      username: this.draft.username.trim() || null,
      id_user_role: this.draft.id_user_role,
    }, this.session.actorUserId());
    this.saving.set(false);
    if (r.ok) {
      this.draft = { email: '', name: '', username: '', id_user_role: 7 };
      await this.refresh();
      this.snack.open('Usuario agregado — recuerda asignarle password', 'cerrar', { duration: 4000 });
    } else {
      this.snack.open(r.message ?? 'Error', 'cerrar', { duration: 3000 });
    }
  }

  async toggle(r: TenantUserRow, enabled: boolean) {
    const cfg = this.session.tenantDbCfg();
    if (!cfg) return;
    this.saving.set(true);
    const res = await window.wizardApi.tenant.toggleUserEnabled(cfg, r.id, enabled ? 1 : 0, this.session.actorUserId());
    this.saving.set(false);
    if (res.ok) await this.refresh();
    else this.snack.open(res.message ?? 'Error', 'cerrar', { duration: 3000 });
  }

  async resetPw(r: TenantUserRow) {
    const ref = this.dialog.open(ResetPasswordDialog, { data: { email: r.email } });
    const newPw = await firstValueFrom(ref.afterClosed());
    if (!newPw) return;
    const cfg = this.session.tenantDbCfg();
    if (!cfg) return;
    this.saving.set(true);
    const res = await window.wizardApi.tenant.resetUserPassword(cfg, r.id, newPw, this.session.actorUserId());
    this.saving.set(false);
    if (res.ok) this.snack.open(`Password de ${r.email} actualizado`, 'cerrar', { duration: 3000 });
    else this.snack.open(res.message ?? 'Error', 'cerrar', { duration: 3000 });
  }
}

// Diálogo simple para capturar nuevo password.
@Component({
  selector: 'wiz-reset-pw-dialog',
  standalone: true,
  imports: [FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, CommonModule],
  template: `
    <h3 mat-dialog-title>Reset password</h3>
    <mat-dialog-content>
      <p>Usuario: <code>{{ data.email }}</code></p>
      <mat-form-field appearance="outline" style="width: 320px;">
        <mat-label>Nueva contraseña (mín. 8)</mat-label>
        <input matInput type="password" [(ngModel)]="newPw" />
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="ref.close()">Cancelar</button>
      <button mat-flat-button color="primary" (click)="confirm()" [disabled]="newPw.length < 8">
        Guardar
      </button>
    </mat-dialog-actions>
  `,
})
export class ResetPasswordDialog {
  readonly ref = inject<MatDialogRef<ResetPasswordDialog, string>>(MatDialogRef);
  readonly data = inject<{ email: string }>(MAT_DIALOG_DATA);
  newPw = '';
  confirm() { this.ref.close(this.newPw); }
}
