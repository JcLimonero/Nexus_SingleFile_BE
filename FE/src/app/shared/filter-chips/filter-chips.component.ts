import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

/**
 * Chip que representa un filtro activo en pantalla.
 *
 * - `key`: identificador único del filtro (usado por `(remove)` para saber
 *          cuál quitar).
 * - `label`: nombre del filtro mostrado al usuario (ej. "Agencia").
 * - `value`: valor humano-legible (ej. "GDL Centro", NO el id `15`).
 */
export interface FilterChip {
  key: string;
  label: string;
  value: string;
}

/**
 * Renderiza los filtros activos como chips removibles + botón "Limpiar todo".
 *
 * Uso típico:
 *
 *   <vex-filter-chips
 *     *ngIf="activeFilters.length > 0"
 *     [chips]="activeFilters"
 *     (remove)="onRemoveFilter($event)"
 *     (clearAll)="onClearAllFilters()">
 *   </vex-filter-chips>
 *
 * Donde `activeFilters` es un getter del componente que construye los chips
 * a partir de su estado (selectedAgency, searchTerm, etc.) y onRemoveFilter
 * reacciona al `key` devuelto para resetear ese filtro.
 *
 * El componente no se preocupa de URL sync — eso lo hace el padre via
 * `writeFiltersToUrl` después de modificar su estado.
 */
@Component({
  selector: 'vex-filter-chips',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatChipsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-wrap items-center gap-2"
         role="region"
         aria-label="Filtros activos">
      <mat-chip-set>
        <mat-chip *ngFor="let chip of chips; trackBy: trackByKey"
                  [removable]="true"
                  (removed)="remove.emit(chip.key)"
                  class="!text-xs">
          <span class="text-gray-600">{{ chip.label }}:</span>
          <strong class="ml-1 text-gray-900">{{ chip.value }}</strong>
          <mat-icon matChipRemove
                    [attr.aria-label]="'Quitar filtro ' + chip.label">
            cancel
          </mat-icon>
        </mat-chip>
      </mat-chip-set>

      <button *ngIf="chips.length > 1"
              type="button"
              mat-button
              color="primary"
              (click)="clearAll.emit()"
              class="!text-xs !min-h-0 !h-7">
        <mat-icon class="!text-base !w-4 !h-4 mr-1">clear_all</mat-icon>
        Limpiar todo
      </button>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class FilterChipsComponent {
  @Input() chips: FilterChip[] = [];

  @Output() remove = new EventEmitter<string>();
  @Output() clearAll = new EventEmitter<void>();

  trackByKey = (_: number, chip: FilterChip): string => chip.key;
}
