import { Component, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { DefaultAgencyService } from '../../../core/services/default-agency.service';
import { ClienteCredito, CreditoService } from './credito.service';
import { CreditoRelacionDialogComponent } from './credito-relacion-dialog.component';

@Component({
  selector: 'vex-credito',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule
  ],
  templateUrl: './credito.component.html',
  styleUrls: ['./credito.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreditoComponent implements OnInit, OnDestroy {
  agencies: any[] = [];
  selectedAgencyId: number | null = null;
  selectedAgency: any = null;
  agenciesLoading = true;

  searchTerm = '';
  clientes: ClienteCredito[] = [];
  loading = false;
  total = 0;
  pageSize = 20;
  pageIndex = 0;
  displayedColumns = ['ndCliente', 'cliente', 'rfc', 'razonSocial', 'relaciones'];

  private destroy$ = new Subject<void>();

  constructor(
    private snackBar: MatSnackBar,
    private defaultAgencyService: DefaultAgencyService,
    private creditoService: CreditoService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const savedAgencyId = this.defaultAgencyService.getAgenciaSeleccionada();
    if (savedAgencyId !== null) {
      this.selectedAgencyId = savedAgencyId;
    }
    this.loadAgencies();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onAgencyChange(agencyId: number | null): void {
    this.selectedAgencyId = agencyId;
    this.selectedAgency = this.agencies.find(agency => agency.Id === agencyId) || null;
    if (agencyId !== null) {
      this.defaultAgencyService.seleccionarAgencia(agencyId);
    }
    this.pageIndex = 0;
    this.cargarClientes();
  }

  buscar(): void {
    this.pageIndex = 0;
    this.cargarClientes();
  }

  limpiarBusqueda(): void {
    this.searchTerm = '';
    this.buscar();
  }

  onPage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.cargarClientes();
  }

  abrirRelaciones(cliente: ClienteCredito): void {
    if (!this.selectedAgencyId) {
      return;
    }
    const dialogRef = this.dialog.open(CreditoRelacionDialogComponent, {
      width: '960px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      autoFocus: false,
      data: {
        idAgency: this.selectedAgencyId,
        agencies: this.agencies,
        cliente
      }
    });

    dialogRef.afterClosed().subscribe(changed => {
      if (changed) {
        this.cargarClientes();
      }
    });
  }

  hasAgencies(): boolean {
    return this.agencies.length > 0;
  }

  trackByAgencyId(index: number, agency: any): any {
    return agency?.Id || index;
  }

  private loadAgencies(): void {
    this.agenciesLoading = true;
    this.defaultAgencyService.obtenerAgencias()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (agencias) => {
          this.agencies = agencias || [];
          this.agenciesLoading = false;
          const savedAgencyId = this.defaultAgencyService.getAgenciaSeleccionada();
          if (savedAgencyId !== null && this.agencies.some(ag => ag.Id === savedAgencyId)) {
            this.selectedAgencyId = savedAgencyId;
            this.selectedAgency = this.agencies.find(agency => agency.Id === savedAgencyId) || null;
          } else if (this.agencies.length > 0) {
            this.selectedAgencyId = this.agencies[0].Id;
            this.selectedAgency = this.agencies[0];
          }
          this.cdr.markForCheck();
          if (this.selectedAgencyId) {
            this.cargarClientes();
          }
        },
        error: () => {
          this.agencies = [];
          this.agenciesLoading = false;
          this.cdr.markForCheck();
          this.snackBar.open('Error al cargar las agencias', 'Cerrar', { duration: 3000 });
        }
      });
  }

  private cargarClientes(): void {
    if (!this.selectedAgencyId) {
      this.clientes = [];
      this.total = 0;
      this.cdr.markForCheck();
      return;
    }

    this.loading = true;
    this.cdr.markForCheck();
    this.creditoService.listarClientes(
      this.selectedAgencyId,
      this.searchTerm,
      this.pageSize,
      this.pageIndex * this.pageSize
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.clientes = response.success && response.data?.clientes ? response.data.clientes : [];
          this.total = response.data?.total ?? 0;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.clientes = [];
          this.total = 0;
          this.loading = false;
          this.cdr.markForCheck();
          this.snackBar.open('Error al cargar los clientes', 'Cerrar', { duration: 3000 });
        }
      });
  }
}
