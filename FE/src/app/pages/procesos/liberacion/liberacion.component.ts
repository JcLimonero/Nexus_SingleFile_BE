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
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Subject, takeUntil, Observable, throwError, of } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { DefaultAgencyService } from '../../../core/services/default-agency.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ClientSearchService, ClientSearchResponse } from '../../../core/services/client-search.service';
import { ClientSelectionDialogComponent } from '../integracion/client-selection-dialog.component';

@Component({
  selector: 'vex-liberacion',
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
    MatTabsModule,
    MatCheckboxModule
  ],
  templateUrl: './liberacion.component.html',
  styleUrls: ['./liberacion.component.scss']
})
export class LiberacionComponent implements OnInit, OnDestroy {
  loading = false;
  liberationStatus = 'inactive'; // inactive, active, error
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
    'fechaRegistro'
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
  documentTabs: Array<{ id: string; name: string; documents: any[]; hasPending: boolean; hasRejected: boolean }> = [];
  selectedTabIndex = 0;
  
  // Process properties - Fixed process for liberación
  liberationProcessId = 3; // Liberación
  private readonly LIBERACION_STATE_ID = 3;
  
  private destroy$ = new Subject<void>();

  constructor(
    private snackBar: MatSnackBar,
    private defaultAgencyService: DefaultAgencyService,
    private http: HttpClient,
    private dialog: MatDialog,
    private clientSearchService: ClientSearchService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.loadLiberationStatus();
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
    this.userRole = 'manager'; // TODO: obtener del usuario real
    this.isManagerOrAdmin = this.userRole === 'manager' || this.userRole === 'admin';
    
    // No hay columna de acciones en esta vista
  }

  loadLiberationStatus(): void {
    this.loading = true;
    setTimeout(() => {
      this.liberationStatus = 'active';
      this.loading = false;
    }, 1000);
  }

  // ====================================
  //           Manejo de agencias
  // ====================================
  private loadAgencies(): void {
    this.agenciesLoading = true;
    
    this.defaultAgencyService.obtenerAgencias()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (agencias) => {
          this.agencies = agencias;
          this.agenciesLoading = false;
          
          setTimeout(() => {
            this.defaultAgencyService.establecerAgenciaPredeterminada(true).subscribe({
              next: (agenciaId) => {
                if (agenciaId) {
                  this.selectedAgencyId = agenciaId;
                  this.onAgencyChange(agenciaId);
                } else if (this.agencies.length > 0) {
                  const primeraAgencia = this.agencies[0];
                  this.selectedAgencyId = primeraAgencia.Id;
                  this.onAgencyChange(primeraAgencia.Id);
                }
              },
              error: (error) => {

                if (this.agencies.length > 0) {
                  const primeraAgencia = this.agencies[0];
                  this.selectedAgencyId = primeraAgencia.Id;
                  this.onAgencyChange(primeraAgencia.Id);
                }
              }
            });
          }, 100);
        },
        error: (error) => {

          this.agencies = [];
          this.agenciesLoading = false;
          this.snackBar.open('Error al cargar las agencias', 'Cerrar', { duration: 3000 });
        }
      });
  }

  onAgencyChange(agencyId: number | null): void {
    this.selectedAgencyId = agencyId;
    this.selectedAgency = this.agencies.find(agency => agency.Id === agencyId) || null;
    
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

  // ====================================
  //         Búsqueda de clientes
  // ====================================
  onClientSearchChange(): void {
    if (!this.clientSearchTerm.trim()) {
      this.clients = [];
      this.showClientResults = false;
    } else if (this.selectedClient) {
      this.clearAllClientData();
    }
  }

  searchClients(): void {
    if (this.clientSearchTerm.trim().length < 1) {
      this.snackBar.open('Debe ingresar al menos 1 carácter para buscar', 'Cerrar', { duration: 3000 });
      return;
    }

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

    if (!this.selectedAgencyId) {
      this.snackBar.open('Debe seleccionar una agencia para buscar clientes', 'Cerrar', { duration: 3000 });
      return;
    }

    this.clientsLoading = true;
    this.showClientResults = true;

    this.clientSearchService.searchClients(
      this.selectedAgencyId!,
      this.clientSearchTerm.trim(),
      50,
      this.LIBERACION_STATE_ID
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ClientSearchResponse) => {
          if (response && response.success && response.data && response.data.clientes) {
            this.clients = response.data.clientes;

            if (this.clients.length > 1) {
              this.showClientSelectionDialog();
            } else if (this.clients.length === 1) {
              this.selectClient(this.clients[0]);
            } else {
              this.snackBar.open('No se encontraron clientes con pedidos en Liberación', 'Cerrar', { duration: 3000 });
            }
          } else {
            this.clients = [];
            this.snackBar.open('No se encontraron clientes con pedidos en Liberación', 'Cerrar', { duration: 3000 });
          }

          this.clientsLoading = false;
        },
        error: (error: any) => {

          this.clients = [];
          this.clientsLoading = false;
          this.snackBar.open('Error al buscar clientes', 'Cerrar', { duration: 3000 });
        }
      });
  }

  clearClientSearch(): void {
    this.clientSearchTerm = '';
    this.clients = [];
    this.showClientResults = false;
    this.selectedClient = null;
    this.requiredDocuments = [];
    this.selectedFile = null;
    this.selectedFiles = {};
    this.filesExceedingSize = {};
    this.selectedDocumentsForBatch.clear();
  }

  clearAllClientData(): void {
    this.selectedClient = null;
    this.clients = [];
    this.showClientResults = false;
    this.files = [];
    this.filteredFiles = [];
    this.paginatedFiles = [];
    this.selectedFile = null;
    this.filesLoading = false;
    this.requiredDocuments = [];
    this.selectedFiles = {};
    this.filesExceedingSize = {};
    this.selectedDocumentsForBatch.clear();
    this.documentsLoading = false;
    this.clientsLoading = false;
    this.orderSearchTerm = '';
    this.currentPage = 0;
    this.totalItems = 0;
  }

  selectClient(client: any): void {
    this.selectedClient = client;
    this.showClientResults = false;
    this.clientSearchTerm = '';
    this.requiredDocuments = [];
    this.selectedFile = null;
    this.selectedFiles = {};
    this.filesExceedingSize = {};
    this.selectedDocumentsForBatch.clear();
    this.orderSearchTerm = '';
    this.currentPage = 0;

    this.loadClientFiles();
    this.snackBar.open(`Cliente seleccionado: ${client.cliente}`, 'Cerrar', { duration: 3000 });
  }

  /**
   * Seleccionar cliente y pedido automáticamente desde parámetros de URL
   */
  private seleccionarClienteYPedidoDesdeURL(idCliente: string, idPedido?: string, idFile?: string): void {

    if (!this.selectedAgency || !this.selectedAgency.IdAgency) {

      setTimeout(() => {
        this.seleccionarClienteYPedidoDesdeURL(idCliente, idPedido, idFile);
      }, 500);
      return;
    }

    // Buscar el cliente por ndCliente
    this.clientSearchService.searchClients(this.selectedAgency.IdAgency, idCliente, 50, this.LIBERACION_STATE_ID)
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

  // ====================================
  //           Manejo de pedidos
  // ====================================
  clearClientSelection(): void {
    this.selectedClient = null;
    this.files = [];
    this.requiredDocuments = [];
    this.selectedFile = null;
    this.selectedFiles = {};
    this.filesExceedingSize = {};
    this.selectedDocumentsForBatch.clear();
    this.orderSearchTerm = '';
    this.currentPage = 0;
    this.updateFilesDisplay();
    this.snackBar.open('Selección de cliente limpiada', 'Cerrar', { duration: 2000 });
  }

  loadClientFiles(): void {
    if (!this.selectedClient || !this.selectedClient.ndCliente) {
      this.files = [];
      return;
    }

    this.filesLoading = true;

    let params = new HttpParams();
    const agencyParam = this.selectedAgency?.IdAgency ?? this.selectedAgencyId;
    if (agencyParam) {
      params = params.set('agencyId', agencyParam.toString());
    }
    params = params.set('ndCliente', this.selectedClient.ndCliente);
    params = params.set('statusId', this.LIBERACION_STATE_ID.toString());

    this.http.get<any>(`${environment.apiBaseUrl}/api/files/by-agency-client`, { params })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response && response.success && response.data && response.data.files) {
            this.files = response.data.files;
          } else {
            this.files = [];
          }
          
          this.updateFilesDisplay();
          this.filesLoading = false;
        },
        error: (error) => {

          this.files = [];
          this.filesLoading = false;
          this.snackBar.open('Error al cargar los pedidos del cliente', 'Cerrar', { duration: 3000 });
        }
      });
  }

  trackByClientId(index: number, client: any): number {
    return client.ndCliente;
  }

  revisarPedido(file: any): void {
    this.snackBar.open(`Pedido ${file.numeroPedido} revisado`, 'Cerrar', { duration: 3000 });
  }

  // ====================================
  //        Documentos por pedido
  // ====================================
  selectFile(file: any): void {
    this.selectedFile = file;
    this.loadRequiredDocuments(file.fileId);
  }

  loadRequiredDocuments(fileId: string): void {
    this.documentsLoading = true;
    this.requiredDocuments = [];
    this.documentTabs = [];

    let params = new HttpParams();
    params = params.set('fileId', fileId);
    params = params.set('idProcessType', '3'); // Documentos de Liberación

    this.http.get<any>(`${environment.apiBaseUrl}/api/documents/required`, { params })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.requiredDocuments = (response && response.success && response.data && response.data.documents) ? response.data.documents : [];
          this.buildDocumentTabs();
          this.documentsLoading = false;
        },
        error: (error) => {

          this.requiredDocuments = [];
          this.documentTabs = [];
          this.documentsLoading = false;
          this.snackBar.open('Error al cargar documentos requeridos', 'Cerrar', { duration: 3000 });
        }
      });
  }

  onFileSelected(event: any, documentFileId: string | number): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const maxSizeBytes = (environment.maxFileSizeMB || 100) * 1024 * 1024; // Convertir MB a bytes
      const key = documentFileId.toString();
      
      // Validar tamaño del archivo
      if (file.size > maxSizeBytes) {
        // Archivo excede el tamaño máximo
        this.filesExceedingSize[key] = true;
        this.selectedFiles[key] = file; // Guardar referencia para mostrar el nombre
        // Remover de selección en lote si estaba
        this.selectedDocumentsForBatch.delete(key);
        
        // Mostrar mensaje de error
        this.snackBar.open(
          `El archivo excede el tamaño máximo permitido de ${environment.maxFileSizeMB}MB`,
          'Cerrar',
          { duration: 5000 }
        );
      } else {
        // Archivo válido
        this.filesExceedingSize[key] = false;
        this.selectedFiles[key] = file;
        // Automáticamente marcar el documento para carga en lote si tiene archivo
        this.selectedDocumentsForBatch.add(key);
      }
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

    // Obtener todos los documentos de todos los tabs que estén seleccionados
    const documentsToUpload: any[] = [];
    this.documentTabs.forEach(tab => {
      tab.documents.forEach(doc => {
        const docKey = doc.fileDocumentId?.toString();
        if (docKey &&
            this.selectedDocumentsForBatch.has(docKey) && 
            this.selectedFiles[docKey] &&
            !this.filesExceedingSize[docKey] && // Excluir archivos que exceden el tamaño
            doc.idCurrentStatus !== '3' && 
            doc.idCurrentStatus !== '4') {
          documentsToUpload.push(doc);
        }
      });
    });
    
    // Verificar si hay archivos que exceden el tamaño
    const filesExceedingCount: any[] = [];
    this.documentTabs.forEach(tab => {
      tab.documents.forEach(doc => {
        const docKey = doc.fileDocumentId?.toString();
        if (docKey &&
            this.selectedDocumentsForBatch.has(docKey) && 
            this.filesExceedingSize[docKey]) {
          filesExceedingCount.push(doc);
        }
      });
    });
    
    if (filesExceedingCount.length > 0) {
      this.snackBar.open(
        `${filesExceedingCount.length} archivo(s) exceden el tamaño máximo de ${environment.maxFileSizeMB}MB y no se pueden cargar`,
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

          // Preparar datos para Vanguardia API
          const formData = new FormData();
          formData.append('file', file); // File: Archivo a subir (con nombre renombrado o original)
          formData.append('idSingleFile', this.selectedFile.fileId.toString());
          formData.append('idDocumentFile', document.fileDocumentId.toString());

          // Usar API de Vanguardia
          return this.http.post<any>(environment.vanguardia.uploadApiUrl, formData);
        })
      )
      .pipe(
        takeUntil(this.destroy$),
        tap((response) => {
          if (showIndividualMessage) {
            this.snackBar.open(`Documento ${document.documentName || document.fileName} ${actionText} exitosamente`, 'Cerrar', { duration: 3000 });
          }
          
          // Recargar documentos para mostrar el estado actualizado
          this.loadRequiredDocuments(this.selectedFile.fileId);
          // Limpiar archivo seleccionado
          delete this.selectedFiles[documentKey];
          delete this.filesExceedingSize[documentKey];
          // Remover de selección en lote si estaba
          this.selectedDocumentsForBatch.delete(documentKey);
          this.buildDocumentTabs();
        }),
        catchError((error) => {

          let errorMessage = 'Error desconocido';
          if (error.status === 0) {
            errorMessage = 'Error de CORS: No se puede conectar con el servidor de Backblaze.';
          } else if (error.status === 400) {
            errorMessage = 'Error 400: Solicitud inválida.';
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
            this.snackBar.open(`Error subiendo documento: ${errorMessage}`, 'Cerrar', { duration: 8000 });
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
      this.snackBar.open('Debe seleccionar un archivo', 'Cerrar', { duration: 3000 });
      return;
    }

    this.uploadingDocuments.add(documentKey);
    this.uploadDocumentInternal(document, true).subscribe({
      next: () => {
        this.uploadingDocuments.delete(documentKey);
      },
      error: () => {
        this.uploadingDocuments.delete(documentKey);
      }
    });
  }

  viewDocument(document: any): void {
    if (!document.documentContainer) {
      this.snackBar.open('No se puede visualizar el documento', 'Cerrar', { duration: 3000 });
      return;
    }

    const duration = 3600;
    const params = new URLSearchParams({
      file: document.documentContainer,
      duration: duration.toString()
    });

    const url = `${environment.vanguardia.uploadApiUrl.replace('/upload', '')}/get-private-url?${params.toString()}`;

    this.http.get<any>(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.data && response.data.url) {
            const newWindow = window.open(response.data.url, '_blank');
            if (!newWindow) {
              this.snackBar.open('No se pudo abrir el documento. Verifica el bloqueador de pop-ups.', 'Cerrar', { duration: 5000 });
            }
          } else {
            this.snackBar.open('No se pudo obtener la URL del documento', 'Cerrar', { duration: 3000 });
          }
        },
        error: () => {
          this.snackBar.open('Error al obtener URL del documento', 'Cerrar', { duration: 3000 });
        }
      });
  }

  getDocumentStatusIcon(status: string, idCurrentStatus?: string): string {
    if (idCurrentStatus) {
      switch (idCurrentStatus) {
        case '1': return 'fiber_new';
        case '2': return 'upload_file';
        case '3': return 'visibility';
        case '4': return 'check_circle';
        case '5': return 'cancel';
        case '6': return 'error';
        default: return 'help';
      }
    }

    switch (status) {
      case 'uploaded': return 'check_circle';
      case 'required': return 'info';
      case 'optional': return 'help';
      default: return 'help';
    }
  }

  trackByDocumentId(index: number, document: any): string {
    return document.fileDocumentId?.toString() || document.documentId?.toString() || index.toString();
  }

  getDocumentStatusColor(status: string, idCurrentStatus?: string): string {
    if (idCurrentStatus) {
      switch (idCurrentStatus) {
        case '1': return 'text-blue-600';
        case '2': return 'text-orange-600';
        case '3': return 'text-yellow-600';
        case '4': return 'text-green-600';
        case '5': return 'text-red-600';
        case '6': return 'text-red-800';
        default: return 'text-gray-600';
      }
    }

    switch (status) {
      case 'uploaded': return 'text-green-600';
      case 'required': return 'text-yellow-600';
      case 'optional': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  }

  // ====================================
  //           Paginación local
  // ====================================
  onOrderSearchChange(): void {
    this.currentPage = 0;
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
    const uniqueFiles = this.files.filter((file, index, self) => 
      index === self.findIndex(f => f.numeroPedido === file.numeroPedido)
    );

    if (this.orderSearchTerm.trim()) {
      const term = this.orderSearchTerm.toLowerCase();
      this.filteredFiles = uniqueFiles.filter(file => 
        file.numeroPedido?.toString().toLowerCase().includes(term) ||
        file.numeroInventario?.toString().toLowerCase().includes(term) ||
        file.proceso?.toLowerCase().includes(term) ||
        file.operacion?.toLowerCase().includes(term) ||
        file.tipoCliente?.toLowerCase().includes(term) ||
        file.vehiculo?.toLowerCase().includes(term) ||
        file.modelo?.toLowerCase().includes(term) ||
        file.vin?.toLowerCase().includes(term) ||
        file.agencia?.toLowerCase().includes(term)
      );
    } else {
      this.filteredFiles = [...uniqueFiles];
    }

    this.totalItems = this.filteredFiles.length;

    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedFiles = this.filteredFiles.slice(startIndex, endIndex);
  }

  private updateFilesDisplay(): void {
    this.filterAndPaginateFiles();
  }

  onTabChange(index: number): void {
    this.selectedTabIndex = index;
  }

  private buildDocumentTabs(): void {
    const groups = new Map<string, { id: string; name: string; documents: any[]; hasPending: boolean; hasRejected: boolean }>();

    this.requiredDocuments.forEach((doc) => {
      const id = doc.subProcessId ? String(doc.subProcessId) : 'default';
      const name = doc.subProcessName || (doc.subProcessId ? `Subproceso ${doc.subProcessId}` : 'General');

      if (!groups.has(id)) {
        groups.set(id, { id, name, documents: [], hasPending: false, hasRejected: false });
      }

      groups.get(id)!.documents.push(doc);

      const status = Number(doc.idCurrentStatus);
      if (status === 5) {
        groups.get(id)!.hasRejected = true;
      } else if (status === 1 || status === 5 || status === 6) {
        groups.get(id)!.hasPending = true;
      }
    });

    this.documentTabs = Array.from(groups.values());
    this.selectedTabIndex = 0;
  }
}

