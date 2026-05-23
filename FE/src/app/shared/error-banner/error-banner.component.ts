import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-error-banner',
  standalone: true,
  imports: [NgIf, MatIconModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      *ngIf="message"
      role="alert"
      aria-live="assertive"
      class="error-banner"
      [class.error-banner--warn]="severity === 'warn'"
    >
      <mat-icon
        svgIcon="mat:error_outline"
        class="error-banner__icon"
        aria-hidden="true"
      ></mat-icon>
      <div class="error-banner__body">
        <div *ngIf="title" class="error-banner__title">{{ title }}</div>
        <div class="error-banner__message">{{ message }}</div>
      </div>
      <button
        *ngIf="showRetry"
        mat-stroked-button
        class="error-banner__action"
        [attr.aria-label]="retryLabel"
        (click)="retry.emit()"
      >
        {{ retryLabel }}
      </button>
    </div>
  `,
  styles: [
    `
      .error-banner {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 12px 16px;
        border-radius: 8px;
        background: rgb(254 226 226);
        color: rgb(127 29 29);
        border: 1px solid rgb(252 165 165);
      }
      .error-banner--warn {
        background: rgb(255 247 237);
        color: rgb(124 45 18);
        border-color: rgb(253 186 116);
      }
      .error-banner__icon {
        flex: none;
        margin-top: 2px;
      }
      .error-banner__body {
        flex: auto;
        min-width: 0;
      }
      .error-banner__title {
        font-weight: 600;
        margin-bottom: 2px;
      }
      .error-banner__message {
        font-size: 0.875rem;
      }
      .error-banner__action {
        flex: none;
      }
    `
  ]
})
export class ErrorBannerComponent {
  @Input() title = '';
  @Input() message = '';
  @Input() severity: 'error' | 'warn' = 'error';
  @Input() showRetry = true;
  @Input() retryLabel = 'Reintentar';
  @Output() retry = new EventEmitter<void>();
}
