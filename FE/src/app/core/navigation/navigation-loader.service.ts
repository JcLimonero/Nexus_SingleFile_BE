import { Injectable } from '@angular/core';
import { NavigationItem, NavigationDropdown, NavigationLink } from './navigation-item.interface';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { switchMap, map, catchError } from 'rxjs/operators';
import { canAccessRoute } from '../constants/route-access.config';
import { PhaseService, PhaseRow, phaseSlug } from '../services/phase.service';

@Injectable({
  providedIn: 'root'
})
export class NavigationLoaderService {
  private readonly _items: BehaviorSubject<NavigationItem[]> =
    new BehaviorSubject<NavigationItem[]>([]);

  get items$(): Observable<NavigationItem[]> {
    return this.authService.currentUser$.pipe(
      switchMap(user => {
        // Combine user identity with the user's active phase list. If the
        // phase endpoint fails (BE not yet updated, no group assigned, etc.)
        // we fall back to an empty list and the legacy hardcoded "Procesos"
        // dropdown still renders.
        return combineLatest([
          of(user),
          this.phaseService.getActiveForUser$().pipe(
            catchError(() => of([] as PhaseRow[]))
          ),
        ]).pipe(
          switchMap(([u, phases]) => this.buildNavigation(u, phases))
        );
      })
    );
  }

  constructor(
    private readonly authService: AuthService,
    private readonly phaseService: PhaseService
  ) {
    this.loadNavigation();
  }

  /**
   * Build a "Procesos" dropdown from the dynamic phase list when present.
   * Falls back to the legacy hardcoded set when phases is empty.
   */
  private buildProcesosDropdown(phases: PhaseRow[]): NavigationDropdown {
    if (!phases.length) {
      return {
        type: 'dropdown',
        label: 'Procesos',
        icon: 'mat:account_tree',
        children: [
          { type: 'link', label: 'Integración', route: '/procesos/integracion', icon: 'mat:merge_type' },
          { type: 'link', label: 'Liquidación', route: '/procesos/liquidacion', icon: 'mat:request_quote' },
          { type: 'link', label: 'Liberación', route: '/procesos/liberacion', icon: 'mat:lock_open' },
        ],
      };
    }

    // Dynamic — one nav link per phase the user's group is configured for
    const ICON_BY_NAME: Record<string, string> = {
      'integración': 'mat:merge_type',
      'integracion': 'mat:merge_type',
      'liquidación': 'mat:request_quote',
      'liquidacion': 'mat:request_quote',
      'liberación': 'mat:lock_open',
      'liberacion': 'mat:lock_open',
      'liberado': 'mat:check_circle',
      'cancelado': 'mat:cancel',
    };

    const children: NavigationLink[] = phases
      .filter((p) => Number(p.enabled) === 1)
      .sort((a, b) => Number(a.display_order) - Number(b.display_order))
      .map((p) => ({
        type: 'link',
        label: p.phase_name,
        route: `/fases/${phaseSlug(p.phase_name)}`,
        icon: ICON_BY_NAME[p.phase_name.toLowerCase()] ?? 'mat:circle',
      }));

    return {
      type: 'dropdown',
      label: 'Procesos',
      icon: 'mat:account_tree',
      children,
    };
  }

  private buildNavigation(user: any, phases: PhaseRow[]): Observable<NavigationItem[]> {
    const roleId = user?.role_id;

    const allItems: NavigationItem[] = [
      {
        type: 'subheading',
        label: 'Dashboards',
        children: [
          {
            type: 'link',
            label: 'Analytics',
            route: '/',
            icon: 'mat:bar_chart',
            routerLinkActiveOptions: { exact: true }
          },
          {
            type: 'link',
            label: 'Global',
            route: '/dashboards/global',
            icon: 'mat:public'
          }
        ]
      },
      {
        type: 'subheading',
        label: 'Procesos',
        children: [
          this.buildProcesosDropdown(phases)
        ]
      },
      {
        type: 'subheading',
        label: 'Mesa de Control',
        children: [
          {
            type: 'link',
            label: 'Consolidación DMS',
            route: '/mesa-control/consolidacion-dms',
            icon: 'mat:inventory'
          },
          {
            type: 'link',
            label: 'Validación',
            route: '/mesa-control/validacion',
            icon: 'mat:fact_check'
          },
          {
            type: 'link',
            label: 'Clientes',
            route: '/mesa-control/clientes',
            icon: 'mat:people'
          },
          {
            type: 'link',
            label: 'Reportes Cumplimiento',
            route: '/mesa-control/reportes-cumplimiento',
            icon: 'mat:assessment'
          }
        ]
      },
      {
        type: 'subheading',
        label: 'Configuración',
        children: [
          {
            type: 'dropdown',
            label: 'Catálogos',
            icon: 'mat:auto_stories',
            children: [
              {
                type: 'link',
                label: 'Agencias',
                route: '/configuracion/catalogos/agencias',
                icon: 'mat:storefront'
              },
              {
                // Catálogo de la tabla sale_type (Autos Nuevos, Seminuevos,
                // Motos). Renombrado de "Procesos" a "Tipos de Venta" para
                // no confundir con las fases del workflow (Integración,
                // Liquidación, Liberación) que también se llaman "procesos".
                type: 'link',
                label: 'Tipos de Venta',
                route: '/configuracion/catalogos/tipos-venta',
                icon: 'mat:sell'
              },
              {
                type: 'link',
                label: 'Tipos de Operación',
                route: '/configuracion/catalogos/tipos-operacion',
                icon: 'mat:swap_horiz'
              },
              {
                type: 'link',
                label: 'Tipos de Cliente',
                route: '/configuracion/catalogos/tipos-cliente',
                icon: 'mat:badge'
              },
              {
                type: 'link',
                label: 'Tipos de Documento',
                route: '/configuracion/catalogos/tipos-documento',
                icon: 'mat:file_copy'
              },
              {
                type: 'link',
                label: 'Motivos de Rechazo',
                route: '/configuracion/motivos-rechazo',
                icon: 'mat:thumbs_up_down'
              }
            ]
          },
          {
            type: 'link',
            label: 'Configuración de Documentos Requeridos',
            route: '/configuracion/documentos-requeridos',
            icon: 'mat:checklist'
          },
          {
            type: 'link',
            label: 'Usuarios',
            route: '/configuracion/usuarios',
            icon: 'mat:group'
          },
          {
            type: 'link',
            label: 'Logs de Actividad',
            route: '/configuracion/logs-activity',
            icon: 'mat:schedule'
          }
        ]
      }
    ];

    const navigationItems = this.filterNavigationByRole(allItems, roleId);

    // Agregar el resto de la navegación
    // navigationItems.push(
    //   {
    //     type: 'subheading',
    //     label: 'Apps',
    //     children: [
    //       {
    //         type: 'link',
    //         label: 'All-In-One Table',
    //         route: '/apps/aio-table',
    //         icon: 'mat:assignment'
    //       },
    //       {
    //         type: 'dropdown',
    //         label: 'Help Center',
    //         icon: 'mat:contact_support',
    //         children: [
    //           {
    //             type: 'link',
    //             label: 'Getting Started',
    //             route: '/apps/help-center/getting-started'
    //           },
    //           {
    //             type: 'link',
    //             label: 'Pricing & Plans',
    //             route: '/apps/help-center/pricing'
    //           },
    //           {
    //             type: 'link',
    //             label: 'FAQ',
    //             route: '/apps/help-center/faq'
    //           },
    //           {
    //             type: 'link',
    //             label: 'Guides',
    //             route: '/apps/help-center/guides'
    //           }
    //         ]
    //       },
    //       {
    //         type: 'link',
    //         label: 'Calendar',
    //         route: '/apps/calendar',
    //         icon: 'mat:date_range',
    //         badge: {
    //           value: '12',
    //           bgClass: 'bg-purple-600',
    //           textClass: 'text-white'
    //         }
    //       },
    //       {
    //         type: 'link',
    //         label: 'Chat',
    //         route: '/apps/chat',
    //         icon: 'mat:chat',
    //         badge: {
    //           value: '16',
    //           bgClass: 'bg-cyan-600',
    //           textClass: 'text-white'
    //         }
    //       },
    //       {
    //         type: 'link',
    //         label: 'Mailbox',
    //         route: '/apps/mail',
    //         icon: 'mat:mail',
    //         badge: {
    //           value: '27',
    //           bgClass: 'bg-amber-600',
    //           textClass: 'text-white'
    //         }
    //       },
    //       {
    //         type: 'link',
    //         label: 'Social',
    //         route: '/apps/social',
    //         icon: 'mat:share'
    //         },
    //       {
    //         type: 'link',
    //         label: 'Contacts',
    //         route: '/apps/contacts/grid',
    //         icon: 'mat:contacts'
    //       },
    //       {
    //         type: 'link',
    //         label: 'Scrumboard',
    //         route: '/apps/scrumboard/1',
    //         icon: 'mat:assessment'
    //       }
    //     ]
    //   }
    // );

    return new Observable(observer => {
      observer.next(navigationItems);
      observer.complete();
    });
  }

  /**
   * Filtra ítems de navegación por rol: solo se muestran rutas a las que el usuario tiene acceso.
   */
  private filterNavigationByRole(items: NavigationItem[], roleId: any): NavigationItem[] {
    return items
      .map(item => {
        if (item.type === 'subheading') {
          const filteredChildren = this.filterNavigationByRole(item.children, roleId);
          return filteredChildren.length ? { ...item, children: filteredChildren } : null;
        }
        if (item.type === 'dropdown') {
          const filteredChildren = this.filterNavigationByRole(item.children, roleId);
          return filteredChildren.length ? { ...item, children: filteredChildren } : null;
        }
        if (item.type === 'link' && item.route) {
          return canAccessRoute(roleId, item.route) ? item : null;
        }
        return item;
      })
      .filter((item): item is NavigationItem => item != null);
  }

  loadNavigation(): void {
    // La navegación ahora se construye dinámicamente en items$
  }
}
