import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'adm-login',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule,
  ],
  template: `
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center;">
      <mat-card style="width: 420px; padding: 32px;">
        <mat-card-content>
          <div style="text-align: center; margin-bottom: 24px;">
            <mat-icon style="font-size: 48px; height: 48px; width: 48px; color: #673ab7;">verified_user</mat-icon>
            <h1 style="margin: 12px 0 4px;">NexFile Admin</h1>
            <p style="margin: 0; color: #666; font-size: 14px;">Acceso super-admin</p>
          </div>

          <mat-form-field appearance="outline" style="width: 100%;">
            <mat-label>Email</mat-label>
            <input matInput type="email" [(ngModel)]="email" autocomplete="username" />
          </mat-form-field>

          <mat-form-field appearance="outline" style="width: 100%;">
            <mat-label>Contraseña</mat-label>
            <input matInput type="password" [(ngModel)]="password" autocomplete="current-password"
                   (keydown.enter)="submit()" />
          </mat-form-field>

          @if (error()) {
            <div style="color: #c62828; font-size: 14px; margin-bottom: 12px;">{{ error() }}</div>
          }

          <button mat-flat-button color="primary" style="width: 100%;"
                  (click)="submit()" [disabled]="loading() || !email || !password">
            @if (loading()) {
              <mat-spinner diameter="20" style="display: inline-block; margin-right: 8px;"></mat-spinner>
            }
            Entrar
          </button>
        </mat-card-content>
      </mat-card>
    </div>
  `,
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  loading = signal(false);
  error = signal<string | null>(null);

  submit(): void {
    if (!this.email || !this.password) return;
    this.loading.set(true);
    this.error.set(null);
    this.auth.login(this.email, this.password).subscribe({
      next: (r) => {
        this.loading.set(false);
        if (r.success) this.router.navigate(['/tenants']);
        else this.error.set(r.message ?? 'Credenciales inválidas');
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message ?? 'No se pudo conectar al servidor');
      },
    });
  }
}
