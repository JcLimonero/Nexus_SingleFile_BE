import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, of } from 'rxjs';
import { takeUntil, map, catchError } from 'rxjs/operators';
import { AnalyticsService } from '../../../../../core/services/analytics.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface AttentionPeriodData {
  range: string;
  label: string;
  count: number;
  color: string;
}

@Component({
  selector: 'vex-widget-attention-period',
  templateUrl: './widget-attention-period.component.html',
  styleUrls: ['./widget-attention-period.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ]
})
export class WidgetAttentionPeriodComponent implements OnInit, OnDestroy, OnChanges {
  @Input() agencyId: number | null = null;
  @Input() userId: number | null = null;
  @Input() showDetails = true;

  private destroy$ = new Subject<void>();

  attentionData: AttentionPeriodData[] = [];
  loading = false;
  error: string | null = null;
  totalCases = 0;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['agencyId'] || changes['userId']) {
      this.loadData();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  refresh(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading = true;
    this.error = null;

    this.analyticsService.getAttentionPeriodData(this.agencyId?.toString(), this.userId?.toString())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: AttentionPeriodData[]) => {
          console.log('Datos de período de atención recibidos:', data);
          
          if (data && Array.isArray(data)) {
            this.attentionData = data;
            this.totalCases = data.reduce((total, item) => total + item.count, 0);
          } else {
            console.warn('Datos no válidos recibidos:', data);
            this.attentionData = [];
            this.totalCases = 0;
          }
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Error loading attention period data:', error);
          this.error = 'Error al cargar los datos de período de atención';
          this.attentionData = [];
          this.totalCases = 0;
          this.loading = false;
        }
      });
  }

  getPercentage(count: number): number {
    if (this.totalCases === 0) return 0;
    return Math.round((count / this.totalCases) * 100);
  }
}
