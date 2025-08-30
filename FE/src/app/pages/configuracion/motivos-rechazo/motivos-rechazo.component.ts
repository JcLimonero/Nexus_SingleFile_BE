import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
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

  displayedColumns: string[] = ['id', 'name', 'idTypeReason', 'enabled', 'actions'];
  dataSource = new MatTableDataSource<FileReason>([]);
  loading = false;

  // Filtros
  filters: FileReasonFilters = {
    search: '',
    id_type_reason: undefined,
    sort_by: 'Name',
    sort_order: 'ASC'
  };

  // Paginación
  totalReasons = 0;
  pageSize = 10;
  pageSizeOptions = [10, 25, 50, 100];



  constructor(
    private fileReasonService: FileReasonService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * Cargar datos con filtros aplicados
   */
  loadData(): void {
    this.loading = true;
    
    this.fileReasonService.getFileReasons(this.filters).subscribe({
      next: (response) => {
        console.log('Respuesta de la API:', response);
        console.log('Datos de motivos:', response.data.file_reasons);
        
        // Debuggear cada motivo individualmente
        response.data.file_reasons.forEach((reason: any, index: number) => {
          console.log(`Motivo ${index + 1}:`, {
            Id: reason.Id,
            Name: reason.Name,
            IdTypeReason: reason.IdTypeReason,
            TypeReasonLabel: reason.TypeReasonLabel,
            IdTypeReasonType: typeof reason.IdTypeReason,
            Comparison4: reason.IdTypeReason == 4,
            Comparison5: reason.IdTypeReason == 5,
            Enabled: reason.Enabled,
            EnabledType: typeof reason.Enabled,
            EnabledComparison: reason.Enabled == 1
          });
        });
        
        this.dataSource.data = response.data.file_reasons;
        this.totalReasons = response.data.total;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando motivos:', error);
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
  }

  /**
   * Limpiar filtros
   */
  clearFilters(): void {
    this.filters = {
      search: '',
      id_type_reason: undefined,
      sort_by: 'Name',
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
        console.log('Diálogo de creación cerrado con éxito, recargando datos...');
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
        console.log('Diálogo de edición cerrado con éxito, recargando datos...');
        this.loadData();
      }
    });
  }

  /**
   * Eliminar motivo
   */
  deleteFileReason(fileReason: FileReason): void {
    if (confirm(`¿Estás seguro de que quieres eliminar el motivo "${fileReason.Name}"?`)) {
      this.fileReasonService.deleteFileReason(fileReason.Id).subscribe({
        next: (response) => {
          this.snackBar.open('Motivo eliminado exitosamente', 'Éxito', { duration: 2000 });
          this.loadData();
        },
        error: (error) => {
          console.error('Error eliminando motivo:', error);
          this.snackBar.open('Error al eliminar el motivo', 'Error', { duration: 3000 });
        }
      });
    }
  }

  /**
   * Cambiar estado del motivo
   */
  toggleStatus(fileReason: FileReason): void {
    this.fileReasonService.toggleStatus(fileReason.Id).subscribe({
              next: (response) => {
          this.snackBar.open('Estado del motivo cambiado exitosamente', 'Éxito', { duration: 2000 });
          this.loadData();
        },
      error: (error) => {
        console.error('Error cambiando estado:', error);
        this.snackBar.open('Error al cambiar el estado del motivo', 'Error', { duration: 3000 });
      }
    });
  }



  /**
   * Obtener color del tipo de razón
   */
  getTypeReasonColor(idTypeReason: number): string {
    if (idTypeReason === 4) return 'emerald'; // Aprobación - verde
    if (idTypeReason === 5) return 'amber';   // Rechazo - naranja/ámbar
    return 'gray'; // Tipo desconocido
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
    if (!this.dataSource.paginator) return '0-0';
    
    const start = this.dataSource.paginator.pageIndex * this.dataSource.paginator.pageSize + 1;
    const end = Math.min(start + this.dataSource.paginator.pageSize - 1, this.dataSource.filteredData.length);
    
    return `${start}-${end}`;
  }
}
