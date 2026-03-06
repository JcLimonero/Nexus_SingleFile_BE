import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface FaltaParaAvanzarData {
  titulo: string;
  faseActual: string;
  faseSiguiente: string;
  cumplido?: string[];
  falta?: string[];
}

@Component({
  selector: 'app-falta-para-avanzar-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <div class="icon-wrapper">
          <mat-icon>info</mat-icon>
        </div>
        <div class="header-text">
          <h2 class="dialog-title">{{ data.titulo }}</h2>
          <p class="dialog-subtitle">
            Para pasar de {{ data.faseActual }} a {{ data.faseSiguiente }}
          </p>
        </div>
      </div>

      <div class="dialog-content">
        <div *ngIf="data.cumplido && data.cumplido.length > 0" class="section">
          <h3 class="section-title cumplido">
            <mat-icon>check_circle</mat-icon>
            Ya cumplido
          </h3>
          <ul class="item-list">
            <li *ngFor="let item of data.cumplido">{{ item }}</li>
          </ul>
        </div>

        <div *ngIf="data.falta && data.falta.length > 0" class="section">
          <h3 class="section-title falta">
            <mat-icon>pending_actions</mat-icon>
            Falta
          </h3>
          <ul class="item-list falta-list">
            <li *ngFor="let item of data.falta">{{ item }}</li>
          </ul>
        </div>
      </div>

      <div class="dialog-actions">
        <button mat-stroked-button color="primary" (click)="cerrar()">Entendido</button>
      </div>
    </div>
  `,
  styles: [
    `
      .dialog-container {
        width: min(480px, 90vw);
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 24px 28px 20px;
      }

      .dialog-header {
        display: flex;
        align-items: center;
        gap: 14px;
      }

      .icon-wrapper {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        background: linear-gradient(135deg, #3b82f6, #2563eb);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
      }

      .icon-wrapper mat-icon {
        font-size: 26px;
      }

      .header-text {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .dialog-title {
        margin: 0;
        font-size: 18px;
        font-weight: 700;
        color: #0f172a;
      }

      .dialog-subtitle {
        margin: 0;
        font-size: 13px;
        color: #64748b;
      }

      .dialog-content {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .section {
        padding: 12px 14px;
        border-radius: 12px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
      }

      .section-title {
        margin: 0 0 8px 0;
        font-size: 14px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .section-title.cumplido {
        color: #059669;
      }

      .section-title.cumplido mat-icon {
        color: #059669;
      }

      .section-title.falta {
        color: #dc2626;
      }

      .section-title.falta mat-icon {
        color: #dc2626;
      }

      .item-list {
        margin: 0;
        padding-left: 20px;
        font-size: 13px;
        line-height: 1.6;
        color: #334155;
      }

      .item-list.falta-list {
        color: #991b1b;
        font-weight: 500;
      }

      .dialog-actions {
        display: flex;
        justify-content: flex-end;
      }
    `
  ]
})
export class FaltaParaAvanzarDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<FaltaParaAvanzarDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FaltaParaAvanzarData
  ) {}

  cerrar(): void {
    this.dialogRef.close();
  }
}
