

import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, takeUntil } from 'rxjs';
import { AnalyticsService, AnalyticsFilters } from '../../../../../core/services/analytics.service';

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

  constructor(
    private analyticsService: AnalyticsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAgencyMetrics();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('🏢 AgencyMetrics ngOnChanges called with changes:', changes);
    if (changes['agencyId'] && !changes['agencyId'].firstChange) {
      console.log('🏢 AgencyMetrics: Agency changed, triggering data reload');
      console.log('🏢 AgencyMetrics: New agencyId:', this.agencyId);
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
    const filters: AnalyticsFilters | undefined = this.agencyId ? { agencyId: this.agencyId } : undefined;
    
    console.log('🏢 AgencyMetrics: Loading agency metrics with filters:', filters);
    console.log('🏢 AgencyMetrics: Current agencyId:', this.agencyId);
    console.log('🏢 AgencyMetrics: Filters object:', filters);

    this.analyticsService.getAgencyMetrics(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (metrics) => {
          console.log('🏢 AgencyMetrics: Received metrics:', metrics);
          this.agencyMetrics = metrics;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('🏢 AgencyMetrics: Error loading agency metrics:', error);
          this.error = 'Error al cargar métricas de agencia';
          this.loading = false;
          this.cdr.markForCheck();
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
