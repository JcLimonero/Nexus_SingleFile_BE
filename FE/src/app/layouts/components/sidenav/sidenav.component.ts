import { Component, Input } from '@angular/core';
import { NavigationService } from '../../../core/navigation/navigation.service';
import { AppLayoutService } from '../../../core/services/app-layout.service';
import { LayoutConfigService } from '../../../core/layout/layout-config.service';
import { map } from 'rxjs/operators';
import { NavigationItem } from '../../../core/navigation/navigation-item.interface';
import { Observable } from 'rxjs';
import { SidenavUserMenuComponent } from './sidenav-user-menu/sidenav-user-menu.component';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { SearchModalComponent } from './search-modal/search-modal.component';
import { SidenavItemComponent } from './sidenav-item/sidenav-item.component';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { BrandingService } from '../../../core/services/branding.service';

@Component({
  selector: 'vex-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
    MatMenuModule,
    NgFor,
    SidenavItemComponent,
    SidenavUserMenuComponent,
    AsyncPipe
  ]
})
export class SidenavComponent {
  @Input() collapsed = false;
  collapsedOpen$ = this.layoutService.sidenavCollapsedOpen$;
  title$ = this.brandingService.getBranding$().pipe(
    map((b) => b.appTitle ?? b.clientName)
  );
  imageUrl$ = this.brandingService.getBranding$().pipe(
    map((b) => b.logoApp)
  );
  logoColor$ = this.brandingService.getBranding$().pipe(
    map((b) => b.theme?.logoColor)
  );
  showCollapsePin$ = this.configService.config$.pipe(
    map((config) => config.sidenav.showCollapsePin)
  );
  userVisible$ = this.configService.config$.pipe(
    map((config) => config.sidenav.user.visible)
  );
  searchVisible$ = this.configService.config$.pipe(
    map((config) => config.sidenav.search.visible)
  );
  currentUser$ = this.authService.currentUser$;
  items$: Observable<NavigationItem[]> = this.navigationService.items$;

  trackByRoute(_index: number, item: NavigationItem): string {
    if (item.type === 'link' && item.route != null) {
      return Array.isArray(item.route) ? item.route.join('/') : String(item.route);
    }
    return item.label;
  }

  constructor(
    private readonly navigationService: NavigationService,
    private readonly layoutService: AppLayoutService,
    private readonly configService: LayoutConfigService,
    private readonly dialog: MatDialog,
    private readonly authService: AuthService,
    private readonly brandingService: BrandingService
  ) {}

  collapseOpenSidenav(): void {
    this.layoutService.collapseOpenSidenav();
  }

  collapseCloseSidenav(): void {
    this.layoutService.collapseCloseSidenav();
  }

  toggleCollapse(): void {
    this.collapsed
      ? this.layoutService.expandSidenav()
      : this.layoutService.collapseSidenav();
  }

  closeUserMenu(trigger: MatMenuTrigger): void {
    trigger.closeMenu();
  }

  openSearch(): void {
    this.dialog.open(SearchModalComponent, {
      panelClass: 'vex-dialog-glossy',
      width: '100%',
      maxWidth: '600px'
    });
  }
}
