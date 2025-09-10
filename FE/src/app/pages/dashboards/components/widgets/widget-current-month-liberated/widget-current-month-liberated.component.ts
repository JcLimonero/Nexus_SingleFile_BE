import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, takeUntil } from 'rxjs';
import { AnalyticsService } from '../../../../../core/services/analytics.service';

export interface CurrentMonthLiberatedData {
  total: number;
  month: string;
  year: number;
}

@Component({
  selector: 'vex-widget-current-month-liberated',
  templateUrl: './widget-current-month-liberated.component.html',
  styleUrls: ['./widget-current-month-liberated.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule
  ]
})
export class WidgetCurrentMonthLiberatedComponent implements OnInit, OnDestroy, OnChanges {
  @Input() agencyId?: number | null;
  @Input() userId?: number | null;

  data: CurrentMonthLiberatedData | null = null;
  loading = true;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['agencyId'] && !changes['agencyId'].firstChange) || 
        (changes['userId'] && !changes['userId'].firstChange)) {
      console.log('🔄 WidgetCurrentMonthLiberated: filtros cambiaron, recargando datos...');
      this.loadData();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;

    this.analyticsService.getCurrentMonthLiberated(
      this.agencyId?.toString(),
      this.userId?.toString()
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.data = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading current month liberated data:', error);
          this.error = 'Error al cargar datos de expedientes liberados';
          this.loading = false;
        }
      });
  }

  getMonthName(): string {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[new Date().getMonth()];
  }
}
