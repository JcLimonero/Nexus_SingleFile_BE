import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AnalyticsService } from '../../../../../core/services/analytics.service';
import { defaultChartOptions } from '@vex/utils/default-chart-options';
import {
  ApexOptions,
  VexChartComponent
} from '@vex/components/vex-chart/vex-chart.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface AdvisorDistributionData {
  advisorName: string;
  approved: number;
  pending: number;
  rejected: number;
  total: number;
}

@Component({
  selector: 'vex-widget-advisor-distribution',
  templateUrl: './widget-advisor-distribution.component.html',
  styleUrls: ['./widget-advisor-distribution.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    VexChartComponent,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ]
})
export class WidgetAdvisorDistributionComponent implements OnInit, OnDestroy, OnChanges {
  @Input() agencyId: number | null = null;
  @Input() userId: number | null = null;
  @Input() showDetails = true;

  private destroy$ = new Subject<void>();

  advisorData: AdvisorDistributionData[] = [];
  series: any[] = [];
  options: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      stackType: 'normal'
    },
    colors: ['#10b981', '#3b82f6', '#ef4444'],
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        barHeight: '60%'
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return val > 0 ? val.toString() : '';
      }
    },
    tooltip: {
      enabled: true,
      shared: true,
      intersect: false
    },
    xaxis: {
      categories: []
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px'
        }
      }
    },
    legend: {
      show: false
    }
  };

  loading = false;
  error: string | null = null;
  totalCases = 0;
  chartHeight = 350;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['agencyId'] || changes['userId']) {
      this.loadData();
    }
  }

  private loadData(): void {
    this.loading = true;
    this.error = null;

    this.analyticsService.getAdvisorDistribution(this.agencyId?.toString(), this.userId?.toString())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: AdvisorDistributionData[]) => {
          console.log('Datos recibidos:', data); // Debug log
          console.log('Tipo de datos:', typeof data);
          console.log('Es array:', Array.isArray(data));
          console.log('Longitud:', data?.length);
          console.log('Primer elemento:', data?.[0]);
          
          if (data && Array.isArray(data)) {
            this.advisorData = data;
            console.log('advisorData asignado:', this.advisorData);
            this.updateChart();
          } else {
            console.warn('Datos no válidos recibidos:', data);
            this.advisorData = [];
            this.updateChart();
          }
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Error loading advisor distribution data:', error);
          this.error = 'Error al cargar los datos de asesores';
          this.advisorData = [];
          this.updateChart();
          this.loading = false;
        }
      });
  }

  private updateChart(): void {
    console.log('updateChart() llamado');
    console.log('advisorData:', this.advisorData);
    console.log('advisorData type:', typeof this.advisorData);
    console.log('advisorData isArray:', Array.isArray(this.advisorData));
    
    // Validar que advisorData existe y es un array
    if (!this.advisorData || !Array.isArray(this.advisorData) || this.advisorData.length === 0) {
      console.log('Datos vacíos o inválidos, inicializando gráfico vacío');
      this.series = [];
      this.options = {
        ...this.options,
        xaxis: {
          ...this.options.xaxis,
          categories: []
        }
      };
      this.totalCases = 0;
      return;
    }

    try {
      console.log('Procesando datos del gráfico...');
      console.log('Primer elemento advisorData:', this.advisorData[0]);
      
      const categories = this.advisorData.map(item => {
        console.log('Procesando item:', item);
        return item.advisorName || 'Sin nombre';
      });
      console.log('Categories generadas:', categories);
      
      const approvedData = this.advisorData.map(item => item.approved || 0);
      const pendingData = this.advisorData.map(item => item.pending || 0);
      const rejectedData = this.advisorData.map(item => item.rejected || 0);

      console.log('Datos aprobados:', approvedData);
      console.log('Datos pendientes:', pendingData);
      console.log('Datos rechazados:', rejectedData);

      this.totalCases = this.advisorData.reduce((total, advisor) => total + (advisor.total || 0), 0);
      console.log('Total casos:', this.totalCases);

      this.series = [
        {
          name: 'Aprobadas',
          data: approvedData
        },
        {
          name: 'Pendientes',
          data: pendingData
        },
        {
          name: 'Rechazadas',
          data: rejectedData
        }
      ];
      console.log('Series configuradas:', this.series);

      this.options = {
        ...this.options,
        xaxis: {
          ...this.options.xaxis,
          categories: categories
        }
      };
      console.log('Opciones actualizadas:', this.options);
      console.log('Categorías asignadas a xaxis:', this.options.xaxis?.categories);
      
    } catch (error) {
      console.error('Error updating chart:', error);
      this.series = [];
      this.totalCases = 0;
    }
  }

  refresh(): void {
    this.loadData();
  }
}
