import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [NgIf, MatIconModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="empty-state" role="status" aria-live="polite">
      <mat-icon
        *ngIf="icon"
        [svgIcon]="icon"
        class="empty-state__icon"
        aria-hidden="true"
      ></mat-icon>
      <div *ngIf="title" class="empty-state__title">{{ title }}</div>
      <div *ngIf="description" class="empty-state__description">
        {{ description }}
      </div>
      <button
        *ngIf="ctaText"
        mat-flat-button
        color="primary"
        class="empty-state__cta"
        [attr.aria-label]="ctaText"
        (click)="ctaClick.emit()"
      >
        {{ ctaText }}
      </button>
    </div>
  `,
  styles: [
    `
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 32px 16px;
        text-align: center;
        color: rgb(75 85 99);
      }
      .empty-state__icon {
        width: 48px;
        height: 48px;
        font-size: 48px;
        margin-bottom: 12px;
        opacity: 0.6;
      }
      .empty-state__title {
        font-weight: 600;
        font-size: 1rem;
        margin-bottom: 4px;
        color: rgb(31 41 55);
      }
      .empty-state__description {
        font-size: 0.875rem;
        max-width: 340px;
        margin-bottom: 16px;
      }
    `
  ]
})
export class EmptyStateComponent {
  @Input() icon = 'mat:inbox';
  @Input() title = 'Sin datos';
  @Input() description = '';
  @Input() ctaText = '';
  @Output() ctaClick = new EventEmitter<void>();
}
