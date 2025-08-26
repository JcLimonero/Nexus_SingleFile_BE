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

import { Agency } from '../../../../core/services/agency.service';
import { AgencyService } from '../../../../core/services/agency.service';
import { AuthService } from '../../../../core/services/auth.service';
import { AgenciaEditDialogComponent, AgenciaEditDialogData } from './agencia-edit-dialog/agencia-edit-dialog.component';

@Component({
  selector: 'app-agencias',
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
    MatDividerModule
  ],
  templateUrl: './agencias.component.html'
})
export class AgenciasComponent implements OnInit, AfterViewInit {
  agencias: Agency[] = [];
  dataSource = new MatTableDataSource<Agency>([]);
  totalAgencias = 0;
  searchTerm = '';
  statusFilter = '';
  
  displayedColumns: string[] = ['Id', 'IdAgency', 'Name', 'Enabled', 'acciones'];
  
  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private agencyService: AgencyService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Verificar autenticación antes de cargar datos
    if (this.checkAuthentication()) {
      this.loadAgencias();
    }
  }

  /**
   * Verificar si el usuario está autenticado
   */
  private checkAuthentication(): boolean {
    const isAuthenticated = this.authService.isAuthenticated();
    const token = this.authService.getToken();
    
    if (!isAuthenticated || !token) {
      this.snackBar.open('Debes iniciar sesión para acceder a esta funcionalidad', 'Error', {
        duration: 5000
      });
      
      // Aquí podrías redirigir al login
      // this.router.navigate(['/login']);
      
      return false;
    }
    
    return true;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    // Configurar filtro personalizado
    this.dataSource.filterPredicate = (data: Agency, filter: string) => {
      const searchTerm = filter.toLowerCase();
      const matches = data.Name.toLowerCase().includes(searchTerm) ||
             (data.IdAgency ? data.IdAgency.toLowerCase().includes(searchTerm) : false);
      
      return matches;
    };
  }

  loadAgencias(): void {
    this.loading = true;
    
    this.agencyService.getAgencies().subscribe({
      next: (response: any) => {
        
        if (response.success && response.data?.agencies) {
          
          // Convertir a array si no lo es
          const agenciasArray = Array.isArray(response.data.agencies) 
            ? response.data.agencies 
            : Object.values(response.data.agencies);
          
          this.agencias = agenciasArray;
          this.totalAgencias = response.data.total;
          
          // Asignar al DataSource usando setData o creando un nuevo DataSource
          this.dataSource = new MatTableDataSource<Agency>(this.agencias);
          
          // Reconfigurar paginator y sort
          if (this.paginator) {
            this.dataSource.paginator = this.paginator;
          }
          if (this.sort) {
            this.dataSource.sort = this.sort;
          }
          
          this.applyFilter();
        } else {
          this.snackBar.open(response.message || 'Error al cargar agencias', 'Error', {
            duration: 3000
          });
        }
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error: any) => {
        
        this.snackBar.open('Error de conexión al cargar agencias', 'Error', {
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
    
    // Aplicar filtro de búsqueda
    this.dataSource.filter = filterValue.trim().toLowerCase();
    
    // Aplicar filtro de estado si existe
    if (this.statusFilter !== '') {
      const status = this.statusFilter === 'true' ? 1 : 0;
      
      this.dataSource.data = this.agencias.filter(agencia => 
        agencia.Enabled === status &&
        (filterValue === '' || 
         agencia.Name.toLowerCase().includes(filterValue.toLowerCase()) ||
         (agencia.IdAgency && agencia.IdAgency.toLowerCase().includes(filterValue.toLowerCase())))
      );
      
    } else {
      this.dataSource.data = this.agencias;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    
    // Reset paginator to first page
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    
  }

  refreshData(): void {
    
    // Mostrar mensaje de recarga
    this.snackBar.open('Recargando datos...', 'Info', {
      duration: 1000
    });
    
    // Recargar datos
    this.loadAgencias();
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
    
    // Resetear la tabla a su estado original
    this.dataSource.data = this.agencias;
    this.dataSource.filter = '';
    
    // Resetear paginador a la primera página
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    
    // Mostrar mensaje de confirmación
    this.snackBar.open('Filtros limpiados exitosamente', 'Éxito', {
      duration: 2000
    });
    
    // Forzar detección de cambios
    this.cdr.markForCheck();
  }

  /**
   * Verificar si hay filtros activos
   */
  hasActiveFilters(): boolean {
    return !!(this.searchTerm || this.statusFilter);
  }

  /**
   * Recargar datos con confirmación
   */
  refreshDataWithConfirmation(): void {
    if (confirm('¿Estás seguro de que quieres recargar los datos? Esto sobrescribirá cualquier cambio no guardado.')) {
      this.refreshData();
    }
  }

  /**
   * Recargar datos silenciosamente (sin mensajes)
   */
  refreshDataSilent(): void {
    this.loadAgencias();
  }

  openCreateDialog(): void {
    const dialogData: AgenciaEditDialogData = {
      agencia: {} as Agency,
      mode: 'create'
    };

    const dialogRef = this.dialog.open(AgenciaEditDialogComponent, {
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

  openEditDialog(agencia: Agency): void {
    const dialogData: AgenciaEditDialogData = {
      agencia: agencia,
      mode: 'edit'
    };

    const dialogRef = this.dialog.open(AgenciaEditDialogComponent, {
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



  deleteAgencia(agencia: Agency): void {
    if (confirm(`¿Estás seguro de que quieres eliminar PERMANENTEMENTE la agencia "${agencia.Name}"?\n\nEsta acción no se puede deshacer.`)) {
      console.log('🗑️ Intentando eliminar agencia:', agencia);
      
      this.agencyService.deleteAgency(Number(agencia.Id), true).subscribe({
        next: (response: any) => {
          console.log('📡 Respuesta del API:', response);
          
          if (response.success) {
            console.log('✅ Agencia eliminada exitosamente');
            this.agencias = this.agencias.filter(a => a.Id !== agencia.Id);
            this.applyFilter();
            this.snackBar.open('Agencia eliminada exitosamente', 'Éxito', {
              duration: 2000
            });
          } else {
            console.log('❌ Error en la respuesta:', response.message);
            this.snackBar.open(response.message || 'Error al eliminar agencia', 'Error', {
              duration: 3000
            });
          }
        },
        error: (error: any) => {
          console.log('💥 Error en la petición:', error);
          this.snackBar.open('Error al eliminar agencia', 'Error', {
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
