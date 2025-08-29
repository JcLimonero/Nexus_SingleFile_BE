import { Component, OnInit, ViewChild, AfterViewInit, Inject, ElementRef, HostListener } from '@angular/core';
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
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';

import { ActivityLogService, ActivityLog, ActivityLogFilters, ActivityLogStats } from '../../../core/services/activity-log.service';
import { ExportService } from '../../../core/services/export.service';

@Component({
  selector: 'app-logs-activity',
  templateUrl: './logs-activity.component.html',
  styleUrls: ['./logs-activity.component.scss'],
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
    MatChipsModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatCardModule,
    MatExpansionModule
  ]
})
export class LogsActivityComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('exportMenuContainer', { static: false }) exportMenuContainer!: ElementRef;

  displayedColumns: string[] = [
    'timestamp', 'username', 'action', 'description', 'change_details'
  ];

  dataSource = new MatTableDataSource<ActivityLog>([]);
  loading = false;
  stats: ActivityLogStats | null = null;
  statsLoading = false;
  showExportMenu = false;

  // Filtros
  filters: ActivityLogFilters = {
    limit: 100,
    offset: 0,
    change_details: ''
  };

  // Opciones de acciones para el filtro
  actionOptions = [
    'LOGIN', 'LOGOUT', 'NAVIGATION', 'CREATE', 'UPDATE', 'DELETE', 'SEARCH', 'EXPORT'
  ];

  // Paginación
  totalLogs = 0;
  pageSize = 100;
  pageSizeOptions = [25, 50, 100, 200];

  constructor(
    private activityLogService: ActivityLogService,
    private exportService: ExportService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadLogs();
    this.loadStats();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * Cargar logs con filtros aplicados
   */
  loadLogs(): void {
    this.loading = true;
    
    this.activityLogService.getLogs(this.filters).subscribe({
      next: (response) => {
        this.dataSource.data = response.data;
        this.totalLogs = response.pagination?.total || 0;
        
        // Actualizar el paginador si es necesario
        if (this.paginator && this.filters.limit !== this.paginator.pageSize) {
          this.paginator.pageSize = this.filters.limit || 100;
        }
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading logs:', error);
        this.snackBar.open('Error al cargar los logs', 'Error', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  /**
   * Cargar estadísticas
   */
  loadStats(): void {
    this.statsLoading = true;
    
    this.activityLogService.getStats().subscribe({
      next: (response) => {
        this.stats = response.data;
        this.statsLoading = false;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
        this.statsLoading = false;
      }
    });
  }

  /**
   * Aplicar filtros
   */
  applyFilters(): void {
    this.filters.offset = 0; // Resetear offset al aplicar filtros
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.loadLogs();
  }

  /**
   * Limpiar filtros
   */
  clearFilters(): void {
    this.filters = {
      limit: 100,
      offset: 0,
      change_details: ''
    };
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.loadLogs();
  }

  /**
   * Cambiar página
   */
  onPageChange(event: any): void {
    this.filters.offset = event.pageIndex * event.pageSize;
    this.filters.limit = event.pageSize;
    this.pageSize = event.pageSize;
    this.loadLogs();
  }

  /**
   * Limpiar logs antiguos
   */
  cleanOldLogs(): void {
    const days = 90; // Por defecto 90 días
    
    this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Limpiar Logs Antiguos',
        message: `¿Estás seguro de que quieres eliminar todos los logs de más de ${days} días? Esta acción no se puede deshacer.`,
        confirmText: 'Limpiar',
        cancelText: 'Cancelar'
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.activityLogService.cleanOldLogs(days).subscribe({
          next: (response) => {
            this.snackBar.open(response.message, 'Éxito', { duration: 3000 });
            this.loadLogs();
            this.loadStats();
          },
          error: (error) => {
            console.error('Error cleaning old logs:', error);
            this.snackBar.open('Error al limpiar logs antiguos', 'Error', { duration: 3000 });
          }
        });
      }
    });
  }

  /**
   * Exportar logs de la página actual
   */
  exportLogs(): void {
    if (!this.dataSource.data || this.dataSource.data.length === 0) {
      this.snackBar.open('No hay datos para exportar', 'Advertencia', { duration: 2000 });
      return;
    }

    try {
      this.loading = true;
      
      // Mostrar mensaje de inicio
      this.snackBar.open('Generando archivo Excel...', 'Info', { duration: 2000 });
      
      // Exportar logs con filtros aplicados
      this.exportService.exportActivityLogsToExcel(this.dataSource.data, this.filters);
      
      // Mensaje de éxito
      this.snackBar.open(
        `Archivo Excel generado exitosamente con ${this.dataSource.data.length} registros`, 
        'Éxito', 
        { duration: 3000 }
      );
      
      // Cerrar menú después de exportar
      this.closeExportMenu();
      
    } catch (error) {
      console.error('Error al exportar logs:', error);
      this.snackBar.open('Error al generar el archivo Excel', 'Error', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }

  /**
   * Exportar todos los logs (no solo los de la página actual)
   */
  exportAllLogs(): void {
    // Confirmar antes de exportar todos los logs
    const confirmMessage = `¿Estás seguro de que quieres exportar TODOS los logs?\n\n` +
                          `• Total de logs: ${this.totalLogs}\n` +
                          `• Filtros aplicados: ${this.getActiveFiltersText()}\n` +
                          `• El archivo puede ser muy grande\n\n` +
                          `¿Continuar con la exportación?`;

    if (confirm(confirmMessage)) {
      try {
        this.loading = true;
        
        // Mostrar mensaje de inicio
        this.snackBar.open('Obteniendo todos los logs para exportar...', 'Info', { duration: 2000 });
        
        // Obtener todos los logs con los filtros actuales pero sin límite de paginación
        const exportFilters = { ...this.filters, limit: 10000, offset: 0 };
        
        this.activityLogService.getLogs(exportFilters).subscribe({
          next: (response) => {
            if (response.data && response.data.length > 0) {
              // Mostrar mensaje de generación
              this.snackBar.open('Generando archivo Excel con todos los logs...', 'Info', { duration: 2000 });
              
              // Exportar todos los logs
              this.exportService.exportActivityLogsToExcel(response.data, this.filters);
              
                          // Mensaje de éxito
            this.snackBar.open(
              `Archivo Excel generado exitosamente con ${response.data.length} registros`, 
              'Éxito', 
              { duration: 3000 }
            );
            
            // Cerrar menú después de exportar
            this.closeExportMenu();
          } else {
            this.snackBar.open('No se encontraron logs para exportar', 'Advertencia', { duration: 2000 });
          }
          this.loading = false;
          },
          error: (error) => {
            console.error('Error al obtener logs para exportar:', error);
            this.snackBar.open('Error al obtener los logs para exportar', 'Error', { duration: 3000 });
            this.loading = false;
          }
        });
        
      } catch (error) {
        console.error('Error al exportar todos los logs:', error);
        this.snackBar.open('Error al generar el archivo Excel', 'Error', { duration: 3000 });
        this.loading = false;
      }
    }
  }

  /**
   * Obtener texto de filtros activos para mostrar en confirmación
   */
  private getActiveFiltersText(): string {
    const activeFilters = [];
    
    if (this.filters.user_id) activeFilters.push(`Usuario: ${this.filters.user_id}`);
    if (this.filters.action) activeFilters.push(`Acción: ${this.filters.action}`);
    if (this.filters.start_date) activeFilters.push(`Fecha inicio: ${this.filters.start_date}`);
    if (this.filters.end_date) activeFilters.push(`Fecha fin: ${this.filters.end_date}`);
    if (this.filters.change_details) activeFilters.push(`Detalles: ${this.filters.change_details}`);

    return activeFilters.length > 0 ? activeFilters.join(', ') : 'Ninguno (todos los registros)';
  }

  /**
   * Alternar menú de exportación
   */
  toggleExportMenu(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.showExportMenu = !this.showExportMenu;
  }

  /**
   * Cerrar menú de exportación
   */
  closeExportMenu(): void {
    this.showExportMenu = false;
  }

  /**
   * Listener para cerrar el menú cuando se hace clic fuera
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (this.exportMenuContainer && !this.exportMenuContainer.nativeElement.contains(event.target as Node)) {
      this.closeExportMenu();
    }
  }

  /**
   * Exportar logs por rango de fechas
   */
  exportLogsByDateRange(): void {
    if (!this.filters.start_date && !this.filters.end_date) {
      this.snackBar.open('Debes seleccionar al menos una fecha para exportar por rango', 'Advertencia', { duration: 3000 });
      return;
    }

    try {
      this.loading = true;
      
      // Mostrar mensaje de inicio
      this.snackBar.open('Exportando logs por rango de fechas...', 'Info', { duration: 2000 });
      
      // Obtener todos los logs para filtrar por fecha
      const exportFilters = { ...this.filters, limit: 10000, offset: 0 };
      
      this.activityLogService.getLogs(exportFilters).subscribe({
        next: (response) => {
          if (response.data && response.data.length > 0) {
            // Exportar logs filtrados por fecha
            this.exportService.exportLogsByDateRange(
              response.data, 
              this.filters.start_date || '', 
              this.filters.end_date || '', 
              this.filters
            );
            
            // Mensaje de éxito
            const startDate = this.filters.start_date ? new Date(this.filters.start_date).toLocaleDateString('es-ES') : 'inicio';
            const endDate = this.filters.end_date ? new Date(this.filters.end_date).toLocaleDateString('es-ES') : 'fin';
            
            this.snackBar.open(
              `Archivo Excel generado exitosamente para el rango ${startDate} - ${endDate}`, 
              'Éxito', 
              { duration: 3000 }
            );
            
            // Cerrar menú después de exportar
            this.closeExportMenu();
          } else {
            this.snackBar.open('No se encontraron logs en el rango de fechas especificado', 'Advertencia', { duration: 2000 });
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al obtener logs para exportar por fecha:', error);
          this.snackBar.open('Error al obtener los logs para exportar', 'Error', { duration: 3000 });
          this.loading = false;
        }
      });
      
    } catch (error) {
      console.error('Error al exportar logs por rango de fechas:', error);
      this.snackBar.open('Error al generar el archivo Excel', 'Error', { duration: 3000 });
      this.loading = false;
    }
  }

  /**
   * Obtener color del chip según la acción
   */
  getActionColor(action: string): { class: string; icon: string; iconClass: string } {
    const colorMap: { [key: string]: { class: string; icon: string; iconClass: string } } = {
      'LOGIN': { 
        class: 'bg-green-100 text-green-800 border-green-200', 
        icon: 'login', 
        iconClass: 'text-green-600' 
      },
      'LOGOUT': { 
        class: 'bg-red-100 text-red-800 border-red-200', 
        icon: 'logout', 
        iconClass: 'text-red-600' 
      },
      'NAVIGATION': { 
        class: 'bg-blue-100 text-blue-800 border-blue-200', 
        icon: 'navigation', 
        iconClass: 'text-blue-600' 
      },
      'CREATE': { 
        class: 'bg-emerald-100 text-emerald-800 border-emerald-200', 
        icon: 'add_circle', 
        iconClass: 'text-emerald-600' 
      },
      'UPDATE': { 
        class: 'bg-amber-100 text-amber-800 border-amber-200', 
        icon: 'edit', 
        iconClass: 'text-amber-600' 
      },
      'DELETE': { 
        class: 'bg-red-100 text-red-800 border-red-200', 
        icon: 'delete', 
        iconClass: 'text-red-600' 
      },
      'SEARCH': { 
        class: 'bg-indigo-100 text-indigo-800 border-indigo-200', 
        icon: 'search', 
        iconClass: 'text-indigo-600' 
      },
      'EXPORT': { 
        class: 'bg-purple-100 text-purple-800 border-purple-200', 
        icon: 'download', 
        iconClass: 'text-purple-600' 
      }
    };
    
    return colorMap[action] || { 
      class: 'bg-gray-100 text-gray-800 border-gray-200', 
      icon: 'help', 
      iconClass: 'text-gray-600' 
    };
  }

  // Método getMethodColor removido ya que no tenemos la columna de método HTTP

  /**
   * Calcular tiempo promedio de ejecución
   */
  getAverageExecutionTime(): number {
    // Como removimos el campo execution_time, retornamos un valor fijo
    // En el futuro se puede implementar un sistema de medición de tiempo real
    return 0;
  }

  /**
   * Obtener rango de página actual
   */
  getPageRange(): string {
    if (!this.paginator) return '0-0';
    
    const start = this.paginator.pageIndex * this.paginator.pageSize + 1;
    const end = Math.min(start + this.paginator.pageSize - 1, this.totalLogs);
    
    return `${start}-${end}`;
  }

  /**
   * Formatear timestamp
   */
  formatTimestamp(timestamp: string): string {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleString('es-ES');
  }

  /**
   * Formatear tiempo de ejecución
   */
  formatExecutionTime(time: number): string {
    // Como removimos el campo execution_time, retornamos un valor por defecto
    return 'N/A';
  }

  /**
   * Truncar texto largo
   */
  truncateText(text: string, maxLength: number = 50): string {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
}

// Componente de diálogo de confirmación
@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>{{ data.message }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>{{ data.cancelText }}</button>
      <button mat-raised-button color="warn" [mat-dialog-close]="true">{{ data.confirmText }}</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule]
})
export class ConfirmDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
