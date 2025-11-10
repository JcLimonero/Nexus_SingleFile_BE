import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface AdvertenciaLiquidacionData {
  cliente?: string;
  ndPedido?: number;
}

@Component({
  selector: 'app-advertencia-liquidacion-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <div class="icon-wrapper">
          <mat-icon>fact_check</mat-icon>
        </div>
        <div class="header-text">
          <h2 class="dialog-title">Documentación completa</h2>
          <p class="dialog-subtitle">
            Pedido
            <strong *ngIf="data?.ndPedido">#{{ data.ndPedido }}</strong>
            <span *ngIf="data?.cliente">· {{ data.cliente }}</span>
          </p>
        </div>
      </div>

      <div class="dialog-content">
        <p class="dialog-message">
          Todos los documentos requeridos en la fase de Integración fueron validados correctamente. El expediente está listo para continuar con el proceso.
        </p>

        <div class="info-card">
          <div class="info-icon">
            <mat-icon>timeline</mat-icon>
          </div>
          <div class="info-text">
            <h3>Avance automático a Liquidación</h3>
            <p>
              Al cerrar este mensaje el pedido avanzará a la etapa de Liquidación sin necesidad de confirmación adicional.
              Asegúrate de haber revisado toda la documentación antes de continuar.
            </p>
          </div>
        </div>

        <div class="warning-banner">
          <mat-icon>warning_amber</mat-icon>
          <span>Este paso no cuenta con opción de reversa desde esta pantalla.</span>
        </div>
      </div>

      <div class="dialog-actions">
        <button mat-stroked-button color="primary" (click)="cerrar()">Continuar a Liquidación</button>
      </div>
    </div>
  `,
  styles: [
    `
      .dialog-container {
        width: min(520px, 90vw);
        display: flex;
        flex-direction: column;
        gap: 24px;
        padding: 28px 32px 24px;
      }

      .dialog-header {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .icon-wrapper {
        width: 56px;
        height: 56px;
        border-radius: 16px;
        background: linear-gradient(135deg, #2563eb, #3b82f6);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        box-shadow: 0 10px 25px -12px rgba(37, 99, 235, 0.7);
      }

      .icon-wrapper mat-icon {
        font-size: 28px;
      }

      .header-text {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .dialog-title {
        margin: 0;
        font-size: 21px;
        font-weight: 700;
        color: #111827;
      }

      .dialog-subtitle {
        margin: 0;
        font-size: 14px;
        color: #6b7280;
      }

      .dialog-content {
        display: flex;
        flex-direction: column;
        gap: 18px;
      }

      .dialog-message {
        margin: 0;
        font-size: 14px;
        line-height: 1.6;
        color: #1f2937;
      }

      .info-card {
        display: flex;
        gap: 16px;
        padding: 16px;
        border-radius: 16px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
      }

      .info-icon {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        width: 36px;
      }

      .info-icon mat-icon {
        color: #2563eb;
      }

      .info-text h3 {
        margin: 0 0 4px 0;
        font-size: 15px;
        font-weight: 600;
        color: #1e3a8a;
      }

      .info-text p {
        margin: 0;
        font-size: 13px;
        line-height: 1.6;
        color: #374151;
      }

      .warning-banner {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 16px;
        border-radius: 12px;
        background: rgba(250, 204, 21, 0.12);
        color: #92400e;
        font-size: 13px;
        font-weight: 600;
        border: 1px solid rgba(250, 204, 21, 0.3);
      }

      .warning-banner mat-icon {
        color: #f59e0b;
      }

      .dialog-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
      }
    `
  ]
})
export class AdvertenciaLiquidacionDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<AdvertenciaLiquidacionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AdvertenciaLiquidacionData
  ) {}

  cerrar(): void {
    this.dialogRef.close();
  }
}

