import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface FilterChip {
  key: string;
  label: string;
  value: string;
}

@Component({
  selector: 'app-filter-chips',
  standalone: true,
  imports: [NgFor, NgIf, MatChipsModule, MatIconModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="chips?.length" class="filter-chips" role="region" aria-label="Filtros activos">
      <mat-chip-set>
        <mat-chip
          *ngFor="let chip of chips; trackBy: trackByKey"
          [removable]="true"
          (removed)="removeChip.emit(chip)"
        >
          <span class="filter-chips__label">{{ chip.label }}:</span>
          <span class="filter-chips__value">{{ chip.value }}</span>
          <button
            matChipRemove
            [attr.aria-label]="'Quitar filtro ' + chip.label"
          >
            <mat-icon svgIcon="mat:close"></mat-icon>
          </button>
        </mat-chip>
      </mat-chip-set>
      <button
        *ngIf="chips.length > 1"
        mat-button
        class="filter-chips__clear"
        (click)="clearAll.emit()"
      >
        Limpiar todo
      </button>
    </div>
  `,
  styles: [
    `
      .filter-chips {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
        padding: 8px 0;
      }
      .filter-chips__label {
        font-weight: 600;
        margin-right: 4px;
      }
      .filter-chips__value {
        opacity: 0.85;
      }
      .filter-chips__clear {
        margin-left: auto;
      }
    `
  ]
})
export class FilterChipsComponent {
  @Input() chips: FilterChip[] = [];
  @Output() removeChip = new EventEmitter<FilterChip>();
  @Output() clearAll = new EventEmitter<void>();

  trackByKey = (_: number, chip: FilterChip) => chip.key;
}
