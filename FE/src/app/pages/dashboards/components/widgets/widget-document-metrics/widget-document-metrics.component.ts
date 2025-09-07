import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, takeUntil } from 'rxjs';
import { AnalyticsService, DocumentStats } from '../../../../../core/services/analytics.service';

@Component({
  selector: 'vex-widget-document-metrics',
  templateUrl: './widget-document-metrics.component.html',
  styleUrls: ['./widget-document-metrics.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatProgressBarModule,
    MatTooltipModule
  ]
})
export class WidgetDocumentMetricsComponent implements OnInit, OnDestroy {
  @Input() showDetails = true;
  @Input() compact = false;

  documentStats: DocumentStats | null = null;
  loading = true;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.loadDocumentStats();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDocumentStats(): void {
    this.loading = true;
    this.error = null;

    this.analyticsService.getDocumentStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stats) => {
          this.documentStats = stats;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading document stats:', error);
          this.error = 'Error al cargar estadísticas de documentos';
          this.loading = false;
        }
      });
  }

  refresh(): void {
    this.loadDocumentStats();
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'active': 'text-green-600',
      'inactive': 'text-red-600',
      'pending': 'text-yellow-600',
      'completed': 'text-blue-600',
      'rejected': 'text-red-600'
    };
    return colors[status.toLowerCase()] || 'text-gray-600';
  }

  getStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      'active': 'mat:check_circle',
      'inactive': 'mat:cancel',
      'pending': 'mat:schedule',
      'completed': 'mat:done',
      'rejected': 'mat:close'
    };
    return icons[status.toLowerCase()] || 'mat:help';
  }

  getActiveDocumentsCount(): number {
    if (!this.documentStats?.documentsByStatus) return 0;
    const activeStatus = this.documentStats.documentsByStatus.find(s => s.status === 'active');
    return activeStatus?.count || 0;
  }
}
