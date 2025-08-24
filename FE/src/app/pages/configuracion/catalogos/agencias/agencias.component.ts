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
  templateUrl: './agencias.component.html'
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
      disableClose: false
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
      disableClose: false
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

  getPageRange(): string {
    if (!this.paginator || this.dataSource.filteredData.length === 0) {
      return '0-0';
    }
    
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize + 1;
    const endIndex = Math.min(startIndex + this.paginator.pageSize - 1, this.dataSource.filteredData.length);
    
    return `${startIndex}-${endIndex}`;
  }
}
