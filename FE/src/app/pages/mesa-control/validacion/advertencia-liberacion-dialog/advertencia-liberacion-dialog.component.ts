import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface AdvertenciaLiberacionData {
  cliente?: string;
  ndPedido?: number;
}

@Component({
  selector: 'app-advertencia-liberacion-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <div class="icon-wrapper">
          <mat-icon>workspace_premium</mat-icon>
        </div>
        <div class="header-text">
          <h2 class="dialog-title">Liquidación completada</h2>
          <p class="dialog-subtitle">
            Pedido
            <strong *ngIf="data?.ndPedido">#{{ data.ndPedido }}</strong>
            <span *ngIf="data?.cliente">· {{ data.cliente }}</span>
          </p>
        </div>
      </div>

      <div class="dialog-content">
        <p class="dialog-message">
          Todos los documentos requeridos en la fase de Liquidación fueron aprobados satisfactoriamente.
          El expediente está listo para avanzar a la fase de Liberación.
        </p>

        <div class="info-card">
          <div class="info-icon">
            <mat-icon>rocket_launch</mat-icon>
          </div>
          <div class="info-text">
            <h3>Avance automático a Liberación</h3>
            <p>
              Al cerrar este mensaje el pedido cambiará automáticamente a la etapa de Liberación.
              Verifica que toda la información esté correcta antes de continuar.
            </p>
          </div>
        </div>

        <div class="warning-banner">
          <mat-icon>warning_amber</mat-icon>
          <span>Este cambio no puede revertirse desde esta pantalla.</span>
        </div>
      </div>

      <div class="dialog-actions">
        <button mat-button (click)="cancelar()">Cancelar</button>
        <button mat-stroked-button color="primary" (click)="confirmar()">Continuar a Liberación</button>
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
        background: linear-gradient(135deg, #10b981, #14b8a6);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        box-shadow: 0 10px 25px -12px rgba(20, 184, 166, 0.7);
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
        color: #0f172a;
      }

      .dialog-subtitle {
        margin: 0;
        font-size: 14px;
        color: #64748b;
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
        background: #f0fdf4;
        border: 1px solid #bbf7d0;
      }

      .info-icon {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        width: 36px;
      }

      .info-icon mat-icon {
        color: #0f766e;
      }

      .info-text h3 {
        margin: 0 0 4px 0;
        font-size: 15px;
        font-weight: 600;
        color: #0f766e;
      }

      .info-text p {
        margin: 0;
        font-size: 13px;
        line-height: 1.6;
        color: #115e59;
      }

      .warning-banner {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 16px;
        border-radius: 12px;
        background: rgba(251, 191, 36, 0.12);
        color: #92400e;
        font-size: 13px;
        font-weight: 600;
        border: 1px solid rgba(251, 191, 36, 0.3);
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
export class AdvertenciaLiberacionDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<AdvertenciaLiberacionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AdvertenciaLiberacionData
  ) {}

  cancelar(): void {
    this.dialogRef.close(false);
  }

  confirmar(): void {
    this.dialogRef.close(true);
  }
}

