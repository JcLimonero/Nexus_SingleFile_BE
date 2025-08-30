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
    limit: 0, // 0 = sin límite (paginación del cliente)
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
    
    // Configurar filtro personalizado para búsqueda
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const searchTerm = filter.toLowerCase();
      return data.Name.toLowerCase().includes(searchTerm);
    };
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  /**
   * Cargar datos de motivos extraordinarios
   */
  loadData(): void {
    this.loading = true;
    
    // Crear filtros para obtener todos los datos
    const loadFilters = {
      ...this.filters,
      limit: 0, // Sin límite para obtener todos los datos
      offset: 0
    };
    
    this.fileExtraordinaryReasonService.getFileExtraordinaryReasons(loadFilters).subscribe({
      next: (response: any) => {
        this.dataSource.data = response.data.file_extraordinary_reasons;
        this.totalItems = response.data.total;
        
        // Aplicar filtros locales
        this.applyLocalFilters();
        
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
    this.applyLocalFilters();
  }
  
  /**
   * Aplicar filtros locales (paginación del cliente)
   */
  applyLocalFilters(): void {
    // Aplicar filtro de búsqueda
    if (this.filters.search) {
      this.dataSource.filter = this.filters.search.trim().toLowerCase();
    } else {
      this.dataSource.filter = '';
    }
    
    // Aplicar filtro de tipo de razón
    if (this.filters.id_type_reason !== undefined) {
      this.dataSource.data = this.dataSource.data.filter(reason => 
        reason.IdTypeReason === this.filters.id_type_reason
      );
    }
    
    // Resetear paginador a primera página
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
  /**
   * Resetear paginación
   */
  resetPagination(): void {
    this.filters.offset = 0;
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
  }
  
  /**
   * Verificar estado actual de la paginación
   */
  getCurrentPaginationState(): any {
    if (!this.paginator) return null;
    
    return {
      pageIndex: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize,
      length: this.paginator.length,
      filters: { ...this.filters },
      totalItems: this.totalItems
    };
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
      limit: 0,
      offset: 0
    };
    
    // Aplicar filtros locales
    this.applyLocalFilters();
  }

  // Nota: onPageChange ya no se necesita con paginación del cliente

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
    const pageIndex = Math.floor(this.filters.offset / this.filters.limit);
    // Asegurar que el índice esté dentro de los límites válidos
    return Math.max(0, Math.min(pageIndex, Math.ceil(this.totalItems / this.filters.limit) - 1));
  }
  
  /**
   * Validar y corregir el estado del paginador
   */
  validatePaginatorState(): void {
    if (!this.paginator) return;
    
    const maxPageIndex = Math.ceil(this.totalItems / this.paginator.pageSize) - 1;
    const currentPageIndex = this.paginator.pageIndex;
    
    // Si el índice de página está fuera de rango, corregirlo
    if (currentPageIndex > maxPageIndex) {
      console.log('validatePaginatorState - Corrigiendo pageIndex:', {
        current: currentPageIndex,
        max: maxPageIndex,
        totalItems: this.totalItems,
        pageSize: this.paginator.pageSize
      });
      
      this.paginator.pageIndex = Math.max(0, maxPageIndex);
      this.filters.offset = this.paginator.pageIndex * this.paginator.pageSize;
    }
  }
}
