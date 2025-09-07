import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, takeUntil } from 'rxjs';
import { AnalyticsService, ProcessStats } from '../../../../../core/services/analytics.service';

@Component({
  selector: 'vex-widget-process-metrics',
  templateUrl: './widget-process-metrics.component.html',
  styleUrls: ['./widget-process-metrics.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatProgressBarModule,
    MatTooltipModule
  ]
})
export class WidgetProcessMetricsComponent implements OnInit, OnDestroy {
  @Input() showDetails = true;
  @Input() compact = false;

  processStats: ProcessStats | null = null;
  loading = true;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.loadProcessStats();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadProcessStats(): void {
    this.loading = true;
    this.error = null;

    this.analyticsService.getProcessStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stats) => {
          this.processStats = stats;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading process stats:', error);
          this.error = 'Error al cargar estadísticas de procesos';
          this.loading = false;
        }
      });
  }

  refresh(): void {
    this.loadProcessStats();
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'active': 'text-green-600',
      'inactive': 'text-red-600',
      'pending': 'text-yellow-600',
      'completed': 'text-blue-600',
      'in_progress': 'text-purple-600',
      'cancelled': 'text-red-600'
    };
    return colors[status.toLowerCase()] || 'text-gray-600';
  }

  getStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      'active': 'mat:play_circle',
      'inactive': 'mat:pause_circle',
      'pending': 'mat:schedule',
      'completed': 'mat:check_circle',
      'in_progress': 'mat:sync',
      'cancelled': 'mat:cancel'
    };
    return icons[status.toLowerCase()] || 'mat:help';
  }

  formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes}m`;
    } else if (minutes < 1440) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes}m`;
    } else {
      const days = Math.floor(minutes / 1440);
      const remainingHours = Math.floor((minutes % 1440) / 60);
      return `${days}d ${remainingHours}h`;
    }
  }

  getCompletedProcessesCount(): number {
    if (!this.processStats?.processesByStatus) return 0;
    const completedStatus = this.processStats.processesByStatus.find(s => s.status === 'completed');
    return completedStatus?.count || 0;
  }
}
