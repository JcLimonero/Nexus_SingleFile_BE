import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';

/**
 * Breadcrumbs auto-generados desde la URL — no requiere modificar cada
 * ruta con `data: { breadcrumb: '...' }`. Mapea segmentos de path a labels
 * humanos vía `SEGMENT_LABELS`. Si un segmento no está mapeado se omite del
 * crumb (típicamente IDs numéricos o auth/login que no aportan contexto).
 *
 * Renderiza nada cuando la profundidad es ≤ 1 (no tiene sentido mostrar
 * "Inicio" solo) o cuando estamos en /login, /register, etc.
 */
@Component({
  selector: 'vex-breadcrumbs',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav *ngIf="crumbs.length >= 2"
         class="px-6 py-2 flex items-center gap-1 text-sm border-b bg-foreground"
         aria-label="Navegación">
      <ol class="flex items-center gap-1 m-0 p-0 list-none">
        <li *ngFor="let crumb of crumbs; let last = last; trackBy: trackByUrl"
            class="flex items-center gap-1">
          <a *ngIf="!last; else currentCrumb"
             [routerLink]="crumb.url"
             class="text-gray-600 hover:text-primary-600 no-underline transition-colors">
            {{ crumb.label }}
          </a>
          <ng-template #currentCrumb>
            <span class="font-medium text-gray-900" aria-current="page">
              {{ crumb.label }}
            </span>
          </ng-template>
          <mat-icon *ngIf="!last"
                    class="!text-base !w-4 !h-4 text-gray-400"
                    aria-hidden="true">
            chevron_right
          </mat-icon>
        </li>
      </ol>
    </nav>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class BreadcrumbsComponent implements OnInit {
  /**
   * Mapeo de segmento de URL → label humano. Si un segmento no está aquí,
   * se omite del breadcrumb (ej. IDs como /pedidos/1234).
   *
   * Mantener sincronizado con las rutas de app.routes.ts.
   */
  private static readonly SEGMENT_LABELS: Record<string, string> = {
    'dashboards':         'Dashboards',
    'analytics':          'Analytics',
    'global':             'Global',
    'mesa-control':       'Mesa Control',
    'validacion':         'Validación',
    'panel-soporte':      'Panel de Soporte',
    'consolidacion-dms':  'Consolidación DMS',
    'procesos':           'Procesos',
    'integracion':        'Integración',
    'liquidacion':        'Liquidación',
    'liberacion':         'Liberación',
    'configuracion':      'Configuración',
    'usuarios':           'Usuarios',
    'documentos-requeridos':       'Documentos requeridos',
    'tipos-documento':             'Tipos de documento',
    'motivos-rechazo':             'Motivos de rechazo',
    'motivos-extraordinarios':     'Motivos extraordinarios',
    'logs-activity':               'Bitácora de actividad',
    'configuracion-general':       'Configuración general',
  };

  /**
   * Rutas en las que NO se muestran breadcrumbs (login, errores, etc).
   * Se compara como prefix de la URL.
   */
  private static readonly HIDDEN_PREFIXES = ['/login', '/register', '/forgot-password', '/coming-soon'];

  crumbs: Array<{ label: string; url: string }> = [];

  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.updateCrumbs(this.router.url);
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((e) => {
        this.updateCrumbs(e.urlAfterRedirects);
        this.cdr.markForCheck();
      });
  }

  private updateCrumbs(url: string): void {
    // Quitar queryParams y fragment para parsear sólo el path
    const cleanUrl = url.split('?')[0].split('#')[0];

    if (BreadcrumbsComponent.HIDDEN_PREFIXES.some((p) => cleanUrl.startsWith(p))) {
      this.crumbs = [];
      return;
    }

    const segments = cleanUrl.split('/').filter(Boolean);
    const crumbs: Array<{ label: string; url: string }> = [];
    let accUrl = '';

    for (const seg of segments) {
      accUrl += '/' + seg;
      const label = BreadcrumbsComponent.SEGMENT_LABELS[seg];
      if (label) {
        crumbs.push({ label, url: accUrl });
      }
      // Si no hay label (IDs o segmentos no mapeados) lo saltamos pero
      // seguimos acumulando la URL para que los crumbs siguientes apunten
      // a la ruta correcta.
    }

    this.crumbs = crumbs;
  }

  trackByUrl(_: number, crumb: { url: string }): string {
    return crumb.url;
  }
}
