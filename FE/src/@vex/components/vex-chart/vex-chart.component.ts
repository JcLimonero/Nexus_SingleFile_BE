import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { asapScheduler } from 'rxjs';
// @ts-ignore
import ApexCharts from 'apexcharts';

export interface ApexOptions {
  annotations?: ApexAnnotations;
  chart?: ApexChart;
  colors?: any[];
  dataLabels?: ApexDataLabels;
  fill?: ApexFill;
  grid?: ApexGrid;
  labels?: string[] | number[];
  legend?: ApexLegend;
  markers?: ApexMarkers;
  noData?: ApexNoData;
  plotOptions?: ApexPlotOptions;
  responsive?: ApexResponsive[];
  series?: ApexAxisChartSeries | ApexNonAxisChartSeries;
  states?: ApexStates;
  stroke?: ApexStroke;
  subtitle?: ApexTitleSubtitle;
  theme?: ApexTheme;
  title?: ApexTitleSubtitle;
  tooltip?: ApexTooltip;
  xaxis?: ApexXAxis;
  yaxis?: ApexYAxis | ApexYAxis[];
}

@Component({
  selector: 'vex-chart',
  template: ` <div #chart></div> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class VexChartComponent implements OnInit, OnChanges {
  @Input() options: ApexOptions = {};
  @Input() series: ApexAxisChartSeries | ApexNonAxisChartSeries = [];
  @Input() autoUpdateSeries = true;
  public chart?: ApexCharts;
  @ViewChild('chart', { static: true }) private chartElement?: ElementRef;

  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    asapScheduler.schedule(() => {
      this._createElement();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    asapScheduler.schedule(() => {
      if (
        this.autoUpdateSeries &&
        Object.keys(changes).filter((c) => c !== 'series').length === 0
      ) {
        this.chart?.updateSeries(this.series, true);
        return;
      }

      this._createElement();
    });
  }

  public render(): void {
    this.chart?.render();
  }

  private _createElement() {
    const hasSeries =
      this.series &&
      Array.isArray(this.series) &&
      this.series.length > 0 &&
      (typeof this.series[0] === 'number' ||
        (this.series[0] && Array.isArray((this.series[0] as any).data) && (this.series[0] as any).data.length > 0));

    if (!hasSeries) {
      if (this.chart) {
        this.chart.destroy();
        this.chart = undefined;
      }
      return;
    }

    this.options.series = this.series;

    if (this.chart) {
      this.chart.destroy();
    }

    this.ngZone.runOutsideAngular(() => {
      if (!this.chartElement) {
        return;
      }

      const el: HTMLElement = this.chartElement.nativeElement;

      // NaN guard: si al instanciar el container tiene size 0 (común cuando el
      // chart vive dentro de un *ngIf que acaba de transicionar a true antes
      // de que flex compute layout), esperamos un frame de animación. Si
      // sigue en 0, instalamos ResizeObserver como backstop pero también
      // intentamos render — Apex puede manejar resize después.
      const tryRender = () => {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          this._instantiateChart(el);
          return true;
        }
        return false;
      };

      if (tryRender()) return;

      // Esperar al siguiente frame para que layout flex compute
      requestAnimationFrame(() => {
        if (tryRender()) return;

        // Último recurso: render forzado + ResizeObserver para redibujar
        // si el container cambia de tamaño después.
        this._instantiateChart(el);
        if (typeof ResizeObserver !== 'undefined') {
          const ro = new ResizeObserver((entries) => {
            for (const entry of entries) {
              const cr = entry.contentRect;
              if (cr.width > 0 && cr.height > 0) {
                ro.disconnect();
                // Re-render por si el primer intento dibujó vacío
                this.chart?.render();
                return;
              }
            }
          });
          ro.observe(el);
        }
      });
    });
  }

  private _instantiateChart(el: HTMLElement) {
    this.chart = new ApexCharts(el, this.options);
    this.render();
  }
}
