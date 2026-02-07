import { Injectable } from '@angular/core';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { NavigationItem } from './navigation-item.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { switchMap } from 'rxjs/operators';
import { canAccessRoute } from '../constants/route-access.config';

@Injectable({
  providedIn: 'root'
})
export class NavigationLoaderService {
  private readonly _items: BehaviorSubject<NavigationItem[]> =
    new BehaviorSubject<NavigationItem[]>([]);

  get items$(): Observable<NavigationItem[]> {
    return this.authService.currentUser$.pipe(
      switchMap(user => {
        return this.buildNavigation(user);
      })
    );
  }

  constructor(
    private layoutService: VexLayoutService,
    private authService: AuthService
  ) {
    this.loadNavigation();
  }

  private buildNavigation(user: any): Observable<NavigationItem[]> {
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
            icon: 'mat:insights',
            routerLinkActiveOptions: { exact: true }
          },
          {
            type: 'link',
            label: 'Global',
            route: '/dashboards/global',
            icon: 'mat:dashboard_customize'
          }
        ]
      },
      {
        type: 'subheading',
        label: 'Procesos',
        children: [
          {
            type: 'link',
            label: 'Integración',
            route: '/procesos/integracion',
            icon: 'mat:sync'
          },
          {
            type: 'link',
            label: 'Liquidación',
            route: '/procesos/liquidacion',
            icon: 'mat:account_balance'
          },
          {
            type: 'link',
            label: 'Liberación',
            route: '/procesos/liberacion',
            icon: 'mat:verified'
          }
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
            icon: 'mat:folder_special'
          },
          {
            type: 'link',
            label: 'Validación',
            route: '/mesa-control/validacion',
            icon: 'mat:verified'
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
            icon: 'mat:category',
            children: [
              {
                type: 'link',
                label: 'Agencias',
                route: '/configuracion/catalogos/agencias',
                icon: 'mat:business'
              },
              {
                type: 'link',
                label: 'Procesos',
                route: '/configuracion/catalogos/procesos',
                icon: 'mat:assignment'
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
                icon: 'mat:person_outline'
              },
              {
                type: 'link',
                label: 'Tipos de Documento',
                route: '/configuracion/catalogos/tipos-documento',
                icon: 'mat:description'
              },
              {
                type: 'link',
                label: 'Motivos de Aprobación y Rechazo',
                route: '/configuracion/motivos-rechazo',
                icon: 'mat:block'
              },
              {
                type: 'link',
                label: 'Motivos Extraordinarios',
                route: '/configuracion/motivos-extraordinarios',
                icon: 'mat:warning'
              }
            ]
          },
          {
            type: 'link',
            label: 'Configuración de Documentos Requeridos',
            route: '/configuracion/documentos-requeridos',
            icon: 'mat:assignment'
          },
          {
            type: 'link',
            label: 'Usuarios',
            route: '/configuracion/usuarios',
            icon: 'mat:people'
          },
          {
            type: 'link',
            label: 'Logs de Actividad',
            route: '/configuracion/logs-activity',
            icon: 'mat:history'
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
