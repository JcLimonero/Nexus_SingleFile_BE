import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { ClientesMesaService, ClienteMesa } from '../../../core/services/clientes-mesa.service';
import { DefaultAgencyService } from '../../../core/services/default-agency.service';
import { CompanyService } from '../../../core/services/company.service';
import { ClienteDetalleDialogComponent } from './cliente-detalle-dialog/cliente-detalle-dialog.component';

@Component({
  selector: 'vex-clientes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatDialogModule,
    MatCheckboxModule
  ],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.scss'
})
export class ClientesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  dataSource = new MatTableDataSource<ClienteMesa>([]);
  displayedColumns: string[] = ['ndCliente', 'cliente', 'aml', 'acciones'];

  loading = false;
  searchTerm = '';
  filterAgency: number | null = null;
  filterSoloUmbralAML = false;
  agencies: { Id: number; Name: string }[] = [];
  companies: { Id: number; Name: string }[] = [];

  totalRecords = 0;
  pageSize = 25;
  pageIndex = 0;
  pageSizeOptions = [10, 25, 50, 100];
  /** Umbral PLD configurado (MXN) - viene del backend */
  amlUmbral: number | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private clientesService: ClientesMesaService,
    private defaultAgencyService: DefaultAgencyService,
    private companyService: CompanyService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAgencies();
    this.loadCompanies();
    this.loadClientes();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadAgencies(): void {
    this.defaultAgencyService.obtenerAgencias()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (agencias) => {
          this.agencies = agencias.map(a => ({ Id: a.Id, Name: a.Name }));
          // Selecciona el primer elemento por defecto si hay agencias
          if (this.agencies.length > 0) {
            this.filterAgency = this.agencies[0].Id;
          } else {
            this.filterAgency = null;
          }
          this.cdr.markForCheck();
        }
      });
  }

  private loadCompanies(): void {
    this.companyService.getCompanies()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.success && res.data?.companies) {
            this.companies = res.data.companies.map((c: { Id: number; Name: string }) => ({ Id: c.Id, Name: c.Name }));
            this.cdr.markForCheck();
          }
        }
      });
  }

  loadClientes(): void {
    this.loading = true;
    this.cdr.markForCheck();

    this.clientesService.list({
      search: this.searchTerm || undefined,
      idAgency: this.filterAgency ?? undefined,
      onlyAmlUmbral: this.filterSoloUmbralAML || undefined,
      limit: this.pageSize,
      offset: this.pageIndex * this.pageSize
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.dataSource.data = res.data.clientes;
          this.totalRecords = res.data.total;
          this.amlUmbral = res.data.amlUmbral ?? null;
        } else {
          this.dataSource.data = [];
          this.totalRecords = 0;
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.loading = false;
        this.dataSource.data = [];
        this.totalRecords = 0;
        this.snackBar.open(err?.error?.message || 'Error al cargar clientes', 'Cerrar', { duration: 3000 });
        this.cdr.markForCheck();
      }
    });
  }

  onSearch(): void {
    this.pageIndex = 0;
    this.loadClientes();
  }

  onFilterChange(): void {
    this.pageIndex = 0;
    this.loadClientes();
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadClientes();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filterAgency = null;
    this.filterSoloUmbralAML = false;
    this.pageIndex = 0;
    this.loadClientes();
  }

  refreshData(): void {
    this.loadClientes();
  }

  openDetalle(row: ClienteMesa): void {
    this.dialog.open(ClienteDetalleDialogComponent, {
      width: '800px',
      maxWidth: '95vw',
      data: { idHeaderClient: row.idHeaderClient, cliente: row.cliente, ndCliente: row.ndCliente }
    });
  }

  /** Formatea el umbral PLD para mostrar en tooltips */
  getAmlUmbralFormatted(): string {
    if (this.amlUmbral == null) return '';
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 }).format(this.amlUmbral);
  }

  getPageRange(): string {
    if (this.totalRecords === 0) return '0-0';
    const start = this.pageIndex * this.pageSize + 1;
    const end = Math.min(start + this.pageSize - 1, this.totalRecords);
    return `${start}-${end}`;
  }
}
