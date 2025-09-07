import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, takeUntil } from 'rxjs';
import { AnalyticsService } from '../../../../../core/services/analytics.service';

export interface DistributionMetrics {
  entregados: {
    total: number;
    porcentaje: number;
  };
  canceladas: {
    total: number;
    porcentaje: number;
  };
  proceso: {
    total: number;
    porcentaje: number;
  };
  total: number;
  month: string;
  year: string;
  agency_id: number | null;
}

@Component({
  selector: 'vex-widget-distribution-metrics',
  templateUrl: './widget-distribution-metrics.component.html',
  styleUrls: ['./widget-distribution-metrics.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ]
})
export class WidgetDistributionMetricsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() agencyId: number | null = null;
  @Input() showDetails = true;

  distributionMetrics: DistributionMetrics | null = null;
  loading = true;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.loadDistributionMetrics();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['agencyId'] && !changes['agencyId'].firstChange) {
      this.loadDistributionMetrics();
    }
  }

  private loadDistributionMetrics(): void {
    this.loading = true;
    this.error = null;

    const filters: any = {
      agency_id: this.agencyId
    };

    this.analyticsService.getDistributionMetrics(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (metrics) => {
          console.log('Distribution Metrics:', metrics);
          this.distributionMetrics = metrics;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading distribution metrics:', error);
          this.error = 'Error al cargar métricas de distribución';
          this.loading = false;
        }
      });
  }

  refresh(): void {
    this.loadDistributionMetrics();
  }
}
