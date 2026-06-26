import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { TenantSessionService } from './state/tenant-session.service';

interface NavItem { route: string; label: string; icon?: string }

/**
 * Shell con sidenav permanente. Marca Nexus Q Tech: navy + cyan, logo SVG
 * en el toolbar. Las secciones del sidebar son colapsables (signals
 * provisioningOpen / adminOpen) — ambas arrancan cerradas por petición
 * UX; al navegar a una ruta de uno de los grupos, la sección
 * correspondiente se expande automáticamente para mostrar el item activo.
 */
@Component({
  selector: 'wiz-root',
  standalone: true,
  imports: [
    CommonModule, RouterOutlet, RouterLink, RouterLinkActive,
    MatToolbarModule, MatIconModule, MatSidenavModule, MatListModule, MatButtonModule,
  ],
  template: `
    <div class="wiz-shell" style="height: 100vh; display:flex; flex-direction:column;">
      <mat-toolbar color="primary" style="height: 64px; padding: 0 16px;">
        <div style="display:flex; align-items:center; gap:12px;">
          <div class="brand-logo-wrap">
            <img src="assets/logo.svg" alt="Nexus Q Tech" class="brand-logo" />
          </div>
          <div style="line-height: 1.15;">
            <div style="font-weight: 600; font-size: 15px; letter-spacing: 0.2px;">Nexus Q Tech</div>
            <div style="font-size: 10.5px; opacity: 0.7; letter-spacing: 0.6px; text-transform: uppercase;">
              NexFile · Wizard
            </div>
          </div>
        </div>
        <span style="flex: 1"></span>
        <span style="font-size: 13px; opacity: 0.85" *ngIf="currentLabel()">
          {{ currentLabel() }}
        </span>
      </mat-toolbar>

      <mat-sidenav-container style="flex: 1; min-height: 0;">
        <mat-sidenav mode="side" opened style="width: 240px; padding: 8px 0;">

          <!-- Provisioning (colapsable) -->
          <button class="section-header" (click)="provisioningOpen.set(!provisioningOpen())">
            <mat-icon class="chevron" [class.open]="provisioningOpen()">chevron_right</mat-icon>
            <span>Provisioning</span>
            <span class="count">{{ provisioningSteps.length }}</span>
          </button>
          @if (provisioningOpen()) {
            <mat-nav-list dense>
              @for (s of provisioningSteps; track s.route) {
                <a mat-list-item
                   [routerLink]="['/', s.route]"
                   routerLinkActive="active-nav"
                   #rla="routerLinkActive">
                  <mat-icon matListItemIcon style="font-size:18px; height:18px; width:18px; opacity:0.7;">
                    {{ s.icon ?? 'chevron_right' }}
                  </mat-icon>
                  <span matListItemTitle style="font-size: 13px;">{{ s.label }}</span>
                </a>
              }
            </mat-nav-list>
          }

          <!-- Administración (colapsable) -->
          <button class="section-header" (click)="adminOpen.set(!adminOpen())" style="margin-top: 4px;">
            <mat-icon class="chevron" [class.open]="adminOpen()">chevron_right</mat-icon>
            <span>Administración</span>
            @if (session.selectedTenant(); as t) {
              <span class="count badge-live" [title]="'Editando ' + t.slug">●</span>
            }
          </button>
          @if (adminOpen()) {
            <mat-nav-list dense>
              <a mat-list-item routerLink="/admin" routerLinkActive="active-nav" [routerLinkActiveOptions]="{exact:true}">
                <mat-icon matListItemIcon style="font-size:18px; height:18px; width:18px; opacity:0.7;">dashboard</mat-icon>
                <span matListItemTitle style="font-size: 13px;">Inicio admin</span>
              </a>
              <a mat-list-item routerLink="/admin/tenants" routerLinkActive="active-nav">
                <mat-icon matListItemIcon style="font-size:18px; height:18px; width:18px; opacity:0.7;">list</mat-icon>
                <span matListItemTitle style="font-size: 13px;">Tenants</span>
              </a>
              @if (session.selectedTenant(); as t) {
                <a mat-list-item [routerLink]="['/admin/tenants', t.id]" routerLinkActive="active-nav">
                  <mat-icon matListItemIcon style="font-size:18px; height:18px; width:18px; color: var(--nexus-cyan);">edit</mat-icon>
                  <span matListItemTitle style="font-size: 13px;">Editando: {{ t.slug }}</span>
                </a>
              }
            </mat-nav-list>
          }
        </mat-sidenav>

        <mat-sidenav-content style="padding: 16px; overflow:auto;">
          <router-outlet></router-outlet>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    .brand-logo-wrap {
      width: 36px; height: 36px;
      border-radius: 8px;
      background: #ffffff;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.18);
    }
    .brand-logo {
      width: 28px; height: 28px;
      display: block;
    }

    .section-header {
      width: calc(100% - 16px);
      margin: 0 8px;
      padding: 8px 10px;
      display: flex; align-items: center; gap: 8px;
      background: transparent;
      border: 0;
      border-radius: 6px;
      cursor: pointer;
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 1.2px;
      color: var(--nexus-text-muted);
      text-align: left;
      font-family: inherit;
      transition: background 0.12s ease;
    }
    .section-header:hover {
      background: var(--nexus-gray-bg);
      color: var(--nexus-navy);
    }
    .section-header .chevron {
      font-size: 18px; height: 18px; width: 18px;
      transition: transform 0.18s ease;
      color: inherit;
    }
    .section-header .chevron.open {
      transform: rotate(90deg);
    }
    .section-header .count {
      margin-left: auto;
      font-size: 10px;
      background: var(--nexus-gray-bg);
      padding: 1px 7px;
      border-radius: 10px;
      letter-spacing: 0;
      font-weight: 600;
    }
    .section-header .badge-live {
      color: var(--nexus-cyan);
      background: transparent;
      font-size: 14px;
    }
  `],
})
export class AppComponent {
  readonly session = inject(TenantSessionService);
  currentRoute = 'welcome';

  // Ambas secciones arrancan CERRADAS por petición UX. Se expanden
  // automáticamente cuando la ruta actual cae dentro de su scope (ver
  // syncSectionsToRoute()).
  readonly provisioningOpen = signal(false);
  readonly adminOpen = signal(false);

  provisioningSteps: NavItem[] = [
    { route: 'welcome',       label: 'Bienvenida',     icon: 'home' },
    { route: 'central-db',    label: 'Central DB',     icon: 'storage' },
    { route: 'admin-login',   label: 'Super-admin',    icon: 'admin_panel_settings' },
    { route: 'tenant-info',   label: 'Tenant',         icon: 'badge' },
    { route: 'client-group',  label: 'Grupo',          icon: 'group_work' },
    { route: 'companies',     label: 'Razones Soc.',   icon: 'apartment' },
    { route: 'agencies',      label: 'Agencias',       icon: 'business' },
    { route: 'phases',        label: 'Fases',          icon: 'timeline' },
    { route: 'catalogs',      label: 'Catálogos',      icon: 'category' },
    { route: 'admin-user',    label: 'Admin',          icon: 'person' },
    { route: 'branding',      label: 'Branding',       icon: 'palette' },
    { route: 'integrations',  label: 'Integraciones',  icon: 'extension' },
    { route: 'confirm',       label: 'Confirmar',      icon: 'rocket_launch' },
    { route: 'done',          label: 'Listo',          icon: 'check_circle' },
  ];

  constructor(router: Router) {
    router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e: any) => {
      const url = (e.urlAfterRedirects as string).replace(/^#?\/?/, '');
      this.currentRoute = url || 'welcome';
      this.syncSectionsToRoute(this.currentRoute);
    });
  }

  /**
   * Si el usuario navega a una ruta que cae bajo /admin/* o uno de los
   * pasos de provisioning, abre la sección correspondiente. No cierra la
   * otra — el usuario puede tener ambas abiertas a la vez si quiere.
   */
  private syncSectionsToRoute(route: string) {
    if (route.startsWith('admin')) {
      this.adminOpen.set(true);
    }
    const firstSeg = route.split('/')[0];
    if (this.provisioningSteps.some((s) => s.route === firstSeg)) {
      this.provisioningOpen.set(true);
    }
  }

  currentLabel(): string {
    return this.provisioningSteps.find((s) => s.route === this.currentRoute)?.label ?? '';
  }
}
