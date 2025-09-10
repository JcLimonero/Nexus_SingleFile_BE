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
import { Subject, takeUntil } from 'rxjs';
import { DefaultAgencyService } from '../../../core/services/default-agency.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ClientSelectionDialogComponent } from './client-selection-dialog.component';

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
    MatMenuModule
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
    
    // Verificar que tenemos la agencia seleccionada con IdAgency
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
  }

  selectClient(client: any): void {
    console.log('Cliente seleccionado:', client);
    this.selectedClient = client;
    this.showClientResults = false; // Ocultar resultados después de seleccionar
    this.clientSearchTerm = ''; // Limpiar el campo de búsqueda
    
    // Cargar los files/pedidos del cliente seleccionado
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
    params = params.set('ndCliente', this.selectedClient.ndCliente);
    params = params.set('status', 'Integracion'); // Filtrar por estatus de integración
    params = params.set('limit', '100');

    this.http.get<any>(`${environment.apiBaseUrl}/api/files/by-client`, { params })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('📁 Files encontrados:', response);
          
          if (response && response.success && response.data && response.data.files) {
            this.files = response.data.files;
          } else {
            this.files = [];
          }
          
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
    console.log('Agregando nuevo pedido de integración para cliente:', this.selectedClient.ndCliente);
    
    // Verificar que tenemos cliente y agencia seleccionados
    if (!this.selectedClient || !this.selectedClient.ndCliente) {
      this.snackBar.open('Debe seleccionar un cliente primero', 'Cerrar', {
        duration: 3000
      });
      return;
    }
    
    if (!this.selectedAgency || !this.selectedAgency.IdAgency) {
      this.snackBar.open('Debe seleccionar una agencia primero', 'Cerrar', {
        duration: 3000
      });
      return;
    }
    
    // Llamar al API de Vanguardia para obtener pedidos
    this.loadOrdersFromVanguardia();
  }

  private loadOrdersFromVanguardia(): void {
    console.log('🔍 Cargando pedidos desde Vanguardia...');
    
    let params = new HttpParams();
    params = params.set('customerDMS', this.selectedClient.ndCliente);
    params = params.set('idAgency', this.selectedAgency.IdAgency);

    this.http.get<any>(environment.vanguardia.ordersApiUrl, { 
      params,
      headers: this.getBackblazeHeaders()
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('🔍 Pedidos encontrados en Vanguardia:', response);
          
          if (response && response.success && response.data) {
            // Procesar los pedidos de Vanguardia
            this.processVanguardiaOrders(response.data);
            
            this.snackBar.open(`Pedidos cargados desde Vanguardia exitosamente`, 'Cerrar', {
              duration: 3000
            });
          } else {
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
    // Convertir los pedidos de Vanguardia al formato esperado por el sistema
    if (Array.isArray(ordersData)) {
      const processedOrders = ordersData.map(order => ({
        numeroPedido: order.numeroPedido || order.orderNumber || order.id,
        numeroInventario: order.numeroInventario || order.inventoryNumber || '',
        proceso: order.proceso || order.process || 'Integración',
        operacion: order.operacion || order.operation || '',
        tipoCliente: order.tipoCliente || order.clientType || '',
        vehiculo: order.vehiculo || order.vehicle || '',
        year: order.year || order.year || '',
        modelo: order.modelo || order.model || '',
        vin: order.vin || order.vin || '',
        agencia: order.agencia || order.agency || this.selectedAgency.Name,
        fechaRegistro: order.fechaRegistro || order.registrationDate || new Date(),
        fileId: order.fileId || order.id,
        // Marcar como pedido de Vanguardia
        isVanguardiaOrder: true,
        vanguardiaData: order
      }));
      
      // Agregar los nuevos pedidos a la lista existente
      this.files = [...this.files, ...processedOrders];
      
      console.log('📁 Pedidos procesados y agregados:', processedOrders);
    } else if (ordersData && typeof ordersData === 'object') {
      // Si es un solo pedido
      const processedOrder = {
        numeroPedido: ordersData.numeroPedido || ordersData.orderNumber || ordersData.id,
        numeroInventario: ordersData.numeroInventario || ordersData.inventoryNumber || '',
        proceso: ordersData.proceso || ordersData.process || 'Integración',
        operacion: ordersData.operacion || ordersData.operation || '',
        tipoCliente: ordersData.tipoCliente || ordersData.clientType || '',
        vehiculo: ordersData.vehiculo || ordersData.vehicle || '',
        year: ordersData.year || ordersData.year || '',
        modelo: ordersData.modelo || ordersData.model || '',
        vin: ordersData.vin || ordersData.vin || '',
        agencia: ordersData.agencia || ordersData.agency || this.selectedAgency.Name,
        fechaRegistro: ordersData.fechaRegistro || ordersData.registrationDate || new Date(),
        fileId: ordersData.fileId || ordersData.id,
        // Marcar como pedido de Vanguardia
        isVanguardiaOrder: true,
        vanguardiaData: ordersData
      };
      
      // Agregar el pedido a la lista
      this.files = [...this.files, processedOrder];
      
      console.log('📁 Pedido procesado y agregado:', processedOrder);
    }
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
    params = params.set('status', 'Integración'); // Solo documentos para pedidos en integración

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
          
          this.snackBar.open(`Documento ${document.documentName} subido exitosamente a Backblaze`, 'Cerrar', {
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
    if (document.backblazeUrl) {
      // Si tiene URL de Backblaze, usarla directamente
      window.open(document.backblazeUrl, '_blank');
    } else if (document.backblazeFileId) {
      // Si tiene fileId de Backblaze, obtener URL privada
      this.getBackblazePrivateUrl(document.backblazeFileId, document);
    } else if (document.filePath) {
      // Fallback al método anterior
      window.open(`${environment.apiBaseUrl}/${document.filePath}`, '_blank');
    } else {
      this.snackBar.open('No se puede visualizar el documento', 'Cerrar', {
        duration: 3000
      });
    }
  }

  private getBackblazePrivateUrl(fileId: string, document: any): void {
    this.http.get<any>(`${environment.backblaze.apiUrl}/private-url/${fileId}`, { headers: this.getBackblazeHeaders() })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
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
}
