import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface AdvertenciaLiberadoData {
  cliente?: string;
  ndPedido?: number;
  /** true si aún hay documentos (de liberación) pendientes de validar */
  tieneDocumentosPorValidar?: boolean;
}

@Component({
  selector: 'app-advertencia-liberado-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <div class="icon-wrapper">
          <mat-icon>emoji_events</mat-icon>
        </div>
        <div class="header-text">
          <h2 class="dialog-title">Liberación completada</h2>
          <p class="dialog-subtitle">
            Pedido
            <strong *ngIf="data?.ndPedido">#{{ data.ndPedido }}</strong>
            <span *ngIf="data?.cliente">· {{ data.cliente }}</span>
          </p>
        </div>
      </div>

      <div class="dialog-content">
        <p class="dialog-message">
          Todos los documentos requeridos en la fase de Liberación fueron aprobados exitosamente.
          El expediente pasará al estado <strong>Liberado</strong>.
        </p>

        <div class="info-card">
          <div class="info-icon">
            <mat-icon>task_alt</mat-icon>
          </div>
          <div class="info-text">
            <h3>Avance final</h3>
            <p>
              Al continuar, el pedido se marcará como liberado y estará listo para cierre.
              Asegúrate de que toda la documentación esté correcta antes de confirmar.
            </p>
          </div>
        </div>
      </div>

      <div class="dialog-actions">
        <button mat-stroked-button (click)="cancelar()">
          {{ data.tieneDocumentosPorValidar ? 'Continuar validando documentos' : 'Cancelar' }}
        </button>
        <button mat-stroked-button color="primary" (click)="confirmar()">Finalizar y liberar</button>
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
        background: linear-gradient(135deg, #9333ea, #6d28d9);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        box-shadow: 0 10px 25px -12px rgba(109, 40, 217, 0.7);
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
        color: #1f2937;
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
        background: #f5f3ff;
        border: 1px solid #ddd6fe;
      }

      .info-icon {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        width: 36px;
      }

      .info-icon mat-icon {
        color: #7c3aed;
      }

      .info-text h3 {
        margin: 0 0 4px 0;
        font-size: 15px;
        font-weight: 600;
        color: #5b21b6;
      }

      .info-text p {
        margin: 0;
        font-size: 13px;
        line-height: 1.6;
        color: #4c1d95;
      }

      .dialog-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
      }
    `
  ]
})
export class AdvertenciaLiberadoDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<AdvertenciaLiberadoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AdvertenciaLiberadoData
  ) {}

  confirmar(): void {
    this.dialogRef.close(true);
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}

