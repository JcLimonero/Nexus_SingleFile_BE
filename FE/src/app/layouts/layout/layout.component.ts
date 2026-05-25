import { Component, ViewChild } from '@angular/core';
import { AppLayoutService } from '../../core/services/app-layout.service';
import { combineLatest, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { RouterOutlet } from '@angular/router';
import { LayoutConfigService } from '../../core/layout/layout-config.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { SidenavComponent } from '../components/sidenav/sidenav.component';
import { ToolbarComponent } from '../components/toolbar/toolbar.component';
import { FooterComponent } from '../components/footer/footer.component';
import { QuickpanelComponent } from '../components/quickpanel/quickpanel.component';
import { MatDrawer, MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { AppProgressBarComponent } from '../components/app-progress-bar/app-progress-bar.component';
import { BaseLayoutComponent } from '../base-layout/base-layout.component';
import { AppLayoutConfig } from '../../core/layout/layout-config.interface';
import { TenantStatusBannerComponent } from '../../shared/components/tenant-status-banner/tenant-status-banner.component';

@Component({
  selector: 'vex-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  imports: [
    BaseLayoutComponent,
    NgIf,
    AsyncPipe,
    SidenavComponent,
    ToolbarComponent,
    FooterComponent,
    QuickpanelComponent,
    MatSidenavModule,
    RouterOutlet,
    AppProgressBarComponent,
    TenantStatusBannerComponent
  ],
  standalone: true
})
export class LayoutComponent {
  @ViewChild('sidenav') sidenav?: MatDrawer;

  config$: Observable<AppLayoutConfig> = this.configService.config$;

  sidenavCollapsed$ = this.layoutService.sidenavCollapsed$;

  // Mode + open state derivados del breakpoint (>=960px = desktop/tablet
  // horizontal usa `side` siempre abierto; <960px = `over` con close por
  // default, abre con el hamburger del toolbar).
  sidenavMode$: Observable<MatDrawerMode> = this.layoutService.gtMd$.pipe(
    map(gt => (gt ? 'side' : 'over')),
    shareReplay({ bufferSize: 1, refCount: true })
  );
  sidenavOpen$: Observable<boolean> = this.layoutService.gtMd$.pipe(
    shareReplay({ bufferSize: 1, refCount: true })
  );
  sidenavDisableClose$: Observable<boolean> = this.layoutService.gtMd$.pipe(
    shareReplay({ bufferSize: 1, refCount: true })
  );

  quickpanelOpen$ = this.layoutService.quickpanelOpen$;

  constructor(
    private readonly layoutService: AppLayoutService,
    private readonly configService: LayoutConfigService,
    private readonly router: Router
  ) {
    // En móvil, cerrar el sidenav al navegar a una ruta nueva.
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        if (this.layoutService.isLtLg() && this.sidenav?.mode === 'over') {
          this.sidenav.close();
        }
      });
  }

  onSidenavClosed(): void {
    this.layoutService.closeSidenav();
  }

  onQuickpanelClosed(): void {
    this.layoutService.closeQuickpanel();
  }

  toggleSidenav(): void {
    this.sidenav?.toggle();
  }
}
