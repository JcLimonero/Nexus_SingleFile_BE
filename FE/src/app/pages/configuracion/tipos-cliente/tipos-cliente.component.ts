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
import { CostumerType, CostumerTypeResponse } from '../../../core/interfaces/costumer-type.interface';
import { CostumerTypeService } from '../../../core/services/costumer-type.service';
import { CostumerTypeEditDialogComponent } from './costumer-type-edit-dialog/costumer-type-edit-dialog.component';

@Component({
  selector: 'app-tipos-cliente',
  templateUrl: './tipos-cliente.component.html',
  styleUrls: ['./tipos-cliente.component.scss'],
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
export class TiposClienteComponent implements OnInit, AfterViewInit {
  tiposCliente: CostumerType[] = [];
  dataSource = new MatTableDataSource<CostumerType>([]);
  displayedColumns: string[] = ['Id', 'Name', 'Enabled', 'acciones'];
  loading = false;
  searchTerm = '';
  statusFilter = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private costumerTypeService: CostumerTypeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadTiposCliente();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Configurar filtro personalizado
    this.dataSource.filterPredicate = (data: CostumerType, filter: string) => {
      const searchTerm = filter.toLowerCase();
      return data.Name.toLowerCase().includes(searchTerm);
    };
  }

  loadTiposCliente(): void {
    console.log('🔄 Cargando tipos de cliente...');
    this.loading = true;
    this.costumerTypeService.getAllCostumerTypes().subscribe({
      next: (response: CostumerTypeResponse) => {
        console.log('✅ Respuesta del API:', response);
        if (response.success) {
          this.tiposCliente = response.data.costumer_types;
          console.log('📊 Tipos de cliente cargados:', this.tiposCliente);
          this.dataSource.data = this.tiposCliente;
          this.applyFilter();
          console.log('🔢 Total de registros en dataSource:', this.dataSource.data.length);
        } else {
          console.error('❌ Error en respuesta del API:', response.message);
          this.snackBar.open(response.message || 'Error al cargar tipos de cliente', 'Error', {
            duration: 3000
          });
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Error loading tipos cliente:', error);
        this.snackBar.open('Error al cargar tipos de cliente', 'Error', {
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
      this.dataSource.data = this.tiposCliente.filter(tipoCliente => 
        tipoCliente.Enabled === status &&
        (filterValue === '' || 
         tipoCliente.Name.toLowerCase().includes(filterValue.toLowerCase()))
      );
    } else {
      this.dataSource.data = this.tiposCliente;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    
    // Reset paginator to first page
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  refreshData(): void {
    this.loadTiposCliente();
  }

  openCreateDialog(): void {
    const dialogData = {
      costumerType: {} as CostumerType,
      mode: 'create'
    };

    const dialogRef = this.dialog.open(CostumerTypeEditDialogComponent, {
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

  openEditDialog(costumerType: CostumerType): void {
    const dialogData = {
      costumerType: costumerType,
      mode: 'edit'
    };

    const dialogRef = this.dialog.open(CostumerTypeEditDialogComponent, {
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

  deleteCostumerType(costumerType: CostumerType): void {
    if (confirm(`¿Estás seguro de que quieres eliminar el tipo de cliente "${costumerType.Name}"?`)) {
      this.costumerTypeService.deleteCostumerType(costumerType.Id!).subscribe({
        next: (response) => {
          if (response.success) {
            this.tiposCliente = this.tiposCliente.filter(t => t.Id !== costumerType.Id);
            this.applyFilter();
            this.snackBar.open('Tipo de cliente eliminado exitosamente', 'Éxito', {
              duration: 2000
            });
          } else {
            this.snackBar.open(response.message || 'Error al eliminar tipo de cliente', 'Error', {
              duration: 3000
            });
          }
        },
        error: (error) => {
          console.error('Error deleting costumer type:', error);
          this.snackBar.open('Error al eliminar tipo de cliente', 'Error', {
            duration: 3000
          });
        }
      });
    }
  }

  toggleStatus(costumerType: CostumerType): void {
    this.costumerTypeService.toggleStatus(costumerType.Id!).subscribe({
      next: (response) => {
        if (response.success) {
          // Actualizar el estado en la lista local
          const index = this.tiposCliente.findIndex(t => t.Id === costumerType.Id);
          if (index !== -1) {
            this.tiposCliente[index].Enabled = this.tiposCliente[index].Enabled === '1' ? '0' : '1';
            this.applyFilter();
          }
          
          this.snackBar.open('Estado cambiado exitosamente', 'Éxito', {
            duration: 2000
          });
        } else {
          this.snackBar.open(response.message || 'Error al cambiar estado', 'Error', {
            duration: 3000
          });
        }
      },
      error: (error) => {
        console.error('Error toggling status:', error);
        this.snackBar.open('Error al cambiar estado', 'Error', {
          duration: 3000
        });
      }
    });
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
