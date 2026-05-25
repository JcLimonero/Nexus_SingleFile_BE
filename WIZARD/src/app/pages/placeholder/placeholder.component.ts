import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'wiz-placeholder',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <mat-card class="wiz-card">
      <mat-card-content>
        <h2 style="display:flex; align-items:center; gap:12px;">
          <mat-icon>construction</mat-icon>
          {{ slug() }}
        </h2>
        <p>
          Este paso del wizard todavía no se ha implementado. Se cubre en una iteración posterior.
        </p>
        <p style="color: #666; font-size: 13px;">
          Slug: <code>{{ slug() }}</code>
        </p>
      </mat-card-content>
    </mat-card>
  `
})
export class PlaceholderComponent {
  private readonly route = inject(ActivatedRoute);
  slug = () => this.route.snapshot.paramMap.get('slug') ?? 'unknown';
}
