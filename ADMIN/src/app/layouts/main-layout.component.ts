import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'adm-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, MatToolbarModule, MatIconModule, MatButtonModule],
  template: `
    <div class="adm-shell">
      <mat-toolbar color="primary">
        <mat-icon style="margin-right: 12px">verified_user</mat-icon>
        <span style="font-weight: 500">NexFile Admin</span>
        <nav style="margin-left: 32px; display: flex; gap: 8px;">
          <a mat-button routerLink="/tenants" routerLinkActive="active-link">Tenants</a>
        </nav>
        <span style="flex: 1"></span>
        <span style="font-size: 14px; opacity: 0.9; margin-right: 12px;">
          {{ auth.currentUser()?.email ?? '' }}
        </span>
        <button mat-icon-button (click)="logout()" aria-label="Logout">
          <mat-icon>logout</mat-icon>
        </button>
      </mat-toolbar>
      <main class="adm-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .active-link { background: rgba(255,255,255,0.15); }
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
