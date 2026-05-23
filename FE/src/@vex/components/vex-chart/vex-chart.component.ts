import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
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
export class VexChartComponent implements OnInit, OnChanges, OnDestroy {
  @Input() options: ApexOptions = {};
  @Input() series: ApexAxisChartSeries | ApexNonAxisChartSeries = [];
  @Input() autoUpdateSeries = true;
  public chart?: ApexCharts;
  @ViewChild('chart', { static: true }) private chartElement?: ElementRef;

  // -------------------------------------------------------------------------
  // Diferimiento defensivo del render:
  //
  // ApexCharts mide el contenedor con getBoundingClientRect() en el momento
  // del render. Si el contenedor todavía tiene width/height = 0 (flexbox sin
  // resolver, el `*ngIf` recién se evaluó, o el panel está oculto), Apex
  // calcula NaN para todos sus paths/arcs y genera errores SVG en bucle a
  // través de su animation timer (setTimeout vía polyfills.js).
  //
  // Esos errores no rompen nada visualmente pero saturan la consola y, lo
  // más importante, cada error invoca un stack trace dentro de un timer del
  // zone => cientos de microtasks al segundo => menús que se sienten lentos.
  //
  // Solución: posponer la creación hasta que el contenedor tenga dimensiones
  // reales. Usamos ResizeObserver para reaccionar inmediatamente en cuanto
  // el layout las resuelva, sin polling.
  // -------------------------------------------------------------------------
  private resizeObserver?: ResizeObserver;
  private pendingRender = false;

  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    asapScheduler.schedule(() => {
      this._scheduleCreate();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    asapScheduler.schedule(() => {
      if (
        this.autoUpdateSeries &&
        Object.keys(changes).filter((c) => c !== 'series').length === 0
      ) {
        if (this.chart && this._containerHasSize()) {
          this.chart.updateSeries(this.series, true);
        } else {
          // Si aún no hay chart o el contenedor está en 0px, agendar creación.
          this._scheduleCreate();
        }
        return;
      }

      this._scheduleCreate();
    });
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    if (this.chart) {
      try {
        this.chart.destroy();
      } catch {
        // ignore
      }
      this.chart = undefined;
    }
  }

  public render(): void {
    this.chart?.render();
  }

  private _containerHasSize(): boolean {
    const el = this.chartElement?.nativeElement as HTMLElement | undefined;
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  /**
   * Crea el chart si hay datos y el contenedor tiene tamaño. Si no, instala
   * un ResizeObserver y reintenta en cuanto el contenedor cambie a >0.
   */
  private _scheduleCreate() {
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
      this.resizeObserver?.disconnect();
      this.resizeObserver = undefined;
      this.pendingRender = false;
      return;
    }

    if (!this.chartElement) {
      return;
    }

    if (this._containerHasSize()) {
      this._createElement();
      return;
    }

    // Contenedor sin tamaño todavía: esperar con ResizeObserver en lugar de
    // dejar que Apex renderice con NaN.
    if (this.pendingRender) {
      return;
    }
    this.pendingRender = true;

    this.ngZone.runOutsideAngular(() => {
      if (typeof ResizeObserver === 'undefined') {
        // Fallback: un único requestAnimationFrame.
        requestAnimationFrame(() => {
          this.pendingRender = false;
          if (this._containerHasSize()) {
            this._createElement();
          }
        });
        return;
      }

      this.resizeObserver?.disconnect();
      this.resizeObserver = new ResizeObserver(() => {
        if (this._containerHasSize()) {
          this.pendingRender = false;
          this.resizeObserver?.disconnect();
          this.resizeObserver = undefined;
          this._createElement();
        }
      });
      this.resizeObserver.observe(this.chartElement!.nativeElement);
    });
  }

  private _createElement() {
    this.options.series = this.series;

    if (this.chart) {
      this.chart.destroy();
    }

    this.ngZone.runOutsideAngular(() => {
      if (!this.chartElement) {
        return;
      }

      this.chart = new ApexCharts(
        this.chartElement.nativeElement,
        this.options
      );

      this.render();
    });
  }
}
