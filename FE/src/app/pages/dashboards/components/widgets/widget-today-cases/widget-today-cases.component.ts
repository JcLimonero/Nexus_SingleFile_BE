import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AnalyticsService } from '../../../../../core/services/analytics.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'vex-widget-today-cases',
  templateUrl: './widget-today-cases.component.html',
  styleUrls: ['./widget-today-cases.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule
  ]
})
export class WidgetTodayCasesComponent implements OnInit, OnDestroy {
  @Input() agencyId?: number | null;

  todayCases: number = 0;
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

    this.analyticsService.getAgencyMetrics({ agencyId: this.agencyId || undefined })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.todayCases = data.todayCases;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading today cases data:', error);
          this.error = 'Error al cargar datos de expedientes del día';
          this.loading = false;
        }
      });
  }
}
