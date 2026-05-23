import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/**
 * Empty state reutilizable para listas, tablas y widgets sin datos.
 * Reemplaza al patrón ad-hoc "div centrado con un icono y un texto" repetido
 * en muchos componentes y agrega un CTA opcional para guiar la acción.
 *
 * Ejemplo:
 *   <vex-empty-state
 *     *ngIf="clientes.length === 0 && !loading"
 *     icon="folder_open"
 *     title="No hay clientes asignados"
 *     description="Selecciona una agencia y un proceso para ver los expedientes."
 *     ctaLabel="Limpiar filtros"
 *     ctaIcon="filter_alt_off"
 *     (ctaClick)="clearFilters()">
 *   </vex-empty-state>
 *
 * Si no se pasa `ctaLabel`, no se muestra el botón.
 */
@Component({
  selector: 'vex-empty-state',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="flex flex-col items-center justify-center text-center"
      [class.py-8]="density === 'default'"
      [class.py-4]="density === 'compact'"
      role="status">

      <mat-icon
        class="text-gray-400"
        [ngClass]="{
          'text-5xl !w-12 !h-12 mb-3': density === 'default',
          'text-3xl !w-8 !h-8 mb-2':   density === 'compact'
        }"
        [attr.aria-hidden]="true">
        {{ icon }}
      </mat-icon>

      <h3
        *ngIf="title"
        class="font-medium text-gray-800"
        [class.text-base]="density === 'default'"
        [class.text-sm]="density === 'compact'">
        {{ title }}
      </h3>

      <p
        *ngIf="description"
        class="text-gray-600 mt-1 max-w-md"
        [class.text-sm]="density === 'default'"
        [class.text-xs]="density === 'compact'">
        {{ description }}
      </p>

      <button
        *ngIf="ctaLabel"
        type="button"
        mat-stroked-button
        color="primary"
        (click)="ctaClick.emit()"
        class="mt-4">
        <mat-icon *ngIf="ctaIcon" class="mr-1">{{ ctaIcon }}</mat-icon>
        {{ ctaLabel }}
      </button>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class EmptyStateComponent {
  @Input() icon = 'inbox';
  @Input() title?: string;
  @Input() description?: string;
  @Input() ctaLabel?: string;
  @Input() ctaIcon?: string;
  @Input() density: 'default' | 'compact' = 'default';

  @Output() ctaClick = new EventEmitter<void>();
}
