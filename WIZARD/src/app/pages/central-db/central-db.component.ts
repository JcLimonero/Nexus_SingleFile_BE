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
  selector: 'wiz-central-db',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule,
  ],
  template: `
    <mat-card class="wiz-card">
      <mat-card-content>
        <h2>Conexión a la base central</h2>
        <p>
          La central DB (<code>nexfile_central</code>) lleva el registro de tenants,
          sus suscripciones y configuración. Necesitas credenciales con permiso para
          INSERT en sus tablas.
        </p>
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 16px; margin-top: 16px;">
          <mat-form-field appearance="outline">
            <mat-label>Host</mat-label>
            <input matInput [(ngModel)]="cfg.host" />
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
          <mat-label>Nombre de la base central</mat-label>
          <input matInput [(ngModel)]="cfg.database" />
        </mat-form-field>
        <mat-form-field appearance="outline" style="width: 100%;">
          <mat-label>URL del ADMIN_BE (para login super-admin)</mat-label>
          <input matInput [(ngModel)]="adminApi" placeholder="http://localhost:8087" />
        </mat-form-field>

        <div style="display: flex; gap: 12px; align-items: center; margin-top: 8px;">
          <button mat-stroked-button (click)="test()" [disabled]="loading()">
            <mat-icon>cable</mat-icon> Probar
          </button>
          @if (loading()) { <mat-spinner [diameter]="20"></mat-spinner> }
          @if (result()) {
            <span [style.color]="result()!.ok ? 'green' : 'crimson'">{{ result()!.message }}</span>
          }
        </div>

        <div class="wiz-step-actions">
          <a mat-button routerLink="/welcome"><mat-icon>arrow_back</mat-icon> Atrás</a>
          <button mat-flat-button color="primary" (click)="next()" [disabled]="!result()?.ok">
            Continuar <mat-icon iconPositionEnd>arrow_forward</mat-icon>
          </button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
})
export class CentralDbComponent {
  private readonly state = inject(WizardStateService);
  private readonly router = inject(Router);
  cfg = { ...this.state.central() };
  adminApi = this.state.adminApiBase();
  loading = signal(false);
  result = signal<{ ok: boolean; message?: string } | null>(null);

  async test() {
    if (!window.wizardApi) {
      this.result.set({ ok: false, message: 'wizardApi no disponible (modo no-Electron)' });
      return;
    }
    this.loading.set(true);
    this.result.set(null);
    const r = await window.wizardApi.db.testConnection({ ...this.cfg });
    this.loading.set(false);
    this.result.set(r);
  }

  next() {
    this.state.central.set({ ...this.cfg });
    this.state.adminApiBase.set(this.adminApi);
    this.state.centralOk.set(true);
    this.router.navigate(['/admin-login']);
  }
}
