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
import { MatSnackBar } from '@angular/material/snack-bar';
import { WizardStateService } from '../../state/wizard-state.service';

@Component({
  selector: 'wiz-db-connection',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule
  ],
  template: `
    <mat-card class="wiz-card">
      <mat-card-content>
        <h2>Conexión a MySQL</h2>
        <p>Captura los datos del servidor donde se creará la base de datos.</p>

        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 16px; margin-top: 16px;">
          <mat-form-field appearance="outline">
            <mat-label>Host</mat-label>
            <input matInput [(ngModel)]="cfg.host" placeholder="127.0.0.1 o domain.com" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Puerto</mat-label>
            <input matInput type="number" [(ngModel)]="cfg.port" />
          </mat-form-field>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <mat-form-field appearance="outline">
            <mat-label>Usuario</mat-label>
            <input matInput [(ngModel)]="cfg.user" autocomplete="username" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Contraseña</mat-label>
            <input matInput type="password" [(ngModel)]="cfg.password" autocomplete="current-password" />
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" style="width: 100%;">
          <mat-label>Nombre de la base de datos (la crearemos si no existe)</mat-label>
          <input matInput [(ngModel)]="cfg.database" />
          <mat-hint>Solo letras, números y guiones bajos.</mat-hint>
        </mat-form-field>

        <div style="display: flex; gap: 12px; align-items: center; margin-top: 16px;">
          <button mat-stroked-button (click)="test()" [disabled]="loading()">
            <mat-icon>cable</mat-icon>
            Probar conexión
          </button>
          @if (loading()) {
            <mat-spinner [diameter]="24"></mat-spinner>
          }
          @if (lastResult()) {
            <span [style.color]="lastResult()!.ok ? 'green' : 'crimson'">
              {{ lastResult()!.message }}
            </span>
          }
        </div>

        <div class="wiz-step-actions">
          <a mat-button routerLink="/welcome">
            <mat-icon>arrow_back</mat-icon>
            Atrás
          </a>
          <button mat-flat-button color="primary"
                  (click)="next()" [disabled]="!canProceed() || loading()">
            Continuar
            <mat-icon iconPositionEnd>arrow_forward</mat-icon>
          </button>
        </div>
      </mat-card-content>
    </mat-card>
  `
})
export class DbConnectionComponent {
  private readonly state = inject(WizardStateService);
  private readonly router = inject(Router);
  private readonly snackbar = inject(MatSnackBar);

  cfg = { ...this.state.dbConfig() };
  loading = signal(false);
  lastResult = signal<{ ok: boolean; message?: string } | null>(null);

  canProceed(): boolean {
    return !!this.lastResult()?.ok;
  }

  async test() {
    if (!window.wizardApi) {
      this.snackbar.open('wizardApi no está disponible (¿modo no-Electron?)', 'OK', { duration: 3000 });
      return;
    }
    this.loading.set(true);
    this.lastResult.set(null);
    const r = await window.wizardApi.db.testConnection({ ...this.cfg });
    this.loading.set(false);
    this.lastResult.set(r);
  }

  next() {
    this.state.dbConfig.set({ ...this.cfg });
    this.router.navigate(['/schema']);
  }
}
