import {
  Component,
  DestroyRef,
  ElementRef,
  HostBinding,
  inject,
  OnInit
} from '@angular/core';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { VexConfigService } from '@vex/config/vex-config.service';
import { filter, map, startWith, switchMap } from 'rxjs/operators';
import { NavigationService } from '../../../core/navigation/navigation.service';
import { VexPopoverService } from '@vex/components/vex-popover/vex-popover.service';
import { MegaMenuComponent } from './mega-menu/mega-menu.component';
import { Observable, of } from 'rxjs';
import { NavigationComponent } from '../navigation/navigation.component';
import { ToolbarUserComponent } from './toolbar-user/toolbar-user.component';
import { ToolbarNotificationsComponent } from './toolbar-notifications/toolbar-notifications.component';
import { NavigationItemComponent } from '../navigation/navigation-item/navigation-item.component';
import { MatMenuModule } from '@angular/material/menu';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NavigationItem } from '../../../core/navigation/navigation-item.interface';
import { checkRouterChildsData } from '@vex/utils/check-router-childs-data';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BrandingService } from '../../../core/services/branding.service';

@Component({
  selector: 'vex-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    NgIf,
    RouterLink,
    MatMenuModule,
    NgClass,
    NgFor,
    NavigationItemComponent,
    ToolbarNotificationsComponent,
    ToolbarUserComponent,
    NavigationComponent,
    AsyncPipe
  ]
})
export class ToolbarComponent implements OnInit {
  @HostBinding('class.shadow-b')
  showShadow: boolean = false;

  navigationItems$: Observable<NavigationItem[]> =
    this.navigationService.items$;

  isHorizontalLayout$: Observable<boolean> = this.configService.config$.pipe(
    map((config) => config.layout === 'horizontal')
  );
  isVerticalLayout$: Observable<boolean> = this.configService.config$.pipe(
    map((config) => config.layout === 'vertical')
  );
  isNavbarInToolbar$: Observable<boolean> = this.configService.config$.pipe(
    map((config) => config.navbar.position === 'in-toolbar')
  );
  isNavbarBelowToolbar$: Observable<boolean> = this.configService.config$.pipe(
    map((config) => config.navbar.position === 'below-toolbar')
  );
  userVisible$: Observable<boolean> = this.configService.config$.pipe(
    map((config) => config.toolbar.user.visible)
  );
  title$: Observable<string> = this.configService.select(
    (config) => config.sidenav.title
  );

  /** Logo de la app (configurable por cliente vía assets/config/branding.json) */
  logoApp$ = this.brandingService.getBranding$().pipe(map((b) => b.logoApp));
  /** Si hay theme.logoColor, se aplica filtro de color al logo */
  logoColor$ = this.brandingService.getBranding$().pipe(map((b) => b.theme?.logoColor));

  // Título dinámico basado en la ruta actual
  dynamicTitle$: Observable<string> = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    startWith(null),
    map(() => {
      const title = this.getPageTitle();

      return title;
    }),
    startWith('Dashboard Analytics')
  );

  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
  megaMenuOpen$: Observable<boolean> = of(false);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private readonly layoutService: VexLayoutService,
    private readonly configService: VexConfigService,
    private readonly navigationService: NavigationService,
    private readonly popoverService: VexPopoverService,
    private readonly router: Router,
    private readonly brandingService: BrandingService
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        startWith(null),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.showShadow = checkRouterChildsData(
          this.router.routerState.root.snapshot,
          (data) => data.toolbarShadowEnabled ?? false
        );
        
        // Debug: mostrar el título actual
        const currentTitle = this.getPageTitle();

      });
  }

  openQuickpanel(): void {
    this.layoutService.openQuickpanel();
  }

  openSidenav(): void {
    this.layoutService.openSidenav();
  }

  openMegaMenu(origin: ElementRef | HTMLElement): void {
    this.megaMenuOpen$ = of(
      this.popoverService.open({
        content: MegaMenuComponent,
        origin,
        offsetY: 12,
        position: [
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top'
          },
          {
            originX: 'end',
            originY: 'bottom',
            overlayX: 'end',
            overlayY: 'top'
          }
        ]
      })
    ).pipe(
      switchMap((popoverRef) => popoverRef.afterClosed$.pipe(map(() => false))),
      startWith(true)
    );
  }

  openSearch(): void {
    this.layoutService.openSearch();
  }

  /**
   * Obtener el título de la página basado en la ruta actual
   */
  private getPageTitle(): string {
    const url = this.router.url;
    
    // Mesa de Control
    if (url.includes('/mesa-control')) {
      if (url.includes('/validacion')) {
        return 'Validación';
      } else if (url.includes('/panel-soporte')) {
        return 'Panel de soporte';
      } else if (url.includes('/consolidacion-dms')) {
        return 'Consolidación DMS';
      } else if (url.includes('/dashboard')) {
        return 'Dashboard Principal';
      } else if (url.includes('/monitoreo')) {
        return 'Monitoreo en Tiempo Real';
      } else if (url.includes('/reportes')) {
        return 'Reportes';
      } else {
        return 'Mesa de Control';
      }
    }
    
    // Configuración
    if (url.includes('/configuracion')) {
      if (url.includes('/agencias')) {
        return 'Agencias';
      } else if (url.includes('/usuarios')) {
        return 'Usuarios';
      } else if (url.includes('/motivos-extraordinarios')) {
        return 'Motivos Extraordinarios';
      } else if (url.includes('/motivos-rechazo')) {
        return 'Motivos de Aprobación y Rechazo';
      } else if (url.includes('/documentos-requeridos')) {
        return 'Documentos Requeridos';
      } else if (url.includes('/tipos-documento')) {
        return 'Tipos de Documento';
      } else if (url.includes('/tipos-cliente')) {
        return 'Tipos de Cliente';
      } else if (url.includes('/catalogos')) {
        return 'Catálogos';
      } else {
        return 'Configuración';
      }
    }
    
    // Procesos
    if (url.includes('/procesos')) {
      if (url.includes('/integracion')) {
        return 'Integración';
      } else if (url.includes('/liquidacion')) {
        return 'Liquidación';
      } else if (url.includes('/liberacion')) {
        return 'Liberación';
      } else {
        return 'Procesos';
      }
    }
    
    // Mesa de Control
    if (url.includes('/mesa-control')) {
      if (url.includes('/validacion')) {
        return 'VaConsolidación DMS';
      } else if (url.includes('/monitoreo')) {
        return 'Monitoreo';
      } else if (url.includes('/reportes')) {
        return 'Reportes';
      } else if (url.includes('/dashboard')) {
        return 'Dashboard';
      } else {
        return 'Mesa de Control';
      }
    }
    
    // Dashboard
    if (url.includes('/dashboards')) {
      if (url.includes('/global')) {
        return 'Dashboard Global';
      }
      
      return 'Dashboard';
    }
    
    // Página principal
    if (url === '/' || url === '') {
      return 'Dashboard Analytics';
    }
    
    // Por defecto
    return 'Dashboard Analytics';
  }
}
