import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
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
import { DocumentoRequeridoService } from '../../../core/services/documento-requerido.service';

// Importar interfaces existentes
import { Proceso } from '../../../core/interfaces/proceso.interface';
import { CostumerType } from '../../../core/interfaces/costumer-type.interface';
import { TipoOperacion } from '../../../core/interfaces/tipo-operacion.interface';
import { DocumentoRequerido, DocumentoRequeridoFilters } from '../../../core/interfaces/documento-requerido.interface';
import { DocumentoRequeridoEditDialogComponent } from './documento-requerido-edit-dialog/documento-requerido-edit-dialog.component';
import { DuplicateConfigurationDialogComponent } from './duplicate-configuration-dialog/duplicate-configuration-dialog.component';

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

  displayedColumns: string[] = ['id', 'agencia', 'proceso', 'tipoCliente', 'tipoOperacion', 'tipoDocumento', 'etapa', 'subEtapa', 'requerido', 'requiereExpiracion'];
  dataSource = new MatTableDataSource<DocumentoRequerido>([]);
  
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
  selectedItem: DocumentoRequerido | null = null;
  
  // Estadísticas
  stats: any = null;

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private procesoService: ProcesoService,
    private agencyService: AgencyService,
    private costumerTypeService: CostumerTypeService,
    private tipoOperacionService: TipoOperacionService,
    private documentoRequeridoService: DocumentoRequeridoService
  ) {}

  ngOnInit(): void {
    this.loadCatalogs();
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    // Configurar sortingDataAccessor para mapear correctamente las propiedades
    this.dataSource.sortingDataAccessor = (item: any, property: string) => {
      switch (property) {
        case 'id':
          return item.Id;
        case 'agencia':
          return item.AgenciaName || '';
        case 'proceso':
          return item.ProcesoName || '';
        case 'tipoCliente':
          return item.TipoClienteName || '';
        case 'tipoOperacion':
          return item.TipoOperacionName || '';
        case 'tipoDocumento':
          return item.TipoDocumentoName || '';
        case 'etapa':
          return item.ProcessTypeName || '';
        case 'subEtapa':
          return item.SubProcessName || '';
        case 'requerido':
          return item.Required === '1' ? 'Sí' : 'No';
        case 'requiereExpiracion':
          return item.ReqExpiration === '1' ? 'Sí' : 'No';
        default:
          return item[property];
      }
    };
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
    // Verificar si todos los catálogos han sido procesados (aunque estén vacíos)
    const totalCatalogs = 4; // procesos, agencias, tipos de cliente, tipos de operación
    const catalogsProcessed = (this.processes.length >= 0 ? 1 : 0) + 
                             (this.agencies.length >= 0 ? 1 : 0) + 
                             (this.customerTypes.length >= 0 ? 1 : 0) + 
                             (this.operationTypes.length >= 0 ? 1 : 0);
    
    if (catalogsProcessed >= totalCatalogs) {
      this.loadingCatalogs = false;
      console.log('✅ Catálogos procesados - Procesos:', this.processes.length, 
                  'Agencias:', this.agencies.length, 
                  'Tipos Cliente:', this.customerTypes.length, 
                  'Tipos Operación:', this.operationTypes.length);
      
      // Si no hay catálogos, mostrar mensaje de error
      if (this.processes.length === 0 && this.agencies.length === 0 && 
          this.customerTypes.length === 0 && this.operationTypes.length === 0) {
        this.snackBar.open('No se pudieron cargar los catálogos. Verifica la conexión con el backend.', 'Error', { duration: 5000 });
      }
    }
  }

  loadData(): void {
    if (!this.isConfigurationSelected()) {
      this.dataSource.data = [];
      return;
    }

    this.loading = true;
    
    // Construir filtros solo con los valores seleccionados
    const filters: DocumentoRequeridoFilters = {};
    
    // Solo agregar filtros que estén seleccionados
    if (this.selectedProcess) filters.IdProcess = this.selectedProcess;
    if (this.selectedAgency) filters.IdAgency = this.selectedAgency;
    if (this.selectedCustomerType) filters.IdCostumerType = this.selectedCustomerType;
    if (this.selectedOperationType) filters.IdOperationType = this.selectedOperationType;

            this.documentoRequeridoService.getDocumentosRequeridos(filters).subscribe({
          next: (response) => {
            if (response.success && response.data) {
              this.dataSource.data = response.data.documentos || [];
            } else {
              this.snackBar.open(response.message || 'Error al cargar documentos', 'Error', { duration: 3000 });
              this.dataSource.data = [];
            }
            this.loading = false;
          },
      error: (error) => {
        console.error('Error cargando documentos requeridos:', error);
        this.snackBar.open('Error al cargar documentos requeridos', 'Error', { duration: 3000 });
        this.dataSource.data = [];
        this.loading = false;
      }
    });
  }

  onConfigurationChange(): void {
    // Cargar datos cuando cambia cualquier selección
    this.loadData();
    
    // Limpiar el item seleccionado cuando cambian los filtros
    this.selectedItem = null;
  }

  isConfigurationSelected(): boolean {
    // Si no hay ninguna selección, considerar como si estuviera todo seleccionado (ver todos los datos)
    if (!this.selectedProcess && !this.selectedAgency && !this.selectedCustomerType && !this.selectedOperationType) {
      return true;
    }
    // Si hay al menos una selección, permitir mostrar datos
    return true;
  }

  hasDataForConfiguration(): boolean {
    // Para modificar la configuración, solo se requiere que TODOS los filtros estén seleccionados
    // No es necesario que haya datos, porque se modifica la configuración base
    return !!(this.selectedProcess && this.selectedAgency && this.selectedCustomerType && this.selectedOperationType);
  }

  clearFilters(): void {
    this.selectedProcess = '';
    this.selectedAgency = '';
    this.selectedCustomerType = '';
    this.selectedOperationType = '';
    this.selectedItem = null; // También limpiar el item seleccionado
    this.loadData(); // Recargar todos los datos después de limpiar filtros
    this.snackBar.open('Filtros limpiados', 'Info', { duration: 2000 });
  }

  refreshData(): void {
    this.loadData();
  }

  addDocumentoRequerido(): void {
    // Para crear una nueva configuración, no es necesario tener filtros seleccionados
    // Se puede crear con valores por defecto o vacíos
    const configuracion = {
      IdProcess: this.selectedProcess || '',
      IdAgency: this.selectedAgency || '',
      IdCostumerType: this.selectedCustomerType || '',
      IdOperationType: this.selectedOperationType || ''
    };

    const dialogRef = this.dialog.open(DocumentoRequeridoEditDialogComponent, {
      width: '800px',
      data: {
        mode: 'create',
        configuracion: configuracion
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
        this.snackBar.open('Documento requerido creado exitosamente', 'Éxito', { duration: 2000 });
      }
    });
  }

  editDocumentoRequerido(item: DocumentoRequerido): void {
    if (!item) {
      this.snackBar.open('Selecciona un documento para editar la configuración', 'Warning', { duration: 3000 });
      return;
    }

    const dialogRef = this.dialog.open(DocumentoRequeridoEditDialogComponent, {
      width: '800px',
      data: {
        mode: 'edit',
        documento: item
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
        this.snackBar.open('Configuración actualizada exitosamente', 'Éxito', { duration: 2000 });
      }
    });
  }

  editConfiguration(): void {
    // Crear objeto de configuración con los filtros seleccionados
    const configuracion = {
      IdProcess: this.selectedProcess,
      IdAgency: this.selectedAgency,
      IdCostumerType: this.selectedCustomerType,
      IdOperationType: this.selectedOperationType
    };

    const dialogRef = this.dialog.open(DocumentoRequeridoEditDialogComponent, {
      width: '800px',
      data: {
        mode: 'edit',
        configuracion: configuracion
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
        this.snackBar.open('Configuración general actualizada exitosamente', 'Éxito', { duration: 2000 });
      }
    });
  }



  // Método para seleccionar un item de la tabla
  onRowClick(element: DocumentoRequerido): void {
    this.selectedItem = element;
    console.log('Item seleccionado:', element);
  }

  // Método para verificar si se puede duplicar la configuración
  canDuplicateConfiguration(): boolean {
    // Solo se puede duplicar si TODOS los filtros están seleccionados
    // y hay datos para esa configuración
    return this.hasDataForConfiguration() && this.dataSource.data.length > 0;
  }

  // Método para abrir el diálogo de duplicación
  duplicateConfiguration(): void {
    if (!this.canDuplicateConfiguration()) {
      this.snackBar.open('Selecciona una configuración completa para duplicar', 'Warning', { duration: 3000 });
      return;
    }

    // Obtener nombres de los elementos seleccionados
    const currentAgency = this.agencies.find(a => a.Id.toString() === this.selectedAgency);
    const currentProcess = this.processes.find(p => p.Id.toString() === this.selectedProcess);
    const currentCustomerType = this.customerTypes.find(c => c.Id.toString() === this.selectedCustomerType);
    const currentOperationType = this.operationTypes.find(o => o.Id.toString() === this.selectedOperationType);

    if (!currentAgency || !currentProcess || !currentCustomerType || !currentOperationType) {
      this.snackBar.open('Error obteniendo información de la configuración', 'Error', { duration: 3000 });
      return;
    }

    // Crear objeto de configuración con los filtros seleccionados
    const configuracion = {
      IdProcess: this.selectedProcess,
      IdAgency: parseInt(this.selectedAgency),
      IdCostumerType: this.selectedCustomerType,
      IdOperationType: this.selectedOperationType
    };

    const dialogRef = this.dialog.open(DuplicateConfigurationDialogComponent, {
      width: '800px',
      data: {
        configuracion: configuracion,
        currentAgencyName: currentAgency.Name,
        processName: currentProcess.Name,
        customerTypeName: currentCustomerType.Name,
        operationTypeName: currentOperationType.Name
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        this.loadData();
        this.snackBar.open(
          `Configuración duplicada exitosamente a ${result.agenciesCount} agencia(s)`, 
          'Éxito', 
          { duration: 3000 }
        );
      }
    });
  }
}
