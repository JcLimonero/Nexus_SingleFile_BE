import { Component } from '@angular/core';
import { AppLayoutService } from '../../core/services/app-layout.service';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RouterOutlet } from '@angular/router';
import { LayoutConfigService } from '../../core/layout/layout-config.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { SidenavComponent } from '../components/sidenav/sidenav.component';
import { ToolbarComponent } from '../components/toolbar/toolbar.component';
import { FooterComponent } from '../components/footer/footer.component';
import { QuickpanelComponent } from '../components/quickpanel/quickpanel.component';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { AppProgressBarComponent } from '../components/app-progress-bar/app-progress-bar.component';
import { BaseLayoutComponent } from '../base-layout/base-layout.component';
import { AppLayoutConfig } from '../../core/layout/layout-config.interface';

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
    AppProgressBarComponent
  ],
  standalone: true
})
export class LayoutComponent {
  config$: Observable<AppLayoutConfig> = this.configService.config$;

  sidenavCollapsed$ = this.layoutService.sidenavCollapsed$;
  sidenavDisableClose$ = true;
  sidenavFixedInViewport$ = false;
  sidenavMode$: Observable<MatDrawerMode> = new Observable(sub => sub.next('side'));
  sidenavOpen$ = new Observable<boolean>(sub => sub.next(true));
  quickpanelOpen$ = this.layoutService.quickpanelOpen$;

  constructor(
    private readonly layoutService: AppLayoutService,
    private readonly configService: LayoutConfigService
  ) {}

  onSidenavClosed(): void {
    this.layoutService.closeSidenav();
  }

  onQuickpanelClosed(): void {
    this.layoutService.closeQuickpanel();
  }
}
