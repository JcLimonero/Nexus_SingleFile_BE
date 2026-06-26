import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../core/auth.service';

/**
 * Shell del portal admin (admin.nexfile.app). Branding Nexus Q Tech:
 * toolbar navy con logo SVG y wordmark, exactamente igual que el WIZARD
 * para que el operador sienta una sola superficie unificada.
 */
@Component({
  selector: 'adm-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, MatToolbarModule, MatIconModule, MatButtonModule],
  template: `
    <div class="adm-shell">
      <mat-toolbar color="primary" style="height: 64px; padding: 0 20px;">
        <div style="display:flex; align-items:center; gap:12px;">
          <div class="brand-logo-wrap">
            <img src="assets/logo.svg" alt="Nexus Q Tech" class="brand-logo" />
          </div>
          <div style="line-height: 1.15;">
            <div style="font-weight: 600; font-size: 15px; letter-spacing: 0.2px;">Nexus Q Tech</div>
            <div style="font-size: 10.5px; opacity: 0.7; letter-spacing: 0.6px; text-transform: uppercase;">
              NexFile · Admin
            </div>
          </div>
        </div>
        <nav style="margin-left: 32px; display: flex; gap: 4px;">
          <a mat-button routerLink="/tenants" routerLinkActive="active-link">
            <mat-icon style="font-size:18px; height:18px; width:18px; margin-right:4px;">apartment</mat-icon>
            Tenants
          </a>
        </nav>
        <span style="flex: 1"></span>
        <span style="font-size: 13px; opacity: 0.9; margin-right: 12px;">
          {{ auth.currentUser()?.email ?? '' }}
        </span>
        <button mat-icon-button (click)="logout()" aria-label="Logout" matTooltip="Cerrar sesión">
          <mat-icon>logout</mat-icon>
        </button>
      </mat-toolbar>
      <main class="adm-content">
        <router-outlet></router-outlet>
      </main>
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
  `],
})
export class MainLayoutComponent {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
