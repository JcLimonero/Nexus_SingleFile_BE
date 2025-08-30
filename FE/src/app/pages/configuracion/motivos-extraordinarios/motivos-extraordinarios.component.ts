import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';

import { FileExtraordinaryReason, FileExtraordinaryReasonService, FileExtraordinaryReasonFilters } from 'src/app/core/services/file-extraordinary-reason.service';
import { MotivoExtraordinarioEditDialogComponent } from './motivo-extraordinario-edit-dialog/motivo-extraordinario-edit-dialog.component';

@Component({
  selector: 'app-motivos-extraordinarios',
  templateUrl: './motivos-extraordinarios.component.html',
  styleUrls: ['./motivos-extraordinarios.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatChipsModule
  ]
})
export class MotivosExtraordinariosComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'idTypeReason', 'enabled', 'actions'];
  dataSource = new MatTableDataSource<FileExtraordinaryReason>();
  
  loading = false;
  totalItems = 0;
  
  filters: FileExtraordinaryReasonFilters = {
    search: '',
    id_type_reason: undefined,
    sort_by: 'Name',
    sort_order: 'ASC',
    limit: 10,
    offset: 0
  };

  constructor(
    private fileExtraordinaryReasonService: FileExtraordinaryReasonService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    // Configurar el paginador con el estado actual
    if (this.paginator) {
      this.paginator.pageIndex = this.getCurrentPageIndex();
      this.paginator.pageSize = this.filters.limit || 10;
    }
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  /**
   * Cargar datos de motivos extraordinarios
   */
  loadData(): void {
    this.loading = true;
    
    this.fileExtraordinaryReasonService.getFileExtraordinaryReasons(this.filters).subscribe({
      next: (response: any) => {
        this.dataSource.data = response.data.file_extraordinary_reasons;
        this.totalItems = response.data.total;
        
        // Sincronizar el paginador con el estado actual
        if (this.paginator) {
          this.paginator.pageIndex = this.getCurrentPageIndex();
          this.paginator.pageSize = this.filters.limit || 10;
        }
        
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error cargando motivos extraordinarios:', error);
        this.snackBar.open('Error al cargar los motivos extraordinarios', 'Error', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  /**
   * Aplicar filtros
   */
  applyFilters(): void {
    this.filters.offset = 0;
    
    // Resetear el paginador a la primera página
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    
    this.loadData();
  }

  /**
   * Limpiar filtros
   */
  clearFilters(): void {
    this.filters = {
      search: '',
      id_type_reason: undefined,
      sort_by: 'Name',
      sort_order: 'ASC',
      limit: 10,
      offset: 0
    };
    
    // Resetear el paginador a la primera página
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    
    this.loadData();
  }

  /**
   * Manejar cambio de página
   */
  onPageChange(event: any): void {
    this.filters.offset = event.pageIndex * event.pageSize;
    this.filters.limit = event.pageSize;
    this.loadData();
  }

  /**
   * Manejar cambio de ordenamiento
   */
  onSortChange(event: any): void {
    this.filters.sort_by = event.active;
    this.filters.sort_order = event.direction;
    this.loadData();
  }

  /**
   * Agregar nuevo motivo extraordinario
   */
  addFileExtraordinaryReason(): void {
    const dialogRef = this.dialog.open(MotivoExtraordinarioEditDialogComponent, {
      width: '500px',
      data: {
        motivo: undefined,
        isEdit: false
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadData();
      }
    });
  }

  /**
   * Editar motivo extraordinario
   */
  editFileExtraordinaryReason(fileExtraordinaryReason: FileExtraordinaryReason): void {
    const dialogRef = this.dialog.open(MotivoExtraordinarioEditDialogComponent, {
      width: '500px',
      data: {
        motivo: fileExtraordinaryReason,
        isEdit: true
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadData();
      }
    });
  }

  /**
   * Eliminar motivo extraordinario
   */
  deleteFileExtraordinaryReason(fileExtraordinaryReason: FileExtraordinaryReason): void {
    if (confirm(`¿Estás seguro de que quieres eliminar el motivo "${fileExtraordinaryReason.Name}"?`)) {
      this.fileExtraordinaryReasonService.deleteFileExtraordinaryReason(fileExtraordinaryReason.Id).subscribe({
        next: (response: any) => {
          this.snackBar.open('Motivo extraordinario eliminado exitosamente', 'Éxito', { duration: 2000 });
          this.loadData();
        },
        error: (error: any) => {
          console.error('Error eliminando motivo extraordinario:', error);
          this.snackBar.open('Error al eliminar el motivo extraordinario', 'Error', { duration: 3000 });
        }
      });
    }
  }

  /**
   * Cambiar estado del motivo extraordinario
   */
  toggleStatus(fileExtraordinaryReason: FileExtraordinaryReason): void {
    this.fileExtraordinaryReasonService.toggleStatus(fileExtraordinaryReason.Id).subscribe({
      next: (response: any) => {
        this.snackBar.open('Estado del motivo extraordinario cambiado exitosamente', 'Éxito', { duration: 2000 });
        this.loadData();
      },
      error: (error: any) => {
        console.error('Error cambiando estado:', error);
        this.snackBar.open('Error al cambiar el estado del motivo extraordinario', 'Error', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  /**
   * Verificar si un motivo está habilitado
   */
  isEnabled(enabledValue: any): boolean {
    // Convertir a string y comparar para manejar diferentes tipos de datos
    const enabledStr = String(enabledValue).trim();
    return enabledStr === '1' || enabledStr === 'true' || enabledValue === true || enabledValue === 1;
  }

  /**
   * Refrescar datos
   */
  refreshData(): void {
    this.loadData();
  }
  
  /**
   * Obtener rango de página actual para mostrar en el contador
   */
  getPageRange(): string {
    if (!this.paginator) return '0-0';
    
    const start = this.paginator.pageIndex * this.paginator.pageSize + 1;
    const end = Math.min(start + this.paginator.pageSize - 1, this.totalItems);
    
    return `${start}-${end}`;
  }
  
  /**
   * Obtener el índice de página actual
   */
  getCurrentPageIndex(): number {
    if (!this.filters.offset || !this.filters.limit) return 0;
    return Math.floor(this.filters.offset / this.filters.limit);
  }
}
