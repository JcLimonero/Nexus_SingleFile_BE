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
import { FormsModule } from '@angular/forms';

import { ReportesCumplimientoService, ReporteCumplimientoDashboard, ExpedienteAlertaPld, ResumenRazonSocialAgencia } from '../../../core/services/reportes-cumplimiento.service';
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
    MatExpansionModule
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

  agencies: { Id: number; Name: string }[] = [];
  filterAgency: number | null = null;
  filterAnio = new Date().getFullYear();
  aniosDisponibles: number[] = [new Date().getFullYear() + 1, new Date().getFullYear(), new Date().getFullYear() - 1, new Date().getFullYear() - 2];

  displayedColumnsExpedientes = ['ndCliente', 'cliente', 'totalMonto', 'anio'];
  dataSourceExpedientes = new MatTableDataSource<ExpedienteAlertaPld>([]);

  constructor(
    private reportesService: ReportesCumplimientoService,
    private defaultAgencyService: DefaultAgencyService
  ) {}

  ngOnInit(): void {
    this.loadAgencies();
    this.loadDashboard();
    this.loadExpedientesAlerta();
    this.loadResumenPorAgencia();
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

  loadResumenPorAgencia(): void {
    this.loadingResumen = true;
    this.reportesService.getResumenPorAgencia({
      idAgency: this.filterAgency ?? undefined,
      anio: this.filterAnio
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
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
  }
}
