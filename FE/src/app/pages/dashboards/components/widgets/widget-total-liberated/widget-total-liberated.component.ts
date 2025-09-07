import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AnalyticsService, TotalLiberatedData } from '../../../../../core/services/analytics.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'vex-widget-total-liberated',
  templateUrl: './widget-total-liberated.component.html',
  styleUrls: ['./widget-total-liberated.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule
  ]
})
export class WidgetTotalLiberatedComponent implements OnInit, OnDestroy {
  @Input() agencyId: number | null = null;
  @Input() userId: number | null = null;

  data: TotalLiberatedData | null = null;
  loading = true;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;
    this.analyticsService.getTotalLiberated(this.agencyId?.toString(), this.userId?.toString())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.data = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading total liberated data:', err);
          this.error = 'Error al cargar datos de expedientes liberados totales.';
          this.loading = false;
        }
      });
  }
}
