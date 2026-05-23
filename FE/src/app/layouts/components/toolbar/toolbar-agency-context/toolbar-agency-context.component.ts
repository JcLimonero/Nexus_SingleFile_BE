import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable, combineLatest, of } from 'rxjs';
import { catchError, map, shareReplay, startWith } from 'rxjs/operators';
import { Agencia, DefaultAgencyService } from '../../../../core/services/default-agency.service';

/**
 * Selector de agencia activa en el toolbar.
 *
 * En multi-agencia, el usuario antes no sabía "en qué contexto está parado"
 * hasta entrar a una pantalla. Ahora ve la agencia actual siempre arriba,
 * y puede cambiarla en 1 click. Si solo hay 1 agencia disponible, se muestra
 * como texto plano (sin dropdown).
 */
@Component({
  selector: 'app-toolbar-agency-context',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="agencias$ | async as agencias">
      <ng-container *ngIf="agencias.length > 0">
        <!-- 1 sola: solo texto -->
        <span
          *ngIf="agencias.length === 1; else multiple"
          class="agency-chip agency-chip--static"
          [matTooltip]="'Tu agencia asignada'">
          <mat-icon svgIcon="mat:business" class="agency-chip__icon" aria-hidden="true"></mat-icon>
          <span class="agency-chip__label">{{ agencias[0].name }}</span>
        </span>

        <!-- ≥2: dropdown -->
        <ng-template #multiple>
          <button
            mat-button
            class="agency-chip agency-chip--button"
            [matMenuTriggerFor]="agencyMenu"
            [matTooltip]="'Cambiar agencia activa'"
            aria-label="Agencia activa, click para cambiar">
            <mat-icon svgIcon="mat:business" class="agency-chip__icon" aria-hidden="true"></mat-icon>
            <span class="agency-chip__label">
              {{ (selectedName$ | async) || 'Sin agencia' }}
            </span>
            <mat-icon svgIcon="mat:arrow_drop_down" class="agency-chip__caret" aria-hidden="true"></mat-icon>
          </button>

          <mat-menu #agencyMenu="matMenu" xPosition="before">
            <button
              *ngFor="let a of agencias"
              mat-menu-item
              (click)="select(a.id)"
              [class.active]="a.id === (selectedId$ | async)">
              <mat-icon
                *ngIf="a.id === (selectedId$ | async); else placeholder"
                svgIcon="mat:check"
                class="text-blue-600"
                aria-hidden="true"
              ></mat-icon>
              <ng-template #placeholder>
                <mat-icon svgIcon="mat:business" aria-hidden="true"></mat-icon>
              </ng-template>
              <span>{{ a.name }}</span>
            </button>
          </mat-menu>
        </ng-template>
      </ng-container>
    </ng-container>
  `,
  styles: [`
    .agency-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 9999px;
      background: rgba(255, 255, 255, 0.12);
      color: #fff;
      font-weight: 500;
      font-size: 0.8125rem;
      line-height: 1.2;
      max-width: 240px;
    }
    .agency-chip--button {
      cursor: pointer;
      border: none;
      transition: background 120ms;
    }
    .agency-chip--button:hover {
      background: rgba(255, 255, 255, 0.2);
    }
    .agency-chip__icon.mat-icon {
      width: 16px;
      height: 16px;
      font-size: 16px;
      flex: none;
    }
    .agency-chip__label {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .agency-chip__caret.mat-icon {
      width: 18px;
      height: 18px;
      font-size: 18px;
      margin: -2px -4px -2px 0;
      flex: none;
    }
  `]
})
export class ToolbarAgencyContextComponent implements OnInit {
  agencias$: Observable<Agencia[]> = of([]);
  selectedId$ = this.agencyService.selectedAgency$;
  selectedName$: Observable<string | null> = of(null);

  constructor(private readonly agencyService: DefaultAgencyService) {}

  ngOnInit(): void {
    this.agencias$ = this.agencyService.obtenerAgencias().pipe(
      catchError(() => of([] as Agencia[])),
      startWith([] as Agencia[]),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    this.selectedName$ = combineLatest([
      this.agencias$,
      this.selectedId$
    ]).pipe(
      map(([agencias, id]) => {
        if (id == null) return null;
        const found = agencias.find(a => Number(a.id) === Number(id));
        return found?.name ?? null;
      })
    );
  }

  select(id: number): void {
    this.agencyService.seleccionarAgencia(id);
    // Si el service expone update remoto, también podríamos llamar
    // actualizarAgenciaPredeterminada — depende del flujo deseado.
  }
}
