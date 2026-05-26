import { Component, OnInit, ChangeDetectorRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule, PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, Sort, MatSort } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TipoVenta, TipoVentaCreateRequest, TipoVentaUpdateRequest } from '../../../../core/interfaces/tipo-venta.interface';
import { AuthService } from '../../../../core/services/auth.service';
import { ConfirmDialogService } from '../../../../core/services/confirm-dialog.service';
import { TipoVentaService } from '../../../../core/services/tipo-venta.service';
import { TipoVentaEditDialogComponent, TipoVentaEditDialogData } from './tipo-venta-edit-dialog/tipo-venta-edit-dialog.component';

@Component({
  selector: 'app-tipos-venta',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    MatChipsModule,
    MatCardModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './tipos-venta.component.html',
  styleUrls: ['./tipos-venta.component.scss']
})
export class TiposVentaComponent implements OnInit, AfterViewInit {
  tiposVenta: TipoVenta[] = [];
  dataSource = new MatTableDataSource<TipoVenta>([]);
  totalTiposVenta = 0;
  searchTerm = '';
  statusFilter = '';

  displayedColumns: string[] = [];

  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private tipoVentaService: TipoVentaService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private confirmDialog: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.displayedColumns = this.authService.getDisplayedColumnsWithOptionalId(['id', 'name', 'enabled', 'acciones']);
    this.loadTiposVenta();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Configurar filtro personalizado
    this.dataSource.filterPredicate = (data: TipoVenta, filter: string) => {
      const searchTerm = filter.toLowerCase();
      return data.name.toLowerCase().includes(searchTerm);
    };
  }

  loadTiposVenta(): void {
    this.loading = true;
    this.tipoVentaService.getTiposVenta().subscribe({
      next: (response) => {
        if (response.success && response.data?.processes) {
          this.tiposVenta = response.data.processes;
          this.totalTiposVenta = response.data.total;

          // Crear nuevo DataSource para asegurar que la tabla se actualice
          this.dataSource = new MatTableDataSource<TipoVenta>(this.tiposVenta);

          // Reconfigurar paginator y sort
          if (this.paginator) {
            this.dataSource.paginator = this.paginator;
          }
          if (this.sort) {
            this.dataSource.sort = this.sort;
          }
          this.applyFilter();
        } else {
          this.snackBar.open(response.message || 'Error al cargar tipos de venta', 'Error', {
            duration: 3000
          });
        }
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.snackBar.open('Error de conexión al cargar tipos de venta', 'Error', {
          duration: 3000
        });
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  applyFilter(): void {
    // Combinar filtros
    let filterValue = '';

    if (this.searchTerm) {
      filterValue = this.searchTerm;
    }

    // Aplicar filtro de estado si existe
    if (this.statusFilter !== '') {
      const status = this.statusFilter; // Mantener como string

      // Crear nuevo DataSource con los datos filtrados
      const filteredTiposVenta = this.tiposVenta.filter(tv =>
        tv.enabled === status &&
        (filterValue === '' ||
         tv.name.toLowerCase().includes(filterValue.toLowerCase()))
      );

      this.dataSource = new MatTableDataSource<TipoVenta>(filteredTiposVenta);

      // Reconfigurar paginator y sort
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
    } else {
      // Sin filtro de estado, usar todos los tipos de venta
      this.dataSource = new MatTableDataSource<TipoVenta>(this.tiposVenta);

      // Reconfigurar paginator y sort
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }

      // Aplicar filtro de búsqueda
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    // Reset paginator to first page
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  refreshData(): void {
    this.loadTiposVenta();
  }

  /**
   * Limpiar todos los filtros aplicados
   */
  clearFilters(): void {
    // Verificar si hay filtros activos
    const hasActiveFilters = this.searchTerm || this.statusFilter;

    if (!hasActiveFilters) {
      this.snackBar.open('No hay filtros activos para limpiar', 'Info', {
        duration: 2000
      });
      return;
    }

    // Limpiar filtros
    this.searchTerm = '';
    this.statusFilter = '';

    // Crear nuevo DataSource con todos los datos
    this.dataSource = new MatTableDataSource<TipoVenta>(this.tiposVenta);

    // Reconfigurar paginator y sort
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }

    // Reset paginator to first page
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    this.snackBar.open('Filtros limpiados', 'Info', {
      duration: 2000
    });
  }

  /**
   * Recargar datos sin mostrar mensaje
   */
  refreshDataSilent(): void {
    this.loadTiposVenta();
  }

  openCreateDialog(): void {
    const dialogData: TipoVentaEditDialogData = {
      tipoVenta: {} as TipoVenta,
      mode: 'create'
    };

    const dialogRef = this.dialog.open(TipoVentaEditDialogComponent, {
      width: '600px',
      data: dialogData,
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshData();
      }
    });
  }

  openEditDialog(tipoVenta: TipoVenta): void {
    const dialogData: TipoVentaEditDialogData = {
      tipoVenta: tipoVenta,
      mode: 'edit'
    };

    const dialogRef = this.dialog.open(TipoVentaEditDialogComponent, {
      width: '600px',
      data: dialogData,
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshData();
      }
    });
  }

  deleteTipoVenta(tipoVenta: TipoVenta): void {
    this.confirmDialog.confirm({
      title: 'Eliminar tipo de venta permanentemente',
      message: `¿Eliminar el tipo de venta "${tipoVenta.name}"?`,
      details: 'Esta acción no se puede deshacer.',
      variant: 'danger',
      confirmText: 'Eliminar permanentemente'
    }).subscribe(ok => {
      if (!ok) return;
      this.tipoVentaService.deleteTipoVenta(tipoVenta.id!, true).subscribe({
        next: (response) => {
          if (response.success) {
            this.tiposVenta = this.tiposVenta.filter(tv => tv.id !== tipoVenta.id);
            this.applyFilter();
            this.snackBar.open('Tipo de venta eliminado exitosamente', 'Éxito', { duration: 2000 });
          } else {
            this.snackBar.open(response.message || 'Error al eliminar tipo de venta', 'Error', { duration: 3000 });
          }
        },
        error: () => {
          this.snackBar.open('Error al eliminar tipo de venta', 'Error', { duration: 3000 });
        }
      });
    });
  }

  getPageRange(): string {
    if (!this.paginator || this.dataSource.filteredData.length === 0) {
      return '0-0';
    }

    const startIndex = this.paginator.pageIndex * this.paginator.pageSize + 1;
    const endIndex = Math.min(startIndex + this.paginator.pageSize - 1, this.dataSource.filteredData.length);

    return `${startIndex}-${endIndex}`;
  }
}
