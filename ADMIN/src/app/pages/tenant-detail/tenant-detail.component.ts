import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'adm-tenant-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <mat-card class="adm-card">
      <mat-card-content>
        <a mat-button routerLink="/tenants">
          <mat-icon>arrow_back</mat-icon>
          Volver
        </a>
        <h2 style="margin-top: 16px;">Detalle del tenant #{{ id() }}</h2>
        <p style="color: #666;">
          Próximamente: tabs de Info / Subscription / Config / Status History.
        </p>
      </mat-card-content>
    </mat-card>
  `,
})
export class TenantDetailComponent {
  private readonly route = inject(ActivatedRoute);
  id = () => this.route.snapshot.paramMap.get('id') ?? '?';
}
