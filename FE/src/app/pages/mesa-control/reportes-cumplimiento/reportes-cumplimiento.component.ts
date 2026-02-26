import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';

import { ReportesCumplimientoService, ReporteCumplimientoDashboard, ExpedienteAlertaPld, ResumenRazonSocialAgencia, DocumentosPendientesAgencia, ExpedienteSinBeneficiario } from '../../../core/services/reportes-cumplimiento.service';
import { DefaultAgencyService } from '../../../core/services/default-agency.service';

@Component({
  selector: 'app-reportes-cumplimiento',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatTabsModule,
    MatExpansionModule,
    MatPaginatorModule
  ],
  templateUrl: './reportes-cumplimiento.component.html',
  styleUrls: ['./reportes-cumplimiento.component.scss']
})
export class ReportesCumplimientoComponent implements OnInit {
  dashboard: ReporteCumplimientoDashboard | null = null;
  loadingDashboard = false;
  loadingExpedientes = false;
  loadingResumen = false;

  expedientesAlerta: ExpedienteAlertaPld[] = [];
  resumenGrupos: ResumenRazonSocialAgencia[] = [];
  /** Resumen agrupado por razón social (calculado al recibir datos, no en getter para evitar loop) */
  resumenPorRazonSocial: { razonSocial: string; agencias: ResumenRazonSocialAgencia[]; totalRazonSocial: number }[] = [];
  loadingDocumentos = false;
  documentosPendientes: DocumentosPendientesAgencia[] = [];
  loadingSinBeneficiario = false;
  expedientesSinBeneficiario: ExpedienteSinBeneficiario[] = [];
  dataSourceSinBeneficiario = new MatTableDataSource<ExpedienteSinBeneficiario>([]);
  displayedColumnsSinBeneficiario = ['ndPedido', 'cliente', 'tipoCliente', 'agencia', 'proceso', 'fase', 'registro'];
  pageSizeSinBeneficiario = 25;
  pageIndexSinBeneficiario = 0;
  totalSinBeneficiario = 0;
  pageSizeOptionsSinBeneficiario = [10, 25, 50, 100];
  loadingSinAviso = false;
  expedientesSinAviso: ExpedienteSinBeneficiario[] = [];
  dataSourceSinAviso = new MatTableDataSource<ExpedienteSinBeneficiario>([]);

  agencies: { Id: number; Name: string }[] = [];
  filterAgency: number | null = null;
  filterAnio: number | null = null;
  aniosDisponibles: number[] = [new Date().getFullYear() + 1, new Date().getFullYear(), new Date().getFullYear() - 1, new Date().getFullYear() - 2];

  displayedColumnsExpedientes = ['ndCliente', 'cliente', 'totalMonto', 'anio'];
  dataSourceExpedientes = new MatTableDataSource<ExpedienteAlertaPld>([]);

  constructor(
    private reportesService: ReportesCumplimientoService,
    private defaultAgencyService: DefaultAgencyService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAgencies();
    this.loadDashboard();
    this.loadExpedientesAlerta();
    this.loadResumenPorAgencia();
    this.loadDocumentosPendientes();
    this.loadExpedientesSinBeneficiario();
  }

  loadAgencies(): void {
    this.defaultAgencyService.obtenerAgencias().subscribe({
      next: (agencias) => {
        this.agencies = agencias.map(a => ({ Id: a.Id, Name: a.Name }));
      },
      error: () => {}
    });
  }

  loadDashboard(): void {
    this.loadingDashboard = true;
    this.reportesService.getDashboard().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.dashboard = res.data;
        }
        this.loadingDashboard = false;
      },
      error: () => {
        this.loadingDashboard = false;
      }
    });
  }

  loadExpedientesAlerta(): void {
    this.loadingExpedientes = true;
    this.reportesService.getExpedientesAlertaPld({
      idAgency: this.filterAgency ?? undefined,
      limit: 100,
      offset: 0
    }).subscribe({
      next: (res) => {
        if (res.success && res.data?.expedientes) {
          this.expedientesAlerta = res.data.expedientes;
          this.dataSourceExpedientes.data = res.data.expedientes;
        }
        this.loadingExpedientes = false;
      },
      error: () => {
        this.loadingExpedientes = false;
      }
    });
  }

  loadExpedientesSinAviso(): void {
    this.loadingSinAviso = true;
    this.reportesService.getExpedientesSinAviso({
      idAgency: this.filterAgency ?? undefined,
      anio: this.filterAnio ?? undefined
    }).subscribe({
      next: (res) => {
        if (res.success && res.data?.expedientes) {
          this.expedientesSinAviso = res.data.expedientes;
          this.dataSourceSinAviso.data = res.data.expedientes;
        } else {
          this.expedientesSinAviso = [];
          this.dataSourceSinAviso.data = [];
          if (res.message) {
            this.snackBar.open(res.message, 'Cerrar', { duration: 6000 });
          }
        }
        this.loadingSinAviso = false;
      },
      error: (err) => {
        this.expedientesSinAviso = [];
        this.dataSourceSinAviso.data = [];
        this.loadingSinAviso = false;
        this.snackBar.open(err?.error?.message || err?.message || 'Error al cargar expedientes sin aviso', 'Cerrar', { duration: 6000 });
      }
    });
  }

  loadExpedientesSinBeneficiario(): void {
    this.loadingSinBeneficiario = true;
    this.reportesService.getExpedientesSinBeneficiario({
      idAgency: this.filterAgency ?? undefined,
      anio: this.filterAnio ?? undefined,
      limit: this.pageSizeSinBeneficiario,
      offset: this.pageIndexSinBeneficiario * this.pageSizeSinBeneficiario
    }).subscribe({
      next: (res) => {
        if (res.success && res.data?.expedientes) {
          this.expedientesSinBeneficiario = res.data.expedientes;
          this.dataSourceSinBeneficiario.data = res.data.expedientes;
          this.totalSinBeneficiario = res.data.total ?? 0;
        } else {
          this.expedientesSinBeneficiario = [];
          this.dataSourceSinBeneficiario.data = [];
          this.totalSinBeneficiario = 0;
        }
        this.loadingSinBeneficiario = false;
      },
      error: () => {
        this.expedientesSinBeneficiario = [];
        this.dataSourceSinBeneficiario.data = [];
        this.totalSinBeneficiario = 0;
        this.loadingSinBeneficiario = false;
      }
    });
  }

  onPageChangeSinBeneficiario(event: PageEvent): void {
    this.pageSizeSinBeneficiario = event.pageSize;
    this.pageIndexSinBeneficiario = event.pageIndex;
    this.loadExpedientesSinBeneficiario();
  }

  loadDocumentosPendientes(): void {
    this.loadingDocumentos = true;
    this.reportesService.getDocumentosPendientes({
      idAgency: this.filterAgency ?? undefined
    }).subscribe({
      next: (res) => {
        if (res.success && res.data?.agencias) {
          this.documentosPendientes = res.data.agencias;
        } else {
          this.documentosPendientes = [];
        }
        this.loadingDocumentos = false;
      },
      error: () => {
        this.documentosPendientes = [];
        this.loadingDocumentos = false;
      }
    });
  }

  loadResumenPorAgencia(): void {
    this.loadingResumen = true;
    this.reportesService.getResumenPorAgencia({
      idAgency: this.filterAgency ?? undefined,
      anio: this.filterAnio ?? undefined
    }).subscribe({
      next: (res) => {
        if (res.success && res.data?.grupos) {
          this.resumenGrupos = res.data.grupos;
          this.resumenPorRazonSocial = this.agruparPorRazonSocial(res.data.grupos);
        } else {
          this.resumenPorRazonSocial = [];
        }
        this.loadingResumen = false;
      },
      error: () => {
        this.resumenPorRazonSocial = [];
        this.loadingResumen = false;
      }
    });
  }

  private agruparPorRazonSocial(grupos: ResumenRazonSocialAgencia[]): { razonSocial: string; agencias: ResumenRazonSocialAgencia[]; totalRazonSocial: number }[] {
    const map = new Map<string, { agencias: ResumenRazonSocialAgencia[]; total: number }>();
    for (const g of grupos) {
      const key = g.razonSocial;
      if (!map.has(key)) {
        map.set(key, { agencias: [], total: 0 });
      }
      const entry = map.get(key)!;
      entry.agencias.push(g);
      entry.total += g.total;
    }
    return Array.from(map.entries()).map(([razonSocial, { agencias, total }]) => ({
      razonSocial,
      agencias: agencias.sort((a, b) => a.nombreAgencia.localeCompare(b.nombreAgencia)),
      totalRazonSocial: total
    })).sort((a, b) => a.razonSocial.localeCompare(b.razonSocial));
  }

  onFilterChange(): void {
    this.loadExpedientesAlerta();
    this.loadResumenPorAgencia();
    this.loadDocumentosPendientes();
    this.pageIndexSinBeneficiario = 0;
    this.loadExpedientesSinBeneficiario();
    this.loadExpedientesSinAviso();
  }

  formatDate(value: string): string {
    if (!value) return '-';
    const d = new Date(value);
    return isNaN(d.getTime()) ? value : d.toLocaleDateString('es-MX');
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
  }
}
