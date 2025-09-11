import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Subject, takeUntil } from 'rxjs';
import { DefaultAgencyService } from '../../../core/services/default-agency.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ClientSelectionDialogComponent } from './client-selection-dialog.component';
import { OrderSelectionDialogComponent } from './order-selection-dialog.component';

@Component({
  selector: 'vex-integracion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule,
    MatInputModule,
    MatDialogModule,
    MatTableModule,
    MatMenuModule,
    MatPaginatorModule
  ],
  templateUrl: './integracion.component.html',
  styleUrls: ['./integracion.component.scss']
})
export class IntegracionComponent implements OnInit, OnDestroy {
  loading = false;
  integrationStatus = 'inactive'; // inactive, active, error
  lastUpdate = new Date();
  
  // Agency filter properties
  agencies: any[] = [];
  selectedAgencyId: number | null = null;
  selectedAgency: any = null;
  agenciesLoading = true;
  
  // Client search properties
  clientSearchTerm = '';
  clients: any[] = [];
  clientsLoading = false;
  showClientResults = false;
  selectedClient: any = null;

  // Files/Pedidos properties
  files: any[] = [];
  filesLoading = false;
  filesDisplayedColumns: string[] = [
    'numeroPedido',
    'numeroInventario', 
    'proceso',
    'operacion',
    'tipoCliente',
    'vehiculo',
    'year',
    'modelo',
    'vin',
    'agencia',
    'fechaRegistro',
    'actions'
  ];

  // Paginación y búsqueda de pedidos
  orderSearchTerm = '';
  filteredFiles: any[] = [];
  paginatedFiles: any[] = [];
  pageSize = 5;
  currentPage = 0;
  totalItems = 0;

  // User permissions
  userRole: string = '';
  isManagerOrAdmin: boolean = false;

  // Document management properties
  selectedFile: any = null;
  requiredDocuments: any[] = [];
  documentsLoading = false;
  selectedFiles: { [key: string]: File } = {};
  
  // Dialog properties
  displayedColumns: string[] = ['ndCliente', 'cliente', 'rfc', 'email', 'actions'];
  
  // Process properties - Fixed process for integration
  integrationProcessId = 1; // Gestión de Clientes
  
  private destroy$ = new Subject<void>();

  // Headers para Backblaze
  private getBackblazeHeaders() {
    return {
      'X-Provider-Token': environment.backblaze.providerToken
    };
  }

  constructor(
    private snackBar: MatSnackBar,
    private defaultAgencyService: DefaultAgencyService,
    private http: HttpClient,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadIntegrationStatus();
    this.loadAgencies();
    this.checkUserPermissions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  checkUserPermissions(): void {
    // Obtener el rol del usuario desde el token o servicio de autenticación
    // Por ahora simulamos que es gerente/administrador
    this.userRole = 'manager'; // Cambiar por la lógica real de obtención del rol
    this.isManagerOrAdmin = this.userRole === 'manager' || this.userRole === 'admin';
    
    // Si no es gerente/admin, quitar la columna de acciones
    if (!this.isManagerOrAdmin) {
      this.filesDisplayedColumns = this.filesDisplayedColumns.filter(col => col !== 'actions');
    }
  }

  loadIntegrationStatus(): void {
    this.loading = true;
    // Simular carga de estado de integración
    setTimeout(() => {
      this.integrationStatus = 'active';
      this.loading = false;
    }, 1000);
  }

  startIntegration(): void {
    this.loading = true;
    this.snackBar.open('Iniciando proceso de integración...', 'Cerrar', {
      duration: 3000
    });
    
    // Simular proceso de integración
    setTimeout(() => {
      this.integrationStatus = 'active';
      this.loading = false;
      this.snackBar.open('Integración completada exitosamente', 'Cerrar', {
        duration: 5000
      });
    }, 3000);
  }

  stopIntegration(): void {
    this.integrationStatus = 'inactive';
    this.snackBar.open('Integración detenida', 'Cerrar', {
      duration: 3000
    });
  }

  getStatusColor(): string {
    switch (this.integrationStatus) {
      case 'active': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  }

  getStatusIcon(): string {
    switch (this.integrationStatus) {
      case 'active': return 'check_circle';
      case 'error': return 'error';
      default: return 'pause_circle';
    }
  }

  getStatusText(): string {
    switch (this.integrationStatus) {
      case 'active': return 'Activa';
      case 'error': return 'Error';
      default: return 'Inactiva';
    }
  }

  // Agency filter methods
  private loadAgencies(): void {
    this.agenciesLoading = true;
    
    this.defaultAgencyService.obtenerAgencias()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (agencias) => {
          console.log('🏢 Agencias asignadas al usuario:', agencias);
          this.agencies = agencias;
          this.agenciesLoading = false;
          
          // Establecer agencia predeterminada
          setTimeout(() => {
            this.defaultAgencyService.establecerAgenciaPredeterminada(true).subscribe({
              next: (agenciaId) => {
                if (agenciaId) {
                  console.log('✅ Agencia predeterminada establecida:', agenciaId);
                  this.selectedAgencyId = agenciaId;
                  this.onAgencyChange(agenciaId);
                } else {
                  console.warn('⚠️ No se pudo establecer agencia predeterminada');
                }
              },
              error: (error) => {
                console.error('❌ Error estableciendo agencia predeterminada:', error);
                // Si falla, intentar seleccionar la primera agencia disponible
                if (this.agencies.length > 0) {
                  const primeraAgencia = this.agencies[0];
                  console.log('🔄 Seleccionando primera agencia disponible como fallback:', primeraAgencia);
                  this.selectedAgencyId = primeraAgencia.Id;
                  this.onAgencyChange(primeraAgencia.Id);
                }
              }
            });
          }, 100);
        },
        error: (error) => {
          console.error('🏢 Error cargando agencias:', error);
          this.agencies = [];
          this.agenciesLoading = false;
          this.snackBar.open('Error al cargar las agencias', 'Cerrar', {
            duration: 3000
          });
        }
      });
  }

  onAgencyChange(agencyId: number | null): void {
    this.selectedAgencyId = agencyId;
    // Encontrar y guardar el objeto agencia completo
    this.selectedAgency = this.agencies.find(agency => agency.Id === agencyId) || null;
    // Aquí puedes agregar lógica adicional cuando cambie la agencia seleccionada
    console.log('Selected agency:', agencyId, 'Agency object:', this.selectedAgency);
  }

  clearAgencyFilter(): void {
    this.selectedAgencyId = null;
    this.selectedAgency = null;
  }

  hasAgencies(): boolean {
    return this.agencies && this.agencies.length > 0;
  }

  trackByAgencyId(index: number, agency: any): number {
    return agency.Id;
  }

  // Client search methods
  onClientSearchChange(): void {
    // Ya no buscamos automáticamente, solo limpiamos resultados si el campo está vacío
    if (!this.clientSearchTerm.trim()) {
      this.clients = [];
      this.showClientResults = false;
    }
  }

  searchClients(): void {
    if (this.clientSearchTerm.trim().length < 3) {
      this.snackBar.open('Debe ingresar al menos 3 caracteres para buscar', 'Cerrar', {
        duration: 3000
      });
      return;
    }
    this.performClientSearch();
  }

  private performClientSearch(): void {
    if (!this.clientSearchTerm.trim()) {
      this.clients = [];
      this.showClientResults = false;
      return;
    }

    // Verificar que tenemos agencia seleccionada
    if (!this.selectedAgencyId) {
      this.snackBar.open('Debe seleccionar una agencia para buscar clientes', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    this.clientsLoading = true;
    this.showClientResults = true;

    let params = new HttpParams();
    params = params.set('id', this.selectedAgencyId.toString());
    params = params.set('search', this.clientSearchTerm.trim());
    params = params.set('limit', '50');

    this.http.get<any>(`${environment.apiBaseUrl}/api/client/search`, { params })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('🔍 Clientes encontrados:', response);
          
          if (response && response.success && response.data && response.data.clientes) {
            this.clients = response.data.clientes;
            
            // Si hay múltiples resultados, mostrar diálogo
            if (this.clients.length > 1) {
              this.showClientSelectionDialog();
            } else if (this.clients.length === 1) {
              // Si hay solo un resultado, seleccionarlo automáticamente
              this.selectClient(this.clients[0]);
            } else {
              // Sin resultados en el sistema local, buscar en Vanguardia
              this.searchClientInVanguardia();
            }
          } else {
            // Sin resultados en el sistema local, buscar en Vanguardia
            this.searchClientInVanguardia();
          }
          
          this.clientsLoading = false;
        },
        error: (error) => {
          console.error('❌ Error buscando clientes:', error);
          this.clients = [];
          this.clientsLoading = false;
          this.snackBar.open('Error al buscar clientes', 'Cerrar', {
            duration: 3000
          });
        }
      });
  }

  private searchClientInVanguardia(): void {
    console.log('🔍 Buscando cliente en Vanguardia...');
    
    // Verificar que tenemos la agencia seleccionada
    if (!this.selectedAgency || !this.selectedAgency.IdAgency) {
      this.snackBar.open('Error: No se encontró la información de IdAgency de la agencia seleccionada', 'Cerrar', {
        duration: 3000
      });
      return;
    }
    
    let params = new HttpParams();
    params = params.set('idAgency', this.selectedAgency.IdAgency);
    params = params.set('ndDMS', this.clientSearchTerm.trim());

    this.http.get<any>(environment.vanguardia.apiUrl, { 
      params,
      headers: this.getBackblazeHeaders()
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('🔍 Cliente encontrado en Vanguardia:', response);
          
          if (response && response.success && response.data) {
            // Convertir respuesta de Vanguardia al formato esperado
            const vanguardiaClient = {
              ndCliente: response.data.ndCliente || response.data.id,
              cliente: response.data.cliente || response.data.nombre || response.data.name,
              rfc: response.data.rfc || '',
              email: response.data.email || '',
              telefono: response.data.telefono || response.data.phone || '',
              direccion: response.data.direccion || response.data.address || '',
              // Marcar como cliente de Vanguardia para referencia
              isVanguardiaClient: true,
              vanguardiaData: response.data
            };
            
            this.clients = [vanguardiaClient];
            this.selectClient(vanguardiaClient);
            
            this.snackBar.open(`Cliente encontrado en Vanguardia: ${vanguardiaClient.cliente}`, 'Cerrar', {
              duration: 3000
            });
          } else {
            this.clients = [];
            this.showClientResults = true;
            this.snackBar.open('Cliente no encontrado en el sistema ni en Vanguardia', 'Cerrar', {
              duration: 3000
            });
          }
        },
        error: (error) => {
          console.error('❌ Error buscando cliente en Vanguardia:', error);
          this.clients = [];
          this.showClientResults = true;
          
          let errorMessage = 'Error desconocido al buscar en Vanguardia';
          
          if (error.status === 0) {
            errorMessage = 'Error de CORS: No se puede conectar con el servidor de Vanguardia.';
          } else if (error.status === 400) {
            errorMessage = 'Error 400: Solicitud inválida a Vanguardia.';
          } else if (error.status === 401) {
            errorMessage = 'Error 401: Token de autenticación inválido para Vanguardia.';
          } else if (error.status === 403) {
            errorMessage = 'Error 403: Acceso denegado a Vanguardia.';
          } else if (error.status === 404) {
            errorMessage = 'Error 404: Endpoint de Vanguardia no encontrado.';
          } else if (error.status === 500) {
            errorMessage = 'Error 500: Error interno del servidor de Vanguardia.';
          } else if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          this.snackBar.open(`Error buscando en Vanguardia: ${errorMessage}`, 'Cerrar', {
            duration: 5000
          });
        }
      });
  }

  clearClientSearch(): void {
    this.clientSearchTerm = '';
    this.clients = [];
    this.showClientResults = false;
    this.selectedClient = null;
    // Limpiar documentos requeridos cuando se limpia la búsqueda de cliente
    this.requiredDocuments = [];
    this.selectedFile = null;
    this.selectedFiles = {};
  }

  selectClient(client: any): void {
    console.log('Cliente seleccionado:', client);
    this.selectedClient = client;
    this.showClientResults = false; // Ocultar resultados después de seleccionar
    this.clientSearchTerm = ''; // Limpiar el campo de búsqueda
    
    // Limpiar documentos requeridos al cambiar de cliente
    this.requiredDocuments = [];
    this.selectedFile = null;
    this.selectedFiles = {};
    
    // Limpiar búsqueda y paginación de pedidos
    this.orderSearchTerm = '';
    this.currentPage = 0;
    
    // Cargar automáticamente los pedidos de integración del cliente seleccionado
    this.loadClientFiles();
    
    this.snackBar.open(`Cliente seleccionado: ${client.cliente}`, 'Cerrar', {
      duration: 3000
    });
  }

  showClientSelectionDialog(): void {
    const dialogRef = this.dialog.open(ClientSelectionDialogComponent, {
      width: '95vw',
      height: '80vh',
      maxWidth: '1200px',
      data: { clients: this.clients }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectClient(result);
      } else {
        // Si se canceló el diálogo, limpiar la búsqueda
        this.clearClientSearch();
      }
    });
  }

  clearClientSelection(): void {
    this.selectedClient = null;
    this.files = []; // Limpiar también los files
    // Limpiar documentos requeridos cuando se limpia la selección de cliente
    this.requiredDocuments = [];
    this.selectedFile = null;
    this.selectedFiles = {};
    // Limpiar búsqueda y paginación
    this.orderSearchTerm = '';
    this.currentPage = 0;
    this.updateFilesDisplay();
    this.snackBar.open('Selección de cliente limpiada', 'Cerrar', {
      duration: 2000
    });
  }

  loadClientFiles(): void {
    if (!this.selectedClient || !this.selectedClient.ndCliente) {
      this.files = [];
      return;
    }

    this.filesLoading = true;

    let params = new HttpParams();
    params = params.set('agencyId', this.selectedAgency.IdAgency);
    params = params.set('ndCliente', this.selectedClient.ndCliente);
    params = params.set('statusId', '1'); // ID para Integración

    // Cargar solo pedidos que ya están en la tabla de file (no desde Vanguardia)
    this.http.get<any>(`${environment.apiBaseUrl}/api/files/by-agency`, { params })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('📁 Files encontrados en tabla file:', response);
          
          if (response && response.success && response.data && response.data.files) {
            this.files = response.data.files;
          } else {
            this.files = [];
          }
          
          this.updateFilesDisplay();
          this.filesLoading = false;
        },
        error: (error) => {
          console.error('❌ Error cargando files:', error);
          this.files = [];
          this.filesLoading = false;
          this.snackBar.open('Error al cargar los pedidos del cliente', 'Cerrar', {
            duration: 3000
          });
        }
      });
  }

  trackByClientId(index: number, client: any): number {
    return client.ndCliente;
  }

  // Métodos para acciones de pedidos
  cancelarPedido(file: any): void {
    console.log('Cancelando pedido:', file.numeroPedido);
    // Aquí implementarías la lógica para cancelar el pedido
    this.snackBar.open(`Pedido ${file.numeroPedido} cancelado`, 'Cerrar', {
      duration: 3000
    });
  }

  excepcionPedido(file: any): void {
    console.log('Creando excepción para pedido:', file.numeroPedido);
    // Aquí implementarías la lógica para crear una excepción
    this.snackBar.open(`Excepción creada para pedido ${file.numeroPedido}`, 'Cerrar', {
      duration: 3000
    });
  }

  agregarPedidoIntegracion(): void {
    console.log('🚀 Iniciando proceso de agregar pedidos...');
    console.log('📊 Cliente seleccionado:', this.selectedClient);
    console.log('📊 Agencia seleccionada:', this.selectedAgency);
    
    // Verificar que tenemos cliente y agencia seleccionados
    if (!this.selectedClient || !this.selectedClient.ndCliente) {
      console.log('❌ No hay cliente seleccionado');
      this.snackBar.open('Debe seleccionar un cliente primero', 'Cerrar', {
        duration: 3000
      });
      return;
    }
    
    if (!this.selectedAgency || !this.selectedAgency.IdAgency) {
      console.log('❌ No hay agencia seleccionada');
      this.snackBar.open('Debe seleccionar una agencia primero', 'Cerrar', {
        duration: 3000
      });
      return;
    }
    
    console.log('✅ Validaciones pasadas, cargando pedidos desde Vanguardia...');
    
    // Llamar al API de Vanguardia para obtener pedidos
    this.loadOrdersFromVanguardia();
  }

  // MÉTODO TEMPORAL PARA PRUEBAS
  private testOrderDialog(): void {
    console.log('🧪 Probando diálogo con datos de prueba...');
    const testOrders = [
      {
        numeroPedido: 'TEST-001',
        numeroInventario: 'INV-001',
        proceso: 'Integración',
        operacion: 'Venta',
        tipoCliente: 'Individual',
        vehiculo: 'Sedán',
        year: '2024',
        modelo: 'Modelo Test',
        vin: 'VIN123456789',
        agencia: 'Agencia Test',
        fechaRegistro: new Date(),
        fileId: 'file-test-1',
        isVanguardiaOrder: true
      },
      {
        numeroPedido: 'TEST-002',
        numeroInventario: 'INV-002',
        proceso: 'Integración',
        operacion: 'Compra',
        tipoCliente: 'Empresarial',
        vehiculo: 'SUV',
        year: '2024',
        modelo: 'Modelo Test 2',
        vin: 'VIN987654321',
        agencia: 'Agencia Test',
        fechaRegistro: new Date(),
        fileId: 'file-test-2',
        isVanguardiaOrder: true
      }
    ];
    
    this.showOrderSelectionDialog(testOrders);
  }


  private loadOrdersFromVanguardia(): void {
    console.log('🔍 Cargando pedidos desde Vanguardia...');
    
    let params = new HttpParams();
    params = params.set('customerDMS', this.selectedClient.ndCliente);
    params = params.set('idAgency', this.selectedAgency.IdAgency);
    params = params.set('perpage', '1000'); // Traer todos los registros de una vez

    this.http.get<any>(environment.vanguardia.ordersApiUrl, { 
      params,
      headers: this.getBackblazeHeaders()
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('🔍 Respuesta completa de Vanguardia:', response);
          
          // Verificar diferentes estructuras de respuesta posibles
          let ordersData = null;
          
          if (response && response.success && response.data) {
            // Estructura estándar: { success: true, data: [...] }
            ordersData = response.data;
          } else if (response && response.status === 200 && response.data) {
            // Estructura de Vanguardia: { status: 200, message: "...", data: [...] }
            console.log('📊 Detectada estructura de Vanguardia, data:', response.data);
            
            // Verificar si data contiene un array de pedidos
            if (Array.isArray(response.data)) {
              console.log('✅ Data es array directo, cantidad:', response.data.length);
              ordersData = response.data;
            } else if (response.data && Array.isArray(response.data.orders)) {
              console.log('✅ Data contiene orders, cantidad:', response.data.orders.length);
              ordersData = response.data.orders;
            } else if (response.data && Array.isArray(response.data.data)) {
              console.log('✅ Data contiene data, cantidad:', response.data.data.length);
              console.log('📊 Total de registros disponibles:', response.data.total_rows);
              ordersData = response.data.data;
            } else if (response.data && Array.isArray(response.data.results)) {
              console.log('✅ Data contiene results, cantidad:', response.data.results.length);
              ordersData = response.data.results;
            } else {
              console.log('⚠️ Data es objeto único, convirtiendo a array');
              ordersData = [response.data];
            }
          } else if (response && Array.isArray(response)) {
            // Estructura directa: [...]
            ordersData = response;
          } else if (response && response.data && Array.isArray(response.data)) {
            // Estructura con data directa: { data: [...] }
            ordersData = response.data;
          } else if (response && response.orders && Array.isArray(response.orders)) {
            // Estructura con orders: { orders: [...] }
            ordersData = response.orders;
          } else if (response && response.results && Array.isArray(response.results)) {
            // Estructura con results: { results: [...] }
            ordersData = response.results;
          }
          
          if (ordersData && Array.isArray(ordersData) && ordersData.length > 0) {
            console.log('📁 Datos de pedidos encontrados:', ordersData);
            console.log('📊 Cantidad total de pedidos:', ordersData.length);
            
            // Mostrar directamente el diálogo con todos los datos
            this.showOrderSelectionDialogDirectly(ordersData);
            
            this.snackBar.open(`${ordersData.length} pedidos encontrados en Vanguardia`, 'Cerrar', {
              duration: 3000
            });
          } else {
            console.log('⚠️ No se encontraron pedidos válidos en la respuesta:', response);
            this.snackBar.open('No se encontraron pedidos en Vanguardia para este cliente', 'Cerrar', {
              duration: 3000
            });
          }
        },
        error: (error) => {
          console.error('❌ Error cargando pedidos desde Vanguardia:', error);
          
          let errorMessage = 'Error desconocido al cargar pedidos desde Vanguardia';
          
          if (error.status === 0) {
            errorMessage = 'Error de CORS: No se puede conectar con el servidor de Vanguardia.';
          } else if (error.status === 400) {
            errorMessage = 'Error 400: Solicitud inválida a Vanguardia.';
          } else if (error.status === 401) {
            errorMessage = 'Error 401: Token de autenticación inválido para Vanguardia.';
          } else if (error.status === 403) {
            errorMessage = 'Error 403: Acceso denegado a Vanguardia.';
          } else if (error.status === 404) {
            errorMessage = 'Error 404: Endpoint de Vanguardia no encontrado.';
          } else if (error.status === 500) {
            errorMessage = 'Error 500: Error interno del servidor de Vanguardia.';
          } else if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          this.snackBar.open(`Error cargando pedidos: ${errorMessage}`, 'Cerrar', {
            duration: 5000
          });
        }
      });
  }

  private processVanguardiaOrders(ordersData: any): void {
    console.log('🔄 Iniciando procesamiento de pedidos de Vanguardia...');
    console.log('📊 Datos recibidos para procesar:', ordersData);
    console.log('📊 Tipo de datos:', typeof ordersData);
    console.log('📊 Es array?', Array.isArray(ordersData));
    
    // Convertir los pedidos de Vanguardia al formato esperado por el sistema
    let processedOrders: any[] = [];
    
    if (Array.isArray(ordersData)) {
      console.log('📋 Procesando array de pedidos, cantidad:', ordersData.length);
      processedOrders = ordersData.map((order, index) => {
        console.log(`📋 Procesando pedido ${index + 1}:`, order);
        return {
          numeroPedido: order.numeroPedido || order.orderNumber || order.id || `PED-${index + 1}`,
          numeroInventario: order.numeroInventario || order.inventoryNumber || '',
          proceso: order.proceso || order.process || 'Integración',
          operacion: order.operacion || order.operation || '',
          tipoCliente: order.tipoCliente || order.clientType || '',
          vehiculo: order.vehiculo || order.vehicle || '',
          year: order.year || order.year || '',
          modelo: order.modelo || order.model || '',
          vin: order.vin || order.vin || '',
          agencia: order.agencia || order.agency || this.selectedAgency?.Name || 'Sin agencia',
          fechaRegistro: order.fechaRegistro || order.registrationDate || new Date(),
          fileId: order.fileId || order.id || `file-${index + 1}`,
          // Marcar como pedido de Vanguardia
          isVanguardiaOrder: true,
          vanguardiaData: order
        };
      });
    } else if (ordersData && typeof ordersData === 'object') {
      console.log('📋 Procesando objeto único:', ordersData);
      // Si es un solo pedido
      processedOrders = [{
        numeroPedido: ordersData.numeroPedido || ordersData.orderNumber || ordersData.id || 'PED-1',
        numeroInventario: ordersData.numeroInventario || ordersData.inventoryNumber || '',
        proceso: ordersData.proceso || ordersData.process || 'Integración',
        operacion: ordersData.operacion || ordersData.operation || '',
        tipoCliente: ordersData.tipoCliente || ordersData.clientType || '',
        vehiculo: ordersData.vehiculo || ordersData.vehicle || '',
        year: ordersData.year || ordersData.year || '',
        modelo: ordersData.modelo || ordersData.model || '',
        vin: ordersData.vin || ordersData.vin || '',
        agencia: ordersData.agencia || ordersData.agency || this.selectedAgency?.Name || 'Sin agencia',
        fechaRegistro: ordersData.fechaRegistro || ordersData.registrationDate || new Date(),
        fileId: ordersData.fileId || ordersData.id || 'file-1',
        // Marcar como pedido de Vanguardia
        isVanguardiaOrder: true,
        vanguardiaData: ordersData
      }];
    } else {
      console.error('❌ Datos de pedidos no válidos:', ordersData);
      this.snackBar.open('Error: Formato de datos de pedidos no válido', 'Cerrar', {
        duration: 3000
      });
      return;
    }
    
    console.log('✅ Pedidos procesados exitosamente:', processedOrders);
    console.log('📊 Cantidad de pedidos procesados:', processedOrders.length);
    
    // Cargar pedidos existentes en file para comparar
    this.loadClientFilesForComparison(processedOrders);
  }

  private loadClientFilesForComparison(vanguardiaOrders: any[]): void {
    console.log('🔄 Iniciando comparación con pedidos existentes...');
    console.log('📊 Pedidos de Vanguardia recibidos:', vanguardiaOrders);
    console.log('📊 Cliente seleccionado:', this.selectedClient);
    
    if (!this.selectedClient || !this.selectedClient.ndCliente) {
      console.log('⚠️ No hay cliente seleccionado, mostrando todos los pedidos de Vanguardia');
      // Si no hay cliente seleccionado, mostrar todos los pedidos de Vanguardia
      this.showOrderSelectionDialog(vanguardiaOrders);
      return;
    }

    console.log('🔍 Cliente seleccionado:', this.selectedClient.ndCliente);
    let params = new HttpParams();
    params = params.set('agencyId', this.selectedAgency.IdAgency);
    params = params.set('ndCliente', this.selectedClient.ndCliente);
    params = params.set('statusId', '1'); // ID para Integración

    console.log('🌐 Consultando API de files existentes...');
    this.http.get<any>(`${environment.apiBaseUrl}/api/files/by-agency`, { params })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('📁 Respuesta de files existentes:', response);
          
          let existingFiles: any[] = [];
          if (response && response.success && response.data && response.data.files) {
            existingFiles = response.data.files;
          }
          
          console.log('📊 Files existentes encontrados:', existingFiles);
          console.log('📊 Cantidad de files existentes:', existingFiles.length);
          
          // Filtrar pedidos de Vanguardia que no existen en la tabla de file
          const newOrders = this.filterNewOrders(vanguardiaOrders, existingFiles);
          console.log('📊 Pedidos nuevos después del filtrado:', newOrders);
          console.log('📊 Cantidad de pedidos nuevos:', newOrders.length);
          
          if (newOrders.length > 0) {
            console.log('✅ Hay pedidos nuevos, mostrando diálogo...');
            this.showOrderSelectionDialog(newOrders);
          } else {
            console.log('ℹ️ No hay pedidos nuevos, todos ya existen');
            this.snackBar.open('Todos los pedidos de Vanguardia ya existen en el sistema', 'Cerrar', {
              duration: 3000
            });
            // Cargar pedidos existentes en la tabla
            this.loadClientFiles();
          }
        },
        error: (error) => {
          console.error('❌ Error cargando files para comparación:', error);
          console.log('⚠️ Error en comparación, mostrando todos los pedidos de Vanguardia');
          // Si hay error, mostrar todos los pedidos de Vanguardia
          this.showOrderSelectionDialog(vanguardiaOrders);
        }
      });
  }

  private filterNewOrders(vanguardiaOrders: any[], existingFiles: any[]): any[] {
    // Crear un Set con los números de pedido existentes para búsqueda rápida
    const existingOrderNumbers = new Set(
      existingFiles.map(file => file.numeroPedido?.toString().toLowerCase())
    );
    
    // Filtrar pedidos de Vanguardia que no existen en la tabla de file
    return vanguardiaOrders.filter(order => {
      const orderNumber = order.numeroPedido?.toString().toLowerCase();
      return !existingOrderNumbers.has(orderNumber);
    });
  }

  private showOrderSelectionDialogDirectly(apiOrders: any[]): void {
    console.log('🎯 Mostrando diálogo directamente con datos del API...');
    console.log('📊 Datos originales del API:', apiOrders);
    console.log('📊 Cantidad de pedidos:', apiOrders?.length || 0);
    console.log('📊 Primer pedido (ejemplo):', apiOrders?.[0]);
    
    if (!apiOrders || apiOrders.length === 0) {
      console.error('❌ No hay pedidos del API para mostrar');
      this.snackBar.open('No hay pedidos disponibles para mostrar', 'Cerrar', {
        duration: 3000
      });
      return;
    }
    
    console.log('✅ Datos válidos, verificando pedidos existentes antes de mostrar diálogo...');

    // Verificar qué pedidos ya existen en la base de datos
    this.checkExistingOrders(apiOrders);
  }

  private checkExistingOrders(apiOrders: any[]): void {
    console.log('🔍 Verificando pedidos existentes en la base de datos...');
    
    const requestData = {
      orders: apiOrders,
      agencyId: this.selectedAgencyId
    };

    this.http.post<any>(`${environment.apiBaseUrl}/api/files/check-existing-orders`, requestData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('✅ Respuesta de verificación de pedidos:', response);
          
          if (response.success && response.data) {
            const { existingOrders, newOrders, existingCount, newCount } = response.data;
            
            console.log(`📊 Resultado: ${existingCount} pedidos existentes, ${newCount} pedidos nuevos`);
            
            if (existingCount > 0) {
              console.log('📋 Pedidos existentes:', existingOrders);
              this.snackBar.open(
                `${existingCount} pedidos ya existen en el sistema. Se mostrarán solo los ${newCount} pedidos nuevos.`, 
                'Cerrar', 
                { duration: 4000 }
              );
            }
            
            if (newOrders.length === 0) {
              console.log('ℹ️ No hay pedidos nuevos para mostrar');
              this.snackBar.open('Todos los pedidos de Vanguardia ya existen en el sistema', 'Cerrar', {
                duration: 3000
              });
              return;
            }
            
            // Mostrar solo los pedidos nuevos en el diálogo
            this.openOrderSelectionDialog(newOrders);
          } else {
            console.error('❌ Error en la respuesta de verificación:', response);
            this.snackBar.open('Error al verificar pedidos existentes', 'Cerrar', {
              duration: 3000
            });
          }
        },
        error: (error) => {
          console.error('❌ Error verificando pedidos existentes:', error);
          this.snackBar.open('Error al verificar pedidos existentes', 'Cerrar', {
            duration: 3000
          });
        }
      });
  }

  private openOrderSelectionDialog(orders: any[]): void {
    console.log('🚀 Abriendo diálogo con pedidos filtrados:', orders.length, 'pedidos nuevos');
    
    try {
      const dialogRef = this.dialog.open(OrderSelectionDialogComponent, {
        width: 'auto',
        height: 'auto',
        maxWidth: '90vw',
        maxHeight: '80vh',
        data: { orders: orders, agencyId: this.selectedAgencyId, ndCliente: this.selectedClient?.ndCliente }
      });

      console.log('✅ Diálogo abierto exitosamente');

      dialogRef.afterClosed().subscribe(result => {
        console.log('🔚 Diálogo cerrado, resultado:', result);
        if (result && result.length > 0) {
          console.log('✅ Pedidos seleccionados:', result);
          // Procesar los pedidos seleccionados antes de agregarlos
          const processedOrders = this.processSelectedOrders(result);
          this.addSelectedOrdersToTable(processedOrders);
          this.snackBar.open(`${result.length} pedidos agregados exitosamente`, 'Cerrar', {
            duration: 3000
          });
        } else {
          console.log('❌ Diálogo cancelado o sin selección');
          // Si se canceló el diálogo, cargar pedidos existentes
          this.loadClientFiles();
        }
      });
    } catch (error) {
      console.error('❌ Error abriendo diálogo:', error);
      this.snackBar.open('Error al abrir el diálogo de selección', 'Cerrar', {
        duration: 3000
      });
    }
  }

  private showOrderSelectionDialog(orders: any[]): void {
    console.log('🎯 Intentando mostrar diálogo de selección de pedidos...');
    console.log('📊 Pedidos para mostrar en diálogo:', orders);
    console.log('📊 Cantidad de pedidos:', orders?.length || 0);
    
    if (!orders || orders.length === 0) {
      console.error('❌ No hay pedidos para mostrar en el diálogo');
      this.snackBar.open('No hay pedidos disponibles para mostrar', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    try {
      console.log('🚀 Abriendo diálogo de selección...');
      const dialogRef = this.dialog.open(OrderSelectionDialogComponent, {
        width: 'auto',
        height: 'auto',
        maxWidth: '90vw',
        maxHeight: '80vh',
        data: { orders: orders, agencyId: this.selectedAgencyId, ndCliente: this.selectedClient?.ndCliente }
      });

      console.log('✅ Diálogo abierto exitosamente');

      dialogRef.afterClosed().subscribe(result => {
        console.log('🔚 Diálogo cerrado, resultado:', result);
        
        if (result && result.success) {
          // File creado exitosamente
          console.log('✅ File creado exitosamente:', result);
          this.snackBar.open(`File creado exitosamente con ${result.documentsCreated} documentos`, 'Cerrar', {
            duration: 5000
          });
          
          // Recargar los files del cliente para mostrar el nuevo file
          this.loadClientFiles();
          
        } else if (result && result.success === false) {
          // Error al crear el file
          console.error('❌ Error al crear file:', result.message);
          this.snackBar.open(`Error: ${result.message}`, 'Cerrar', {
            duration: 5000
          });
          
        } else if (result && result.length > 0) {
          // Formato anterior (pedidos seleccionados directamente)
          console.log('✅ Pedidos seleccionados:', result);
          this.addSelectedOrdersToTable(result);
          this.snackBar.open(`${result.length} pedidos agregados exitosamente`, 'Cerrar', {
            duration: 3000
          });
          
        } else {
          // Diálogo cancelado
          console.log('❌ Diálogo cancelado o sin selección');
          this.loadClientFiles();
        }
      });
    } catch (error) {
      console.error('❌ Error abriendo diálogo:', error);
      this.snackBar.open('Error al abrir el diálogo de selección', 'Cerrar', {
        duration: 3000
      });
    }
  }

  private processSelectedOrders(selectedOrders: any[]): any[] {
    console.log('🔄 Procesando pedidos seleccionados...');
    console.log('📊 Pedidos seleccionados:', selectedOrders);
    
    return selectedOrders.map((order, index) => {
      console.log(`📋 Procesando pedido seleccionado ${index + 1}:`, order);
      return {
        numeroPedido: order.numeroPedido || order.orderNumber || order.id || `PED-${index + 1}`,
        numeroInventario: order.numeroInventario || order.inventoryNumber || '',
        proceso: order.proceso || order.process || 'Integración',
        operacion: order.operacion || order.operation || '',
        tipoCliente: order.tipoCliente || order.clientType || '',
        vehiculo: order.vehiculo || order.vehicle || '',
        year: order.year || order.year || '',
        modelo: order.modelo || order.model || '',
        vin: order.vin || order.vin || '',
        agencia: order.agencia || order.agency || this.selectedAgency?.Name || 'Sin agencia',
        fechaRegistro: order.fechaRegistro || order.registrationDate || new Date(),
        fileId: order.fileId || order.id || `file-${index + 1}`,
        // Marcar como pedido de Vanguardia
        isVanguardiaOrder: true,
        vanguardiaData: order
      };
    });
  }

  private addSelectedOrdersToTable(selectedOrders: any[]): void {
    console.log('📁 Agregando pedidos seleccionados a la tabla...');
    console.log('📊 Pedidos a agregar:', selectedOrders);
    
    // Recargar los pedidos desde el servidor para obtener la lista actualizada sin duplicados
    this.loadClientFiles();
  }

  // Métodos para manejo de documentos
  selectFile(file: any): void {
    this.selectedFile = file;
    this.loadRequiredDocuments(file.fileId); // Usar fileId en lugar de numeroPedido
  }

  loadRequiredDocuments(fileId: string): void {
    this.documentsLoading = true;
    this.requiredDocuments = [];

    let params = new HttpParams();
    params = params.set('fileId', fileId);
    params = params.set('idProcessType', '1'); // Filtro por integración usando ID = 1

    this.http.get<any>(`${environment.apiBaseUrl}/api/documents/required`, { params })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('📄 Documentos requeridos:', response);
          
          if (response && response.success && response.data && response.data.documents) {
            this.requiredDocuments = response.data.documents;
          } else {
            this.requiredDocuments = [];
          }
          
          this.documentsLoading = false;
        },
        error: (error) => {
          console.error('❌ Error cargando documentos:', error);
          this.requiredDocuments = [];
          this.documentsLoading = false;
          this.snackBar.open('Error al cargar documentos requeridos', 'Cerrar', {
            duration: 3000
          });
        }
      });
  }

  onFileSelected(event: any, documentId: string): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFiles[documentId] = file;
    }
  }

  uploadDocument(document: any): void {
    if (!this.selectedFiles[document.documentId]) {
      this.snackBar.open('Debe seleccionar un archivo', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    // Mostrar mensaje diferente si se está reemplazando
    const isReplacing = document.idCurrentStatus === '2';
    const actionText = isReplacing ? 'reemplazando' : 'cargando';

    // Preparar datos para Backblaze según documentación API
    const formData = new FormData();
    formData.append('file', this.selectedFiles[document.documentId]); // File: Archivo a subir
    formData.append('idSingleFile', this.selectedFile.fileId.toString()); // Integer: ID del archivo en tabla (IdFile)
    formData.append('idDocumentFile', document.documentId.toString()); // Integer: ID del documento (IdDocumentByFile)

    // Usar API de Backblaze con header de autenticación
    this.http.post<any>(`${environment.backblaze.apiUrl}/upload`, formData, { headers: this.getBackblazeHeaders() })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('📤 Documento subido a Backblaze:', response);
          
          // Guardar información del archivo en Backblaze en la base de datos local
          this.saveDocumentInfo(document, response);
          
          this.snackBar.open(`Documento ${document.documentName} ${actionText} exitosamente`, 'Cerrar', {
            duration: 3000
          });
          
          // Recargar documentos
          this.loadRequiredDocuments(this.selectedFile.fileId);
          // Limpiar archivo seleccionado
          delete this.selectedFiles[document.documentId];
        },
        error: (error) => {
          console.error('❌ Error subiendo documento a Backblaze:', error);
          
          let errorMessage = 'Error desconocido';
          
          if (error.status === 0) {
            errorMessage = 'Error de CORS: No se puede conectar con el servidor de Backblaze. Verifique la configuración del servidor.';
          } else if (error.status === 400) {
            errorMessage = 'Error 400: Solicitud inválida. Verifique los parámetros enviados.';
          } else if (error.status === 401) {
            errorMessage = 'Error 401: Token de autenticación inválido.';
          } else if (error.status === 403) {
            errorMessage = 'Error 403: Acceso denegado.';
          } else if (error.status === 404) {
            errorMessage = 'Error 404: Endpoint no encontrado.';
          } else if (error.status === 500) {
            errorMessage = 'Error 500: Error interno del servidor.';
          } else if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          this.snackBar.open(`Error subiendo documento: ${errorMessage}`, 'Cerrar', {
            duration: 8000
          });
        }
      });
  }

  private saveDocumentInfo(document: any, backblazeResponse: any): void {
    const documentData = {
      fileId: this.selectedFile.fileId,
      documentTypeId: document.documentId,
      fileName: backblazeResponse.fileName || this.selectedFiles[document.documentId].name,
      filePath: backblazeResponse.filePath,
      backblazeFileId: backblazeResponse.fileId,
      backblazeUrl: backblazeResponse.url,
      uploadDate: new Date().toISOString(),
      status: 'uploaded'
    };

    this.http.post<any>(`${environment.apiBaseUrl}/api/documents/save-backblaze-info`, documentData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('📝 Información del documento guardada:', response);
        },
        error: (error) => {
          console.error('❌ Error guardando información del documento:', error);
        }
      });
  }

  viewDocument(document: any): void {
    if (document.documentContainer) {
      // Usar documentContainer para obtener URL privada de Backblaze
      this.getBackblazePrivateUrl(document.documentContainer, document);
    } else if (document.backblazeUrl) {
      // Si tiene URL de Backblaze, usarla directamente
      window.open(document.backblazeUrl, '_blank');
    } else if (document.filePath) {
      // Fallback al método anterior
      window.open(`${environment.apiBaseUrl}/${document.filePath}`, '_blank');
    } else {
      this.snackBar.open('No se puede visualizar el documento', 'Cerrar', {
        duration: 3000
      });
    }
  }

  private getBackblazePrivateUrl(fileName: string, document: any): void {
    const requestData = {
      file: fileName,
      duration: 300 // 5 minutos por defecto
    };

    this.http.post<any>(`${environment.backblaze.apiUrl}/get-private-url`, requestData, { headers: this.getBackblazeHeaders() })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('🔗 URL privada obtenida:', response);
          if (response.url) {
            window.open(response.url, '_blank');
          } else {
            this.snackBar.open('No se pudo obtener la URL del documento', 'Cerrar', {
              duration: 3000
            });
          }
        },
        error: (error) => {
          console.error('❌ Error obteniendo URL privada de Backblaze:', error);
          this.snackBar.open('Error al obtener URL del documento', 'Cerrar', {
            duration: 3000
          });
        }
      });
  }

  getDocumentStatusIcon(status: string, idCurrentStatus?: string): string {
    // Si tenemos idCurrentStatus, usamos ese para determinar el icono
    if (idCurrentStatus) {
      switch (idCurrentStatus) {
        case '1': return 'fiber_new'; // Nuevo
        case '2': return 'upload_file'; // Documento cargado
        case '3': return 'visibility'; // En revisión
        case '4': return 'check_circle'; // Revisado y OK
        case '5': return 'cancel'; // Rechazado
        case '6': return 'error'; // Documento no válido
        default: return 'help';
      }
    }
    
    // Fallback al status calculado si no hay idCurrentStatus
    switch (status) {
      case 'uploaded': return 'check_circle';
      case 'required': return 'info';
      case 'optional': return 'help';
      default: return 'help';
    }
  }

  getDocumentStatusColor(status: string, idCurrentStatus?: string): string {
    // Si tenemos idCurrentStatus, usamos ese para determinar el color
    if (idCurrentStatus) {
      switch (idCurrentStatus) {
        case '1': return 'text-blue-600'; // Nuevo - Azul
        case '2': return 'text-orange-600'; // Documento cargado - Naranja
        case '3': return 'text-yellow-600'; // En revisión - Amarillo
        case '4': return 'text-green-600'; // Revisado y OK - Verde
        case '5': return 'text-red-600'; // Rechazado - Rojo
        case '6': return 'text-red-800'; // Documento no válido - Rojo oscuro
        default: return 'text-gray-600';
      }
    }
    
    // Fallback al status calculado si no hay idCurrentStatus
    switch (status) {
      case 'uploaded': return 'text-green-600';
      case 'required': return 'text-yellow-600';
      case 'optional': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  }

  // Métodos para paginación y búsqueda de pedidos
  onOrderSearchChange(): void {
    this.currentPage = 0; // Resetear a la primera página
    this.filterAndPaginateFiles();
  }

  clearOrderSearch(): void {
    this.orderSearchTerm = '';
    this.currentPage = 0;
    this.filterAndPaginateFiles();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.filterAndPaginateFiles();
  }

  private filterAndPaginateFiles(): void {
    // Eliminar duplicados basándose en numeroPedido antes de filtrar
    const uniqueFiles = this.files.filter((file, index, self) => 
      index === self.findIndex(f => f.numeroPedido === file.numeroPedido)
    );

    // Filtrar archivos por término de búsqueda
    if (this.orderSearchTerm.trim()) {
      this.filteredFiles = uniqueFiles.filter(file => 
        file.numeroPedido?.toString().toLowerCase().includes(this.orderSearchTerm.toLowerCase()) ||
        file.numeroInventario?.toString().toLowerCase().includes(this.orderSearchTerm.toLowerCase()) ||
        file.proceso?.toLowerCase().includes(this.orderSearchTerm.toLowerCase()) ||
        file.operacion?.toLowerCase().includes(this.orderSearchTerm.toLowerCase()) ||
        file.tipoCliente?.toLowerCase().includes(this.orderSearchTerm.toLowerCase()) ||
        file.vehiculo?.toLowerCase().includes(this.orderSearchTerm.toLowerCase()) ||
        file.modelo?.toLowerCase().includes(this.orderSearchTerm.toLowerCase()) ||
        file.vin?.toLowerCase().includes(this.orderSearchTerm.toLowerCase()) ||
        file.agencia?.toLowerCase().includes(this.orderSearchTerm.toLowerCase())
      );
    } else {
      this.filteredFiles = [...uniqueFiles];
    }

    // Actualizar total de elementos
    this.totalItems = this.filteredFiles.length;

    // Calcular elementos para la página actual
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedFiles = this.filteredFiles.slice(startIndex, endIndex);
  }

  private updateFilesDisplay(): void {
    this.filterAndPaginateFiles();
  }

  eliminarPedido(file: any): void {
    console.log('🗑️ Eliminando pedido:', file);
    console.log('🔍 File ID encontrado:', file.fileId);
    
    if (!file.fileId) {
      console.error('❌ No se encontró fileId en el objeto file');
      this.snackBar.open('Error: No se pudo identificar el ID del pedido', 'Cerrar', {
        duration: 3000
      });
      return;
    }
    
    // Confirmar eliminación
    const confirmMessage = `¿Estás seguro de que deseas eliminar el pedido ${file.numeroPedido}?\n\nEsta acción eliminará:\n- El file completo\n- Todos los documentos asociados\n- El registro en OrderByCar\n\nEsta acción no se puede deshacer.`;
    
    if (confirm(confirmMessage)) {
      this.deleteFileFromServer(file.fileId);
    }
  }

  private deleteFileFromServer(fileId: string): void {
    console.log('🔄 Eliminando file del servidor:', fileId);
    
    const requestData = { fileId: fileId };

    this.http.post<any>(`${environment.apiBaseUrl}/api/files/delete`, requestData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('✅ File eliminado exitosamente:', response);
          
          if (response.success) {
            this.snackBar.open(
              `Pedido eliminado exitosamente. Documentos eliminados: ${response.data.documentsDeleted}`, 
              'Cerrar', 
              { duration: 4000 }
            );
            
            // Recargar la lista de files
            this.loadClientFiles();
          } else {
            this.snackBar.open(
              `Error al eliminar el pedido: ${response.message}`, 
              'Cerrar', 
              { duration: 4000 }
            );
          }
        },
        error: (error) => {
          console.error('❌ Error eliminando file:', error);
          
          let errorMessage = 'Error desconocido al eliminar el pedido';
          
          if (error.status === 403) {
            errorMessage = 'No tienes permisos para eliminar pedidos';
          } else if (error.status === 401) {
            errorMessage = 'Sesión expirada. Por favor, inicia sesión nuevamente';
          } else if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          
          this.snackBar.open(`Error: ${errorMessage}`, 'Cerrar', {
            duration: 5000
          });
        }
      });
  }
}
