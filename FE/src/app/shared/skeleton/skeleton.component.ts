import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Skeleton loader animado. Reemplaza a `<mat-spinner>` cuando se desea
 * mostrar la forma del contenido en vez de un spinner abstracto.
 *
 * Ejemplo:
 *   <vex-skeleton variant="metric-card" *ngIf="loading"></vex-skeleton>
 *   <vex-skeleton width="80%" height="1rem" *ngIf="loading"></vex-skeleton>
 *
 * Variantes disponibles:
 * - `text`         (default): rectángulo simple, hereda width/height
 * - `metric-card`: card de métrica (icono + texto grande + 2 líneas)
 * - `chart`       : área alta para gráficos
 * - `table-row`   : 1 fila de tabla
 */
@Component({
  selector: 'vex-skeleton',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container [ngSwitch]="variant">

      <div *ngSwitchCase="'metric-card'" class="metric-card-skel p-4 flex items-center gap-4">
        <div class="skel-shimmer rounded-lg" style="width:3rem; height:3rem"></div>
        <div class="flex-1 space-y-2">
          <div class="skel-shimmer rounded" style="width:60%; height:1.75rem"></div>
          <div class="skel-shimmer rounded" style="width:40%; height:0.875rem"></div>
          <div class="skel-shimmer rounded" style="width:30%; height:0.75rem"></div>
        </div>
      </div>

      <div *ngSwitchCase="'chart'" class="skel-shimmer rounded"
           [style.width]="'100%'"
           [style.height]="height || '16rem'"></div>

      <div *ngSwitchCase="'table-row'" class="flex gap-2 p-2">
        <div class="skel-shimmer rounded" style="width:20%; height:1rem"></div>
        <div class="skel-shimmer rounded" style="width:30%; height:1rem"></div>
        <div class="skel-shimmer rounded" style="width:20%; height:1rem"></div>
        <div class="skel-shimmer rounded" style="width:25%; height:1rem"></div>
      </div>

      <div *ngSwitchDefault class="skel-shimmer rounded"
           [style.width]="width"
           [style.height]="height"></div>

    </ng-container>
  `,
  styles: [`
    :host { display: block; }
    .skel-shimmer {
      background: linear-gradient(
        90deg,
        rgba(229, 231, 235, 1) 0%,
        rgba(243, 244, 246, 1) 50%,
        rgba(229, 231, 235, 1) 100%
      );
      background-size: 200% 100%;
      animation: skel-shimmer 1.4s ease-in-out infinite;
    }
    @keyframes skel-shimmer {
      0%   { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    .metric-card-skel {
      background: var(--mat-card-background-color, #ffffff);
      border-radius: 0.5rem;
    }
    @media (prefers-reduced-motion: reduce) {
      .skel-shimmer { animation: none; opacity: 0.6; }
    }
  `]
})
export class SkeletonComponent {
  @Input() variant: 'text' | 'metric-card' | 'chart' | 'table-row' = 'text';
  @Input() width = '100%';
  @Input() height = '1rem';
}
