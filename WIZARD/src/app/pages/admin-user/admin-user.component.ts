import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { WizardStateService } from '../../state/wizard-state.service';

@Component({
  selector: 'wiz-admin-user',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <mat-card class="wiz-card">
      <mat-card-content>
        <h2>Usuario administrador del tenant</h2>
        <p>
          Este NO es un super-admin (ese ya lo usaste en el paso 2). Es el primer
          usuario que loguea al portal del tenant para empezar a operar.
        </p>
        <mat-form-field appearance="outline" style="width: 100%;">
          <mat-label>Nombre</mat-label>
          <input matInput [(ngModel)]="draft.name" placeholder="Administrador" />
        </mat-form-field>
        <mat-form-field appearance="outline" style="width: 100%;">
          <mat-label>Email</mat-label>
          <input matInput type="email" [(ngModel)]="draft.email" autocomplete="username" />
        </mat-form-field>
        <mat-form-field appearance="outline" style="width: 100%;">
          <mat-label>Contraseña (mín 8 caracteres)</mat-label>
          <input matInput type="password" [(ngModel)]="draft.password" autocomplete="new-password" />
        </mat-form-field>
        <mat-form-field appearance="outline" style="width: 100%;">
          <mat-label>Confirmar contraseña</mat-label>
          <input matInput type="password" [(ngModel)]="confirm" />
        </mat-form-field>
        @if (mismatch()) {
          <p style="color: crimson; font-size: 13px;">Las contraseñas no coinciden.</p>
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
  private readonly state = inject(WizardStateService);
  private readonly router = inject(Router);
  draft = { ...this.state.adminUserDraft() };
  confirm = this.draft.password;

  mismatch(): boolean {
    return !!this.confirm && this.draft.password !== this.confirm;
  }
  canProceed(): boolean {
    return !!(this.draft.email && this.draft.password && this.draft.password.length >= 8 && this.draft.password === this.confirm);
  }
  next() {
    this.state.adminUserDraft.set({ ...this.draft });
    this.router.navigate(['/branding']);
  }
}
