import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { WizardStateService } from '../../state/wizard-state.service';

@Component({
  selector: 'wiz-admin-login',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule,
  ],
  template: `
    <mat-card class="wiz-card">
      <mat-card-content>
        <h2>Login super-admin</h2>
        <p>
          El tenant nuevo queda auditado con tu identidad de super-admin.
          Si aún no existe, créalo en el server con
          <code>php spark super-admin:seed --email=… --password=…</code>.
        </p>
        <mat-form-field appearance="outline" style="width: 100%;">
          <mat-label>Email</mat-label>
          <input matInput type="email" [(ngModel)]="email" autocomplete="username" />
        </mat-form-field>
        <mat-form-field appearance="outline" style="width: 100%;">
          <mat-label>Contraseña</mat-label>
          <input matInput type="password" [(ngModel)]="password" autocomplete="current-password" />
        </mat-form-field>

        <div style="display: flex; gap: 12px; align-items: center;">
          <button mat-stroked-button (click)="login()" [disabled]="loading() || !email || !password">
            <mat-icon>login</mat-icon> Entrar
          </button>
          @if (loading()) { <mat-spinner [diameter]="20"></mat-spinner> }
          @if (error()) { <span style="color: crimson;">{{ error() }}</span> }
          @if (state.adminUser()) {
            <span style="color: green;">✓ {{ state.adminUser()?.email }}</span>
          }
        </div>

        <div class="wiz-step-actions">
          <a mat-button routerLink="/central-db"><mat-icon>arrow_back</mat-icon> Atrás</a>
          <button mat-flat-button color="primary" (click)="next()" [disabled]="!state.adminToken()">
            Continuar <mat-icon iconPositionEnd>arrow_forward</mat-icon>
          </button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
})
export class AdminLoginComponent {
  readonly state = inject(WizardStateService);
  private readonly router = inject(Router);
  // Pre-fill from config/central.env (populated by the CentralDb step).
  // Falls back to empty so manual entry still works for ad-hoc super-admins.
  email = this.state.adminPrefillEmail();
  password = this.state.adminPrefillPassword();
  loading = signal(false);
  error = signal<string | null>(null);

  async login() {
    if (!window.wizardApi) {
      this.error.set('wizardApi no disponible');
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    const r = await window.wizardApi.admin.login(this.state.adminApiBase(), this.email, this.password);
    this.loading.set(false);
    if (!r.ok) {
      this.error.set(r.message ?? 'Login fallido');
      return;
    }
    this.state.adminToken.set(r.token ?? null);
    this.state.adminUser.set(r.user ?? null);
  }

  next() {
    this.router.navigate(['/tenant-info']);
  }
}
