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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Subject, takeUntil, Observable, throwError, of } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { DefaultAgencyService } from '../../../core/services/default-agency.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ClientSearchService, ClientSearchResponse } from '../../../core/services/client-search.service';
import { VanguardiaClientService, VanguardiaResponse } from '../../../core/services/vanguardia-client.service';
import { VanguardiaClientImportService, VanguardiaClientImportResponse } from '../../../core/services/vanguardia-client-import.service';
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
    MatPaginatorModule,
    MatCheckboxModule
  ],
  templateUrl: './integracion.component.html',
  styleUrls: ['./integracion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
  loadingOrdersFromVanguardia = false; // Loading para el botón de agregar pedidos
  refreshingFiles = false; // Loading para el botón de refrescar pedidos
  filesDisplayedColumns: string[] = [
    'numeroPedido',
    'numeroInventario', 
    'proceso',
    'operacion',
    'tipoCliente',
    'year',
    'modelo',
    'version',
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
  maxFileSizeMB = environment.maxFileSizeMB || 100; // Tamaño máximo configurable
  selectedDocumentsForBatch: Set<string> = new Set(); // Documentos seleccionados para carga en lote
  uploadingDocuments: Set<string> = new Set(); // Documentos que se están cargando actualmente
  
  // Dialog properties
  displayedColumns: string[] = ['ndCliente', 'cliente', 'rfc', 'email', 'actions'];
  
  // Process properties - Fixed process for integration
  integrationProcessId = 1; // Gestión de Clientes
  
  private destroy$ = new Subject<void>();

  // TrackBy functions para optimizar *ngFor
  trackByDocumentId(index: number, item: any): any {
    return item?.documentId || item?.Id || index;
  }

  trackByFileId(index: number, item: any): any {
    return item?.idFile || item?.Id || index;
  }

  // Headers para Vanguardia (ya no necesarios para upload directo)
  private getVanguardiaHeaders() {
    return {
      'Content-Type': 'multipart/form-data'
    };
  }

  constructor(
    private snackBar: MatSnackBar,
    private defaultAgencyService: DefaultAgencyService,
    private http: HttpClient,
    private dialog: MatDialog,
    private clientSearchService: ClientSearchService,
    private vanguardiaClientService: VanguardiaClientService,
    private vanguardiaClientImportService: VanguardiaClientImportService,
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

    this.loadIntegrationStatus();
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
      this.cdr.markForCheck();
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
          this.agencies = agencias;
          this.agenciesLoading = false;
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
                    this.selectedAgencyId = primeraAgencia.id ?? primeraAgencia.Id;
                    this.onAgencyChange(primeraAgencia.id ?? primeraAgencia.Id);
                    this.cdr.markForCheck();
                  }
                },
                error: (error) => {
                  console.error('Error estableciendo agencia predeterminada:', error);
                  // Si falla y hay agencias, seleccionar la primera
                  if (this.agencies.length > 0) {
                    const primeraAgencia = this.agencies[0];
                    this.selectedAgencyId = primeraAgencia.id ?? primeraAgencia.Id;
                    this.onAgencyChange(primeraAgencia.id ?? primeraAgencia.Id);
                    this.cdr.markForCheck();
                  }
                }
              });
            }
          }, 150); // Aumentar el timeout para asegurar que las opciones se rendericen
        },
        error: (error) => {
          console.error('Error cargando agencias:', error);
          this.agencies = [];
          this.agenciesLoading = false;
          this.cdr.markForCheck();
          this.snackBar.open('Error al cargar las agencias', 'Cerrar', {
            duration: 3000
          });
        }
      });
  }

  onAgencyChange(agencyId: number | null): void {
    this.selectedAgencyId = agencyId;
    this.cdr.markForCheck();
    // Encontrar y guardar el objeto agencia completo
    this.selectedAgency = this.agencies.find(agency => {
      const agId = agency.id ?? agency.Id ?? agency.IdAgency;
      return agId != null && Number(agId) === Number(agencyId);
    }) || null;
    
    // Actualizar el caché usando seleccionarAgencia (ya actualiza cookie y BehaviorSubject)
    if (agencyId !== null) {
      this.defaultAgencyService.seleccionarAgencia(agencyId);
    }
    
    // COMENTADO: Llamada HTTP deshabilitada para mejorar performance
    // seleccionarAgencia() ya actualiza el caché (cookie y BehaviorSubject)
    // La actualización del servidor se puede hacer de forma asíncrona o en otro momento
    /*
    // Actualizar la agencia predeterminada del usuario
    if (agencyId !== null) {
      this.defaultAgencyService.actualizarAgenciaPredeterminada(agencyId).subscribe({
        next: (success) => {
          // Agencia predeterminada actualizada
        },
        error: (error) => {
          // Error actualizando agencia predeterminada
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

  trackByAgencyId(index: number, agency: any): any {
    return agency?.id ?? agency?.Id ?? index;
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

    // Usar el Id de la agencia seleccionada (que corresponde a File.IdAgency en la vista)
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
              // Sin resultados en el sistema local, buscar en Vanguardia
              this.searchClientInVanguardia();
            }
          } else {
            // Sin resultados en el sistema local, buscar en Vanguardia
            this.searchClientInVanguardia();
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

  private searchClientInVanguardia(): void {
    // Obtener la agencia seleccionada para enviar el connectionstring a Vanguardia
    const selectedAgency = this.agencies.find(agency => {
      const agId = agency.id ?? agency.Id ?? agency.IdAgency;
      return agId != null && Number(agId) === Number(this.selectedAgencyId);
    });
    if (!selectedAgency) {
      this.snackBar.open('Agencia no encontrada para búsqueda en Vanguardia', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    // Verificar que la agencia tenga AgencyConnection
    if (!selectedAgency.AgencyConnection) {
      this.snackBar.open('La agencia seleccionada no tiene connectionstring configurado', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    // Realizar búsqueda en el API de Vanguardia usando connectionstring
    // connectionstring=xxx&ndDMS=10004
    this.vanguardiaClientService.searchClients(selectedAgency.AgencyConnection, this.clientSearchTerm.trim())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: VanguardiaResponse) => {
          if (response && response.status === 200 && response.data && response.data.data) {
            // Convertir los datos de Vanguardia al formato estándar
            this.clients = response.data.data.map(client => 
              this.vanguardiaClientService.convertVanguardiaClient(client)
            );
            
            if (this.clients.length > 0) {
              // Mostrar mensaje de que se encontraron en Vanguardia
              this.snackBar.open(`Se encontraron ${this.clients.length} cliente(s) en Vanguardia. Importando al sistema local...`, 'Cerrar', {
                duration: 4000
              });
              
              // Importar el primer cliente encontrado al sistema local
              this.importVanguardiaClient(this.clients[0]);
            } else {
              // Sin resultados en Vanguardia tampoco
              this.snackBar.open('No se encontraron clientes en el sistema local ni en Vanguardia', 'Cerrar', {
                duration: 4000
              });
            }
          } else {
            // Sin resultados en Vanguardia
            this.snackBar.open('No se encontraron clientes en el sistema local ni en Vanguardia', 'Cerrar', {
              duration: 4000
            });
          }
        },
        error: (error) => {
          this.snackBar.open('Error al buscar en Vanguardia: ' + (error.error?.message || error.message), 'Cerrar', {
            duration: 4000
          });
        }
      });
  }

  private importVanguardiaClient(vanguardiaClient: any): void {
    // Convertir datos de Vanguardia al formato de importación
    const importData = this.vanguardiaClientImportService.convertVanguardiaDataForImport(vanguardiaClient);
    
    // Usar el Id interno de la agencia seleccionada en lugar del idAgency del cliente de Vanguardia
    if (this.selectedAgency) {
      const agencyId = this.selectedAgency.id ?? this.selectedAgency.Id ?? this.selectedAgency.IdAgency;
      if (agencyId != null) {
        importData.idAgency = String(agencyId);
      }
    }
    
    // Importar cliente al sistema local
    this.vanguardiaClientImportService.importClient(importData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: VanguardiaClientImportResponse) => {
          if (response.success && response.data) {
            // Convertir el cliente importado/existente al formato estándar
            // Usar el idAgency de la respuesta si está disponible, sino usar el de la agencia seleccionada
            const responseData = response.data as any; // Type assertion para acceder a idAgency opcional
            const clientIdAgency = responseData.idAgency !== undefined && responseData.idAgency !== null
              ? (typeof responseData.idAgency === 'string' ? parseInt(responseData.idAgency) : responseData.idAgency)
              : (this.selectedAgency?.Id || null);
            
            const importedClient = {
              idCliente: response.data.idCliente,
              ndCliente: response.data.ndCliente || vanguardiaClient.ndDMS,
              cliente: response.data.cliente || 
                      `${response.data.nombre || ''} ${response.data.apellidoPaterno || ''} ${response.data.apellidoMaterno || ''}`.trim() ||
                      response.data.razonSocial,
              nombre: response.data.nombre,
              apellidoPaterno: response.data.apellidoPaterno,
              apellidoMaterno: response.data.apellidoMaterno,
              rfc: response.data.rfc,
              email: response.data.email,
              telefono: response.data.telefono,
              telefono2: response.data.telefono2,
              razonSocial: response.data.razonSocial,
              curp: response.data.curp,
              asesor: response.data.asesor,
              agenciaOrigen: response.data.agenciaOrigen || String(clientIdAgency),
              fechaRegistro: response.data.fechaRegistro,
              fechaActualizacion: response.data.fechaActualizacion,
              idAgency: clientIdAgency,
              isImportedFromVanguardia: true
            };
            
            // Seleccionar el cliente (ya sea importado o existente)
            this.selectClient(importedClient);
            
            // Mostrar mensaje apropiado según el caso
            if (response.message && response.message.includes('importado exitosamente')) {
              this.snackBar.open(`Cliente ${importedClient.cliente || importedClient.ndCliente} importado exitosamente desde Vanguardia`, 'Cerrar', {
                duration: 5000
              });
            } else if (response.message && response.message.includes('vinculado por RFC')) {
              this.snackBar.open(`Cliente ${importedClient.cliente || importedClient.ndCliente} vinculado por RFC; se creó la relación con ND ${importedClient.ndCliente}`, 'Cerrar', {
                duration: 5000
              });
            } else if (response.message && response.message.includes('ya existe')) {
              // Cliente ya existe: informar al usuario y seleccionarlo
              this.snackBar.open(`Cliente ${importedClient.cliente || importedClient.ndCliente} ya existe en el sistema. Seleccionado automáticamente.`, 'Cerrar', {
                duration: 5000
              });
            }
          } else {
            this.snackBar.open('Error al importar cliente desde Vanguardia: ' + (response.message || 'Error desconocido'), 'Cerrar', {
              duration: 4000
            });
          }
        },
        error: (error) => {
          // Si el error es que el cliente ya existe, intentar buscarlo y seleccionarlo
          if (error.error?.message && error.error.message.includes('ya existe')) {
            // El cliente existe pero no se pudo obtener en la respuesta
            // Intentar buscarlo por ndDMS en la agencia actual
            const ndDMS = importData.ndDMS;
            if (ndDMS && this.selectedAgencyId) {
              this.clientSearchService.searchClients(this.selectedAgencyId, ndDMS, 10)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                  next: (searchResponse: ClientSearchResponse) => {
                    if (searchResponse.success && searchResponse.data?.clientes && searchResponse.data.clientes.length > 0) {
                      // Encontrar el cliente con el ndDMS exacto
                      const foundClient = searchResponse.data.clientes.find(c => c.ndCliente === ndDMS);
                      if (foundClient) {
                        this.selectClient(foundClient);
                        this.snackBar.open(`Cliente ${foundClient.cliente || foundClient.ndCliente} ya existe en el sistema. Seleccionado automáticamente.`, 'Cerrar', {
                          duration: 5000
                        });
                      } else {
                        this.snackBar.open('Cliente ya existe pero no se pudo encontrar en la búsqueda. Intente buscarlo manualmente.', 'Cerrar', {
                          duration: 5000
                        });
                      }
                    } else {
                      this.snackBar.open('Cliente ya existe pero no se pudo encontrar en la búsqueda. Intente buscarlo manualmente.', 'Cerrar', {
                        duration: 5000
                      });
                    }
                  },
                  error: () => {
                    this.snackBar.open('Cliente ya existe pero no se pudo encontrar. Intente buscarlo manualmente.', 'Cerrar', {
                      duration: 5000
                    });
                  }
                });
            } else {
              this.snackBar.open('Error: Cliente ya existe pero no se pudo obtener la información. Intente buscarlo manualmente.', 'Cerrar', {
                duration: 5000
              });
            }
          } else {
            this.snackBar.open('Error al importar cliente desde Vanguardia: ' + (error.error?.message || error.message), 'Cerrar', {
              duration: 5000
            });
          }
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
    this.uploadingDocuments.clear();
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
    this.selectedDocumentsForBatch.clear();
    this.uploadingDocuments.clear();
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
    this.uploadingDocuments.clear();
    
    // Limpiar búsqueda y paginación de pedidos
    this.orderSearchTerm = '';
    this.currentPage = 0;
    
    // Cargar automáticamente los pedidos de integración del cliente seleccionado
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
    this.filesExceedingSize = {};
    this.selectedDocumentsForBatch.clear();
    this.uploadingDocuments.clear();
    // Limpiar búsqueda y paginación
    this.orderSearchTerm = '';
    this.currentPage = 0;
    this.updateFilesDisplay();
    this.snackBar.open('Selección de cliente limpiada', 'Cerrar', {
      duration: 2000
    });
  }

  loadClientFiles(): void {
    this.loadClientFilesWithCallback();
  }

  /**
   * Refrescar los pedidos relacionados del cliente
   */
  refreshClientFiles(): void {
    if (!this.selectedClient || !this.selectedClient.ndCliente) {
      this.snackBar.open('Debe seleccionar un cliente primero', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    const agencyId = this.selectedAgency?.id ?? this.selectedAgency?.Id ?? this.selectedAgency?.IdAgency;
    if (!this.selectedAgency || agencyId == null) {
      this.snackBar.open('Debe seleccionar una agencia primero', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    this.refreshingFiles = true;
    this.cdr.markForCheck();
    
    // Guardar referencia para mostrar mensaje después
    const wasRefreshing = true;
    
    // Llamar al método de carga
    this.loadClientFilesWithCallback(() => {
      if (wasRefreshing) {
        this.snackBar.open('Pedidos actualizados correctamente', 'Cerrar', {
          duration: 2000
        });
      }
    });
  }

  /**
   * Cargar pedidos del cliente con callback opcional
   */
  private loadClientFilesWithCallback(callback?: () => void): void {
    if (!this.selectedClient || !this.selectedClient.ndCliente) {
      this.files = [];
      if (callback) callback();
      return;
    }

    this.filesLoading = true;

    const agencyId = this.selectedAgency.id ?? this.selectedAgency.Id ?? this.selectedAgency.IdAgency;
    let params = new HttpParams();
    params = params.set('agencyId', String(agencyId));
    params = params.set('ndCliente', this.selectedClient.ndCliente);
    params = params.set('statusId', '1'); // ID para Integración

    // Cargar solo pedidos que ya están en la tabla de file (no desde Vanguardia)
    this.http.get<any>(`${environment.apiBaseUrl}/api/files/by-agency-client`, { params })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response && response.success && response.data && response.data.files) {
            // Normalizar nombres de propiedades a minúsculas para asegurar consistencia
            this.files = response.data.files.map((file: any) => ({
              ...file,
              // Asegurar que los campos estén en minúsculas (por si vienen en mayúsculas)
              year: file.year || file.Year || null,
              modelo: file.modelo || file.Modelo || null,
              version: file.version || file.Version || null,
              vin: file.vin || file.VIN || file.Vin || null
            }));
          } else {
            this.files = [];
          }
          
          this.updateFilesDisplay();
          
          this.filesLoading = false;
          this.refreshingFiles = false;
          this.cdr.markForCheck();
          
          if (callback) callback();
        },
        error: (error) => {
          this.files = [];
          this.filesLoading = false;
          this.refreshingFiles = false;
          this.cdr.markForCheck();
          this.snackBar.open('Error al cargar los pedidos del cliente', 'Cerrar', {
            duration: 3000
          });
          if (callback) callback();
        }
      });
  }

  trackByClientId(index: number, client: any): any {
    return client?.ndCliente || client?.idCliente || client?.Id || index;
  }

  // Métodos para acciones de pedidos
  cancelarPedido(file: any): void {
    // Aquí implementarías la lógica para cancelar el pedido
    this.snackBar.open(`Pedido ${file.numeroPedido} cancelado`, 'Cerrar', {
      duration: 3000
    });
  }

  excepcionPedido(file: any): void {
    // Aquí implementarías la lógica para crear una excepción
    this.snackBar.open(`Excepción creada para pedido ${file.numeroPedido}`, 'Cerrar', {
      duration: 3000
    });
  }

  agregarPedidoIntegracion(): void {
    // Verificar que tenemos cliente y agencia seleccionados
    if (!this.selectedClient || !this.selectedClient.ndCliente) {
      this.snackBar.open('Debe seleccionar un cliente primero', 'Cerrar', {
        duration: 3000
      });
      return;
    }
    
    const agencyId = this.selectedAgency?.id ?? this.selectedAgency?.Id ?? this.selectedAgency?.IdAgency;
    if (!this.selectedAgency || agencyId == null) {
      this.snackBar.open('Debe seleccionar una agencia primero', 'Cerrar', {
        duration: 3000
      });
      return;
    }
    
    // Llamar al API de Vanguardia para obtener pedidos
    this.loadOrdersFromVanguardia();
  }

  // MÉTODO TEMPORAL PARA PRUEBAS
  private testOrderDialog(): void {
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
    // Activar loading
    this.loadingOrdersFromVanguardia = true;
    this.cdr.markForCheck();
    
    // Verificar que la agencia tenga AgencyConnection
    if (!this.selectedAgency.AgencyConnection) {
      this.loadingOrdersFromVanguardia = false;
      this.cdr.markForCheck();
      this.snackBar.open('La agencia seleccionada no tiene connectionstring configurado', 'Cerrar', {
        duration: 3000
      });
      return;
    }
    
    let params = new HttpParams();
    params = params.set('customerDMS', this.selectedClient.ndCliente);
    params = params.set('connectionstring', this.selectedAgency.AgencyConnection);
    params = params.set('perpage', '1000'); // Traer todos los registros de una vez

    const headers = {
      'X-Provider-Token': 'b26e88c4-ddbe-4adb-a214-4667f454824a'
    };

    this.http.get<any>(environment.vanguardia.ordersApiUrl, { 
      params,
      headers
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          // Desactivar loading
          this.loadingOrdersFromVanguardia = false;
          this.cdr.markForCheck();
          
          // Verificar diferentes estructuras de respuesta posibles
          let ordersData = null;
          
          if (response && response.success && response.data) {
            // Estructura estándar: { success: true, data: [...] }
            ordersData = response.data;
          } else if (response && response.status === 200 && response.data) {
            // Estructura de Vanguardia: { status: 200, message: "...", data: [...] }
            // Verificar si data contiene un array de pedidos
            if (Array.isArray(response.data)) {
              ordersData = response.data;
            } else if (response.data && Array.isArray(response.data.orders)) {
              ordersData = response.data.orders;
            } else if (response.data && Array.isArray(response.data.data)) {
              ordersData = response.data.data;
            } else if (response.data && Array.isArray(response.data.results)) {
              ordersData = response.data.results;
            } else {
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
            // Mostrar directamente el diálogo con todos los datos
            this.showOrderSelectionDialogDirectly(ordersData);
            
            this.snackBar.open(`${ordersData.length} pedidos encontrados en Vanguardia`, 'Cerrar', {
              duration: 3000
            });
          } else {
            // Desactivar loading
            this.loadingOrdersFromVanguardia = false;
            this.cdr.markForCheck();
            this.snackBar.open('No se encontraron pedidos en Vanguardia para este cliente', 'Cerrar', {
              duration: 3000
            });
          }
        },
        error: (error) => {
          // Desactivar loading
          this.loadingOrdersFromVanguardia = false;
          this.cdr.markForCheck();
          
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
    let processedOrders: any[] = [];
    
    if (Array.isArray(ordersData)) {
      processedOrders = ordersData.map((order, index) => {
        return {
          numeroPedido: order.numeroPedido || order.orderNumber || order.id || `PED-${index + 1}`,
          numeroInventario: order.numeroInventario || order.inventoryNumber || '',
          proceso: order.proceso || order.process || 'Integración',
          operacion: order.operacion || order.operation || '',
          tipoCliente: order.tipoCliente || order.clientType || '',
          vehiculo: order.vehiculo || order.vehicle || '',
          year: order.year || order.year || '',
          modelo: order.modelo || order.model || '',
          version: order.version || '',
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
        version: ordersData.version || '',
        vin: ordersData.vin || ordersData.vin || '',
        agencia: ordersData.agencia || ordersData.agency || this.selectedAgency?.Name || 'Sin agencia',
        fechaRegistro: ordersData.fechaRegistro || ordersData.registrationDate || new Date(),
        fileId: ordersData.fileId || ordersData.id || 'file-1',
        // Marcar como pedido de Vanguardia
        isVanguardiaOrder: true,
        vanguardiaData: ordersData
      }];
    } else {
      this.snackBar.open('Error: Formato de datos de pedidos no válido', 'Cerrar', {
        duration: 3000
      });
      return;
    }
    
    // Cargar pedidos existentes en file para comparar
    this.loadClientFilesForComparison(processedOrders);
  }

  private loadClientFilesForComparison(vanguardiaOrders: any[]): void {
    if (!this.selectedClient || !this.selectedClient.ndCliente) {
      // Si no hay cliente seleccionado, mostrar todos los pedidos de Vanguardia
      this.showOrderSelectionDialog(vanguardiaOrders);
      return;
    }

    const agencyId = this.selectedAgency.id ?? this.selectedAgency.Id ?? this.selectedAgency.IdAgency;
    let params = new HttpParams();
    params = params.set('agencyId', String(agencyId));
    params = params.set('ndCliente', this.selectedClient.ndCliente);
    params = params.set('statusId', '1'); // ID para Integración

    this.http.get<any>(`${environment.apiBaseUrl}/api/files/by-agency-client`, { params })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          let existingFiles: any[] = [];
          if (response && response.success && response.data && response.data.files) {
            existingFiles = response.data.files;
          }
          
          // Filtrar pedidos de Vanguardia que no existen en la tabla de file
          const newOrders = this.filterNewOrders(vanguardiaOrders, existingFiles);
          
          if (newOrders.length > 0) {
            this.showOrderSelectionDialog(newOrders);
          } else {
            this.snackBar.open('Todos los pedidos de Vanguardia ya existen en el sistema', 'Cerrar', {
              duration: 3000
            });
            // Cargar pedidos existentes en la tabla
            this.loadClientFiles();
          }
        },
        error: (error) => {
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
    if (!apiOrders || apiOrders.length === 0) {
      this.snackBar.open('No hay pedidos disponibles para mostrar', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    // Verificar qué pedidos ya existen en la base de datos
    this.checkExistingOrders(apiOrders);
  }

  private checkExistingOrders(apiOrders: any[]): void {
    const requestData = {
      orders: apiOrders,
      agencyId: this.selectedAgencyId,
      ndCliente: this.selectedClient?.ndCliente ?? undefined
    };

    this.http.post<any>(`${environment.apiBaseUrl}/api/files/check-existing-orders`, requestData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            const { existingOrders, newOrders, existingCount, newCount } = response.data;
            
            if (existingCount > 0) {
              this.snackBar.open(
                `${existingCount} pedidos ya existen en el sistema. Pueden no aparecer en el listado si fueron creados con una relación de cliente incorrecta.`, 
                'Cerrar', 
                { duration: 5000 }
              );
            }
            
            if (newOrders.length === 0 && existingCount > 0) {
              // Si no hay pedidos nuevos pero hay existentes, mostrar solo los existentes
              // Desactivar loading
              this.loadingOrdersFromVanguardia = false;
              this.cdr.markForCheck();
              // Abrir diálogo con solo pedidos existentes
              this.openOrderSelectionDialog([], existingOrders);
              return;
            }
            
            if (newOrders.length === 0) {
              // Desactivar loading
              this.loadingOrdersFromVanguardia = false;
              this.cdr.markForCheck();
              this.snackBar.open('Todos los pedidos de Vanguardia ya existen en el sistema', 'Cerrar', {
                duration: 3000
              });
              return;
            }
            
            // Mostrar pedidos nuevos y existentes en el diálogo con tabs
            this.openOrderSelectionDialog(newOrders, existingOrders);
          } else {
            // Desactivar loading
            this.loadingOrdersFromVanguardia = false;
            this.cdr.markForCheck();
            this.snackBar.open('Error al verificar pedidos existentes', 'Cerrar', {
              duration: 3000
            });
          }
        },
        error: (error) => {
          // Desactivar loading
          this.loadingOrdersFromVanguardia = false;
          this.cdr.markForCheck();
          this.snackBar.open('Error al verificar pedidos existentes', 'Cerrar', {
            duration: 3000
          });
        }
      });
  }

  private openOrderSelectionDialog(orders: any[], existingOrders: any[] = []): void {
    // Desactivar loading cuando se abre el diálogo
    this.loadingOrdersFromVanguardia = false;
    this.cdr.markForCheck();
    
    try {
      const dialogRef = this.dialog.open(OrderSelectionDialogComponent, {
        width: 'auto',
        height: 'auto',
        maxWidth: '90vw',
        maxHeight: '80vh',
        data: { 
          orders: orders, 
          agencyId: this.selectedAgencyId, 
          ndCliente: this.selectedClient?.ndCliente,
          existingOrders: existingOrders // Pasar pedidos existentes al diálogo
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result && result.length > 0) {
          // Procesar los pedidos seleccionados antes de agregarlos
          const processedOrders = this.processSelectedOrders(result);
          this.addSelectedOrdersToTable(processedOrders);
          this.snackBar.open(`${result.length} pedidos agregados exitosamente`, 'Cerrar', {
            duration: 3000
          });
        } else {
          // Si se canceló el diálogo, cargar pedidos existentes
          this.loadClientFiles();
        }
      });
    } catch (error) {
      // Desactivar loading en caso de error
      this.loadingOrdersFromVanguardia = false;
      this.cdr.markForCheck();
      this.snackBar.open('Error al abrir el diálogo de selección', 'Cerrar', {
        duration: 3000
      });
    }
  }

  private showOrderSelectionDialog(orders: any[], existingOrders: any[] = []): void {
    if ((!orders || orders.length === 0) && (!existingOrders || existingOrders.length === 0)) {
      // Desactivar loading
      this.loadingOrdersFromVanguardia = false;
      this.cdr.markForCheck();
      this.snackBar.open('No hay pedidos disponibles para mostrar', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    // Desactivar loading cuando se abre el diálogo
    this.loadingOrdersFromVanguardia = false;
    this.cdr.markForCheck();

    try {
      const dialogRef = this.dialog.open(OrderSelectionDialogComponent, {
        width: 'auto',
        height: 'auto',
        maxWidth: '90vw',
        maxHeight: '80vh',
        disableClose: false, // Permitir cerrar normalmente, pero se controlará en el componente
        data: { 
          orders: orders, 
          agencyId: this.selectedAgencyId, 
          ndCliente: this.selectedClient?.ndCliente,
          existingOrders: existingOrders // Pasar pedidos existentes al diálogo
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result && result.success) {
          // Expediente creado exitosamente
          this.snackBar.open(`Expediente creado exitosamente con ${result.documentsCreated} documentos`, 'Cerrar', {
            duration: 5000
          });
          
          // Recargar los expedientes del cliente para mostrar el nuevo expediente
          this.loadClientFiles();
          
        } else if (result && result.success === false) {
          // Error al crear el expediente
          this.snackBar.open(`Error: ${result.message}`, 'Cerrar', {
            duration: 5000
          });
          
        } else if (result && result.length > 0) {
          // Formato anterior (pedidos seleccionados directamente)
          this.addSelectedOrdersToTable(result);
          this.snackBar.open(`${result.length} pedidos agregados exitosamente`, 'Cerrar', {
            duration: 3000
          });
          
        } else {
          // Diálogo cancelado
          this.loadClientFiles();
        }
      });
    } catch (error) {
      this.snackBar.open('Error al abrir el diálogo de selección', 'Cerrar', {
        duration: 3000
      });
    }
  }

  private processSelectedOrders(selectedOrders: any[]): any[] {
    return selectedOrders.map((order, index) => {
      return {
        numeroPedido: order.numeroPedido || order.orderNumber || order.id || `PED-${index + 1}`,
        numeroInventario: order.numeroInventario || order.inventoryNumber || '',
        proceso: order.proceso || order.process || 'Integración',
        operacion: order.operacion || order.operation || '',
        tipoCliente: order.tipoCliente || order.clientType || '',
        vehiculo: order.vehiculo || order.vehicle || '',
        year: order.year || order.year || '',
        modelo: order.modelo || order.model || '',
        version: order.version || '',
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
          if (response && response.success && response.data && response.data.documents) {
            this.requiredDocuments = response.data.documents;
          } else {
            this.requiredDocuments = [];
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
        }
      });
  }

  onFileSelected(event: any, documentId: string): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const maxSizeBytes = (environment.maxFileSizeMB || 100) * 1024 * 1024; // Convertir MB a bytes
      
      // Validar tamaño del archivo
      if (file.size > maxSizeBytes) {
        // Archivo excede el tamaño máximo
        this.filesExceedingSize[documentId] = true;
        this.selectedFiles[documentId] = file; // Guardar referencia para mostrar el nombre
        // Remover de selección en lote si estaba
        this.selectedDocumentsForBatch.delete(documentId);
        
        // Mostrar mensaje de error
        this.snackBar.open(
          `El archivo excede el tamaño máximo permitido de ${environment.maxFileSizeMB}MB`,
          'Cerrar',
          { duration: 5000 }
        );
      } else {
        // Archivo válido
        this.filesExceedingSize[documentId] = false;
        this.selectedFiles[documentId] = file;
        // Automáticamente marcar el documento para carga en lote si tiene archivo
        this.selectedDocumentsForBatch.add(documentId);
      }
      
      // Forzar detección de cambios
      this.cdr.markForCheck();
    }
  }

  /**
   * Toggle selección de documento para carga en lote
   */
  toggleDocumentForBatch(documentId: string): void {
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
  }

  /**
   * Verificar si un documento está seleccionado para carga en lote
   */
  isDocumentSelectedForBatch(documentId: string): boolean {
    return this.selectedDocumentsForBatch.has(documentId);
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
   * Cargar todos los documentos seleccionados en lote
   */
  uploadMultipleDocuments(): void {
    if (!this.hasDocumentsSelectedForBatch()) {
      this.snackBar.open('Debe seleccionar al menos un documento para cargar', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    const documentsToUpload = this.requiredDocuments.filter(doc => 
      this.selectedDocumentsForBatch.has(doc.documentId) && 
      this.selectedFiles[doc.documentId] &&
      !this.filesExceedingSize[doc.documentId] && // Excluir archivos que exceden el tamaño
      doc.idCurrentStatus !== '3' && 
      doc.idCurrentStatus !== '4'
    );
    
    // Verificar si hay archivos que exceden el tamaño
    const filesExceedingCount = this.requiredDocuments.filter(doc => 
      this.selectedDocumentsForBatch.has(doc.documentId) && 
      this.filesExceedingSize[doc.documentId]
    ).length;
    
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
      this.uploadingDocuments.add(doc.documentId);
    });

    // Cargar documentos secuencialmente para evitar sobrecarga
    let completed = 0;
    let failed = 0;
    const total = documentsToUpload.length;

    documentsToUpload.forEach((document, index) => {
      setTimeout(() => {
        this.uploadDocumentInternal(document, false).subscribe({
          next: () => {
            completed++;
            this.selectedDocumentsForBatch.delete(document.documentId);
            this.uploadingDocuments.delete(document.documentId);
            
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
            this.uploadingDocuments.delete(document.documentId);
            
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
   * Cargar un documento individual
   */
  uploadDocument(document: any): void {
    if (!this.selectedFiles[document.documentId]) {
      this.snackBar.open('Debe seleccionar un archivo', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    this.uploadingDocuments.add(document.documentId);
    this.uploadDocumentInternal(document, true).subscribe({
      next: () => {
        this.uploadingDocuments.delete(document.documentId);
      },
      error: () => {
        this.uploadingDocuments.delete(document.documentId);
      }
    });
  }

  /**
   * Método interno para cargar un documento
   */
  private uploadDocumentInternal(document: any, showIndividualMessage: boolean = true): Observable<any> {
    // Mostrar mensaje diferente si se está reemplazando
    const isReplacing = document.idCurrentStatus === '2';
    const actionText = isReplacing ? 'reemplazando' : 'cargando';

    // Validar que fileDocumentId existe (puede ser null si el documento nunca se ha subido)
    if (!document.fileDocumentId) {
      const errorMsg = 'Error: El documento no tiene un ID de archivo válido. Por favor, recarga la página e intenta nuevamente.';
      if (showIndividualMessage) {
        this.snackBar.open(errorMsg, 'Cerrar', {
          duration: 8000
        });
      }
      return throwError(() => new Error(errorMsg));
    }

    // Obtener archivo y sanitizar su nombre
    let file = this.selectedFiles[document.documentId];
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
          console.warn('No se pudo obtener el nombre desde la vista, usando nombre del documento requerido:', error);
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
            console.log('Archivo renombrado desde vista:', newFileName);
          } else if (response.useDocumentName && document.documentName) {
            // Usar el nombre del documento requerido como fallback
            const originalExtension = file.name.split('.').pop();
            const fileNameBase = document.documentName.replace(/\.[^/.]+$/, ''); // Remover extensión si tiene
            newFileName = fileNameBase + (originalExtension ? '.' + originalExtension : '');
            console.log('Archivo renombrado usando documentName:', newFileName);
          }

          // Si se obtuvo un nuevo nombre, crear un nuevo File
          if (newFileName) {
            file = new File([file], newFileName, { type: file.type });
          }

          // Preparar datos para Vanguardia API según documentación
          const formData = new FormData();
          formData.append('file', file); // File: Archivo a subir (con nombre renombrado o original)
          formData.append('idSingleFile', this.selectedFile.fileId.toString()); // Integer: ID del archivo en tabla (IdFile)
          formData.append('idDocumentFile', document.fileDocumentId.toString()); // Integer: ID del documento (IdDocumentByFile)

          // Usar API de Vanguardia (el proxy agregará X-Provider-Token automáticamente)
          return this.http.post<any>(environment.vanguardia.uploadApiUrl, formData);
        })
      )
      .pipe(
        takeUntil(this.destroy$),
        tap((response) => {
          if (showIndividualMessage) {
            this.snackBar.open(`Documento ${document.documentName} ${actionText} exitosamente`, 'Cerrar', {
              duration: 3000
            });
          }
          
          // Recargar documentos para mostrar el estado actualizado
          this.loadRequiredDocuments(this.selectedFile.fileId);
          // Limpiar archivo seleccionado
          delete this.selectedFiles[document.documentId];
          delete this.filesExceedingSize[document.documentId];
          // Remover de selección en lote si estaba
          this.selectedDocumentsForBatch.delete(document.documentId);
        }),
        catchError((error) => {
          let errorMessage = 'Error desconocido';
          
          if (error.status === 0) {
            errorMessage = 'Error de CORS: No se puede conectar con el servidor de Vanguardia. Verifique la configuración del servidor.';
          } else if (error.status === 400) {
            // Error 400: puede ser validación o registro no encontrado
            if (error.error && error.error.message) {
              const backendMessage = error.error.message;
              if (backendMessage.includes('No se encontró registro') || backendMessage.includes('No se encontró')) {
                errorMessage = `El registro del documento no existe en la base de datos de Vanguardia. Esto puede ocurrir si el registro fue eliminado o las bases de datos no están sincronizadas. Por favor, recarga la página para sincronizar los datos.`;
                // Recargar documentos para sincronizar después de mostrar el mensaje
                setTimeout(() => {
                  if (this.selectedFile) {
                    this.loadRequiredDocuments(this.selectedFile.fileId);
                  }
                }, 2000);
              } else if (error.error.error) {
                // Algunos errores tienen un campo 'error' adicional
                errorMessage = `${backendMessage}: ${error.error.error}`;
              } else {
                errorMessage = `Error de validación: ${backendMessage}`;
              }
            } else if (error.error && error.error.error) {
              errorMessage = `Error: ${error.error.error}`;
            } else {
              errorMessage = 'Error 400: Solicitud inválida. Verifique los parámetros enviados.';
            }
          } else if (error.status === 401) {
            errorMessage = 'Error 401: Token de autenticación inválido.';
          } else if (error.status === 403) {
            errorMessage = 'Error 403: Acceso denegado.';
          } else if (error.status === 404) {
            errorMessage = 'Error 404: Endpoint no encontrado.';
          } else if (error.status === 500) {
            errorMessage = 'Error 500: Error interno del servidor de Vanguardia.';
          } else if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          if (showIndividualMessage) {
            this.snackBar.open(`Error subiendo documento: ${errorMessage}`, 'Cerrar', {
              duration: 10000
            });
          }
          
          return throwError(() => error);
        })
      );
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
   * Verificar si un documento se está cargando
   */
  isDocumentUploading(documentId: string): boolean {
    return this.uploadingDocuments.has(documentId);
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
      duration: duration.toString()
    });

    const url = `${environment.vanguardia.uploadApiUrl.replace('/upload', '')}/get-private-url?${params.toString()}`;

    // El proxy agregará X-Provider-Token automáticamente
    this.http.get<any>(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.data && response.data.url) {
            const newWindow = window.open(response.data.url, '_blank');
            if (!newWindow) {
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
    // Eliminar duplicados basándose en fileId (ID único) antes de filtrar
    // No usar numeroPedido porque puede haber múltiples registros con el mismo número de pedido pero diferentes fileId
    const uniqueFiles = this.files.filter((file, index, self) => {
      const fileId = file.fileId || file.Id;
      const foundIndex = self.findIndex(f => (f.fileId || f.Id) === fileId);
      return index === foundIndex;
    });

    // Filtrar archivos por término de búsqueda
    if (this.orderSearchTerm && this.orderSearchTerm.trim()) {
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
    if (!file.fileId) {
      this.snackBar.open('Error: No se pudo identificar el ID del pedido', 'Cerrar', {
        duration: 3000
      });
      return;
    }
    
    // Confirmar eliminación
    const confirmMessage = `¿Estás seguro de que deseas eliminar el pedido ${file.numeroPedido}?\n\nEsta acción eliminará:\n- El expediente completo\n- Todos los documentos asociados\n\nEsta acción no se puede deshacer.`;
    
    if (confirm(confirmMessage)) {
      this.deleteFileFromServer(file.fileId);
    }
  }

  private deleteFileFromServer(fileId: string): void {
    const requestData = { fileId: fileId };

    this.http.post<any>(`${environment.apiBaseUrl}/api/files/delete`, requestData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            // Eliminar inmediatamente del array local para respuesta rápida
            const initialLength = this.files.length;
            this.files = this.files.filter(file => {
              const id = file.fileId || file.Id || file.id;
              return id !== fileId;
            });
            
            // Si se eliminó un pedido, actualizar la visualización
            if (this.files.length < initialLength) {
              this.updateFilesDisplay();
              
              // Ajustar la página si la página actual quedó vacía
              const maxPage = Math.max(0, Math.ceil(this.totalItems / this.pageSize) - 1);
              if (this.currentPage > maxPage) {
                this.currentPage = maxPage;
                this.updateFilesDisplay();
              }
            }
            
            // Limpiar la selección actual si el pedido eliminado era el seleccionado
            if (this.selectedFile && this.selectedFile.fileId === fileId) {
              this.selectedFile = null;
              this.requiredDocuments = [];
              this.documentsLoading = false;
              this.selectedFiles = {};
    this.filesExceedingSize = {};
            }
            
            // Marcar para detección de cambios
            this.cdr.markForCheck();
            
            this.snackBar.open(
              `Pedido eliminado exitosamente. Documentos eliminados: ${response.data.documentsDeleted}`, 
              'Cerrar', 
              { duration: 4000 }
            );
            
            // Recargar la lista de files para sincronizar con el servidor
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
