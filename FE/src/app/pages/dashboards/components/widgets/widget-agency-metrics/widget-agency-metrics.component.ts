import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, takeUntil } from 'rxjs';
import { AnalyticsService } from '../../../../../core/services/analytics.service';

export interface AgencyMetrics {
  todayCases: number;
  monthlyCases: number;
  totalCases: number;
  totalUsers: number;
  monthlyAgencyCases: number;
  monthlyName: string;
}

@Component({
  selector: 'vex-widget-agency-metrics',
  templateUrl: './widget-agency-metrics.component.html',
  styleUrls: ['./widget-agency-metrics.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule
  ]
})
export class WidgetAgencyMetricsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() agencyId: number | null = null;
  @Input() showDetails = true;
  @Input() compact = false;

  agencyMetrics: AgencyMetrics | null = null;
  loading = true;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.loadAgencyMetrics();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['agencyId'] && !changes['agencyId'].firstChange) {
      this.loadAgencyMetrics();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadAgencyMetrics(): void {
    this.loading = true;
    this.error = null;

    // Solo aplicar filtro de agencia, ignorar filtros de fecha
    const filters = this.agencyId ? { agencyId: this.agencyId } : undefined;
    
    console.log('Loading agency metrics with filters:', filters);
    console.log('Current agencyId:', this.agencyId);

    this.analyticsService.getAgencyMetrics(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (metrics) => {
          console.log('Received agency metrics:', metrics);
          this.agencyMetrics = metrics;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading agency metrics:', error);
          this.error = 'Error al cargar métricas de agencia';
          this.loading = false;
        }
      });
  }

  refresh(): void {
    this.loadAgencyMetrics();
  }

  getMonthName(): string {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[new Date().getMonth()];
  }
}
