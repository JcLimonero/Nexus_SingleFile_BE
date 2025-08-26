import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

// Importar servicios existentes
import { ProcesoService } from '../../../core/services/proceso.service';
import { AgencyService, Agency } from '../../../core/services/agency.service';
import { CostumerTypeService } from '../../../core/services/costumer-type.service';
import { TipoOperacionService } from '../../../core/services/tipo-operacion.service';

// Importar interfaces existentes
import { Proceso } from '../../../core/interfaces/proceso.interface';
import { CostumerType } from '../../../core/interfaces/costumer-type.interface';
import { TipoOperacion } from '../../../core/interfaces/tipo-operacion.interface';

@Component({
  selector: 'app-documentos-requeridos',
  templateUrl: './documentos-requeridos.component.html',
  styleUrls: ['./documentos-requeridos.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSelectModule
  ]
})
export class DocumentosRequeridosComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['id', 'proceso', 'agencia', 'tipoCliente', 'tipoOperacion', 'documento'];
  dataSource = new MatTableDataSource<any>([]);
  
  loading = false;
  loadingCatalogs = false;
  selectedProcess = '';
  selectedAgency = '';
  selectedCustomerType = '';
  selectedOperationType = '';
  
  // Datos para los dropdowns usando interfaces existentes
  processes: Proceso[] = [];
  agencies: Agency[] = [];
  customerTypes: CostumerType[] = [];
  operationTypes: TipoOperacion[] = [];
  
  // Item seleccionado para edición
  selectedItem: any = null;

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private procesoService: ProcesoService,
    private agencyService: AgencyService,
    private costumerTypeService: CostumerTypeService,
    private tipoOperacionService: TipoOperacionService
  ) {}

  ngOnInit(): void {
    this.loadCatalogs();
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadCatalogs(): void {
    this.loadingCatalogs = true;
    console.log('🔄 Iniciando carga de catálogos...');
    
    // Cargar procesos
    console.log('🔄 Cargando procesos...');
    this.procesoService.getProcesos().subscribe({
      next: (response: any) => {
        console.log('📋 Respuesta de procesos:', response);
        if (response?.success && response.data) {
          this.processes = response.data.processes || [];
          console.log('✅ Procesos cargados:', this.processes.length);
        } else {
          console.error('❌ Error cargando procesos:', response);
          this.snackBar.open('Error al cargar procesos', 'Error', { duration: 3000 });
        }
        this.checkCatalogsLoaded();
      },
      error: (error: any) => {
        console.error('❌ Error cargando procesos:', error);
        this.snackBar.open('Error al cargar procesos', 'Error', { duration: 3000 });
        this.checkCatalogsLoaded();
      }
    });

    // Cargar agencias con debug detallado
    console.log('🔄 Cargando agencias...');
    console.log('🏢 AgencyService disponible:', !!this.agencyService);
    
    // Verificar la URL que se va a construir
    const testUrl = this.agencyService['apiBaseService'].buildApiUrl('agency');
    console.log('🔗 URL que se va a construir para agencias:', testUrl);
    console.log('🔗 URL incluye localhost:8080:', testUrl.includes('localhost:8080'));
    
    // Usar método más simple sin parámetros
    this.agencyService.getAgencies({}).subscribe({
      next: (response: any) => {
        console.log('📋 Respuesta completa de agencias:', response);
        console.log('📋 Response.success:', response?.success);
        console.log('📋 Response.data:', response?.data);
        console.log('📋 Response.data.agencies:', response?.data?.agencies);
        
        if (response?.success && response.data) {
          this.agencies = response.data.agencies || [];
          console.log('✅ Agencias cargadas:', this.agencies.length);
          console.log('✅ Primeras 3 agencias:', this.agencies.slice(0, 3));
        } else {
          console.error('❌ Error cargando agencias - Respuesta inválida:', response);
          this.snackBar.open('Error al cargar agencias: Respuesta inválida', 'Error', { duration: 3000 });
        }
        this.checkCatalogsLoaded();
      },
      error: (error: any) => {
        console.error('❌ Error cargando agencias:', error);
        console.error('❌ Error status:', error.status);
        console.error('❌ Error message:', error.message);
        console.error('❌ Error error:', error.error);
        this.snackBar.open(`Error al cargar agencias: ${error.message || 'Error desconocido'}`, 'Error', { duration: 3000 });
        this.checkCatalogsLoaded();
      }
    });

    // Cargar tipos de cliente
    console.log('🔄 Cargando tipos de cliente...');
    this.costumerTypeService.getCostumerTypes().subscribe({
      next: (response: any) => {
        console.log('📋 Respuesta de tipos de cliente:', response);
        if (response?.success && response.data) {
          this.customerTypes = response.data.costumer_types || [];
          console.log('✅ Tipos de cliente cargados:', this.customerTypes.length);
        } else {
          console.error('❌ Error cargando tipos de cliente:', response);
          this.snackBar.open('Error al cargar tipos de cliente', 'Error', { duration: 3000 });
        }
        this.checkCatalogsLoaded();
      },
      error: (error: any) => {
        console.error('❌ Error cargando tipos de cliente:', error);
        this.snackBar.open('Error al cargar tipos de cliente', 'Error', { duration: 3000 });
        this.checkCatalogsLoaded();
      }
    });

    // Cargar tipos de operación
    console.log('🔄 Cargando tipos de operación...');
    this.tipoOperacionService.getTiposOperacion().subscribe({
      next: (response: any) => {
        console.log('📋 Respuesta de tipos de operación:', response);
        if (response?.success && response.data) {
          this.operationTypes = response.data.operationTypes || [];
          console.log('✅ Tipos de operación cargados:', this.operationTypes.length);
        } else {
          console.error('❌ Error cargando tipos de operación:', response);
          this.snackBar.open('Error al cargar tipos de operación', 'Error', { duration: 3000 });
        }
        this.checkCatalogsLoaded();
      },
      error: (error: any) => {
        console.error('❌ Error cargando tipos de operación:', error);
        this.snackBar.open('Error al cargar tipos de operación', 'Error', { duration: 3000 });
        this.checkCatalogsLoaded();
      }
    });
  }

  private checkCatalogsLoaded(): void {
    if (this.processes.length > 0 || this.agencies.length > 0 || 
        this.customerTypes.length > 0 || this.operationTypes.length > 0) {
      this.loadingCatalogs = false;
      console.log('✅ Catálogos cargados - Procesos:', this.processes.length, 
                  'Agencias:', this.agencies.length, 
                  'Tipos Cliente:', this.customerTypes.length, 
                  'Tipos Operación:', this.operationTypes.length);
    }
  }

  loadData(): void {
    this.loading = true;
    
    // TODO: Implementar carga de datos desde el servicio de configuración
    // Por ahora, datos de ejemplo para mostrar la estructura
    setTimeout(() => {
      this.dataSource.data = [
        {
          id: 1,
          proceso: 'AUTOS NUEVOS',
          agencia: 'MOTONOVA',
          tipoCliente: 'CONSUMIDOR (MOTO EXCEDE MON)',
          tipoOperacion: 'CAJA POPULAR',
          documento: 'AUTORIZACION BANCARIA',
          orden: 1
        },
        {
          id: 2,
          proceso: 'AUTOS NUEVOS',
          agencia: 'MOTONOVA',
          tipoCliente: 'CONSUMIDOR (MOTO EXCEDE MON)',
          tipoOperacion: 'CAJA POPULAR',
          documento: 'COMPROBANTE DE DOMICILIO',
          orden: 2
        },
        {
          id: 3,
          proceso: 'AUTOS NUEVOS',
          agencia: 'MOTONOVA',
          tipoCliente: 'CONSUMIDOR (MOTO EXCEDE MON)',
          tipoOperacion: 'CAJA POPULAR',
          documento: 'IDENTIFICACION OFICIAL',
          orden: 3
        },
        {
          id: 4,
          proceso: 'AUTOS NUEVOS',
          agencia: 'MOTONOVA',
          tipoCliente: 'PERSONA MORAL (MOTO EX MON)',
          tipoOperacion: 'CONTADO',
          documento: 'ACTA CONSTITUTIVA',
          orden: 1
        },
        {
          id: 5,
          proceso: 'AUTOS NUEVOS',
          agencia: 'MOTONOVA',
          tipoCliente: 'PERSONA MORAL (MOTO EX MON)',
          tipoOperacion: 'CONTADO',
          documento: 'CEDULA FISCAL',
          orden: 2
        }
      ];
      this.loading = false;
      this.snackBar.open('Datos cargados', 'Info', { duration: 2000 });
    }, 1000);
  }

  onConfigurationChange(): void {
    // Cuando cambia cualquier selección, cargar los documentos de esa configuración
    if (this.selectedProcess && this.selectedAgency && this.selectedCustomerType && this.selectedOperationType) {
      this.loadData();
    }
  }

  isConfigurationSelected(): boolean {
    return !!(this.selectedProcess && this.selectedAgency && this.selectedCustomerType && this.selectedOperationType);
  }

  clearFilters(): void {
    this.selectedProcess = '';
    this.selectedAgency = '';
    this.selectedCustomerType = '';
    this.selectedOperationType = '';
    this.dataSource.data = [];
    this.snackBar.open('Filtros limpiados', 'Info', { duration: 2000 });
  }

  refreshData(): void {
    if (this.isConfigurationSelected()) {
      this.loadData();
    } else {
      this.snackBar.open('Selecciona una configuración completa', 'Info', { duration: 2000 });
    }
  }

  addDocumentoRequerido(): void {
    if (!this.isConfigurationSelected()) {
      this.snackBar.open('Selecciona una configuración completa', 'Warning', { duration: 3000 });
      return;
    }
    // TODO: Implementar modal para agregar documento requerido
    this.snackBar.open('Función en desarrollo', 'Info', { duration: 2000 });
  }

  editDocumentoRequerido(item: any): void {
    if (!item) {
      this.snackBar.open('Selecciona un documento para editar', 'Warning', { duration: 3000 });
      return;
    }
    // TODO: Implementar modal para editar documento requerido
    this.snackBar.open('Función en desarrollo', 'Info', { duration: 2000 });
  }

  deleteDocumentoRequerido(item: any): void {
    if (!item) {
      this.snackBar.open('Selecciona un documento para eliminar', 'Warning', { duration: 3000 });
      return;
    }
    // TODO: Implementar modal para eliminar documento requerido
    this.snackBar.open('Función en desarrollo', 'Info', { duration: 2000 });
  }

  // Método para seleccionar un item de la tabla
  onRowClick(element: any): void {
    this.selectedItem = element;
    console.log('Item seleccionado:', element);
  }
}
