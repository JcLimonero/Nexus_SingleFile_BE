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

import { Proceso, ProcesoCreateRequest, ProcesoUpdateRequest } from '../../../../core/interfaces/proceso.interface';
import { ProcesoService } from '../../../../core/services/proceso.service';
import { ProcesoEditDialogComponent, ProcesoEditDialogData } from './proceso-edit-dialog/proceso-edit-dialog.component';

@Component({
  selector: 'app-procesos',
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
  templateUrl: './procesos.component.html'
})
export class ProcesosComponent implements OnInit, AfterViewInit {
  procesos: Proceso[] = [];
  dataSource = new MatTableDataSource<Proceso>([]);
  totalProcesos = 0;
  searchTerm = '';
  statusFilter = '';
  
  displayedColumns: string[] = ['Id', 'Name', 'Enabled', 'acciones'];
  
  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private procesoService: ProcesoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProcesos();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    // Configurar filtro personalizado
    this.dataSource.filterPredicate = (data: Proceso, filter: string) => {
      const searchTerm = filter.toLowerCase();
      return data.Name.toLowerCase().includes(searchTerm);
    };
  }

  loadProcesos(): void {
    this.loading = true;
    this.procesoService.getProcesos().subscribe({
      next: (response) => {
        if (response.success && response.data?.processes) {
          this.procesos = response.data.processes;
          this.totalProcesos = response.data.total;
          
          // Crear nuevo DataSource para asegurar que la tabla se actualice
          this.dataSource = new MatTableDataSource<Proceso>(this.procesos);
          
          // Reconfigurar paginator y sort
          if (this.paginator) {
            this.dataSource.paginator = this.paginator;
          }
          if (this.sort) {
            this.dataSource.sort = this.sort;
          }
          this.applyFilter();
        } else {
          this.snackBar.open(response.message || 'Error al cargar procesos', 'Error', {
            duration: 3000
          });
        }
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.snackBar.open('Error de conexión al cargar procesos', 'Error', {
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
      const filteredProcesos = this.procesos.filter(proceso => 
        proceso.Enabled === status &&
        (filterValue === '' || 
         proceso.Name.toLowerCase().includes(filterValue.toLowerCase()))
      );
      
      this.dataSource = new MatTableDataSource<Proceso>(filteredProcesos);
      
      // Reconfigurar paginator y sort
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
    } else {
      // Sin filtro de estado, usar todos los procesos
      this.dataSource = new MatTableDataSource<Proceso>(this.procesos);
      
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
    this.loadProcesos();
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
    this.dataSource = new MatTableDataSource<Proceso>(this.procesos);
    
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
    this.loadProcesos();
  }

  openCreateDialog(): void {
    const dialogData: ProcesoEditDialogData = {
      proceso: {} as Proceso,
      mode: 'create'
    };

    const dialogRef = this.dialog.open(ProcesoEditDialogComponent, {
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

  openEditDialog(proceso: Proceso): void {
    const dialogData: ProcesoEditDialogData = {
      proceso: proceso,
      mode: 'edit'
    };

    const dialogRef = this.dialog.open(ProcesoEditDialogComponent, {
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

  deleteProceso(proceso: Proceso): void {
    if (confirm(`¿Estás seguro de que quieres eliminar PERMANENTEMENTE el proceso "${proceso.Name}"?\n\nEsta acción no se puede deshacer.`)) {
      console.log('🗑️ Intentando eliminar proceso:', proceso);
      
      this.procesoService.deleteProceso(proceso.Id!, true).subscribe({
        next: (response) => {
          console.log('📡 Respuesta del API:', response);
          
          if (response.success) {
            console.log('✅ Proceso eliminado exitosamente');
            this.procesos = this.procesos.filter(p => p.Id !== proceso.Id);
            this.applyFilter();
            this.snackBar.open('Proceso eliminado exitosamente', 'Éxito', {
              duration: 2000
            });
          } else {
            console.log('❌ Error en la respuesta:', response.message);
            this.snackBar.open(response.message || 'Error al eliminar proceso', 'Error', {
              duration: 3000
            });
          }
        },
        error: (error) => {
          console.log('💥 Error en la petición:', error);
          this.snackBar.open('Error al eliminar proceso', 'Error', {
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
