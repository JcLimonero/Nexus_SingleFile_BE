import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';

import { ReportesCumplimientoService, ReporteCumplimientoDashboard, ExpedienteAlertaPld, ResumenRazonSocialAgencia, DocumentosPendientesAgencia, DocumentosPendientesGrupo, ExpedienteSinBeneficiario } from '../../../core/services/reportes-cumplimiento.service';
import { DefaultAgencyService } from '../../../core/services/default-agency.service';
import { CompanyService, Company } from '../../../core/services/company.service';

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
    MatInputModule,
    MatTooltipModule,
    MatTabsModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatMenuModule,
    MatCheckboxModule
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
  /** Documentos agrupados por razón social (calculado al recibir datos) */
  documentosPorRazonSocial: { razonSocial: string; agencias: DocumentosPendientesAgencia[]; totalRazonSocial: number }[] = [];
  loadingSinBeneficiario = false;
  expedientesSinBeneficiario: ExpedienteSinBeneficiario[] = [];
  dataSourceSinBeneficiario = new MatTableDataSource<ExpedienteSinBeneficiario>([]);
  displayedColumnsSinBeneficiario = ['ndPedido', 'cliente', 'tipoCliente', 'agencia', 'proceso', 'fase', 'registro'];
  pageSizeSinBeneficiario = 10;
  pageIndexSinBeneficiario = 0;
  totalSinBeneficiario = 0;
  pageSizeOptionsSinBeneficiario = [10, 25, 50, 100];
  loadingSinAviso = false;
  expedientesSinAviso: ExpedienteSinBeneficiario[] = [];
  dataSourceSinAviso = new MatTableDataSource<ExpedienteSinBeneficiario>([]);
  pageSizeSinAviso = 10;
  pageIndexSinAviso = 0;
  totalSinAviso = 0;
  pageSizeOptionsSinAviso = [10, 25, 50, 100];

  agencies: { id: number; name: string; id_company?: number }[] = [];
  companies: Company[] = [];
  filterCompania: number | null = null;
  selectedAgencyIds: number[] = [];
  filterAnio: number | null = new Date().getFullYear();
  aniosDisponibles: number[] = [new Date().getFullYear() + 1, new Date().getFullYear(), new Date().getFullYear() - 1, new Date().getFullYear() - 2];

  displayedColumnsExpedientes = ['ndCliente', 'cliente', 'totalMonto', 'anio'];
  dataSourceExpedientes = new MatTableDataSource<ExpedienteAlertaPld>([]);

  constructor(
    private reportesService: ReportesCumplimientoService,
    private defaultAgencyService: DefaultAgencyService,
    private companyService: CompanyService,
    private snackBar: MatSnackBar
  ) {}

  get agenciesFiltradas(): { id: number; name: string; id_company?: number }[] {
    if (!this.filterCompania) return this.agencies;
    const idComp = Number(this.filterCompania);
    return this.agencies.filter(a => {
      const aId = a.id_company ?? (a as any).IdCompany ?? (a as any).idCompany;
      if (aId == null || aId === '') return false;
      return Number(aId) === idComp;
    });
  }

  get agenciaSelectorLabel(): string {
    const list = this.agenciesFiltradas;
    if (list.length === 0) return this.filterCompania ? 'Sin agencias para esta razón social' : 'No hay agencias';
    if (this.selectedAgencyIds.length === 0) return 'Todas';
    const allSelected = list.every(a => this.selectedAgencyIds.includes(a.id)) && this.selectedAgencyIds.length === list.length;
    return allSelected ? `Todas (${list.length})` : `${this.selectedAgencyIds.length} agencia(s)`;
  }

  get isAllAgenciesSelected(): boolean {
    const list = this.agenciesFiltradas;
    return list.length > 0 && list.every(a => this.selectedAgencyIds.includes(a.id));
  }

  get isSomeAgenciesSelected(): boolean {
    const list = this.agenciesFiltradas;
    const selectedInList = list.filter(a => this.selectedAgencyIds.includes(a.id)).length;
    return selectedInList > 0 && selectedInList < list.length;
  }

  toggleTodos(checked: boolean): void {
    const list = this.agenciesFiltradas;
    if (checked) {
      const idsToAdd = list.map(a => a.id).filter(id => !this.selectedAgencyIds.includes(id));
      this.selectedAgencyIds = [...this.selectedAgencyIds, ...idsToAdd];
    } else {
      const idsToRemove = list.map(a => a.id);
      this.selectedAgencyIds = this.selectedAgencyIds.filter(id => !idsToRemove.includes(id));
    }
    this.onFilterChange();
  }

  toggleAgency(agencyId: number, checked: boolean): void {
    if (checked) {
      if (!this.selectedAgencyIds.includes(agencyId)) {
        this.selectedAgencyIds = [...this.selectedAgencyIds, agencyId];
      }
    } else {
      this.selectedAgencyIds = this.selectedAgencyIds.filter(id => id !== agencyId);
    }
    this.onFilterChange();
  }

  isAgencySelected(agencyId: number): boolean {
    return this.selectedAgencyIds.includes(agencyId);
  }

  getCompanyName(c: Company): string {
    const rec = c as unknown as Record<string, unknown>;
    const raw = rec['Name'] ?? rec['name'] ?? rec['company_name'];
    return raw != null ? String(raw) : '';
  }

  getCompanyId(c: Company): number {
    const rec = c as unknown as Record<string, unknown>;
    const raw = rec['Id'] ?? rec['id'];
    return typeof raw === 'number' ? raw : Number(raw) || 0;
  }

  ngOnInit(): void {
    this.loadAgencies();
    this.loadCompanies();
    this.loadDashboard();
    this.loadExpedientesAlerta();
    this.loadResumenPorAgencia();
    this.loadDocumentosPendientes();
    this.loadExpedientesSinBeneficiario();
    this.loadExpedientesSinAviso();
  }

  loadAgencies(): void {
    this.defaultAgencyService.obtenerAgencias(true).subscribe({
      next: (agencias) => {
        this.agencies = agencias.map(a => {
          const aAny = a as any;
          return {
            id: aAny.id ?? aAny.Id,
            name: aAny.name ?? aAny.Name,
            id_company: aAny.id_company ?? aAny.IdCompany ?? aAny.idCompany
          };
        });
      },
      error: () => {}
    });
  }

  loadCompanies(): void {
    this.companyService.getCompanies().subscribe({
      next: (res) => {
        if (res.success && res.data?.companies) {
          const raw = res.data.companies as unknown as Array<Record<string, unknown>>;
          this.companies = raw.map((c) => ({
            Id: (c['Id'] ?? c['id']) as number,
            Name: String(c['Name'] ?? c['name'] ?? c['company_name'] ?? '')
          }));
        }
      }
    });
  }

  loadDashboard(): void {
    this.loadingDashboard = true;
    this.reportesService.getDashboard({ idCompany: this.filterCompania ?? undefined }).subscribe({
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
      idAgencies: this.selectedAgencyIds.length ? this.selectedAgencyIds : undefined,
      idCompany: this.filterCompania ?? undefined,
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
      idAgencies: this.selectedAgencyIds.length ? this.selectedAgencyIds : undefined,
      idCompany: this.filterCompania ?? undefined,
      anio: this.filterAnio ?? undefined,
      limit: this.pageSizeSinAviso,
      offset: this.pageIndexSinAviso * this.pageSizeSinAviso
    }).subscribe({
      next: (res) => {
        if (res.success && res.data?.expedientes) {
          this.expedientesSinAviso = res.data.expedientes;
          this.dataSourceSinAviso.data = res.data.expedientes;
          this.totalSinAviso = res.data.total ?? 0;
        } else {
          this.expedientesSinAviso = [];
          this.dataSourceSinAviso.data = [];
          this.totalSinAviso = 0;
          if (res.message) {
            this.snackBar.open(res.message, 'Cerrar', { duration: 6000 });
          }
        }
        this.loadingSinAviso = false;
      },
      error: (err) => {
        this.expedientesSinAviso = [];
        this.dataSourceSinAviso.data = [];
        this.totalSinAviso = 0;
        this.loadingSinAviso = false;
        this.snackBar.open(err?.error?.message || err?.message || 'Error al cargar expedientes sin aviso', 'Cerrar', { duration: 6000 });
      }
    });
  }

  onPageChangeSinAviso(event: PageEvent): void {
    this.pageSizeSinAviso = event.pageSize;
    this.pageIndexSinAviso = event.pageIndex;
    this.loadExpedientesSinAviso();
  }

  loadExpedientesSinBeneficiario(): void {
    this.loadingSinBeneficiario = true;
    this.reportesService.getExpedientesSinBeneficiario({
      idAgencies: this.selectedAgencyIds.length ? this.selectedAgencyIds : undefined,
      idCompany: this.filterCompania ?? undefined,
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
      idAgencies: this.selectedAgencyIds.length ? this.selectedAgencyIds : undefined,
      idCompany: this.filterCompania ?? undefined
    }).subscribe({
      next: (res) => {
        if (res.success && res.data?.grupos) {
          const grupos = res.data.grupos as DocumentosPendientesGrupo[];
          this.documentosPendientes = grupos.map(g => ({
            idAgency: g.idAgency,
            nombreAgencia: g.nombreAgencia,
            porEstatus: g.porEstatus,
            total: g.total
          }));
          this.documentosPorRazonSocial = this.agruparDocumentosPorRazonSocial(grupos);
        } else {
          this.documentosPendientes = [];
          this.documentosPorRazonSocial = [];
        }
        this.loadingDocumentos = false;
      },
      error: () => {
        this.documentosPendientes = [];
        this.documentosPorRazonSocial = [];
        this.loadingDocumentos = false;
      }
    });
  }

  private agruparDocumentosPorRazonSocial(grupos: DocumentosPendientesGrupo[]): { razonSocial: string; agencias: DocumentosPendientesAgencia[]; totalRazonSocial: number }[] {
    const map = new Map<string, { agencias: DocumentosPendientesAgencia[]; total: number }>();
    for (const g of grupos) {
      const key = g.razonSocial;
      if (!map.has(key)) {
        map.set(key, { agencias: [], total: 0 });
      }
      const entry = map.get(key)!;
      entry.agencias.push({
        idAgency: g.idAgency,
        nombreAgencia: g.nombreAgencia,
        porEstatus: g.porEstatus,
        total: g.total
      });
      entry.total += g.total;
    }
    return Array.from(map.entries()).map(([razonSocial, { agencias, total }]) => ({
      razonSocial,
      agencias: agencias.sort((a, b) => a.nombreAgencia.localeCompare(b.nombreAgencia)),
      totalRazonSocial: total
    })).sort((a, b) => a.razonSocial.localeCompare(b.razonSocial));
  }

  loadResumenPorAgencia(): void {
    this.loadingResumen = true;
    this.reportesService.getResumenPorAgencia({
      idAgencies: this.selectedAgencyIds.length ? this.selectedAgencyIds : undefined,
      idCompany: this.filterCompania ?? undefined,
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
    if (this.filterCompania && this.selectedAgencyIds.length) {
      const validIds = new Set(this.agenciesFiltradas.map(a => a.id));
      this.selectedAgencyIds = this.selectedAgencyIds.filter(id => validIds.has(id));
    }
    this.loadDashboard();
    this.loadExpedientesAlerta();
    this.loadResumenPorAgencia();
    this.loadDocumentosPendientes();
    this.pageIndexSinBeneficiario = 0;
    this.pageIndexSinAviso = 0;
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
