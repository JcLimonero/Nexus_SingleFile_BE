import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/**
 * Banner de error inline persistente con acción de "Reintentar".
 *
 * Pensado para reemplazar `snackBar.open('Error...', 'Cerrar', { duration: 3000 })`
 * en cargas iniciales de tablas/widgets — los snackbars desaparecen y el usuario
 * pierde el feedback. Este banner queda visible hasta que el retry tenga éxito o
 * el usuario lo descarte.
 *
 * Ejemplo:
 *   <vex-error-banner
 *     *ngIf="error"
 *     [message]="error"
 *     (retry)="cargarClientes()"
 *     (dismiss)="error = null">
 *   </vex-error-banner>
 *
 * Severidades:
 * - `error`   (default): rojo — fallo de red, 500, etc.
 * - `warning`: ámbar — datos incompletos, permisos parciales
 * - `info`   : azul   — informativo
 */
@Component({
  selector: 'vex-error-banner',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="flex items-start gap-3 p-4 rounded-lg border"
      [ngClass]="{
        'bg-red-50 border-red-200 text-red-900':     severity === 'error',
        'bg-amber-50 border-amber-200 text-amber-900': severity === 'warning',
        'bg-blue-50 border-blue-200 text-blue-900':  severity === 'info'
      }"
      role="alert"
      aria-live="assertive">

      <mat-icon
        class="flex-none mt-0.5"
        [ngClass]="{
          'text-red-600':   severity === 'error',
          'text-amber-600': severity === 'warning',
          'text-blue-600':  severity === 'info'
        }">
        {{ iconName }}
      </mat-icon>

      <div class="flex-1 min-w-0">
        <div *ngIf="title" class="font-semibold text-sm mb-1">{{ title }}</div>
        <div class="text-sm" [class.font-medium]="!title">{{ message }}</div>
        <div *ngIf="details" class="text-xs mt-1 opacity-75">{{ details }}</div>
      </div>

      <div class="flex-none flex items-center gap-1">
        <button
          *ngIf="retry.observed"
          type="button"
          mat-stroked-button
          color="primary"
          (click)="retry.emit()"
          class="!h-8 !px-3 !text-xs">
          <mat-icon class="!text-base !w-4 !h-4 mr-1">refresh</mat-icon>
          Reintentar
        </button>
        <button
          *ngIf="dismiss.observed"
          type="button"
          mat-icon-button
          (click)="dismiss.emit()"
          aria-label="Cerrar mensaje"
          class="!w-8 !h-8 !p-0">
          <mat-icon class="!text-base !w-5 !h-5">close</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class ErrorBannerComponent {
  @Input() message = '';
  @Input() title?: string;
  @Input() details?: string;
  @Input() severity: 'error' | 'warning' | 'info' = 'error';

  @Output() retry = new EventEmitter<void>();
  @Output() dismiss = new EventEmitter<void>();

  get iconName(): string {
    switch (this.severity) {
      case 'warning': return 'warning';
      case 'info':    return 'info';
      default:        return 'error_outline';
    }
  }
}
