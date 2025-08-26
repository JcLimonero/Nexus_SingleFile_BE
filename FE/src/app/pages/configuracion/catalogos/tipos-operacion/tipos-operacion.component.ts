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
import { TipoOperacion, TipoOperacionResponse } from '../../../../core/interfaces/tipo-operacion.interface';
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
    MatTooltipModule
  ]
})
export class TiposOperacionComponent implements OnInit, AfterViewInit {
  tiposOperacion: TipoOperacion[] = [];
  dataSource = new MatTableDataSource<TipoOperacion>([]);
  displayedColumns: string[] = ['Id', 'Name', 'Enabled', 'acciones'];
  loading = false;
  searchTerm = '';
  statusFilter = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private tipoOperacionService: TipoOperacionService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadTiposOperacion();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Configurar filtro personalizado
    this.dataSource.filterPredicate = (data: TipoOperacion, filter: string) => {
      const searchTerm = filter.toLowerCase();
      return data.Name.toLowerCase().includes(searchTerm);
    };
  }

  loadTiposOperacion(): void {
    this.loading = true;
    this.tipoOperacionService.getTiposOperacion().subscribe({
      next: (response: TipoOperacionResponse) => {
        if (response.success) {
          this.tiposOperacion = response.data.operationTypes;
          this.dataSource.data = this.tiposOperacion;
          this.applyFilter();
        } else {
          this.snackBar.open(response.message || 'Error al cargar tipos de operación', 'Error', {
            duration: 3000
          });
        }
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Error al cargar tipos de operación', 'Error', {
          duration: 3000
        });
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
        tipoOperacion.Enabled === status &&
        (filterValue === '' || 
         tipoOperacion.Name.toLowerCase().includes(filterValue.toLowerCase()))
      );
    } else {
      this.dataSource.data = this.tiposOperacion;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    
    // Reset paginator to first page
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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
    if (confirm(`¿Estás seguro de que quieres eliminar el tipo de operación "${tipoOperacion.Name}"?`)) {
      this.tipoOperacionService.deleteTipoOperacion(tipoOperacion.Id!).subscribe({
        next: (response) => {
          if (response.success) {
            this.tiposOperacion = this.tiposOperacion.filter(t => t.Id !== tipoOperacion.Id);
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

  getPageRange(): string {
    if (!this.paginator || this.dataSource.filteredData.length === 0) {
      return '0-0';
    }
    
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize + 1;
    const endIndex = Math.min(startIndex + this.paginator.pageSize - 1, this.dataSource.filteredData.length);
    
    return `${startIndex}-${endIndex}`;
  }
}
