import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { TipoOperacion, TipoOperacionResponse } from '../../../../core/interfaces/tipo-operacion.interface';
import { AuthService } from '../../../../core/services/auth.service';
import { TipoOperacionService } from '../../../../core/services/tipo-operacion.service';
import { TipoOperacionEditDialogComponent } from './tipo-operacion-edit-dialog/tipo-operacion-edit-dialog.component';

@Component({
  selector: 'app-tipos-operacion',
  templateUrl: './tipos-operacion.component.html',
  styleUrls: ['./tipos-operacion.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatCardModule
  ]
})
export class TiposOperacionComponent implements OnInit, AfterViewInit {
  tiposOperacion: TipoOperacion[] = [];
  dataSource = new MatTableDataSource<TipoOperacion>([]);
  displayedColumns: string[] = [];
  loading = false;
  searchTerm = '';
  statusFilter = '';
  pageRangeText = '0-0';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private tipoOperacionService: TipoOperacionService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.displayedColumns = this.authService.getDisplayedColumnsWithOptionalId(['id', 'name', 'enabled', 'acciones']);
    this.loadTiposOperacion();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (this.paginator) {
      this.paginator.page.subscribe(() => this.updatePageRange());
    }

    // Configurar filtro personalizado
    this.dataSource.filterPredicate = (data: TipoOperacion, filter: string) => {
      const searchTerm = filter.toLowerCase();
      return data.name.toLowerCase().includes(searchTerm);
    };
  }

  loadTiposOperacion(): void {
    this.loading = true;
    this.tipoOperacionService.getTiposOperacion().subscribe({
      next: (response: TipoOperacionResponse) => {
        if (response.success) {
          this.tiposOperacion = response.data.operation_types ?? response.data.operationTypes ?? [];
          this.dataSource.data = this.tiposOperacion;
          this.applyFilter();
          this.updatePageRange();
        } else {
          this.snackBar.open(response.message || 'Error al cargar tipos de operación', 'Error', {
            duration: 3000
          });
          this.pageRangeText = '0-0';
        }
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Error al cargar tipos de operación', 'Error', {
          duration: 3000
        });
        this.pageRangeText = '0-0';
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    const filterValue = this.searchTerm.trim();
    
    // Aplicar filtro de estado si existe
    if (this.statusFilter !== '') {
      const status = this.statusFilter === 'true' ? '1' : '0';
      this.dataSource.data = this.tiposOperacion.filter(tipoOperacion => 
        tipoOperacion.enabled === status &&
        (filterValue === '' || 
         tipoOperacion.name.toLowerCase().includes(filterValue.toLowerCase()))
      );
    } else {
      this.dataSource.data = this.tiposOperacion;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    
    // Reset paginator to first page
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.updatePageRange();
  }

  private updatePageRange(): void {
    if (!this.paginator || this.dataSource.filteredData.length === 0) {
      this.pageRangeText = '0-0';
      return;
    }
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize + 1;
    const endIndex = Math.min(startIndex + this.paginator.pageSize - 1, this.dataSource.filteredData.length);
    this.pageRangeText = `${startIndex}-${endIndex}`;
  }

  refreshData(): void {
    this.loadTiposOperacion();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.applyFilter();
    
    this.snackBar.open('Filtros limpiados', 'Info', {
      duration: 2000
    });
  }

  openCreateDialog(): void {
    const dialogData = {
      tipoOperacion: {} as TipoOperacion,
      mode: 'create'
    };

    const dialogRef = this.dialog.open(TipoOperacionEditDialogComponent, {
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

  openEditDialog(tipoOperacion: TipoOperacion): void {
    const dialogData = {
      tipoOperacion: tipoOperacion,
      mode: 'edit'
    };

    const dialogRef = this.dialog.open(TipoOperacionEditDialogComponent, {
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

  deleteTipoOperacion(tipoOperacion: TipoOperacion): void {
    if (confirm(`¿Estás seguro de que quieres eliminar el tipo de operación "${tipoOperacion.name}"?`)) {
      this.tipoOperacionService.deleteTipoOperacion(tipoOperacion.id!).subscribe({
        next: (response) => {
          if (response.success) {
            this.tiposOperacion = this.tiposOperacion.filter(t => t.id !== tipoOperacion.id);
            this.applyFilter();
            this.snackBar.open('Tipo de operación eliminado exitosamente', 'Éxito', {
              duration: 2000
            });
          } else {
            this.snackBar.open(response.message || 'Error al eliminar tipo de operación', 'Error', {
              duration: 3000
            });
          }
        },
        error: (error) => {
          this.snackBar.open('Error al eliminar tipo de operación', 'Error', {
            duration: 3000
          });
        }
      });
    }
  }

}
