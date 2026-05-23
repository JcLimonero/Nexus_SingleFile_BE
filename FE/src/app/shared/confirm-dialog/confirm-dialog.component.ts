import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';

export type ConfirmVariant = 'danger' | 'warning' | 'info';

export interface ConfirmDialogData {
  title: string;
  message: string;
  details?: string;
  variant?: ConfirmVariant;
  confirmText?: string;
  cancelText?: string;
}

const VARIANT_STYLES: Record<ConfirmVariant, { icon: string; iconClass: string; buttonColor: 'primary' | 'warn' | 'accent' }> = {
  danger:  { icon: 'mat:warning',       iconClass: 'text-red-600',    buttonColor: 'warn' },
  warning: { icon: 'mat:report_problem', iconClass: 'text-amber-600',  buttonColor: 'accent' },
  info:    { icon: 'mat:info',          iconClass: 'text-blue-600',   buttonColor: 'primary' }
};

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [NgIf, MatDialogModule, MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="confirm-dialog" role="alertdialog" aria-modal="true">
      <div class="confirm-dialog__header">
        <mat-icon
          [svgIcon]="style.icon"
          class="confirm-dialog__icon"
          [class]="style.iconClass"
          aria-hidden="true"
        ></mat-icon>
        <h2 mat-dialog-title class="confirm-dialog__title">{{ data.title }}</h2>
      </div>

      <mat-dialog-content class="confirm-dialog__body">
        <p class="confirm-dialog__message">{{ data.message }}</p>
        <pre *ngIf="data.details" class="confirm-dialog__details">{{ data.details }}</pre>
      </mat-dialog-content>

      <mat-dialog-actions align="end" class="confirm-dialog__actions">
        <button mat-button (click)="onCancel()" cdkFocusInitial>
          {{ data.cancelText || 'Cancelar' }}
        </button>
        <button
          mat-flat-button
          [color]="style.buttonColor"
          (click)="onConfirm()"
        >
          {{ data.confirmText || 'Confirmar' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .confirm-dialog {
      min-width: 360px;
      max-width: 540px;
    }
    .confirm-dialog__header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px 24px 4px;
    }
    .confirm-dialog__icon {
      flex: none;
      width: 32px;
      height: 32px;
      font-size: 32px;
    }
    .confirm-dialog__title {
      margin: 0 !important;
      font-size: 1.125rem;
      font-weight: 600;
    }
    .confirm-dialog__body {
      padding-top: 8px !important;
    }
    .confirm-dialog__message {
      margin: 0 0 8px;
      font-size: 0.9375rem;
      line-height: 1.5;
      color: rgb(55 65 81);
      white-space: pre-line;
    }
    .confirm-dialog__details {
      background: rgb(243 244 246);
      border-radius: 6px;
      padding: 10px 12px;
      margin: 8px 0 0;
      font-size: 0.8125rem;
      color: rgb(75 85 99);
      white-space: pre-wrap;
      font-family: inherit;
      max-height: 200px;
      overflow: auto;
    }
    .confirm-dialog__actions {
      padding: 12px 16px 16px !important;
      gap: 8px;
    }
  `]
})
export class ConfirmDialogComponent {
  style: { icon: string; iconClass: string; buttonColor: 'primary' | 'warn' | 'accent' };

  constructor(
    private readonly dialogRef: MatDialogRef<ConfirmDialogComponent, boolean>,
    @Inject(MAT_DIALOG_DATA) public readonly data: ConfirmDialogData
  ) {
    this.style = VARIANT_STYLES[data.variant || 'danger'];
  }

  onCancel(): void { this.dialogRef.close(false); }
  onConfirm(): void { this.dialogRef.close(true); }
}
