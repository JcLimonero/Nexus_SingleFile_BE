import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, takeUntil } from 'rxjs';
import { RealTimeAnalyticsService, RealTimeMetric, RealTimeStats } from '../../../../../core/services/real-time-analytics.service';

@Component({
  selector: 'vex-widget-real-time-metrics',
  templateUrl: './widget-real-time-metrics.component.html',
  styleUrls: ['./widget-real-time-metrics.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatTooltipModule
  ]
})
export class WidgetRealTimeMetricsComponent implements OnInit, OnDestroy {
  @Input() showActivityFeed = true;
  @Input() maxFeedItems = 10;

  connectionStatus = false;
  realTimeStats: RealTimeStats | null = null;
  recentActivity: RealTimeMetric[] = [];
  loading = true;

  private destroy$ = new Subject<void>();

  constructor(private realTimeService: RealTimeAnalyticsService) {}

  ngOnInit(): void {
    this.subscribeToServices();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToServices(): void {
    // Suscribirse al estado de conexión
    this.realTimeService.connectionStatus$
      .pipe(takeUntil(this.destroy$))
      .subscribe(status => {
        this.connectionStatus = status;
        this.loading = false;
      });

    // Suscribirse a las métricas en tiempo real
    this.realTimeService.metrics$
      .pipe(takeUntil(this.destroy$))
      .subscribe(metric => {
        this.addToActivityFeed(metric);
      });

    // Suscribirse a las estadísticas
    this.realTimeService.stats$
      .pipe(takeUntil(this.destroy$))
      .subscribe(stats => {
        this.realTimeStats = stats;
      });
  }

  private addToActivityFeed(metric: RealTimeMetric): void {
    this.recentActivity.unshift(metric);
    
    // Mantener solo los últimos elementos
    if (this.recentActivity.length > this.maxFeedItems) {
      this.recentActivity = this.recentActivity.slice(0, this.maxFeedItems);
    }
  }

  toggleConnection(): void {
    if (this.connectionStatus) {
      this.realTimeService.disconnect();
    } else {
      this.realTimeService.connect();
    }
  }

  clearActivityFeed(): void {
    this.recentActivity = [];
  }

  getMetricIcon(type: RealTimeMetric['type']): string {
    const icons = {
      'document': 'mat:description',
      'process': 'mat:settings',
      'user': 'mat:person',
      'system': 'mat:memory'
    };
    return icons[type] || 'mat:help';
  }

  getMetricColor(type: RealTimeMetric['type']): string {
    const colors = {
      'document': 'text-blue-600',
      'process': 'text-purple-600',
      'user': 'text-green-600',
      'system': 'text-orange-600'
    };
    return colors[type] || 'text-gray-600';
  }

  getActionText(action: RealTimeMetric['action']): string {
    const actions = {
      'created': 'Creado',
      'updated': 'Actualizado',
      'deleted': 'Eliminado',
      'status_changed': 'Estado cambiado'
    };
    return actions[action] || action;
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  getConnectionStatusText(): string {
    return this.connectionStatus ? 'Conectado' : 'Desconectado';
  }

  getConnectionStatusColor(): string {
    return this.connectionStatus ? 'text-green-600' : 'text-red-600';
  }

  trackByActivityId(index: number, activity: RealTimeMetric): string {
    return activity.id;
  }
}
