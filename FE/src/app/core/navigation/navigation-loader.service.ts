import { Injectable } from '@angular/core';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { NavigationItem } from './navigation-item.interface';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NavigationLoaderService {
  private readonly _items: BehaviorSubject<NavigationItem[]> =
    new BehaviorSubject<NavigationItem[]>([]);

  get items$(): Observable<NavigationItem[]> {
    console.log('🔍 items$ getter llamado');
    
    return this.authService.currentUser$.pipe(
      switchMap(user => {
        console.log('🔍 currentUser$ emitió usuario:', user);
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
    console.log('🔍 buildNavigation llamado con usuario:', user);
    
    const isConfigUser = this.isConfigUser(user);
    console.log('🔍 isConfigUser resultado:', isConfigUser);
    console.log('🔍 Detalles del usuario:', {
      hasUser: !!user,
      role_id: user?.role_id,
      role_name: user?.role_name,
      role: user?.role
    });
    
    const navigationItems: NavigationItem[] = [
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
          }
        ]
      }
    ];

    // Solo agregar la sección de configuración si el usuario tiene permisos
    if (isConfigUser) {
      console.log('✅ Agregando sección CONFIGURACIÓN al menú');
      navigationItems.push({
        type: 'subheading',
        label: 'Configuración',
        children: [
          {
            type: 'link',
            label: 'Configuración General',
            route: '/configuracion/general',
            icon: 'mat:settings'
          },
          {
            type: 'link',
            label: 'Usuarios',
            route: '/configuracion/usuarios',
            icon: 'mat:people'
          },
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
              icon: 'mat:settings'
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
            }
          ]
        }
        ]
      });
    } else {
      console.log('❌ NO se agrega sección CONFIGURACIÓN - usuario no autorizado');
    }

    console.log('🔍 Navegación final construida:', navigationItems);

    // Agregar el resto de la navegación
    navigationItems.push(
      {
        type: 'subheading',
        label: 'Apps',
        children: [
          {
            type: 'link',
            label: 'All-In-One Table',
            route: '/apps/aio-table',
            icon: 'mat:assignment'
          },
          {
            type: 'dropdown',
            label: 'Help Center',
            icon: 'mat:contact_support',
            children: [
              {
                type: 'link',
                label: 'Getting Started',
                route: '/apps/help-center/getting-started'
              },
              {
                type: 'link',
                label: 'Pricing & Plans',
                route: '/apps/help-center/pricing'
              },
              {
                type: 'link',
                label: 'FAQ',
                route: '/apps/help-center/faq'
              },
              {
                type: 'link',
                label: 'Guides',
                route: '/apps/help-center/guides'
              }
            ]
          },
          {
            type: 'link',
            label: 'Calendar',
            route: '/apps/calendar',
            icon: 'mat:date_range',
            badge: {
              value: '12',
              bgClass: 'bg-purple-600',
              textClass: 'text-white'
            }
          },
          {
            type: 'link',
            label: 'Chat',
            route: '/apps/chat',
            icon: 'mat:chat',
            badge: {
              value: '16',
              bgClass: 'bg-cyan-600',
              textClass: 'text-white'
            }
          },
          {
            type: 'link',
            label: 'Mailbox',
            route: '/apps/mail',
            icon: 'mat:mail',
            badge: {
              value: '27',
              bgClass: 'bg-amber-600',
              textClass: 'text-white'
            }
          },
          {
            type: 'link',
            label: 'Social',
            route: '/apps/social',
            icon: 'mat:share'
          },
          {
            type: 'link',
            label: 'Contacts',
            route: '/apps/contacts/grid',
            icon: 'mat:contacts'
          },
          {
            type: 'link',
            label: 'Scrumboard',
            route: '/apps/scrumboard/1',
            icon: 'mat:assessment'
          }
        ]
      }
    );

    return new Observable(observer => {
      observer.next(navigationItems);
      observer.complete();
    });
  }

  loadNavigation(): void {
    // La navegación ahora se construye dinámicamente en items$
  }

  private isConfigUser(user: any): boolean {
    console.log('🔍 isConfigUser llamado con:', user);
    console.log('🔍 Verificando role_id:', user?.role_id);
    console.log('🔍 Tipo de role_id:', typeof user?.role_id);
    
    // Convertir a number para comparación segura
    const roleId = Number(user?.role_id);
    console.log('🔍 role_id convertido a number:', roleId);
    
    const is6 = roleId === 6;
    const is7 = roleId === 7;
    const resultado = user && (is6 || is7);
    
    console.log('🔍 Comparación:', {
      role_id_original: user?.role_id,
      role_id_number: roleId,
      is6: is6,
      is7: is7,
      resultado: resultado
    });
    
    return resultado;
  }
}
