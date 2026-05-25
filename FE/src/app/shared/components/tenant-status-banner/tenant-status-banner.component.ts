import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TenantStatusService } from '../../../core/services/tenant-status.service';

/**
 * Persistent banner that surfaces the current tenant license state above the
 * main app shell. Stays hidden when there's no notice (active tenant).
 */
@Component({
  selector: 'app-tenant-status-banner',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    @if (status.suspended()) {
      <div class="banner banner-suspended">
        <mat-icon>block</mat-icon>
        <span>
          Cuenta suspendida — los APIs no responden. Contacta a soporte.
        </span>
      </div>
    } @else if (status.readonly()) {
      <div class="banner banner-readonly">
        <mat-icon>lock</mat-icon>
        <span>
          Cuenta en modo solo-lectura. No puedes crear ni modificar registros hasta regularizar el pago.
        </span>
      </div>
    } @else if (status.graceDaysLeft() !== null) {
      <div class="banner banner-grace">
        <mat-icon>schedule</mat-icon>
        <span>
          Periodo de gracia: {{ status.graceDaysLeft() }}
          {{ status.graceDaysLeft() === 1 ? 'día restante' : 'días restantes' }}
          antes de que la cuenta pase a modo solo-lectura.
        </span>
      </div>
    }
  `,
  styles: [`
    .banner {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      font-size: 13px;
      font-weight: 500;
    }
    .banner-grace { background: #fff8e1; color: #ff8f00; }
    .banner-readonly { background: #fff3e0; color: #e65100; }
    .banner-suspended { background: #ffebee; color: #c62828; }
    .banner mat-icon { font-size: 18px; height: 18px; width: 18px; }
  `],
})
export class TenantStatusBannerComponent {
  readonly status = inject(TenantStatusService);
}
