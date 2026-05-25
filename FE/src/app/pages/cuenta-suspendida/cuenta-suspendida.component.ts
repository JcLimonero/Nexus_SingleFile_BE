import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-cuenta-suspendida',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px;">
      <mat-card style="max-width: 520px; padding: 40px; text-align: center;">
        <mat-card-content>
          <mat-icon style="font-size: 72px; height: 72px; width: 72px; color: #c62828;">block</mat-icon>
          <h1 style="margin-top: 16px;">Cuenta suspendida</h1>
          <p style="font-size: 15px; line-height: 1.6; color: #555;">
            El acceso a esta instalación de NexFile está suspendido por falta de pago.
            Tu información está intacta y se restaurará en cuanto se regularice la cuenta.
          </p>
          <p style="margin-top: 24px;">
            Para reactivar, contacta:
          </p>
          <p style="font-weight: 500;">
            <a href="mailto:soporte@nexusqtech.com">soporte&#64;nexusqtech.com</a>
          </p>
          <button mat-stroked-button (click)="retry()" style="margin-top: 24px;">
            <mat-icon>refresh</mat-icon> Reintentar
          </button>
        </mat-card-content>
      </mat-card>
    </div>
  `,
})
export class CuentaSuspendidaComponent {
  retry() {
    window.location.href = '/';
  }
}
