import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { WizardStateService } from '../../state/wizard-state.service';

@Component({
  selector: 'wiz-admin-user',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule],
  template: `
    <mat-card class="wiz-card">
      <mat-card-content>
        <h2>Usuario administrador del tenant</h2>
        <p>
          Este es el primer usuario que loguea al portal del tenant para empezar
          a operar. Puede ser el mismo super-admin (si ops NexusQTech administra
          al tenant directamente) o uno propio del tenant.
        </p>

        <mat-checkbox [(ngModel)]="useSameAsSuperAdmin" (change)="onUseSameChange($event.checked)" style="margin-bottom: 12px;">
          Usar mismas credenciales que super-admin
          @if (useSameAsSuperAdmin && state.adminPrefillEmail()) {
            <span style="color:#666; font-size:13px; margin-left:8px;">
              ({{ state.adminPrefillEmail() }})
            </span>
          }
        </mat-checkbox>

        <mat-form-field appearance="outline" style="width: 100%;">
          <mat-label>Nombre</mat-label>
          <input matInput [(ngModel)]="draft.name" placeholder="Administrador" [readonly]="useSameAsSuperAdmin" />
        </mat-form-field>
        <mat-form-field appearance="outline" style="width: 100%;">
          <mat-label>Email</mat-label>
          <input matInput type="email" [(ngModel)]="draft.email" autocomplete="username" [readonly]="useSameAsSuperAdmin" />
        </mat-form-field>
        <mat-form-field appearance="outline" style="width: 100%;">
          <mat-label>Contraseña (mín 8 caracteres)</mat-label>
          <input matInput type="password" [(ngModel)]="draft.password" autocomplete="new-password"
                 [readonly]="useSameAsSuperAdmin" (ngModelChange)="syncConfirmIfLocked()" />
        </mat-form-field>
        @if (!useSameAsSuperAdmin) {
          <mat-form-field appearance="outline" style="width: 100%;">
            <mat-label>Confirmar contraseña</mat-label>
            <input matInput type="password" [(ngModel)]="confirm" />
          </mat-form-field>
          @if (mismatch()) {
            <p style="color: crimson; font-size: 13px;">Las contraseñas no coinciden.</p>
          }
        }

        <div class="wiz-step-actions">
          <a mat-button routerLink="/catalogs"><mat-icon>arrow_back</mat-icon> Atrás</a>
          <button mat-flat-button color="primary" (click)="next()" [disabled]="!canProceed()">
            Continuar <mat-icon iconPositionEnd>arrow_forward</mat-icon>
          </button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
})
export class AdminUserComponent {
  readonly state = inject(WizardStateService);
  private readonly router = inject(Router);
  draft = { ...this.state.adminUserDraft() };
  confirm = this.draft.password;

  /**
   * Default ON when central.env has a super-admin AND the user hasn't
   * already typed a different email. Lets NexusQTech ops "be" the tenant
   * admin in one click for managed deployments.
   */
  useSameAsSuperAdmin = (() => {
    const e = this.state.adminPrefillEmail();
    if (!e) return false;
    if (this.draft.email && this.draft.email !== e) return false;
    return true;
  })();

  constructor() {
    if (this.useSameAsSuperAdmin) this.copyFromSuperAdmin();
  }

  onUseSameChange(checked: boolean): void {
    this.useSameAsSuperAdmin = checked;
    if (checked) this.copyFromSuperAdmin();
  }

  private copyFromSuperAdmin(): void {
    this.draft.email = this.state.adminPrefillEmail();
    this.draft.password = this.state.adminPrefillPassword();
    if (!this.draft.name) this.draft.name = 'Administrador';
    this.confirm = this.draft.password;
  }

  syncConfirmIfLocked(): void {
    if (this.useSameAsSuperAdmin) this.confirm = this.draft.password;
  }

  mismatch(): boolean {
    return !this.useSameAsSuperAdmin && !!this.confirm && this.draft.password !== this.confirm;
  }
  canProceed(): boolean {
    if (!this.draft.email || !this.draft.password || this.draft.password.length < 8) return false;
    // When locked to super-admin creds, no confirm required
    if (this.useSameAsSuperAdmin) return true;
    return this.draft.password === this.confirm;
  }
  next() {
    this.state.adminUserDraft.set({ ...this.draft });
    this.router.navigate(['/branding']);
  }
}
