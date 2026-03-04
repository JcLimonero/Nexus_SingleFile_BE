import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Subject, takeUntil, Observable, throwError, of } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { DefaultAgencyService } from '../../../core/services/default-agency.service';
import { ApiConfigService } from '../../../core/services/api-config.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ClientSearchService, ClientSearchResponse } from '../../../core/services/client-search.service';
import { ClientSelectionDialogComponent } from '../integracion/client-selection-dialog.component';
import { LiquidationAddDocumentDialogComponent } from './liquidation-add-document-dialog.component';

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
    MatPaginatorModule,
    MatCheckboxModule
  ],
  templateUrl: './liquidacion.component.html',
  styleUrls: ['./liquidacion.component.scss']
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
  filesExceedingSize: { [key: string]: boolean } = {}; // Rastrear archivos que exceden el tamaño máximo
  selectedDocumentsForBatch: Set<string> = new Set(); // Documentos seleccionados para carga en lote
  uploadingDocuments: Set<string> = new Set();
  maxFileSizeMB = environment.maxFileSizeMB || 100; // Tamaño máximo configurable
  addingLiquidationDocument = false;
  expedientAmount = 0;
  totalReceiptAmount = 0;
  remainingAmount = 0;

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
    private apiConfig: ApiConfigService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Obtener la agencia guardada inmediatamente al inicializar
    const savedAgencyId = this.defaultAgencyService.getAgenciaSeleccionada();
    if (savedAgencyId !== null) {
      this.selectedAgencyId = savedAgencyId;
    }

    // Suscribirse a los cambios de agencia del servicio compartido
    this.defaultAgencyService.selectedAgency$
      .pipe(takeUntil(this.destroy$))
      .subscribe(agenciaId => {
        if (agenciaId !== null && agenciaId !== this.selectedAgencyId) {
          this.selectedAgencyId = agenciaId;
          this.cdr.markForCheck();
        }
      });

    this.loadLiquidationStatus();
    this.loadAgencies();
    this.checkUserPermissions();
    
    // Verificar si hay parámetros en la URL para selección automática
    this.route.queryParams.subscribe(params => {
      const idCliente = params['idCliente'];
      const idPedido = params['idPedido'];
      const idFile = params['idFile'];
      
      if (idCliente && (idPedido || idFile)) {
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
          this.agencies = agencias;
          this.agenciesLoading = false;
          // Forzar actualización de la vista después de cargar agencias
          this.cdr.markForCheck();
          
          // Establecer agencia predeterminada DESPUÉS de que las agencias se carguen
          setTimeout(() => {
            // Obtener la agencia guardada
            const savedAgencyId = this.defaultAgencyService.getAgenciaSeleccionada();
            
            // Verificar que la agencia guardada existe en la lista
            if (savedAgencyId !== null && this.agencies.some(ag => {
              const agId = ag.id ?? ag.Id ?? ag.IdAgency;
              return agId != null && Number(agId) === Number(savedAgencyId);
            })) {
              // La agencia guardada existe, usarla
              this.selectedAgencyId = savedAgencyId;
              this.onAgencyChange(savedAgencyId);
              this.cdr.markForCheck();
            } else {
              // Si no hay agencia guardada válida, establecer la predeterminada
              this.defaultAgencyService.establecerAgenciaPredeterminada(true).subscribe({
                next: (agenciaId) => {
                  if (agenciaId && this.agencies.some(ag => {
                    const agId = ag.id ?? ag.Id ?? ag.IdAgency;
                    return agId != null && Number(agId) === Number(agenciaId);
                  })) {
                    this.selectedAgencyId = agenciaId;
                    this.onAgencyChange(agenciaId);
                    this.cdr.markForCheck();
                  } else if (this.agencies.length > 0) {
                    // Solo como último recurso, seleccionar la primera
                    const primeraAgencia = this.agencies[0];
                    const firstAgencyId = primeraAgencia.id ?? primeraAgencia.Id ?? primeraAgencia.IdAgency;
                    if (firstAgencyId != null) {
                      this.selectedAgencyId = firstAgencyId;
                      this.onAgencyChange(firstAgencyId);
                    }
                    this.cdr.markForCheck();
                  }
                },
                error: (error) => {
                  // Si falla y hay agencias, seleccionar la primera
                  if (this.agencies.length > 0) {
                    const primeraAgencia = this.agencies[0];
                    const firstAgencyId = primeraAgencia.id ?? primeraAgencia.Id ?? primeraAgencia.IdAgency;
                    if (firstAgencyId != null) {
                      this.selectedAgencyId = firstAgencyId;
                      this.onAgencyChange(firstAgencyId);
                    }
                    this.cdr.markForCheck();
                  }
                }
              });
            }
          }, 150); // Aumentar el timeout para asegurar que las opciones se rendericen
        },
        error: (error) => {
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
    this.selectedAgency = this.agencies.find(agency => {
      const agId = agency.id ?? agency.Id ?? agency.IdAgency;
      return agId != null && Number(agId) === Number(agencyId);
    }) || null;
    
    // Actualizar el caché usando seleccionarAgencia (ya actualiza localStorage y BehaviorSubject)
    if (agencyId !== null) {
      this.defaultAgencyService.seleccionarAgencia(agencyId);
    }
    
    // Forzar actualización de la vista con OnPush
    this.cdr.markForCheck();
    
    // COMENTADO: Llamada HTTP deshabilitada para mejorar performance
    // seleccionarAgencia() ya actualiza el caché (localStorage y BehaviorSubject)
    // La actualización del servidor se puede hacer de forma asíncrona o en otro momento
    /*
    // Actualizar la agencia predeterminada del usuario
    if (agencyId !== null) {
      this.defaultAgencyService.actualizarAgenciaPredeterminada(agencyId).subscribe({
        next: (success) => {
          if (success) {

          } else {

          }
        },
        error: (error) => {

        }
      });
    }
    */
  }

  clearAgencyFilter(): void {
    this.selectedAgencyId = null;
    this.selectedAgency = null;
  }

  hasAgencies(): boolean {
    return this.agencies && this.agencies.length > 0;
  }

  trackByAgencyId(index: number, agency: any): number {
    return agency?.id ?? agency?.Id ?? agency?.IdAgency ?? index;
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
    this.filesExceedingSize = {};
    this.selectedDocumentsForBatch.clear();
  }

  clearAllClientData(): void {

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
    this.filesExceedingSize = {};
    this.documentsLoading = false;
    
    // Limpiar estado de carga
    this.clientsLoading = false;
    
    // Limpiar búsqueda de pedidos
    this.orderSearchTerm = '';
    this.currentPage = 0;
    this.totalItems = 0;

  }

  selectClient(client: any): void {

    this.selectedClient = client;
    this.showClientResults = false; // Ocultar resultados después de seleccionar
    this.clientSearchTerm = ''; // Limpiar el campo de búsqueda
    
    // Limpiar documentos requeridos al cambiar de cliente
    this.requiredDocuments = [];
    this.selectedFile = null;
    this.selectedFiles = {};
    this.filesExceedingSize = {};
    this.selectedDocumentsForBatch.clear();
    
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
    const agencyId = this.selectedAgency?.id ?? this.selectedAgency?.Id ?? this.selectedAgency?.IdAgency;
    if (!this.selectedAgency || agencyId == null) {
      setTimeout(() => {
        this.seleccionarClienteYPedidoDesdeURL(idCliente, idPedido, idFile);
      }, 500);
      return;
    }

    // Buscar el cliente por ndCliente
    this.clientSearchService.searchClients(agencyId, idCliente, 50)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ClientSearchResponse) => {
          if (response && response.success && response.data && response.data.clientes) {
            const clientes = response.data.clientes;
            const clienteEncontrado = clientes.find(c => String(c.ndCliente) === String(idCliente));
            
            if (clienteEncontrado) {

              // Seleccionar el cliente
              this.selectClient(clienteEncontrado);
              
              // Esperar a que se carguen los pedidos y luego seleccionar el pedido
              setTimeout(() => {
                this.seleccionarPedidoDesdeURL(idPedido, idFile);
              }, 1000);
            } else {

              this.snackBar.open('Cliente no encontrado', 'Cerrar', {
                duration: 3000
              });
            }
          } else {

            this.snackBar.open('Cliente no encontrado', 'Cerrar', {
              duration: 3000
            });
          }
        },
        error: (error) => {

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

    if (!this.files || this.files.length === 0) {

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
    this.filesExceedingSize = {};
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

    const agencyId = this.selectedAgency?.id ?? this.selectedAgency?.Id ?? this.selectedAgency?.IdAgency;
    if (!this.selectedAgency || agencyId == null) {
      this.files = [];
      return;
    }

    this.filesLoading = true;

    let params = new HttpParams();
    params = params.set('agencyId', String(agencyId));
    params = params.set('ndCliente', this.selectedClient.ndCliente);
    params = params.set('statusId', '2'); // ID para Liquidación

    // Cargar pedidos de liquidación
    this.http.get<any>(`${environment.apiBaseUrl}/api/files/by-agency-client`, { params })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {

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

    // Aquí implementarías la lógica para liquidar el pedido
    this.snackBar.open(`Pedido ${file.numeroPedido} liquidado exitosamente`, 'Cerrar', {
      duration: 3000
    });
  }

  revisarPedido(file: any): void {

    // Aquí implementarías la lógica para revisar el pedido
    this.snackBar.open(`Pedido ${file.numeroPedido} enviado a revisión`, 'Cerrar', {
      duration: 3000
    });
  }

  // Métodos para manejo de documentos
  selectFile(file: any): void {
    this.selectedFile = file;
    const fileId = file?.fileId ?? file?.id ?? file?.file_id;
    if (fileId != null) {
      this.loadRequiredDocuments(String(fileId));
    } else {
      this.requiredDocuments = [];
      this.documentsLoading = false;
    }
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

          if (response && response.success && response.data && response.data.documents) {
            this.requiredDocuments = response.data.documents;
            this.expedientAmount = response.data.expedientAmount ?? 0;
            this.totalReceiptAmount = response.data.totalReceiptAmount ?? 0;
            this.remainingAmount = response.data.remainingAmount ?? Math.max(0, this.expedientAmount - this.totalReceiptAmount);
          } else {
            this.requiredDocuments = [];
            this.expedientAmount = 0;
            this.totalReceiptAmount = 0;
            this.remainingAmount = 0;
          }
          
          this.documentsLoading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {

          this.requiredDocuments = [];
          this.documentsLoading = false;
          this.cdr.markForCheck();
          this.snackBar.open('Error al cargar documentos requeridos', 'Cerrar', {
            duration: 3000
          });
        },
        complete: () => {
          this.documentsLoading = false;
          this.cdr.markForCheck();
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

    if (this.addingLiquidationDocument || this.remainingAmount <= 0) {
      if (this.remainingAmount <= 0) {
        this.snackBar.open('La suma de los comprobantes ya alcanzó el monto del expediente', 'Cerrar', {
          duration: 3000
        });
      }
      return;
    }

    const fileId = this.selectedFile.fileId;
    const dialogRef = this.dialog.open(LiquidationAddDocumentDialogComponent, {
      width: '600px',
      data: {
        fileId,
        expedientAmount: this.expedientAmount,
        totalReceiptAmount: this.totalReceiptAmount,
        remainingAmount: this.remainingAmount
      }
    });

    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe((result) => {
      if (result?.success) {
        this.snackBar.open('Documento de liquidación agregado correctamente', 'Cerrar', { duration: 3000 });
        this.loadRequiredDocuments(String(fileId));
      } else if (result && !result.success && result.message) {
        this.snackBar.open(result.message, 'Cerrar', { duration: 4000 });
      }
    });
  }

  onFileSelected(event: any, documentFileId: string | number): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const maxSizeBytes = (environment.maxFileSizeMB || 100) * 1024 * 1024; // Convertir MB a bytes
      const docId = documentFileId.toString();
      
      // Validar tamaño del archivo
      if (file.size > maxSizeBytes) {
        // Archivo excede el tamaño máximo
        this.filesExceedingSize[docId] = true;
        this.selectedFiles[docId] = file; // Guardar referencia para mostrar el nombre
        // Remover de selección en lote si estaba
        this.selectedDocumentsForBatch.delete(docId);
        
        // Mostrar mensaje de error
        this.snackBar.open(
          `El archivo excede el tamaño máximo permitido de ${environment.maxFileSizeMB}MB`,
          'Cerrar',
          { duration: 5000 }
        );
      } else {
        // Archivo válido
        this.filesExceedingSize[docId] = false;
        this.selectedFiles[docId] = file;
        // Automáticamente marcar el documento para carga en lote si tiene archivo
        this.selectedDocumentsForBatch.add(docId);
      }
      
      // Forzar detección de cambios
      this.cdr.markForCheck();
      return;
    }
    
  }

  /**
   * Toggle selección de documento para carga en lote
   */
  toggleDocumentForBatch(documentId: string): void {
    if (!documentId) return;
    
    if (this.selectedDocumentsForBatch.has(documentId)) {
      this.selectedDocumentsForBatch.delete(documentId);
    } else {
      // Solo permitir seleccionar si tiene archivo seleccionado y no excede el tamaño
      if (this.selectedFiles[documentId] && !this.filesExceedingSize[documentId]) {
        this.selectedDocumentsForBatch.add(documentId);
      } else if (this.filesExceedingSize[documentId]) {
        this.snackBar.open(`El archivo excede el tamaño máximo de ${this.maxFileSizeMB}MB`, 'Cerrar', {
          duration: 3000
        });
      } else {
        this.snackBar.open('Debe seleccionar un archivo primero', 'Cerrar', {
          duration: 2000
        });
      }
    }
    this.cdr.markForCheck();
  }

  /**
   * Verificar si un documento está seleccionado para carga en lote
   */
  isDocumentSelectedForBatch(documentId: string | null | undefined): boolean {
    if (!documentId) return false;
    return this.selectedDocumentsForBatch.has(documentId);
  }

  /**
   * Obtener cantidad de documentos seleccionados para carga en lote
   */
  getSelectedDocumentsCount(): number {
    return this.selectedDocumentsForBatch.size;
  }

  /**
   * Verificar si hay documentos seleccionados para carga en lote
   */
  hasDocumentsSelectedForBatch(): boolean {
    return this.selectedDocumentsForBatch.size > 0;
  }

  /**
   * Verificar si un documento se está cargando
   */
  isDocumentUploading(documentId: string | null | undefined): boolean {
    if (!documentId) return false;
    return this.uploadingDocuments.has(documentId);
  }

  /**
   * Verificar si hay archivos que exceden el tamaño en la selección para carga masiva
   */
  hasFilesExceedingSizeInBatch(): boolean {
    return Array.from(this.selectedDocumentsForBatch).some(docId => 
      this.filesExceedingSize[docId]
    );
  }

  /**
   * Obtener cantidad de archivos que exceden el tamaño en la selección para carga masiva
   */
  getFilesExceedingSizeCount(): number {
    return Array.from(this.selectedDocumentsForBatch).filter(docId => 
      this.filesExceedingSize[docId]
    ).length;
  }

  /**
   * Sanitizar nombre de archivo: remover caracteres especiales como comas, acentos, etc.
   */
  private sanitizeFileName(file: File): File {
    // Obtener nombre original
    let fileName = file.name;
    
    // Remover caracteres especiales: comas, comillas, paréntesis, corchetes, etc.
    fileName = fileName.replace(/[,'"()[\]{}]/g, '');
    
    // Reemplazar espacios múltiples con un solo espacio
    fileName = fileName.replace(/\s+/g, ' ');
    
    // Remover acentos y caracteres diacríticos
    fileName = fileName.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    // Trim de espacios al inicio y final
    fileName = fileName.trim();
    
    // Si el nombre quedó vacío, usar un nombre por defecto
    if (!fileName) {
      fileName = 'documento';
    }
    
    // Si el nombre cambió, crear un nuevo Blob con el nombre sanitizado
    if (fileName !== file.name) {
      return new File([file], fileName, { type: file.type });
    }
    
    return file;
  }

  /**
   * Cargar todos los documentos seleccionados en lote
   */
  uploadMultipleDocuments(): void {
    if (!this.hasDocumentsSelectedForBatch()) {
      this.snackBar.open('Debe seleccionar al menos un documento para cargar', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    const documentsToUpload = this.requiredDocuments.filter(doc => {
      const docKey = doc.fileDocumentId?.toString();
      return docKey &&
        this.selectedDocumentsForBatch.has(docKey) && 
        this.selectedFiles[docKey] &&
        !this.filesExceedingSize[docKey] && // Excluir archivos que exceden el tamaño
        doc.idCurrentStatus !== '3' && 
        doc.idCurrentStatus !== '4';
    });
    
    // Verificar si hay archivos que exceden el tamaño
    const filesExceedingCount = this.requiredDocuments.filter(doc => {
      const docKey = doc.fileDocumentId?.toString();
      return docKey &&
        this.selectedDocumentsForBatch.has(docKey) && 
        this.filesExceedingSize[docKey];
    }).length;
    
    if (filesExceedingCount > 0) {
      this.snackBar.open(
        `${filesExceedingCount} archivo(s) exceden el tamaño máximo de ${environment.maxFileSizeMB}MB y no se pueden cargar`,
        'Cerrar',
        { duration: 5000 }
      );
    }

    if (documentsToUpload.length === 0) {
      this.snackBar.open('No hay documentos válidos para cargar', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    // Marcar todos como cargando
    documentsToUpload.forEach(doc => {
      const docKey = doc.fileDocumentId?.toString();
      if (docKey) {
        this.uploadingDocuments.add(docKey);
      }
    });
    this.cdr.markForCheck();

    // Cargar documentos secuencialmente para evitar sobrecarga
    let completed = 0;
    let failed = 0;
    const total = documentsToUpload.length;

    documentsToUpload.forEach((document, index) => {
      setTimeout(() => {
        const docKey = document.fileDocumentId?.toString();
        if (!docKey) return;

        this.uploadDocumentInternal(document, false).subscribe({
          next: () => {
            completed++;
            this.selectedDocumentsForBatch.delete(docKey);
            this.uploadingDocuments.delete(docKey);
            this.cdr.markForCheck();
            
            if (completed + failed === total) {
              // Todos los documentos procesados
              this.snackBar.open(`${completed} de ${total} documentos cargados exitosamente${failed > 0 ? `, ${failed} fallaron` : ''}`, 'Cerrar', {
                duration: 5000
              });
              // Recargar documentos para mostrar el estado actualizado
              this.loadRequiredDocuments(this.selectedFile.fileId);
            }
          },
          error: () => {
            failed++;
            this.uploadingDocuments.delete(docKey);
            this.cdr.markForCheck();
            
            if (completed + failed === total) {
              // Todos los documentos procesados
              this.snackBar.open(`${completed} de ${total} documentos cargados exitosamente${failed > 0 ? `, ${failed} fallaron` : ''}`, 'Cerrar', {
                duration: 5000
              });
              // Recargar documentos para mostrar el estado actualizado
              this.loadRequiredDocuments(this.selectedFile.fileId);
            }
          }
        });
      }, index * 200); // Pequeño delay entre cada carga para evitar sobrecarga
    });
  }

  /**
   * Método interno para cargar un documento
   */
  private uploadDocumentInternal(document: any, showIndividualMessage: boolean = true): Observable<any> {
    const documentKey = document.fileDocumentId?.toString();
    if (!documentKey || !this.selectedFiles[documentKey]) {
      const errorMsg = 'Debe seleccionar un archivo';
      if (showIndividualMessage) {
        this.snackBar.open(errorMsg, 'Cerrar', {
          duration: 3000
        });
      }
      return throwError(() => new Error(errorMsg));
    }

    // Mostrar mensaje diferente si se está reemplazando
    const isReplacing = document.idCurrentStatus === '2';
    const actionText = isReplacing ? 'reemplazando' : 'cargando';

    // Obtener archivo y sanitizar su nombre
    let file = this.selectedFiles[documentKey];
    file = this.sanitizeFileName(file);

    // Obtener el nombre del archivo desde la vista view_document_name
    const params = new HttpParams()
      .set('idDocumentByFile', document.fileDocumentId.toString())
      .set('idFile', this.selectedFile.fileId.toString());

    // Primero consultar el nombre del archivo desde la vista, luego renombrar y subir
    return this.http.get<any>(`${environment.apiBaseUrl}/api/documents/get-file-name`, { params })
      .pipe(
        catchError((error) => {
          // Si falla la consulta, usar el nombre del documento requerido (documentName)
          return of({ success: false, useDocumentName: true }); // Retornar un objeto para que continue el flujo
        }),
        switchMap((response) => {
          // Renombrar el archivo si se obtuvo el nombre de la vista o usar documentName como fallback
          let newFileName: string | null = null;
          
          if (response.success && response.data?.file_name_original) {
            // Usar el nombre de la vista
            const fileNameFromView = response.data.file_name_original;
            const originalExtension = file.name.split('.').pop();
            const fileNameBase = fileNameFromView.replace(/\.[^/.]+$/, ''); // Remover extensión si tiene
            newFileName = fileNameBase + (originalExtension ? '.' + originalExtension : '');
          } else if (response.useDocumentName && document.documentName) {
            // Usar el nombre del documento requerido como fallback
            const originalExtension = file.name.split('.').pop();
            const fileNameBase = document.documentName.replace(/\.[^/.]+$/, ''); // Remover extensión si tiene
            newFileName = fileNameBase + (originalExtension ? '.' + originalExtension : '');
          }

          // Si se obtuvo un nuevo nombre, crear un nuevo File
          if (newFileName) {
            file = new File([file], newFileName, { type: file.type });
          }

          // Preparar datos para Backblaze según documentación API
          const formData = new FormData();
          formData.append('file', file); // File: Archivo a subir (con nombre renombrado o original)
          formData.append('idSingleFile', this.selectedFile.fileId.toString()); // Integer: ID del archivo en tabla (IdFile)
          formData.append('idDocumentFile', document.fileDocumentId.toString()); // Integer: ID del documento (fileDocumentId)

          // Usar API de Vanguardia (el proxy agregará X-Provider-Token automáticamente)
          return this.http.post<any>(this.apiConfig.getUploadApiUrl(), formData);
        })
      )
      .pipe(
        takeUntil(this.destroy$),
        tap((response) => {

          if (showIndividualMessage) {
            this.snackBar.open(`Documento ${document.documentName || document.fileName} ${actionText} exitosamente`, 'Cerrar', {
              duration: 3000
            });
          }
          
          // Recargar documentos para mostrar el estado actualizado
          this.loadRequiredDocuments(this.selectedFile.fileId);
          // Limpiar archivo seleccionado
          delete this.selectedFiles[documentKey];
          delete this.filesExceedingSize[documentKey];
          // Remover de selección en lote si estaba
          this.selectedDocumentsForBatch.delete(documentKey);
          this.cdr.markForCheck();
        }),
        catchError((error) => {

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
          
          if (showIndividualMessage) {
            this.snackBar.open(`Error subiendo documento: ${errorMessage}`, 'Cerrar', {
              duration: 8000
            });
          }
          
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  /**
   * Cargar un documento individual
   */
  uploadDocument(document: any): void {
    const documentKey = document.fileDocumentId?.toString();
    if (!documentKey || !this.selectedFiles[documentKey]) {
      this.snackBar.open('Debe seleccionar un archivo', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    this.uploadingDocuments.add(documentKey);
    this.cdr.markForCheck();
    this.uploadDocumentInternal(document, true).subscribe({
      next: () => {
        this.uploadingDocuments.delete(documentKey);
        this.cdr.markForCheck();
      },
      error: () => {
        this.uploadingDocuments.delete(documentKey);
        this.cdr.markForCheck();
      }
    });
  }

  viewDocument(document: any): void {

    if (document.documentContainer) {

      // Usar documentContainer para obtener URL privada de Backblaze
      this.getBackblazePrivateUrl(document.documentContainer, document);
    } else {

      this.snackBar.open('No se puede visualizar el documento', 'Cerrar', {
        duration: 3000
      });
    }
  }

  private getBackblazePrivateUrl(fileName: string, document: any): void {

    const duration = 3600; // 1 hora por defecto
    const params = new URLSearchParams({
      file: fileName,
      duration: duration.toString(),
      baseUrl: environment.apiBaseUrl
    });

    const url = `${this.apiConfig.getUploadApiBaseUrl()}/get-private-url?${params.toString()}`;

    // El proxy agregará X-Provider-Token automáticamente
    this.http.get<any>(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {

          if (response.data && response.data.url) {

            const newWindow = window.open(response.data.url, '_blank');
            if (newWindow) {

            } else {
              
              this.snackBar.open('No se pudo abrir el documento. Verifica que no tengas bloqueado el navegador de pop-ups.', 'Cerrar', {
                duration: 5000
              });
            }
          } else {

            this.snackBar.open('No se pudo obtener la URL del documento', 'Cerrar', {
              duration: 3000
            });
          }
        },
        error: (error) => {

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

  trackByDocumentId(index: number, document: any): string {
    return document.fileDocumentId?.toString() || document.documentId?.toString() || index.toString();
  }

  /**
   * Obtener monto del comprobante desde el documento (soporta distintas claves de la API)
   */
  getReceiptAmount(document: any): number | null {
    if (!document) return null;
    const val = document.receiptAmount ?? document.receiptamount ?? document.amount ?? document.monto;
    if (val === null || val === undefined || val === '') return null;
    const num = typeof val === 'number' ? val : parseFloat(String(val));
    return isNaN(num) ? null : num;
  }

  /**
   * Formatear monto para mostrar en el listado (evita problemas con currency pipe y valores nulos)
   */
  formatReceiptAmount(document: any): string {
    const amt = this.getReceiptAmount(document);
    if (amt == null) return 'N/A';
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amt);
  }
}

