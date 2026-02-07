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
import { MatTabsModule, MatTabGroup } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';

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
import { DocumentosConfiguracionDialogComponent } from './documentos-configuracion-dialog/documentos-configuracion-dialog.component';

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
    MatSelectModule,
    MatTabsModule,
    MatTooltipModule
  ]
})
export class DocumentosRequeridosComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('configuracionesPaginator') configuracionesPaginator!: MatPaginator;
  @ViewChild('configuracionesSort') configuracionesSort!: MatSort;
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;

  displayedColumns: string[] = ['id', 'agencia', 'proceso', 'tipoCliente', 'tipoOperacion', 'tipoDocumento', 'etapa', 'subEtapa', 'requerido', 'requiereExpiracion'];
  dataSource = new MatTableDataSource<DocumentoRequerido>([]);
  
  // Tab 1: Configuraciones agrupadas
  displayedColumnsConfiguraciones: string[] = ['id', 'agencia', 'proceso', 'tipoCliente', 'tipoOperacion', 'totalDocumentos', 'enabled', 'acciones'];
  dataSourceConfiguraciones = new MatTableDataSource<any>([]);
  selectedAgencyForConfiguraciones = '';
  
  loading = false;
  loadingCatalogs = false;
  loadingConfiguraciones = false;
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
    this.loadConfiguraciones();
  }

  ngAfterViewInit(): void {
    // Configurar paginador y sort para el Tab 2
    if (this.paginator) {
      // Asegurar que el pageSize sea 25 para mostrar más registros
      this.paginator.pageSize = 25;
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
    
    // Configurar paginador y sort para configuraciones (puede no estar disponible inmediatamente si está en un tab inactivo)
    setTimeout(() => {
      if (this.configuracionesPaginator) {
        this.dataSourceConfiguraciones.paginator = this.configuracionesPaginator;
      }
      if (this.configuracionesSort) {
        this.dataSourceConfiguraciones.sort = this.configuracionesSort;
      }
      
      // Reconectar sort del Tab 2 si no estaba disponible inicialmente
      if (!this.dataSource.sort && this.sort) {
        this.dataSource.sort = this.sort;
      }
      if (!this.dataSource.paginator && this.paginator) {
        // Asegurar que el pageSize sea 25
        this.paginator.pageSize = 25;
        this.dataSource.paginator = this.paginator;
      }
    }, 100);
    
    // Configurar sortingDataAccessor para mapear correctamente las propiedades del Tab 2
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

    // Configurar sortingDataAccessor para configuraciones agrupadas (Tab 1)
    this.dataSourceConfiguraciones.sortingDataAccessor = (item: any, property: string) => {
      switch (property) {
        case 'agencia':
          return item.AgenciaName || '';
        case 'proceso':
          return item.ProcesoName || '';
        case 'tipoCliente':
          return item.TipoClienteName || '';
        case 'tipoOperacion':
          return item.TipoOperacionName || '';
        case 'enabled':
          return item.Enabled === '1' || item.Enabled === 1 ? 'Activo' : 'Inactivo';
        case 'totalDocumentos':
          return item.totalDocumentos || 0;
        default:
          return item[property];
      }
    };
  }

  loadCatalogs(): void {
    this.loadingCatalogs = true;

    // Cargar procesos

    this.procesoService.getProcesos().subscribe({
      next: (response: any) => {

        if (response?.success && response.data) {
          this.processes = response.data.processes || [];

        } else {

          this.snackBar.open('Error al cargar procesos', 'Error', { duration: 3000 });
        }
        this.checkCatalogsLoaded();
      },
      error: (error: any) => {

        this.snackBar.open('Error al cargar procesos', 'Error', { duration: 3000 });
        this.checkCatalogsLoaded();
      }
    });

    // Cargar agencias con debug detallado

    // Verificar la URL que se va a construir
    const testUrl = this.agencyService['apiBaseService'].buildApiUrl('agency');

    
    
    // Usar método más simple sin parámetros
    this.agencyService.getAgencies({}).subscribe({
      next: (response: any) => {

        if (response?.success && response.data) {
          this.agencies = response.data.agencies || [];

          
        } else {

          this.snackBar.open('Error al cargar agencias: Respuesta inválida', 'Error', { duration: 3000 });
        }
        this.checkCatalogsLoaded();
      },
      error: (error: any) => {

        this.snackBar.open(`Error al cargar agencias: ${error.message || 'Error desconocido'}`, 'Error', { duration: 3000 });
        this.checkCatalogsLoaded();
      }
    });

    // Cargar tipos de cliente

    this.costumerTypeService.getCostumerTypes().subscribe({
      next: (response: any) => {

        if (response?.success && response.data) {
          this.customerTypes = response.data.costumer_types || [];

        } else {

          this.snackBar.open('Error al cargar tipos de cliente', 'Error', { duration: 3000 });
        }
        this.checkCatalogsLoaded();
      },
      error: (error: any) => {

        this.snackBar.open('Error al cargar tipos de cliente', 'Error', { duration: 3000 });
        this.checkCatalogsLoaded();
      }
    });

    // Cargar tipos de operación

    this.tipoOperacionService.getTiposOperacion().subscribe({
      next: (response: any) => {

        if (response?.success && response.data) {
          this.operationTypes = response.data.operationTypes || [];

        } else {

          this.snackBar.open('Error al cargar tipos de operación', 'Error', { duration: 3000 });
        }
        this.checkCatalogsLoaded();
      },
      error: (error: any) => {

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
              const documentos = response.data.documentos || [];

              
              
              this.dataSource.data = documentos;
              
              // Asegurar que el paginador tenga el pageSize correcto después de cargar datos
              setTimeout(() => {

                if (this.paginator) {
                  // Forzar el pageSize a 25 si está en 10
                  if (this.paginator.pageSize === 10) {

                    this.paginator.pageSize = 25;
                    this.paginator._changePageSize(25);
                  }

                }
              }, 100);
            } else {
              this.snackBar.open(response.message || 'Error al cargar documentos', 'Error', { duration: 3000 });
              this.dataSource.data = [];
            }
            this.loading = false;
          },
      error: (error) => {

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
    // Para crear una nueva configuración, usar filtros del Tab 2 si están disponibles,
    // o del Tab 1 (filtro de agencia), o valores vacíos
    const configuracion = {
      IdProcess: this.selectedProcess || '',
      IdAgency: this.selectedAgency || this.selectedAgencyForConfiguraciones || '',
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
        this.loadConfiguraciones(); // Recargar también las configuraciones agrupadas
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
        this.loadConfiguraciones(); // Recargar también las configuraciones agrupadas
        this.snackBar.open('Configuración actualizada exitosamente', 'Éxito', { duration: 2000 });
      }
    });
  }

  editConfiguration(): void {
    // Buscar el estado de la configuración desde los datos cargados
    const existingConfig = this.dataSource.data.find(doc => 
      doc.IdProcess === this.selectedProcess &&
      doc.IdAgency === this.selectedAgency &&
      doc.IdCostumerType === this.selectedCustomerType &&
      doc.IdOperationType === this.selectedOperationType
    );

    // Crear objeto de configuración con los filtros seleccionados
    const configuracion = {
      IdProcess: this.selectedProcess,
      IdAgency: this.selectedAgency,
      IdCostumerType: this.selectedCustomerType,
      IdOperationType: this.selectedOperationType,
      Enabled: existingConfig?.Enabled || '1'
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
        this.loadConfiguraciones(); // Recargar también las configuraciones agrupadas
        this.snackBar.open('Configuración general actualizada exitosamente', 'Éxito', { duration: 2000 });
      }
    });
  }

  // Método para seleccionar un item de la tabla
  onRowClick(element: DocumentoRequerido): void {
    this.selectedItem = element;

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
        this.loadConfiguraciones(); // Recargar también las configuraciones agrupadas
        this.snackBar.open(
          `Configuración duplicada exitosamente a ${result.agenciesCount} agencia(s)`, 
          'Éxito', 
          { duration: 3000 }
        );
      }
    });
  }

  /**
   * Cargar configuraciones agrupadas para el Tab 1
   */
  loadConfiguraciones(): void {
    this.loadingConfiguraciones = true;
    
    // Construir filtros solo con la agencia seleccionada
    const filters: DocumentoRequeridoFilters = {};
    if (this.selectedAgencyForConfiguraciones) {
      filters.IdAgency = this.selectedAgencyForConfiguraciones;
    }

    this.documentoRequeridoService.getDocumentosRequeridos(filters).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const documentos = response.data.documentos || [];
          
          // Agrupar por configuración (Proceso, Agencia, Tipo Cliente, Tipo Operación)
          const configuracionesMap = new Map<string, any>();
          
          documentos.forEach((doc: DocumentoRequerido) => {
            const key = `${doc.IdProcess}-${doc.IdAgency}-${doc.IdCostumerType}-${doc.IdOperationType}`;
            
            if (!configuracionesMap.has(key)) {
              configuracionesMap.set(key, {
                IdConfigurationProcess: doc.IdConfigurationProcess,
                IdProcess: doc.IdProcess,
                IdAgency: doc.IdAgency,
                IdCostumerType: doc.IdCostumerType,
                IdOperationType: doc.IdOperationType,
                ProcesoName: doc.ProcesoName || 'N/A',
                AgenciaName: doc.AgenciaName || 'N/A',
                TipoClienteName: doc.TipoClienteName || 'N/A',
                TipoOperacionName: doc.TipoOperacionName || 'N/A',
                Enabled: doc.Enabled || '1',
                totalDocumentos: 0
              });
            }
            
            const config = configuracionesMap.get(key);
            config.totalDocumentos++;
          });
          
          // Convertir map a array
          const configuraciones = Array.from(configuracionesMap.values());
          this.dataSourceConfiguraciones.data = configuraciones;
          
          // Asegurar que el paginador y sort estén conectados después de cargar datos
          setTimeout(() => {
            if (this.configuracionesPaginator && !this.dataSourceConfiguraciones.paginator) {
              this.dataSourceConfiguraciones.paginator = this.configuracionesPaginator;
            }
            if (this.configuracionesSort && !this.dataSourceConfiguraciones.sort) {
              this.dataSourceConfiguraciones.sort = this.configuracionesSort;
            }
          }, 0);
        } else {
          this.snackBar.open(response.message || 'Error al cargar configuraciones', 'Error', { duration: 3000 });
          this.dataSourceConfiguraciones.data = [];
        }
        this.loadingConfiguraciones = false;
      },
      error: (error) => {

        this.snackBar.open('Error al cargar configuraciones', 'Error', { duration: 3000 });
        this.dataSourceConfiguraciones.data = [];
        this.loadingConfiguraciones = false;
      }
    });
  }

  /**
   * Cuando cambia el filtro de agencia en el Tab 1
   */
  onAgencyFilterChange(): void {
    this.loadConfiguraciones();
  }

  /**
   * Aplicar configuración seleccionada del Tab 1 al Tab 2
   */
  aplicarConfiguracion(configuracion: any): void {
    this.selectedProcess = configuracion.IdProcess;
    this.selectedAgency = configuracion.IdAgency;
    this.selectedCustomerType = configuracion.IdCostumerType;
    this.selectedOperationType = configuracion.IdOperationType;
    this.loadData();
    // Cambiar al tab 2 automáticamente (opcional, se puede hacer con referencia al tab group)
    this.snackBar.open('Configuración aplicada. Revisa el tab "Vista Detallada"', 'Info', { duration: 3000 });
  }

  /**
   * Editar configuración desde el Tab 1
   */
  editConfiguracionFromTab1(configuracion: any): void {
    const dialogRef = this.dialog.open(DocumentoRequeridoEditDialogComponent, {
      width: '800px',
      data: {
        mode: 'edit',
        configuracion: {
          IdProcess: configuracion.IdProcess,
          IdAgency: configuracion.IdAgency,
          IdCostumerType: configuracion.IdCostumerType,
          IdOperationType: configuracion.IdOperationType,
          Enabled: configuracion.Enabled || '1'
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadConfiguraciones();
        this.loadData();
        this.snackBar.open('Configuración actualizada exitosamente', 'Éxito', { duration: 2000 });
      }
    });
  }

  /**
   * Duplicar configuración desde el Tab 1
   */
  duplicateConfigurationFromTab1(configuracion: any): void {
    // Obtener nombres de los elementos de la configuración
    const currentAgency = this.agencies.find(a => a.Id.toString() === configuracion.IdAgency);
    const currentProcess = this.processes.find(p => p.Id.toString() === configuracion.IdProcess);
    const currentCustomerType = this.customerTypes.find(c => c.Id.toString() === configuracion.IdCostumerType);
    const currentOperationType = this.operationTypes.find(o => o.Id.toString() === configuracion.IdOperationType);

    if (!currentAgency || !currentProcess || !currentCustomerType || !currentOperationType) {
      this.snackBar.open('Error obteniendo información de la configuración', 'Error', { duration: 3000 });
      return;
    }

    // Crear objeto de configuración
    const config = {
      IdProcess: configuracion.IdProcess,
      IdAgency: parseInt(configuracion.IdAgency),
      IdCostumerType: configuracion.IdCostumerType,
      IdOperationType: configuracion.IdOperationType
    };

    const dialogRef = this.dialog.open(DuplicateConfigurationDialogComponent, {
      width: '800px',
      data: {
        configuracion: config,
        currentAgencyName: currentAgency.Name,
        processName: currentProcess.Name,
        customerTypeName: currentCustomerType.Name,
        operationTypeName: currentOperationType.Name
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        this.loadData();
        this.loadConfiguraciones(); // Recargar también las configuraciones agrupadas
        this.snackBar.open(
          `Configuración duplicada exitosamente a ${result.agenciesCount} agencia(s)`, 
          'Éxito', 
          { duration: 3000 }
        );
      }
    });
  }

  /**
   * Mostrar documentos de una configuración - Cambia al Tab 2 y aplica la configuración
   */
  verDocumentosConfiguracion(configuracion: any): void {
    // Aplicar la configuración al Tab 2
    this.aplicarConfiguracion(configuracion);
    
    // Cambiar al Tab 2 (Vista Detallada)
    setTimeout(() => {
      if (this.tabGroup) {
        this.tabGroup.selectedIndex = 1;
      }
    }, 0);
  }
}
