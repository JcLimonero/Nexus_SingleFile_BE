import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

import { MotivoEditDialogComponent, MotivoEditData } from './motivo-edit-dialog/motivo-edit-dialog.component';

import { AuthService } from '../../../core/services/auth.service';
import { FileReasonService, FileReason, FileReasonFilters, FileReasonStats } from '../../../core/services/file-reason.service';

@Component({
  selector: 'app-motivos-rechazo',
  templateUrl: './motivos-rechazo.component.html',
  styleUrls: ['./motivos-rechazo.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCardModule
  ]
})
export class MotivosRechazoComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<FileReason>([]);
  loading = false;

  // Filtros
  filters: FileReasonFilters = {
    search: '',
    sort_by: 'name',
    sort_order: 'ASC'
  };

  // Paginación
  totalReasons = 0;
  pageSize = 10;
  pageSizeOptions = [10, 25, 50, 100];
  pageRangeText = '0-0';

  constructor(
    private fileReasonService: FileReasonService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.displayedColumns = this.authService.getDisplayedColumnsWithOptionalId(['id', 'name', 'enabled', 'actions']);
    this.loadData();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      
      // Suscribirse a eventos del paginator para actualizar el rango
      if (this.paginator) {
        this.paginator.page.subscribe(() => {
          this.updatePageRange();
        });
      }
      
      // Actualizar el rango inicial
      this.updatePageRange();
    });
  }
  
  /**
   * Actualizar el texto del rango de páginas
   */
  updatePageRange(): void {
    if (!this.paginator || !this.dataSource || !this.dataSource.data || this.dataSource.data.length === 0) {
      this.pageRangeText = '0-0';
      return;
    }
    
    const dataLength = this.dataSource.filteredData.length || this.dataSource.data.length;
    if (dataLength === 0) {
      this.pageRangeText = '0-0';
      return;
    }
    
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize + 1;
    const endIndex = Math.min(startIndex + this.paginator.pageSize - 1, dataLength);
    
    this.pageRangeText = `${startIndex}-${endIndex}`;
  }

  /**
   * Cargar datos con filtros aplicados
   */
  loadData(): void {
    this.loading = true;
    
    const payload: FileReasonFilters = {
      ...this.filters
    };

    this.fileReasonService.getFileReasons(payload).subscribe({
      next: (response) => {

        // Debuggear cada motivo individualmente
        response.data.file_reasons.forEach((reason: any, index: number) => {

        });
        
        this.dataSource.data = response.data.file_reasons;
        this.totalReasons = response.data.total;
        this.loading = false;
        this.updatePageRange();
      },
      error: (error) => {

        this.snackBar.open('Error al cargar los motivos', 'Error', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  /**
   * Aplicar filtros
   */
  applyFilters(): void {
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.loadData();
    
    // Actualizar el rango después de aplicar filtros
    setTimeout(() => {
      this.updatePageRange();
    });
  }

  /**
   * Limpiar filtros
   */
  clearFilters(): void {
    this.filters = {
      search: '',
      sort_by: 'name',
      sort_order: 'ASC'
    };
    this.applyFilters();
  }

  /**
   * Cambio de página
   */
  onPageChange(event: any): void {
    // Implementar si se necesita paginación del lado del servidor
  }

  /**
   * Ordenamiento
   */
  onSortChange(event: any): void {
    this.filters.sort_by = event.active;
    this.filters.sort_order = event.direction;
    this.loadData();
  }

  /**
   * Agregar nuevo motivo
   */
  addFileReason(): void {
    const dialogRef = this.dialog.open(MotivoEditDialogComponent, {
      width: '500px',
      data: {
        motivo: undefined,
        isEdit: false
      } as MotivoEditData,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {

        this.loadData();
      }
    });
  }

  /**
   * Editar motivo
   */
  editFileReason(fileReason: FileReason): void {
    const dialogRef = this.dialog.open(MotivoEditDialogComponent, {
      width: '500px',
      data: {
        motivo: fileReason,
        isEdit: true
      } as MotivoEditData,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {

        this.loadData();
      }
    });
  }

  /**
   * Eliminar motivo
   */
  deleteFileReason(fileReason: FileReason): void {
    if (confirm(`¿Estás seguro de que quieres eliminar el motivo "${fileReason.name}"?`)) {
      this.fileReasonService.deleteFileReason(fileReason.id).subscribe({
        next: (response) => {
          this.snackBar.open('Motivo eliminado exitosamente', 'Éxito', { duration: 2000 });
          this.loadData();
        },
        error: (error) => {

          this.snackBar.open('Error al eliminar el motivo', 'Error', { duration: 3000 });
        }
      });
    }
  }

  /**
   * Cambiar estado del motivo
   */
  toggleStatus(fileReason: FileReason): void {
    this.fileReasonService.toggleStatus(fileReason.id).subscribe({
              next: (response) => {
          this.snackBar.open('Estado del motivo cambiado exitosamente', 'Éxito', { duration: 2000 });
          this.loadData();
        },
      error: (error) => {

        this.snackBar.open('Error al cambiar el estado del motivo', 'Error', { duration: 3000 });
      }
    });
  }

  /**
   * Refrescar datos
   */
  refreshData(): void {
    this.loadData();
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
   * Obtener rango de página actual para mostrar en el contador
   */
  getPageRange(): string {
    return this.pageRangeText;
  }
}
