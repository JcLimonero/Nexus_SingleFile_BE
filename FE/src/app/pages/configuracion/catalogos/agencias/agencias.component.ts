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

import { Agencia, AgenciaCreateRequest, AgenciaUpdateRequest } from '../../../../core/interfaces/agencia.interface';
import { AgenciaService } from '../../../../core/services/agencia.service';
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
  template: `
    <div class="p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Gestión de Agencias</h1>
          <p class="text-gray-600 mt-2">Administra las agencias del sistema</p>
        </div>
        <button 
          (click)="openCreateDialog()" 
          color="primary" 
          mat-raised-button>
          <mat-icon>➕</mat-icon>
          Nueva Agencia
        </button>
      </div>

      <!-- Filtros y Búsqueda -->
      <mat-card class="mb-6">
        <mat-card-content>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Buscar por nombre</mat-label>
              <input 
                matInput 
                [(ngModel)]="searchTerm" 
                (input)="applyFilter()"
                placeholder="Nombre de la agencia">
              <mat-icon matSuffix>🔍</mat-icon>
            </mat-form-field>
            
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Estado</mat-label>
              <mat-select [(ngModel)]="statusFilter" (selectionChange)="applyFilter()">
                <mat-option value="">Todos</mat-option>
                <mat-option value="true">Activo</mat-option>
                <mat-option value="false">Inactivo</mat-option>
              </mat-select>
            </mat-form-field>
            

          </div>
        </mat-card-content>
      </mat-card>

      <!-- Tabla de Agencias -->
      <mat-card>
        <mat-card-content>
          <div class="overflow-x-auto">
            <table mat-table [dataSource]="dataSource" matSort class="w-full">
              <!-- Columna ID -->
              <ng-container matColumnDef="Id">
                <th mat-header-cell *matHeaderCellDef mat-sort-header class="w-16 text-center py-1">ID</th>
                <td mat-cell *matCellDef="let agencia" class="text-center text-xs font-mono text-gray-600 py-0.5">
                  {{ agencia.Id }}
                </td>
              </ng-container>

              <!-- Columna Código -->
              <ng-container matColumnDef="IdAgency">
                <th mat-header-cell *matHeaderCellDef mat-sort-header class="w-32 py-1">Nd Agencia</th>
                <td mat-cell *matCellDef="let agencia" class="py-0.5">
                  <span class="font-mono bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded-full text-xs font-medium">
                    {{ agencia.IdAgency }}
                  </span>
                </td>
              </ng-container>

              <!-- Columna Nombre -->
              <ng-container matColumnDef="Name">
                <th mat-header-cell *matHeaderCellDef mat-sort-header class="min-w-0 flex-1 py-1">Nombre</th>
                <td mat-cell *matCellDef="let agencia" class="py-0.5">
                  <div class="font-medium text-gray-900 truncate pr-2 text-xs" [title]="agencia.Name">
                    {{ agencia.Name }}
                  </div>
                </td>
              </ng-container>

              <!-- Columna Estado -->
              <ng-container matColumnDef="Enabled">
                <th mat-header-cell *matHeaderCellDef mat-sort-header class="w-24 text-center py-1">Estado</th>
                <td mat-cell *matCellDef="let agencia" class="text-center py-0.5">
                  <span 
                    [class]="agencia.Enabled === '1' 
                      ? 'inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800' 
                      : 'inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'">
                    <span 
                      [class]="agencia.Enabled === '1' ? 'w-0.5 h-0.5 bg-green-400 rounded-full mr-1' : 'w-0.5 h-0.5 bg-red-400 rounded-full mr-1'">
                    </span>
                    {{ agencia.Enabled === '1' ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
              </ng-container>

              <!-- Columna Acciones -->
              <ng-container matColumnDef="acciones">
                <th mat-header-cell *matHeaderCellDef class="w-28 text-center py-1">Acciones</th>
                <td mat-cell *matCellDef="let agencia" class="text-center py-0.5">
                  <div class="flex gap-0.5 justify-center">
                    <button 
                      (click)="openEditDialog(agencia)" 
                      mat-icon-button 
                      color="primary"
                      matTooltip="Editar"
                      class="!w-8 !h-8">
                      <mat-icon class="!text-lg">edit</mat-icon>
                    </button>
                    <button 
                      (click)="deleteAgencia(agencia)" 
                      mat-icon-button 
                      color="warn"
                      matTooltip="Eliminar"
                      class="!w-8 !h-8">
                      <mat-icon class="!text-lg">delete</mat-icon>
                    </button>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>

          <!-- Paginación -->
          <mat-paginator 
            [pageSizeOptions]="[5, 10, 25, 50]"
            showFirstLastButtons
            class="mt-4">
          </mat-paginator>
        </mat-card-content>
      </mat-card>

      <!-- Contador de resultados -->
      <div class="mt-4 text-sm text-gray-600 text-center">
        Mostrando {{ dataSource.filteredData.length }} de {{ totalAgencias }} agencias
      </div>
    </div>
  `
})
export class AgenciasComponent implements OnInit, AfterViewInit {
  agencias: Agencia[] = [];
  dataSource = new MatTableDataSource<Agencia>([]);
  totalAgencias = 0;
  searchTerm = '';
  statusFilter = '';
  
  displayedColumns: string[] = ['Id', 'IdAgency', 'Name', 'Enabled', 'acciones'];
  
  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private agenciaService: AgenciaService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAgencias();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    // Configurar filtro personalizado
    this.dataSource.filterPredicate = (data: Agencia, filter: string) => {
      const searchTerm = filter.toLowerCase();
      return data.Name.toLowerCase().includes(searchTerm) ||
             data.IdAgency.toLowerCase().includes(searchTerm);
    };
  }

  loadAgencias(): void {
    this.loading = true;
    this.agenciaService.getAgencias().subscribe({
      next: (response) => {
        if (response.success && response.data?.agencies) {
          this.agencias = response.data.agencies;
          this.totalAgencias = response.data.total;
          this.dataSource.data = this.agencias;
          this.applyFilter();
        } else {
          this.snackBar.open(response.message || 'Error al cargar agencias', 'Error', {
            duration: 3000
          });
        }
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading agencias:', error);
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
      const status = this.statusFilter === 'true' ? '1' : '0';
      this.dataSource.data = this.agencias.filter(agencia => 
        agencia.Enabled === status &&
        (filterValue === '' || 
         agencia.Name.toLowerCase().includes(filterValue.toLowerCase()) ||
         agencia.IdAgency.toLowerCase().includes(filterValue.toLowerCase()))
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
    this.loadAgencias();
  }

  openCreateDialog(): void {
    const dialogData: AgenciaEditDialogData = {
      agencia: {} as Agencia,
      mode: 'create'
    };

    const dialogRef = this.dialog.open(AgenciaEditDialogComponent, {
      width: '600px',
      data: dialogData,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshData();
      }
    });
  }

  openEditDialog(agencia: Agencia): void {
    const dialogData: AgenciaEditDialogData = {
      agencia: agencia,
      mode: 'edit'
    };

    const dialogRef = this.dialog.open(AgenciaEditDialogComponent, {
      width: '600px',
      data: dialogData,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshData();
      }
    });
  }



  deleteAgencia(agencia: Agencia): void {
    if (confirm(`¿Estás seguro de que quieres eliminar la agencia "${agencia.Name}"?`)) {
      this.agenciaService.deleteAgencia(agencia.Id!).subscribe({
        next: (response) => {
          if (response.success) {
            this.agencias = this.agencias.filter(a => a.Id !== agencia.Id);
            this.applyFilter();
            this.snackBar.open('Agencia eliminada exitosamente', 'Éxito', {
              duration: 2000
            });
          } else {
            this.snackBar.open(response.message || 'Error al eliminar agencia', 'Error', {
              duration: 3000
            });
          }
        },
        error: (error) => {
          console.error('Error deleting agencia:', error);
          this.snackBar.open('Error al eliminar agencia', 'Error', {
            duration: 3000
          });
        }
      });
    }
  }
}
