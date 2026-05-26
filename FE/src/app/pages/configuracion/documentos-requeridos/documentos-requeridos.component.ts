import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
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
import { MatCardModule } from '@angular/material/card';

// Importar servicios existentes
import { TipoVentaService } from '../../../core/services/tipo-venta.service';
import { AgencyService, Agency } from '../../../core/services/agency.service';
import { CompanyService } from '../../../core/services/company.service';
import { CostumerTypeService } from '../../../core/services/costumer-type.service';
import { TipoOperacionService } from '../../../core/services/tipo-operacion.service';
import { DocumentoRequeridoService } from '../../../core/services/documento-requerido.service';

// Importar interfaces existentes
import { TipoVenta } from '../../../core/interfaces/tipo-venta.interface';
import { CostumerType } from '../../../core/interfaces/costumer-type.interface';
import { TipoOperacion } from '../../../core/interfaces/tipo-operacion.interface';
import { DocumentoRequerido, DocumentoRequeridoFilters } from '../../../core/interfaces/documento-requerido.interface';
import { AuthService } from '../../../core/services/auth.service';
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
    MatTooltipModule,
    MatCardModule
  ]
})
export class DocumentosRequeridosComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('configuracionesPaginator') configuracionesPaginator!: MatPaginator;
  @ViewChild('configuracionesSort') configuracionesSort!: MatSort;
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;

  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<DocumentoRequerido>([]);
  pageSizeDocumentos = 10;
  pageIndexDocumentos = 0;
  totalDocumentos = 0;
  pageSizeOptionsDocumentos = [10, 25, 50, 100, 200, 500];
  
  // Tab 1: Configuraciones agrupadas
  displayedColumnsConfiguraciones: string[] = [];
  dataSourceConfiguraciones = new MatTableDataSource<any>([]);
  selectedAgencyForConfiguraciones = '';
  
  loading = false;
  loadingCatalogs = false;
  loadingConfiguraciones = false;
  selectedCompany = '';
  selectedProcess = '';
  selectedAgency = '';
  selectedCustomerType = '';
  selectedOperationType = '';
  
  // Datos para los dropdowns usando interfaces existentes
  processes: TipoVenta[] = [];
  agencies: Agency[] = [];
  companies: { id: number; name: string }[] = [];
  customerTypes: CostumerType[] = [];
  operationTypes: TipoOperacion[] = [];
  
  // Item seleccionado para edición
  selectedItem: DocumentoRequerido | null = null;
  
  // Estadísticas
  stats: any = null;

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private authService: AuthService,
    private tipoVentaService: TipoVentaService,
    private agencyService: AgencyService,
    private companyService: CompanyService,
    private costumerTypeService: CostumerTypeService,
    private tipoOperacionService: TipoOperacionService,
    private documentoRequeridoService: DocumentoRequeridoService
  ) {}

  ngOnInit(): void {
    this.displayedColumns = this.authService.getDisplayedColumnsWithOptionalId(['id', 'agencia', 'proceso', 'tipoCliente', 'tipoOperacion', 'tipoDocumento', 'etapa', 'subEtapa', 'requerido', 'requiereExpiracion']);
    this.displayedColumnsConfiguraciones = this.authService.getDisplayedColumnsWithOptionalId(['id', 'agencia', 'proceso', 'tipoCliente', 'tipoOperacion', 'totalDocumentos', 'enabled', 'acciones']);
    this.loadCompanies();
    this.loadCatalogs();
    this.loadData();
    this.loadConfiguraciones();
  }

  ngAfterViewInit(): void {
    // Tab 2 usa paginación en servidor: NO asignar dataSource.paginator
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
    }, 100);
    
    // Configurar sortingDataAccessor para mapear correctamente las propiedades del Tab 2
    this.dataSource.sortingDataAccessor = (item: any, property: string) => {
      switch (property) {
        case 'id':
          return item.id;
        case 'agencia':
          return item.agencia_name || '';
        case 'proceso':
          return item.proceso_name || '';
        case 'tipoCliente':
          return item.tipo_cliente_name || '';
        case 'tipoOperacion':
          return item.tipo_operacion_name || '';
        case 'tipoDocumento':
          return item.tipo_documento_name || '';
        case 'etapa':
          return item.process_type_name || '';
        case 'subEtapa':
          return item.sub_process_name || '';
        case 'requerido':
          return item.required === '1' ? 'Sí' : 'No';
        case 'requiereExpiracion':
          return item.req_expiration === '1' ? 'Sí' : 'No';
        default:
          return item[property];
      }
    };

    // Configurar sortingDataAccessor para configuraciones agrupadas (Tab 1)
    this.dataSourceConfiguraciones.sortingDataAccessor = (item: any, property: string) => {
      switch (property) {
        case 'agencia':
          return item.agencia_name || '';
        case 'proceso':
          return item.proceso_name || '';
        case 'tipoCliente':
          return item.tipo_cliente_name || '';
        case 'tipoOperacion':
          return item.tipo_operacion_name || '';
        case 'enabled':
          return item.enabled === '1' || item.enabled === 1 ? 'Activo' : 'Inactivo';
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

    this.tipoVentaService.getTiposVenta().subscribe({
      next: (response: any) => {

        if (response?.success && response.data) {
          this.processes = response.data.processes || [];

        } else {

          this.snackBar.open('Error al cargar tipos de venta', 'Error', { duration: 3000 });
        }
        this.checkCatalogsLoaded();
      },
      error: (error: any) => {

        this.snackBar.open('Error al cargar tipos de venta', 'Error', { duration: 3000 });
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

  private loadCompanies(): void {
    this.companyService.getCompanies().subscribe({
      next: (res) => {
        if (res.success && res.data?.companies) {
          this.companies = res.data.companies.map((c: any) => ({ id: c.id ?? c.Id, name: c.name ?? c.Name }));
        }
      }
    });
  }

  get agenciesFiltradas(): Agency[] {
    if (!this.selectedCompany) return this.agencies;
    const idComp = Number(this.selectedCompany);
    return this.agencies.filter(a => {
      const aId = a.id_company ?? (a as any).IdCompany ?? (a as any).idCompany;
      if (aId == null || aId === '') return false;
      return Number(aId) === idComp;
    });
  }

  compareById(a: any, b: any): boolean {
    if ((a === null || a === undefined || a === '') && (b === null || b === undefined || b === '')) return true;
    if (a === null || a === undefined || a === '' || b === null || b === undefined || b === '') return false;
    return Number(a) === Number(b);
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
      this.totalDocumentos = 0;
      return;
    }

    this.loading = true;

    const filters: DocumentoRequeridoFilters = {
      limit: this.pageSizeDocumentos,
      offset: this.pageIndexDocumentos * this.pageSizeDocumentos
    };
    if (this.selectedCompany) filters.id_company = this.selectedCompany;
    if (this.selectedProcess) filters.id_sale_type = this.selectedProcess;
    if (this.selectedAgency) filters.id_agency = this.selectedAgency;
    if (this.selectedCustomerType) filters.id_customer_type = this.selectedCustomerType;
    if (this.selectedOperationType) filters.id_operation_type = this.selectedOperationType;

    this.documentoRequeridoService.getDocumentosRequeridos(filters).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const documentos = response.data.documentos || [];
          this.dataSource.data = documentos;
          this.totalDocumentos = response.data.total ?? 0;
        } else {
          this.snackBar.open(response.message || 'Error al cargar documentos', 'Error', { duration: 3000 });
          this.dataSource.data = [];
          this.totalDocumentos = 0;
        }
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Error al cargar documentos requeridos', 'Error', { duration: 3000 });
        this.dataSource.data = [];
        this.totalDocumentos = 0;
        this.loading = false;
      }
    });
  }

  onPageChangeDocumentos(event: PageEvent): void {
    this.pageSizeDocumentos = event.pageSize;
    this.pageIndexDocumentos = event.pageIndex;
    this.loadData();
  }

  onConfigurationChange(): void {
    this.pageIndexDocumentos = 0;
    this.loadData();
    this.selectedItem = null;
  }

  onCompanyFilterChange(): void {
    this.selectedAgency = '';
    this.selectedAgencyForConfiguraciones = '';
    this.onConfigurationChange();
    this.loadConfiguraciones();
  }

  isConfigurationSelected(): boolean {
    // Si no hay ninguna selección, considerar como si estuviera todo seleccionado (ver todos los datos)
    if (!this.selectedCompany && !this.selectedProcess && !this.selectedAgency && !this.selectedCustomerType && !this.selectedOperationType) {
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
    this.selectedCompany = '';
    this.selectedProcess = '';
    this.selectedAgency = '';
    this.selectedCustomerType = '';
    this.selectedOperationType = '';
    this.selectedItem = null;
    this.pageIndexDocumentos = 0;
    this.loadData();
    this.snackBar.open('Filtros limpiados', 'Info', { duration: 2000 });
  }

  refreshData(): void {
    this.loadData();
  }

  addDocumentoRequerido(): void {
    // Para crear una nueva configuración, usar filtros del Tab 2 si están disponibles,
    // o del Tab 1 (filtro de agencia), o valores vacíos
    const configuracion = {
      id_sale_type: this.selectedProcess || '',
      id_agency: this.selectedAgency || this.selectedAgencyForConfiguraciones || '',
      id_customer_type: this.selectedCustomerType || '',
      id_operation_type: this.selectedOperationType || ''
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
      doc.id_sale_type === this.selectedProcess &&
      doc.id_agency === this.selectedAgency &&
      doc.id_customer_type === this.selectedCustomerType &&
      doc.id_operation_type === this.selectedOperationType
    );

    // Crear objeto de configuración con los filtros seleccionados
    const configuracion = {
      id_sale_type: this.selectedProcess,
      id_agency: this.selectedAgency,
      id_customer_type: this.selectedCustomerType,
      id_operation_type: this.selectedOperationType,
      enabled: existingConfig?.enabled || '1'
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
    const currentAgency = this.agencies.find(a => String(a.id) === String(this.selectedAgency));
    const currentProcess = this.processes.find(p => String(p.id) === String(this.selectedProcess));
    const currentCustomerType = this.customerTypes.find(c => String(c.id) === String(this.selectedCustomerType));
    const currentOperationType = this.operationTypes.find(o => String(o.id) === String(this.selectedOperationType));

    if (!currentAgency || !currentProcess || !currentCustomerType || !currentOperationType) {
      this.snackBar.open('Error obteniendo información de la configuración', 'Error', { duration: 3000 });
      return;
    }

    // Crear objeto de configuración con los filtros seleccionados
    const configuracion = {
      id_sale_type: this.selectedProcess,
      id_agency: parseInt(this.selectedAgency),
      id_customer_type: this.selectedCustomerType,
      id_operation_type: this.selectedOperationType
    };

    const dialogRef = this.dialog.open(DuplicateConfigurationDialogComponent, {
      width: '800px',
      data: {
        configuracion: configuracion,
        currentAgencyName: currentAgency.name,
        processName: currentProcess.name,
        customerTypeName: currentCustomerType.name,
        operationTypeName: currentOperationType.name
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
    
    // Construir filtros con razón social y agencia
    const filters: DocumentoRequeridoFilters = {};
    if (this.selectedCompany) filters.id_company = this.selectedCompany;
    if (this.selectedAgencyForConfiguraciones) filters.id_agency = this.selectedAgencyForConfiguraciones;

    this.documentoRequeridoService.getDocumentosRequeridos(filters).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const documentos = response.data.documentos || [];
          
          // Agrupar por configuración (Proceso, Agencia, Tipo Cliente, Tipo Operación)
          const configuracionesMap = new Map<string, any>();
          
          documentos.forEach((doc: DocumentoRequerido) => {
            const key = `${doc.id_sale_type}-${doc.id_agency}-${doc.id_customer_type}-${doc.id_operation_type}`;
            
            if (!configuracionesMap.has(key)) {
              configuracionesMap.set(key, {
                id_configuration_process: doc.id_configuration_process,
                id_sale_type: doc.id_sale_type,
                id_agency: doc.id_agency,
                id_customer_type: doc.id_customer_type,
                id_operation_type: doc.id_operation_type,
                proceso_name: doc.proceso_name || 'N/A',
                agencia_name: doc.agencia_name || 'N/A',
                tipo_cliente_name: doc.tipo_cliente_name || 'N/A',
                tipo_operacion_name: doc.tipo_operacion_name || 'N/A',
                enabled: doc.enabled || '1',
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
    this.selectedProcess = configuracion.id_sale_type;
    this.selectedAgency = configuracion.id_agency;
    this.selectedCustomerType = configuracion.id_customer_type;
    this.selectedOperationType = configuracion.id_operation_type;
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
          id_sale_type: configuracion.id_sale_type,
          id_agency: configuracion.id_agency,
          id_customer_type: configuracion.id_customer_type,
          id_operation_type: configuracion.id_operation_type,
          enabled: configuracion.enabled || '1'
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
    const currentAgency = this.agencies.find(a => String(a.id) === String(configuracion.id_agency));
    const currentProcess = this.processes.find(p => String(p.id) === String(configuracion.id_sale_type));
    const currentCustomerType = this.customerTypes.find(c => String(c.id) === String(configuracion.id_customer_type));
    const currentOperationType = this.operationTypes.find(o => String(o.id) === String(configuracion.id_operation_type));

    if (!currentAgency || !currentProcess || !currentCustomerType || !currentOperationType) {
      this.snackBar.open('Error obteniendo información de la configuración', 'Error', { duration: 3000 });
      return;
    }

    // Crear objeto de configuración
    const config = {
      id_sale_type: configuracion.id_sale_type,
      id_agency: parseInt(configuracion.id_agency),
      id_customer_type: configuracion.id_customer_type,
      id_operation_type: configuracion.id_operation_type
    };

    const dialogRef = this.dialog.open(DuplicateConfigurationDialogComponent, {
      width: '800px',
      data: {
        configuracion: config,
        currentAgencyName: currentAgency.name,
        processName: currentProcess.name,
        customerTypeName: currentCustomerType.name,
        operationTypeName: currentOperationType.name
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
   * Obtener rango de página actual para Configuraciones Generales
   */
  getPageRangeConfiguraciones(): string {
    if (!this.configuracionesPaginator || this.dataSourceConfiguraciones.data.length === 0) {
      return '0-0';
    }
    const start = this.configuracionesPaginator.pageIndex * this.configuracionesPaginator.pageSize + 1;
    const end = Math.min(start + this.configuracionesPaginator.pageSize - 1, this.dataSourceConfiguraciones.data.length);
    return `${start}-${end}`;
  }

  getPageRangeDocumentos(): string {
    if (this.totalDocumentos === 0) return '0-0';
    const start = this.pageIndexDocumentos * this.pageSizeDocumentos + 1;
    const end = Math.min(start + this.pageSizeDocumentos - 1, this.totalDocumentos);
    return `${start}-${end}`;
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
