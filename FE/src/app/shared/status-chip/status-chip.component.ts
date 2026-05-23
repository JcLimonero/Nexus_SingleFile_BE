import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export type StatusVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';
export type StatusSize = 'sm' | 'md';

/**
 * Chip de estado reutilizable basado en tokens semánticos
 * (--app-success/warning/danger/info/neutral).
 *
 *   <app-status-chip variant="success" label="Aprobado"></app-status-chip>
 *   <app-status-chip variant="warning" label="Pendiente" icon="mat:schedule"></app-status-chip>
 *   <app-status-chip variant="danger" label="Rechazado" size="sm"></app-status-chip>
 *
 * Reemplaza los patrones distintos de badges que vivían en validacion,
 * usuarios, dashboards. Si la app cambia de paleta solo se editan los
 * tokens en styles.scss y todos los chips actualizan.
 */
@Component({
  selector: 'app-status-chip',
  standalone: true,
  imports: [NgIf, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="status-chip"
      [class]="'status-chip--' + variant + ' status-chip--' + size"
    >
      <mat-icon
        *ngIf="icon"
        [svgIcon]="icon"
        class="status-chip__icon"
        aria-hidden="true"
      ></mat-icon>
      <span class="status-chip__label">{{ label }}</span>
    </span>
  `,
  styles: [`
    .status-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      border-radius: 9999px;
      font-weight: 500;
      white-space: nowrap;
      border: 1px solid;
      line-height: 1;
    }
    .status-chip--sm { padding: 2px 8px;  font-size: 0.6875rem; }
    .status-chip--md { padding: 4px 10px; font-size: 0.8125rem; }

    .status-chip__icon.mat-icon {
      width: 14px;
      height: 14px;
      font-size: 14px;
      line-height: 1;
    }
    .status-chip--md .status-chip__icon.mat-icon {
      width: 16px;
      height: 16px;
      font-size: 16px;
    }

    .status-chip--success {
      background: var(--app-success-bg);
      color: var(--app-success-fg);
      border-color: var(--app-success-border);
    }
    .status-chip--success .status-chip__icon { color: var(--app-success-icon); }

    .status-chip--warning {
      background: var(--app-warning-bg);
      color: var(--app-warning-fg);
      border-color: var(--app-warning-border);
    }
    .status-chip--warning .status-chip__icon { color: var(--app-warning-icon); }

    .status-chip--danger {
      background: var(--app-danger-bg);
      color: var(--app-danger-fg);
      border-color: var(--app-danger-border);
    }
    .status-chip--danger .status-chip__icon { color: var(--app-danger-icon); }

    .status-chip--info {
      background: var(--app-info-bg);
      color: var(--app-info-fg);
      border-color: var(--app-info-border);
    }
    .status-chip--info .status-chip__icon { color: var(--app-info-icon); }

    .status-chip--neutral {
      background: var(--app-neutral-bg);
      color: var(--app-neutral-fg);
      border-color: var(--app-neutral-border);
    }
    .status-chip--neutral .status-chip__icon { color: var(--app-neutral-icon); }
  `]
})
export class StatusChipComponent {
  @Input({ required: true }) label = '';
  @Input() variant: StatusVariant = 'neutral';
  @Input() size: StatusSize = 'md';
  @Input() icon = '';
}
