import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
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
import { ActivatedRoute, Router } from '@angular/router';
import { DefaultAgencyService } from '../../../core/services/default-agency.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ClientSearchService, ClientSearchResponse } from '../../../core/services/client-search.service';
import { ClientSelectionDialogComponent } from '../integracion/client-selection-dialog.component';

@Component({
  selector: 'vex-liquidacion',
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
  templateUrl: './liquidacion.component.html',
  styleUrls: ['./liquidacion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LiquidacionComponent implements OnInit, OnDestroy {
  loading = false;
  liquidationStatus = 'inactive'; // inactive, active, error
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
  addingLiquidationDocument = false;
  
  // Process properties - Fixed process for liquidation
  liquidationProcessId = 2; // Liquidación
  private readonly LIQUIDACION_STATE_ID = 2;
  
  private destroy$ = new Subject<void>();

  constructor(
    private snackBar: MatSnackBar,
    private defaultAgencyService: DefaultAgencyService,
    private http: HttpClient,
    private dialog: MatDialog,
    private clientSearchService: ClientSearchService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('🚀 LiquidacionComponent inicializado');
    this.loadLiquidationStatus();
    this.loadAgencies();
    this.checkUserPermissions();
    
    // Verificar si hay parámetros en la URL para selección automática
    this.route.queryParams.subscribe(params => {
      const idCliente = params['idCliente'];
      const idPedido = params['idPedido'];
      const idFile = params['idFile'];
      
      if (idCliente && (idPedido || idFile)) {
        console.log('🔍 Parámetros encontrados en URL:', { idCliente, idPedido, idFile });
        // Esperar a que las agencias se carguen antes de seleccionar
        setTimeout(() => {
          this.seleccionarClienteYPedidoDesdeURL(idCliente, idPedido, idFile);
        }, 500);
      }
    });
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

  loadLiquidationStatus(): void {
    this.loading = true;
    // Simular carga de estado de liquidación
    setTimeout(() => {
      this.liquidationStatus = 'active';
      this.loading = false;
    }, 1000);
  }

  startLiquidation(): void {
    this.loading = true;
    this.snackBar.open('Iniciando proceso de liquidación...', 'Cerrar', {
      duration: 3000
    });
    
    // Simular proceso de liquidación
    setTimeout(() => {
      this.liquidationStatus = 'active';
      this.loading = false;
      this.snackBar.open('Liquidación completada exitosamente', 'Cerrar', {
        duration: 5000
      });
    }, 3000);
  }

  stopLiquidation(): void {
    this.liquidationStatus = 'inactive';
    this.snackBar.open('Liquidación detenida', 'Cerrar', {
      duration: 3000
    });
  }

  getStatusColor(): string {
    switch (this.liquidationStatus) {
      case 'active': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  }

  getStatusIcon(): string {
    switch (this.liquidationStatus) {
      case 'active': return 'check_circle';
      case 'error': return 'error';
      default: return 'pause_circle';
    }
  }

  getStatusText(): string {
    switch (this.liquidationStatus) {
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
    
    // Actualizar la agencia predeterminada del usuario
    if (agencyId !== null) {
      this.defaultAgencyService.actualizarAgenciaPredeterminada(agencyId).subscribe({
        next: (success) => {
          if (success) {
            console.log('✅ LiquidacionComponent - Agencia predeterminada actualizada:', agencyId);
          } else {
            console.warn('⚠️ LiquidacionComponent - No se pudo actualizar la agencia predeterminada');
          }
        },
        error: (error) => {
          console.error('❌ LiquidacionComponent - Error actualizando agencia predeterminada:', error);
        }
      });
    }
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
    // Si el campo está vacío, limpiar resultados
    if (!this.clientSearchTerm.trim()) {
      this.clients = [];
      this.showClientResults = false;
    } else {
      // Si el usuario empieza a escribir y ya hay un cliente seleccionado, limpiar todos los datos
      if (this.selectedClient) {
        this.clearAllClientData();
      }
    }
  }

  searchClients(): void {
    if (this.clientSearchTerm.trim().length < 1) {
      this.snackBar.open('Debe ingresar al menos 1 carácter para buscar', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    // Si ya hay un cliente seleccionado y se busca otro, limpiar todos los datos
    if (this.selectedClient) {
      this.clearAllClientData();
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

    // Buscar clientes sin filtrar por estado (igual que en integración)
    // El filtro de estado (liquidación) se aplica al cargar los pedidos, no al buscar clientes
    this.clientSearchService.searchClients(this.selectedAgencyId!, this.clientSearchTerm.trim(), 50)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ClientSearchResponse) => {
          console.log('🔍 Clientes encontrados:', response);
          
          if (response && response.success && response.data && response.data.clientes) {
            this.clients = response.data.clientes;
            this.cdr.markForCheck();
            
            // Si hay múltiples resultados, mostrar diálogo
            if (this.clients.length > 1) {
              this.showClientSelectionDialog();
            } else if (this.clients.length === 1) {
              // Si hay solo un resultado, seleccionarlo automáticamente
              this.selectClient(this.clients[0]);
            } else {
              this.snackBar.open('No se encontraron clientes con el término de búsqueda', 'Cerrar', {
                duration: 3000
              });
            }
          } else {
            this.clients = [];
            this.snackBar.open('No se encontraron clientes con el término de búsqueda', 'Cerrar', {
              duration: 3000
            });
          }
          
          this.clientsLoading = false;
          this.cdr.markForCheck();
        },
        error: (error: any) => {
          console.error('❌ Error buscando clientes:', error);
          this.clients = [];
          this.cdr.markForCheck();
          this.clientsLoading = false;
          this.snackBar.open('Error al buscar clientes', 'Cerrar', {
            duration: 3000
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

  clearAllClientData(): void {
    console.log('🧹 Limpiando todos los datos del cliente anterior...');
    
    // Limpiar datos del cliente
    this.selectedClient = null;
    this.clients = [];
    this.showClientResults = false;
    
    // Limpiar archivos/pedidos
    this.files = [];
    this.filteredFiles = [];
    this.paginatedFiles = [];
    this.selectedFile = null;
    this.filesLoading = false;
    
    // Limpiar documentos
    this.requiredDocuments = [];
    this.selectedFiles = {};
    this.documentsLoading = false;
    
    // Limpiar estado de carga
    this.clientsLoading = false;
    
    // Limpiar búsqueda de pedidos
    this.orderSearchTerm = '';
    this.currentPage = 0;
    this.totalItems = 0;
    
    console.log('✅ Todos los datos del cliente anterior han sido limpiados');
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
    
    // Cargar automáticamente los pedidos de liquidación del cliente seleccionado
    this.loadClientFiles();
    
    this.snackBar.open(`Cliente seleccionado: ${client.cliente}`, 'Cerrar', {
      duration: 3000
    });
  }

  /**
   * Seleccionar cliente y pedido automáticamente desde parámetros de URL
   */
  private seleccionarClienteYPedidoDesdeURL(idCliente: string, idPedido?: string, idFile?: string): void {
    console.log('🔍 Seleccionando cliente y pedido desde URL:', { idCliente, idPedido, idFile });
    
    if (!this.selectedAgency || !this.selectedAgency.IdAgency) {
      console.log('⚠️ No hay agencia seleccionada, esperando...');
      setTimeout(() => {
        this.seleccionarClienteYPedidoDesdeURL(idCliente, idPedido, idFile);
      }, 500);
      return;
    }

    // Buscar el cliente por ndCliente
    this.clientSearchService.searchClients(this.selectedAgency.IdAgency, idCliente, 50)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ClientSearchResponse) => {
          if (response && response.success && response.data && response.data.clientes) {
            const clientes = response.data.clientes;
            const clienteEncontrado = clientes.find(c => String(c.ndCliente) === String(idCliente));
            
            if (clienteEncontrado) {
              console.log('✅ Cliente encontrado:', clienteEncontrado);
              // Seleccionar el cliente
              this.selectClient(clienteEncontrado);
              
              // Esperar a que se carguen los pedidos y luego seleccionar el pedido
              setTimeout(() => {
                this.seleccionarPedidoDesdeURL(idPedido, idFile);
              }, 1000);
            } else {
              console.log('⚠️ Cliente no encontrado en resultados');
              this.snackBar.open('Cliente no encontrado', 'Cerrar', {
                duration: 3000
              });
            }
          } else {
            console.log('⚠️ No se encontraron clientes');
            this.snackBar.open('Cliente no encontrado', 'Cerrar', {
              duration: 3000
            });
          }
        },
        error: (error) => {
          console.error('❌ Error buscando cliente:', error);
          this.snackBar.open('Error al buscar cliente', 'Cerrar', {
            duration: 3000
          });
        }
      });
  }

  /**
   * Seleccionar pedido automáticamente desde parámetros de URL
   */
  private seleccionarPedidoDesdeURL(idPedido?: string, idFile?: string): void {
    console.log('🔍 Seleccionando pedido desde URL:', { idPedido, idFile });
    
    if (!this.files || this.files.length === 0) {
      console.log('⚠️ No hay pedidos cargados aún, esperando...');
      setTimeout(() => {
        this.seleccionarPedidoDesdeURL(idPedido, idFile);
      }, 500);
      return;
    }

    // Buscar el pedido por idFile (prioridad) o por numeroPedido
    let pedidoEncontrado: any = null;
    
    if (idFile) {
      pedidoEncontrado = this.files.find(f => String(f.fileId) === String(idFile));
    }
    
    if (!pedidoEncontrado && idPedido) {
      pedidoEncontrado = this.files.find(f => String(f.numeroPedido) === String(idPedido));
    }

    if (pedidoEncontrado) {
      console.log('✅ Pedido encontrado:', pedidoEncontrado);
      this.selectFile(pedidoEncontrado);
      this.snackBar.open(`Pedido ${pedidoEncontrado.numeroPedido} seleccionado`, 'Cerrar', {
        duration: 3000
      });
      
      // Limpiar parámetros de la URL después de seleccionar
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {},
        replaceUrl: true
      });
    } else {
      console.log('⚠️ Pedido no encontrado');
      this.snackBar.open('Pedido no encontrado', 'Cerrar', {
        duration: 3000
      });
    }
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
    params = params.set('statusId', '2'); // ID para Liquidación

    // Cargar pedidos de liquidación
    this.http.get<any>(`${environment.apiBaseUrl}/api/files/by-agency-client`, { params })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('📁 Files de liquidación encontrados:', response);
          
          if (response && response.success && response.data && response.data.files) {
            // Normalizar nombres de propiedades a minúsculas para asegurar consistencia (igual que en integración)
            this.files = response.data.files.map((file: any) => ({
              ...file,
              // Asegurar que los campos estén en minúsculas (por si vienen en mayúsculas)
              year: file.year || file.Year || null,
              modelo: file.modelo || file.Modelo || null,
              version: file.version || file.Version || null,
              vin: file.vin || file.VIN || file.Vin || null,
              // Mapear version a vehiculo para compatibilidad con el HTML
              vehiculo: file.version || file.Version || file.vehiculo || null
            }));
          } else {
            this.files = [];
          }
          
          this.updateFilesDisplay();
          this.filesLoading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('❌ Error cargando files de liquidación:', error);
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
  liquidarPedido(file: any): void {
    console.log('Liquidando pedido:', file.numeroPedido);
    // Aquí implementarías la lógica para liquidar el pedido
    this.snackBar.open(`Pedido ${file.numeroPedido} liquidado exitosamente`, 'Cerrar', {
      duration: 3000
    });
  }

  revisarPedido(file: any): void {
    console.log('Revisando pedido:', file.numeroPedido);
    // Aquí implementarías la lógica para revisar el pedido
    this.snackBar.open(`Pedido ${file.numeroPedido} enviado a revisión`, 'Cerrar', {
      duration: 3000
    });
  }

  // Métodos para manejo de documentos
  selectFile(file: any): void {
    this.selectedFile = file;
    this.loadRequiredDocuments(file.fileId); // Usar fileId en lugar de numeroPedido
    this.cdr.markForCheck();
  }

  loadRequiredDocuments(fileId: string): void {
    this.documentsLoading = true;
    this.requiredDocuments = [];
    this.cdr.markForCheck();

    let params = new HttpParams();
    params = params.set('fileId', fileId);
    params = params.set('idProcessType', '2'); // Filtro por liquidación usando ID = 2

    this.http.get<any>(`${environment.apiBaseUrl}/api/documents/required`, { params })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('📄 Documentos requeridos para liquidación:', response);
          
          if (response && response.success && response.data && response.data.documents) {
            this.requiredDocuments = response.data.documents;
          } else {
            this.requiredDocuments = [];
          }
          
          this.documentsLoading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('❌ Error cargando documentos:', error);
          this.requiredDocuments = [];
          this.documentsLoading = false;
          this.cdr.markForCheck();
          this.snackBar.open('Error al cargar documentos requeridos', 'Cerrar', {
            duration: 3000
          });
        }
      });
  }

  agregarDocumentoLiquidacion(): void {
    if (!this.selectedFile || !this.selectedFile.fileId) {
      this.snackBar.open('Selecciona un pedido antes de agregar documentos', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    if (this.addingLiquidationDocument) {
      return;
    }

    const fileId = this.selectedFile.fileId;
    this.addingLiquidationDocument = true;

    this.http.post<any>(`${environment.apiBaseUrl}/api/clients-validation/documentos/liquidacion`, {
      idFile: fileId
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        const message = response?.message || 'Documento de Liquidación agregado';
        this.snackBar.open(message, 'Cerrar', { duration: 3000 });
        this.loadRequiredDocuments(fileId);
      },
      error: (error) => {
        console.error('❌ Error agregando documento de liquidación:', error);
        const errorMessage = error?.error?.message || 'No se pudo agregar el documento de Liquidación';
        this.snackBar.open(errorMessage, 'Cerrar', { duration: 4000 });
        this.addingLiquidationDocument = false;
      },
      complete: () => {
        this.addingLiquidationDocument = false;
      }
    });
  }

  onFileSelected(event: any, documentFileId: string | number): void {
    const file = event.target.files[0];
    if (file) {
      const key = documentFileId.toString();
      this.selectedFiles[key] = file;
    }
  }

  uploadDocument(document: any): void {
    const documentKey = document.fileDocumentId?.toString();
    if (!documentKey || !this.selectedFiles[documentKey]) {
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
    formData.append('file', this.selectedFiles[documentKey]); // File: Archivo a subir
    formData.append('idSingleFile', this.selectedFile.fileId.toString()); // Integer: ID del archivo en tabla (IdFile)
    formData.append('idDocumentFile', document.fileDocumentId.toString()); // Integer: ID del documento (fileDocumentId)

    // Usar API de Vanguardia (el proxy agregará X-Provider-Token automáticamente)
    this.http.post<any>(environment.vanguardia.uploadApiUrl, formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('📤 Documento subido exitosamente a Vanguardia:', response);
          
          this.snackBar.open(`Documento ${document.documentName} ${actionText} exitosamente`, 'Cerrar', {
            duration: 3000
          });
          
          // Recargar documentos
          this.loadRequiredDocuments(this.selectedFile.fileId);
          // Limpiar archivo seleccionado
          delete this.selectedFiles[documentKey];
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


  viewDocument(document: any): void {
    console.log('🖱️ CLICK EN BOTÓN VER - viewDocument ejecutándose');
    console.log('🔍 viewDocument llamado con:', document);
    
    if (document.documentContainer) {
      console.log('📁 Usando documentContainer:', document.documentContainer);
      // Usar documentContainer para obtener URL privada de Backblaze
      this.getBackblazePrivateUrl(document.documentContainer, document);
    } else {
      console.log('❌ No hay documentContainer disponible');
      this.snackBar.open('No se puede visualizar el documento', 'Cerrar', {
        duration: 3000
      });
    }
  }

  private getBackblazePrivateUrl(fileName: string, document: any): void {
    console.log('🔍 getBackblazePrivateUrl llamado con:', { fileName, document });
    
    const duration = 3600; // 1 hora por defecto
    const params = new URLSearchParams({
      file: fileName,
      duration: duration.toString()
    });

    const url = `${environment.vanguardia.uploadApiUrl.replace('/upload', '')}/get-private-url?${params.toString()}`;
    console.log('🔗 URL completa:', url);

    // El proxy agregará X-Provider-Token automáticamente
    this.http.get<any>(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('🔗 URL privada obtenida:', response);
          if (response.data && response.data.url) {
            console.log('🌐 Abriendo URL en nueva pestaña:', response.data.url);
            const newWindow = window.open(response.data.url, '_blank');
            if (newWindow) {
              console.log('✅ Nueva pestaña abierta correctamente');
            } else {
              console.error('❌ No se pudo abrir nueva pestaña (posible bloqueador de pop-ups)');
              this.snackBar.open('No se pudo abrir el documento. Verifica que no tengas bloqueado el navegador de pop-ups.', 'Cerrar', {
                duration: 5000
              });
            }
          } else {
            console.error('❌ Respuesta sin URL válida:', response);
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
}

