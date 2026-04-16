import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CancelarPedidoDialogComponent, CancelarPedidoData, CancelarPedidoResult } from './cancelar-pedido-dialog/cancelar-pedido-dialog.component';
import { ExcepcionPedidoDialogComponent, ExcepcionPedidoData, ExcepcionPedidoResult } from './excepcion-pedido-dialog/excepcion-pedido-dialog.component';
import { EliminarPedidoDialogComponent, EliminarPedidoData, EliminarPedidoResult } from './eliminar-pedido-dialog/eliminar-pedido-dialog.component';
import { CambiarEstatusDialogComponent, CambiarEstatusData, CambiarEstatusResult } from './cambiar-estatus-dialog/cambiar-estatus-dialog.component';
import { AprobarDocumentoDialogComponent, AprobarDocumentoData, AprobarDocumentoResult } from './aprobar-documento-dialog/aprobar-documento-dialog.component';
import { RechazarDocumentoDialogComponent, RechazarDocumentoData, RechazarDocumentoResult } from './rechazar-documento-dialog/rechazar-documento-dialog.component';
import { EliminarDocumentoDialogComponent, EliminarDocumentoData, EliminarDocumentoResult } from './eliminar-documento-dialog/eliminar-documento-dialog.component';
import { FASES_CATALOG, CatalogItem } from '../../../core/constants/catalogs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Subject, Subscription, takeUntil, catchError, of, timeout } from 'rxjs';
import { ValidacionService, Cliente, Documento, FiltrosValidacion } from './validacion.service';
import { AuthService } from '../../../core/services/auth.service';
import { DefaultAgencyService, Agencia } from '../../../core/services/default-agency.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AdvertenciaLiquidacionDialogComponent } from './advertencia-liquidacion-dialog/advertencia-liquidacion-dialog.component';
import { AdvertenciaLiberacionDialogComponent } from './advertencia-liberacion-dialog/advertencia-liberacion-dialog.component';
import { AdvertenciaLiberadoDialogComponent } from './advertencia-liberado-dialog/advertencia-liberado-dialog.component';

@Component({
  selector: 'vex-validacion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatChipsModule,
    MatCheckboxModule,
    MatMenuModule,
    MatSlideToggleModule,
    ScrollingModule,
    AprobarDocumentoDialogComponent,
    AdvertenciaLiquidacionDialogComponent,
    AdvertenciaLiberacionDialogComponent,
    AdvertenciaLiberadoDialogComponent
  ],
  templateUrl: './validacion.component.html',
  styleUrl: './validacion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ValidacionComponent implements OnInit, OnDestroy, AfterViewInit {
  private destroy$ = new Subject<void>();
  private sortChangeSub: Subscription | null = null;

  // Estado del componente
  loadingClientes = false;   // Tabla superior (clientes)
  loadingDocumentos = false; // Tabla inferior (documentos)
  loadingAgencias = false;
  loadingProcesos = false;   // Specific loading state for processes
  error = '';

  /** Valor especial para "Todos los procesos" en el combo */
  readonly ALL_PROCESSES_VALUE = 0;

  // Filtros principales: por defecto "Todos los procesos"
  selectedAgency: number | null = null;
  selectedProcess: number | null = 0; // 0 = Todos los procesos
  selectedFase: string = '';
  showCancelledOrders: boolean = false;

  // Datos de filtros disponibles
  agencias: any[] = [];
  procesos: any[] = [];
  fases: CatalogItem[] = FASES_CATALOG;

  // Tabla de clientes
  get clientesDisplayedColumns(): string[] {
    // Columna idFile solo para roles 7 y 8, al inicio cuando se muestra
    const base = ['ndCliente', 'ndPedido', 'cliente', 'tipoCliente', 'proceso', 'operacion', 'fase', 'fechaLiberacion', 'registro', 'acciones'];
    if (this.isAdmin) {
      return ['idFile', ...base];
    }
    return base;
  }
  clientesDataSource = new MatTableDataSource<any>([]);

  // Paginación
  pageSize = 7;
  pageSizeOptions = [5, 7, 10, 25, 50];
  currentPage = 0;
  totalRecords = 0;

  // Tabla de documentos: columnas visibles según rol (Rechazar solo rol 7, Eliminar solo roles 6 y 7)
  get documentosDisplayedColumns(): string[] {
    const base = ['proceso', 'fase', 'documento', 'disponibleCliente', 'estatus', 'ver', 'validar'];
    // Rechazar y Eliminar solo para roles 7 (Administrador) y 8 (Soporte)
    if (this.isAdmin) base.push('rechazar');
    if (this.isAdmin) base.push('eliminar');
    return [...base, 'requerido', 'requiereExpiracion', 'fecha', 'fechaExpiracion', 'comentario', 'asignado'];
  }
  documentosDataSource: any[] = [];

  // Cliente seleccionado
  selectedCliente: any = null;
  private advertenciaLiquidacionMostrada = false;
  private advertenciaLiberacionMostrada = false;
  private advertenciaLiberadoMostrada = false;
  private readonly LIQUIDACION_STATE_ID = 2;
  private readonly LIBERACION_STATE_ID = 3;
  private readonly LIBERADO_STATE_ID = 4;

  // Búsqueda
  searchTerm: string = '';

  // Verificar si el usuario es gerente o administrador
  get isManagerOrAdmin(): boolean {
    const user = this.authService.getCurrentUser();
    if (!user) return false;

    // Gerente (role_id = '6') o Administrador (role_id = '7' / '8')
    return String(user.role_id) === '6' || String(user.role_id) === '7' || String(user.role_id) === '8';
  }

  /** Solo roles 7 (Administrador) y 8 (Soporte): ID File, Rechazar, Eliminar, Administrar > Eliminar/Cambiar estatus. */
  get isAdmin(): boolean {
    const user = this.authService.getCurrentUser();
    if (!user) return false;
    return String(user.role_id) === '7' || String(user.role_id) === '8';
  }

  // Método auxiliar para el tooltip de fecha de expiración
  getFechaExpiracionTooltip(fechaExpiracion: string | null): string {
    return fechaExpiracion ? fechaExpiracion : '';
  }

  // TrackBy functions para optimizar *ngFor
  trackByAgenciaId(index: number, item: any): any {
    return item?.Id || index;
  }

  trackByProcesoId(index: number, item: any): any {
    return item?.Id || index;
  }

  trackByFaseValue(index: number, item: CatalogItem): any {
    return item?.value || index;
  }

  trackByClienteId(index: number, item: any): any {
    return item?.idFile || item?.Id || index;
  }

  trackByDocumentoId(index: number, item: any): any {
    return item?.idDocumentByFile || item?.Id || index;
  }

  // Métodos para las acciones del menú
  onDescargarArchivo(cliente: any): void {

    // Implementar lógica de descarga
    this.snackBar.open(`Descargando archivo para ${cliente.cliente}`, 'Cerrar', { duration: 3000 });
  }

  /**
   * Validar documento - abrir dialog para aprobar/rechazar
   */
  onValidarDocumento(documento: any): void {

    // Verificar que el estatus actual sea "3"
    if (documento.idEstatus !== '3') {
      this.snackBar.open('Solo se pueden validar documentos con estatus listo para validar', 'Cerrar', { duration: 3000 });
      return;
    }

    // Crear dialog para aprobar/rechazar documento
    const dialogData: AprobarDocumentoData = {
      documento: documento
    };

    const dialogRef = this.dialog.open(AprobarDocumentoDialogComponent, {
      width: '600px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe((result: AprobarDocumentoResult) => {
      if (result) {

        this.procesarAprobacionDocumento(documento, result);
      }
    });
  }

  /**
   * Ver documento - abrir el archivo directamente
   */
  onVerDocumento(documento: any): void {

    // Verificar si hay un documentContainer (nombre del archivo)
    if (!documento.documentContainer) {

      this.snackBar.open('No se puede visualizar el documento. No hay archivo asociado.', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    // Si el documento está en estatus 2 (Documento Cargado), cambiar a estatus 3 (En revisión)
    if (documento.idEstatus === '2') {
      

      this.validacionService.prepararDocumento(documento.idDocumentByFile)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            
            // Actualizar el estatus local del documento
            documento.idEstatus = '3';
            // Abrir el documento
            this.getBackblazePrivateUrl(documento.documentContainer, documento);
            // Recargar documentos para reflejar el cambio
            if (this.selectedCliente) {
              this.cargarDocumentosCliente(this.selectedCliente.idFile);
            }
          },
          error: (error) => {

            // Aún así abrir el documento, el cambio de estatus no debe bloquear la visualización
            this.snackBar.open('Advertencia: No se pudo cambiar el estatus del documento', 'Cerrar', {
              duration: 3000
            });
            this.getBackblazePrivateUrl(documento.documentContainer, documento);
          }
        });
    } else {
      // Si ya está en otro estatus, solo abrir el documento

      this.getBackblazePrivateUrl(documento.documentContainer, documento);
    }
  }

  /**
   * Obtener URL privada de Backblaze y abrir el documento en nueva pestaña
   */
  private getBackblazePrivateUrl(fileName: string, documento: any): void {

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

  /**
   * Procesar aprobación/rechazo de documento
   */
  private procesarAprobacionDocumento(documento: any, resultado: AprobarDocumentoResult): void {

    const nuevoEstatus = resultado.aprobado ? 4 : 5; // 4 = Aprobado, 5 = Rechazado

    this.validacionService.aprobarDocumento(documento.idDocumentByFile, nuevoEstatus, resultado.comentario, resultado.fechaExpiracion)
      .pipe(
        takeUntil(this.destroy$),
        timeout(10000)
      )
      .subscribe({
        next: (response) => {

          const mensaje = resultado.aprobado ? 'Documento aprobado exitosamente' : 'Documento rechazado exitosamente';
          this.snackBar.open(mensaje, 'Cerrar', { duration: 3000 });

          // Recargar documentos para reflejar el cambio
          if (this.selectedCliente) {
            this.cargarDocumentosCliente(this.selectedCliente.idFile);
          }
        },
        error: (error) => {

          this.snackBar.open(
            `Error al procesar el documento: ${error.message || 'Error desconocido'}`,
            'Cerrar',
            { duration: 5000 }
          );
        }
      });
  }

  /**
   * Método interno para preparar documento (reutilizable)
   */
  private validarDocumentoInterno(documento: any): void {

    this.validacionService.prepararDocumento(documento.idDocumentByFile)
      .pipe(
        takeUntil(this.destroy$),
        timeout(10000)
      )
      .subscribe({
        next: (response) => {

          this.snackBar.open('Documento preparado para validación exitosamente', 'Cerrar', { duration: 3000 });

          // Recargar documentos para reflejar el cambio
          if (this.selectedCliente) {
            this.cargarDocumentosCliente(this.selectedCliente.idFile);
          }
        },
        error: (error) => {

          this.snackBar.open(
            `Error al preparar el documento: ${error.message || 'Error desconocido'}`,
            'Cerrar',
            { duration: 5000 }
          );
        }
      });
  }

  // Método para prevenir la propagación del evento en el botón de acciones
  onActionsClick(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
  }

  // Método para manejar el toggle de pedidos cancelados
  onToggleCancelledOrders(): void {
    this.cargarClientes({ resetPage: true });
  }

  onCancelar(cliente: any): void {

    const dialogData: CancelarPedidoData = {
      cliente: cliente
    };

    const dialogRef = this.dialog.open(CancelarPedidoDialogComponent, {
      width: '600px',
      data: dialogData,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result: CancelarPedidoResult) => {
      if (result) {

        this.procesarCancelacion(cliente, result);
      }
    });
  }

  private procesarCancelacion(cliente: any, result: CancelarPedidoResult): void {

    // Llamar al servicio para cancelar el pedido
    this.validacionService.cancelarPedido(
      cliente.idFile,
      result.motivoId,
      result.comentario
    ).subscribe({
      next: (response) => {

        this.snackBar.open(
          `Pedido ${cliente.ndPedido} cancelado exitosamente`,
          'Cerrar',
          { duration: 5000 }
        );

        // Recargar los datos para reflejar el cambio
        this.cargarClientes();
      },
      error: (error) => {

        this.snackBar.open(
          `Error al cancelar el pedido: ${error.message || 'Error desconocido'}`,
          'Cerrar',
          { duration: 5000 }
        );
      }
    });
  }

  onExcepcion(cliente: any): void {

    const dialogData: ExcepcionPedidoData = {
      cliente: cliente
    };

    const dialogRef = this.dialog.open(ExcepcionPedidoDialogComponent, {
      width: '600px',
      data: dialogData,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result: ExcepcionPedidoResult) => {
      if (result) {

        this.procesarExcepcion(cliente, result);
      }
    });
  }

  private procesarExcepcion(cliente: any, result: ExcepcionPedidoResult): void {

    // Llamar al servicio para crear la excepción
    this.validacionService.excepcionPedido(
      cliente.idFile,
      result.motivoId,
      result.comentario
    ).subscribe({
      next: (response) => {

        this.snackBar.open(
          `Excepción creada para el pedido ${cliente.ndPedido}`,
          'Cerrar',
          { duration: 5000 }
        );

        // Recargar los datos para reflejar el cambio
        this.cargarClientes();
      },
      error: (error) => {

        this.snackBar.open(
          `Error al crear la excepción: ${error.message || 'Error desconocido'}`,
          'Cerrar',
          { duration: 5000 }
        );
      }
    });
  }

  onAdministrar(cliente: any): void {

    // Este método ya no se usa directamente, ahora abre el submenú
  }

  onEliminar(cliente: any): void {

    const dialogData: EliminarPedidoData = {
      cliente: cliente
    };

    const dialogRef = this.dialog.open(EliminarPedidoDialogComponent, {
      width: '600px',
      data: dialogData,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result: EliminarPedidoResult) => {
      if (result && result.confirmado) {

        this.procesarEliminacion(cliente);
      }
    });
  }

  private procesarEliminacion(cliente: any): void {

    // Llamar al servicio para eliminar el pedido
    this.validacionService.eliminarPedido(cliente.idFile).subscribe({
      next: (response) => {

        this.snackBar.open(
          `Pedido ${cliente.ndPedido} eliminado exitosamente`,
          'Cerrar',
          { duration: 5000 }
        );

        // Recargar los datos para reflejar el cambio
        this.cargarClientes();
      },
      error: (error) => {

        this.snackBar.open(
          `Error al eliminar el pedido: ${error.message || 'Error desconocido'}`,
          'Cerrar',
          { duration: 5000 }
        );
      }
    });
  }

  onCambiarEstatus(cliente: any): void {

    const dialogData: CambiarEstatusData = {
      cliente: cliente
    };

    const dialogRef = this.dialog.open(CambiarEstatusDialogComponent, {
      width: '600px',
      data: dialogData,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result: CambiarEstatusResult) => {
      if (result) {

        this.procesarCambioEstatus(cliente, result);
      }
    });
  }

  private procesarCambioEstatus(cliente: any, result: CambiarEstatusResult): void {
    // Llamar al servicio para cambiar el estatus
    this.validacionService.cambiarEstatus(
      cliente.idFile,
      result.nuevoIdCurrentState
    ).subscribe({
      next: (response) => {
        this.snackBar.open(
          `Estatus del pedido ${cliente.ndPedido} cambiado a ${result.nuevoEstatus}`,
          'Cerrar',
          { duration: 5000 }
        );

        // Recargar los datos para reflejar el cambio
        this.cargarClientes();
      },
      error: (error) => {
        let errorMessage = 'Error desconocido';
        
        if (error?.error?.message) {
          errorMessage = error.error.message;
        } else if (error?.message) {
          errorMessage = error.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        }
        
        this.snackBar.open(
          `Error al cambiar el estatus: ${errorMessage}`,
          'Cerrar',
          { duration: 7000 }
        );
      }
    });
  }

  // Método temporal para obtener el rol del usuario
  private getCurrentUserRole(): string {
    // Implementar la lógica real para obtener el rol del usuario
    // Por ahora retorno 'gerente' para mostrar la opción
    return 'gerente';
  }

  // Verificar si las opciones de cancelar y excepción están disponibles
  canCancelOrCreateException(cliente: any): boolean {
    return cliente.IdCurrentState !== 3; // Liberado
  }

  // ViewChild para ordenamiento
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private validacionService: ValidacionService,
    private defaultAgencyService: DefaultAgencyService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {

  }

  ngOnInit() {

    this.cargarAgencias();
    this.cargarProcesos();
    this.loadData();

    // Suscribirse a los cambios de agencia del servicio compartido
    this.defaultAgencyService.selectedAgency$.subscribe(agenciaId => {
      if (agenciaId !== null) {
        this.selectedAgency = agenciaId;

        // Si hay proceso seleccionado (incl. "Todos los procesos"), cargar clientes
        if (this.selectedProcess !== null && this.selectedProcess !== undefined) {
          this.cargarClientes({ resetPage: true });
        }
      }
    });
  }

  ngOnDestroy() {
    this.sortChangeSub?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit() {
    this.connectSort();
  }

  /**
   * Conectar MatSort cuando la tabla esté en el DOM (*ngIf="!loadingClientes").
   * Se llama desde ngAfterViewInit y tras cargar clientes para que el sort funcione al hacer clic en el encabezado.
   */
  private connectSort(): void {
    if (!this.sort) return;
    if (this.sortChangeSub) this.sortChangeSub.unsubscribe();
    this.sortChangeSub = this.sort.sortChange.subscribe(() => {
      this.cargarClientes({ resetPage: true });
    });
  }

  /**
   * Manejar la selección de un cliente de la tabla superior
   */
  onClienteSelect(cliente: any): void {

    // Guardar el cliente seleccionado
    this.selectedCliente = cliente;
    this.advertenciaLiquidacionMostrada = false;
    this.advertenciaLiberacionMostrada = false;
    this.advertenciaLiberadoMostrada = false;
    this.cdr.markForCheck();

    // Cargar los documentos del archivo específico
    this.cargarDocumentosCliente(cliente.idFile);
  }

  /**
   * Copiar contenido de celda al portapapeles
   * Solo se usa para la columna ndCliente
   */
  copyToClipboard(text: string, event?: Event): void {
    if (event) {
      event.stopPropagation(); // Evitar que se propague el evento de click de la fila
    }

    if (!text || text.trim() === '') {
      return;
    }

    // Intentar usar Clipboard API primero (más moderno y no interfiere con la selección)
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text.trim()).then(() => {
        this.snackBar.open('Copiado al portapapeles', 'Cerrar', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
        // Limpiar cualquier selección después de copiar
        this.clearTextSelection();
      }).catch(() => {
        // Fallback al método antiguo si falla
        this.copyToClipboardLegacy(text);
      });
    } else {
      // Fallback al método antiguo si no está disponible
      this.copyToClipboardLegacy(text);
    }
  }

  /**
   * Limpiar cualquier selección de texto en el DOM
   */
  private clearTextSelection(): void {
    // Usar setTimeout para asegurar que se ejecute después de que termine la operación de copia
    setTimeout(() => {
      if (window.getSelection) {
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
        }
      }
      if (document.getSelection) {
        const selection = document.getSelection();
        if (selection) {
          selection.removeAllRanges();
        }
      }
      // Asegurarse de que ningún elemento tenga el foco que pueda interferir
      if (document.activeElement && document.activeElement instanceof HTMLElement) {
        const activeElement = document.activeElement as HTMLElement;
        // Solo hacer blur si no es un input, textarea o button
        if (!['INPUT', 'TEXTAREA', 'BUTTON'].includes(activeElement.tagName)) {
          activeElement.blur();
        }
      }
    }, 100);
  }

  /**
   * Método legacy para copiar al portapapeles (fallback)
   */
  private copyToClipboardLegacy(text: string): void {
    // Crear un elemento temporal para copiar
    const textarea = document.createElement('textarea');
    textarea.value = text.trim();
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, 99999); // Para dispositivos móviles

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        this.snackBar.open('Copiado al portapapeles', 'Cerrar', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      } else {
        this.snackBar.open('Error al copiar', 'Cerrar', {
          duration: 2000
        });
      }
    } catch (err) {
      this.snackBar.open('Error al copiar', 'Cerrar', {
        duration: 2000
      });
    } finally {
      // Remover el elemento primero
      document.body.removeChild(textarea);
      // Limpiar selección después de remover el elemento
      this.clearTextSelection();
    }
  }

  /**
   * Formatear fecha para copiar al portapapeles
   */
  formatDateForCopy(date: any): string {
    if (!date) {
      return '';
    }
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return String(date);
      }
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch {
      return String(date);
    }
  }

  /**
   * Navegar a la pantalla correspondiente según la fase del pedido
   */
  navegarAPantallaFase(cliente: any, event?: Event): void {
    if (event) {
      event.stopPropagation(); // Evitar que se propague el evento de click de la fila
    }

    if (!cliente || !cliente.idFile) {
      this.snackBar.open('No se puede navegar: información del pedido incompleta', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    const fase = this.normalizarTexto(cliente.fase);
    const idFile = cliente.idFile;
    const idCliente = cliente.ndCliente;
    const idPedido = cliente.ndPedido;

    let ruta = '';
    let nombreFase = '';

    switch (fase) {
      case 'integracion':
        ruta = '/procesos/integracion';
        nombreFase = 'Integración';
        break;
      case 'liquidacion':
        ruta = '/procesos/liquidacion';
        nombreFase = 'Liquidación';
        break;
      case 'liberacion':
        ruta = '/procesos/liberacion';
        nombreFase = 'Liberación';
        break;
      default:
        this.snackBar.open('No hay pantalla disponible para esta fase', 'Cerrar', {
          duration: 3000
        });
        return;
    }

    // Construir URL con query parameters
    const queryParams = new URLSearchParams({
      idCliente: String(idCliente),
      idPedido: String(idPedido),
      idFile: String(idFile)
    });
    
    const url = `${ruta}?${queryParams.toString()}`;
    
    // Abrir en una nueva pestaña
    window.open(url, '_blank');
  }

  /**
   * Verificar si se puede navegar a una pantalla según la fase
   */
  puedeNavegarAFase(fase: string): boolean {
    const faseNormalizada = this.normalizarTexto(fase);
    return faseNormalizada === 'integracion' || 
           faseNormalizada === 'liquidacion' || 
           faseNormalizada === 'liberacion';
  }

  /**
   * Seleccionar cliente programáticamente (para selección automática)
   */
  private seleccionarCliente(cliente: any): void {

    this.onClienteSelect(cliente);
  }

  /**
   * Limpiar la selección del cliente
   */
  clearSelection(): void {

    this.selectedCliente = null;
    this.advertenciaLiquidacionMostrada = false;
    this.advertenciaLiberacionMostrada = false;
    this.advertenciaLiberadoMostrada = false;
    this.documentosDataSource = [];
  }

  /**
   * Cargar documentos de un archivo específico
   */
  private cargarDocumentosCliente(idFile: number): void {

    this.loadingDocumentos = true;

    this.validacionService.cargarDocumentos(idFile)
      .pipe(
        takeUntil(this.destroy$),
        timeout(10000)
      )
      .subscribe({
        next: (documentos) => {

          this.documentosDataSource = documentos;
          this.verificarAvanceFaseLiquidacion(documentos);
          this.verificarAvanceFaseLiberacion(documentos);
          this.verificarAvanceFaseLiberado(documentos);
          this.loadingDocumentos = false;
          this.cdr.markForCheck();
        },
        error: (error) => {

          this.mostrarError('Error cargando documentos del archivo');
          this.documentosDataSource = [];
          this.loadingDocumentos = false;
          this.cdr.markForCheck();
        }
      });
  }

  private verificarAvanceFaseLiquidacion(documentos: Documento[]): void {
    if (this.advertenciaLiquidacionMostrada || !this.selectedCliente) {
      return;
    }

    const faseCliente = this.normalizarTexto(this.selectedCliente.fase);
    if (faseCliente !== 'integracion') {
      return;
    }

    const documentosIntegracionRequeridos = documentos.filter((doc) => {
      return this.esDocumentoDeIntegracion(doc) && this.esDocumentoRequerido(doc);
    });

    if (documentosIntegracionRequeridos.length === 0) {
      return;
    }

    const todosValidados = documentosIntegracionRequeridos.every((doc) => this.esDocumentoAprobado(doc));
    if (!todosValidados) {
      return;
    }

    this.advertenciaLiquidacionMostrada = true;
    this.mostrarAdvertenciaLiquidacion();
  }

  private verificarAvanceFaseLiberacion(documentos: Documento[]): void {
    if (this.advertenciaLiberacionMostrada || !this.selectedCliente) {
      return;
    }

    const faseCliente = this.normalizarTexto(this.selectedCliente.fase);
    if (faseCliente !== 'liquidacion') {
      return;
    }

    if (String(this.selectedCliente.IdCurrentState) !== this.LIQUIDACION_STATE_ID.toString()) {
      return;
    }

    const documentosLiquidacionRequeridos = documentos.filter((doc) => {
      return this.esDocumentoDeLiquidacion(doc) && this.esDocumentoRequerido(doc);
    });

    if (documentosLiquidacionRequeridos.length === 0) {
      return;
    }

    const todosValidados = documentosLiquidacionRequeridos.every((doc) => this.esDocumentoAprobado(doc));
    if (!todosValidados) {
      return;
    }

    this.advertenciaLiberacionMostrada = true;
    this.mostrarAdvertenciaLiberacion();
  }

  private esDocumentoDeIntegracion(documento: Documento): boolean {
    return this.normalizarTexto(documento.fase) === 'integracion';
  }

  private esDocumentoDeLiquidacion(documento: Documento): boolean {
    return this.normalizarTexto(documento.fase) === 'liquidacion';
  }

  private esDocumentoDeLiberacion(documento: Documento): boolean {
    return this.normalizarTexto(documento.fase) === 'liberacion';
  }

  private esDocumentoRequerido(documento: Documento): boolean {
    const requerido = (documento as any).requerido;
    if (typeof requerido === 'boolean') {
      return requerido;
    }
    if (typeof requerido === 'number') {
      return requerido === 1;
    }
    if (typeof requerido === 'string') {
      const normalizado = requerido.trim().toLowerCase();
      return normalizado === '1' || normalizado === 'true' || normalizado === 'si' || normalizado === 'sí';
    }
    return false;
  }

  private esDocumentoAprobado(documento: Documento): boolean {
    const estatus = Number(documento.idEstatus);
    return estatus === 4;
  }

  /**
   * Helpers de estatus de documento
   */
  isDocumentoStatus(documento: any, status: number): boolean {
    return Number(documento?.idEstatus) === status;
  }

  private normalizarTexto(valor: string | null | undefined): string {
    if (!valor) {
      return '';
    }

    return valor
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  private mostrarAdvertenciaLiquidacion(): void {
    if (!this.selectedCliente) {
      return;
    }

    this.dialog.open(AdvertenciaLiquidacionDialogComponent, {
      width: '520px',
      disableClose: true,
      data: {
        cliente: this.selectedCliente.cliente,
        ndPedido: this.selectedCliente.ndPedido
      }
    }).afterClosed().subscribe((confirmado) => {
      if (confirmado) {
        this.avanzarPedidoALiquidacion();
      } else {
        this.advertenciaLiquidacionMostrada = false;
        this.snackBar.open('El pedido se mantiene en Integración', 'Cerrar', { duration: 3000 });
      }
    });
  }

  private mostrarAdvertenciaLiberacion(): void {
    if (!this.selectedCliente) {
      return;
    }

    this.dialog.open(AdvertenciaLiberacionDialogComponent, {
      width: '520px',
      disableClose: true,
      data: {
        cliente: this.selectedCliente.cliente,
        ndPedido: this.selectedCliente.ndPedido
      }
    }).afterClosed().subscribe((confirmado) => {
      if (confirmado) {
        this.avanzarPedidoALiberacion();
      } else {
        this.advertenciaLiberacionMostrada = false;
        this.snackBar.open('El pedido se mantiene en Liquidación', 'Cerrar', { duration: 3000 });
      }
    });
  }

  private avanzarPedidoALiquidacion(): void {
    if (!this.selectedCliente) {
      return;
    }

    const idFile = this.selectedCliente.idFile;

    this.validacionService.cambiarEstatus(idFile, this.LIQUIDACION_STATE_ID)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          if (this.selectedCliente) {
            this.selectedCliente.IdCurrentState = this.LIQUIDACION_STATE_ID;
            this.selectedCliente.fase = 'Liquidación';
          }
          this.snackBar.open('El pedido avanzó a la etapa de Liquidación', 'Cerrar', { duration: 4000 });
          this.cargarClientes();
        },
        error: (error) => {
          let errorMessage = 'Error desconocido';
          
          if (error?.error?.message) {
            errorMessage = error.error.message;
          } else if (error?.message) {
            errorMessage = error.message;
          } else if (typeof error === 'string') {
            errorMessage = error;
          }
          
          this.snackBar.open(
            `No se pudo avanzar el pedido a Liquidación: ${errorMessage}`,
            'Cerrar',
            { duration: 7000 }
          );
        }
      });
  }

  private avanzarPedidoALiberacion(): void {
    if (!this.selectedCliente) {
      return;
    }

    const idFile = this.selectedCliente.idFile;

    this.validacionService.cambiarEstatus(idFile, this.LIBERACION_STATE_ID)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          if (this.selectedCliente) {
            this.selectedCliente.IdCurrentState = this.LIBERACION_STATE_ID;
            this.selectedCliente.fase = 'Liberación';
          }
          this.snackBar.open('El pedido avanzó a la etapa de Liberación', 'Cerrar', { duration: 4000 });
          this.cargarClientes();
        },
        error: (error) => {

          this.snackBar.open(
            `No se pudo avanzar el pedido a Liberación: ${error?.message || 'Error desconocido'}`,
            'Cerrar',
            { duration: 5000 }
          );
        }
      });
  }

  private verificarAvanceFaseLiberado(documentos: Documento[]): void {
    if (this.advertenciaLiberadoMostrada || !this.selectedCliente) {
      return;
    }

    const faseCliente = this.normalizarTexto(this.selectedCliente.fase);
    if (faseCliente !== 'liberacion') {
      return;
    }

    if (String(this.selectedCliente.IdCurrentState) !== this.LIBERACION_STATE_ID.toString()) {
      return;
    }

    const documentosLiberacion = documentos.filter((doc) => this.esDocumentoDeLiberacion(doc) && this.esDocumentoRequerido(doc));
    if (documentosLiberacion.length === 0) {
      return;
    }

    const todosValidados = documentosLiberacion.every((doc) => this.esDocumentoAprobado(doc));
    if (!todosValidados) {
      return;
    }

    this.advertenciaLiberadoMostrada = true;
    this.mostrarAdvertenciaLiberado(documentos);
  }

  private mostrarAdvertenciaLiberado(documentos: Documento[]): void {
    if (!this.selectedCliente) {
      return;
    }

    const tieneDocumentosPorValidar = documentos.some(
      (doc) => this.esDocumentoDeLiberacion(doc) && !this.esDocumentoAprobado(doc)
    );

    this.dialog.open(AdvertenciaLiberadoDialogComponent, {
      width: '520px',
      disableClose: true,
      data: {
        cliente: this.selectedCliente.cliente,
        ndPedido: this.selectedCliente.ndPedido,
        tieneDocumentosPorValidar
      }
    }).afterClosed().subscribe((confirmado) => {
      if (confirmado) {
        this.avanzarPedidoALiberado();
      } else {
        this.advertenciaLiberadoMostrada = false;
      }
    });
  }

  private avanzarPedidoALiberado(): void {
    if (!this.selectedCliente) {
      return;
    }

    const idFile = this.selectedCliente.idFile;

    this.validacionService.cambiarEstatus(idFile, this.LIBERADO_STATE_ID)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          if (this.selectedCliente) {
            this.selectedCliente.IdCurrentState = this.LIBERADO_STATE_ID;
            this.selectedCliente.fase = 'Liberado';
          }
          this.snackBar.open('El pedido avanzó a la etapa de Liberado', 'Cerrar', { duration: 4000 });
          this.cargarClientes();
        },
        error: (error) => {

          this.snackBar.open(
            `No se pudo avanzar el pedido a Liberado: ${error?.message || 'Error desconocido'}`,
            'Cerrar',
            { duration: 5000 }
          );
        }
      });
  }

  /**
   * Cargar procesos desde la API
   */
  private cargarProcesos() {

    this.loadingProcesos = true;

    this.validacionService.cargarProcesos()
      .pipe(
        takeUntil(this.destroy$),
        timeout(10000), // 10 segundos de timeout
        catchError(error => {
          if (error.name === 'TimeoutError') {

            this.mostrarError('Timeout: La carga de procesos tardó demasiado');
          } else {

            this.mostrarError('Error cargando procesos');
          }
          this.procesos = [];
          this.loadingProcesos = false;
          return of([]);
        })
      )
      .subscribe({
        next: (procesos) => {

          // Verificar que procesos sea un array
          if (!Array.isArray(procesos)) {

            this.procesos = [];
            this.loadingProcesos = false;
            return;
          }

          // Debug: mostrar el estado de cada proceso
          procesos.forEach((proceso, index) => {
            
          });

          // TEMPORAL: Mostrar todos los procesos para debugging
          this.procesos = procesos.filter(proceso => proceso);

          // ORIGINAL: Mostrar solo procesos habilitados (Enabled = 1)
          // this.procesos = procesos.filter(proceso => proceso && proceso.Enabled === 1);

          

          // Por defecto seleccionar "Todos los procesos"
          this.selectedProcess = this.ALL_PROCESSES_VALUE;

          // Si ya hay agencia seleccionada, cargar clientes automáticamente
          if (this.selectedAgency !== null) {
            this.cargarClientes({ resetPage: true });
          }

          this.loadingProcesos = false;
          this.cdr.markForCheck();
        },
        error: (error) => {

          this.procesos = [];
          this.selectedProcess = null;
          this.loadingProcesos = false;
          this.cdr.markForCheck();
        }
      });
  }

  /**
   * Cargar agencias desde la API usando el servicio compartido
   */
  private cargarAgencias() {
    this.loadingAgencias = true;

    this.defaultAgencyService.obtenerAgencias()
      .pipe(
        takeUntil(this.destroy$),
        timeout(10000) // 10 segundos de timeout
      )
      .subscribe({
        next: (agencias) => {
          this.agencias = agencias;
          this.loadingAgencias = false;
          this.cdr.markForCheck();

          // Establecer agencia predeterminada DESPUÉS de que las agencias se carguen
          setTimeout(() => {
            // Obtener la agencia guardada
            const savedAgencyId = this.defaultAgencyService.getAgenciaSeleccionada();
            
            // Verificar que la agencia guardada existe en la lista
            if (savedAgencyId !== null && this.agencias.some(ag => ag.Id === savedAgencyId)) {
              // La agencia guardada existe, usarla
              this.selectedAgency = savedAgencyId;
              this.cdr.markForCheck();
            } else {
              // Si no hay agencia guardada válida, establecer la predeterminada
              this.defaultAgencyService.establecerAgenciaPredeterminada(true).subscribe({
                next: (agenciaId) => {
                  if (agenciaId && this.agencias.some(ag => ag.Id === agenciaId)) {
                    this.selectedAgency = agenciaId;
                    this.cdr.markForCheck();
                  } else if (this.agencias.length > 0) {
                    // Solo como último recurso, seleccionar la primera
                    const primeraAgencia = this.agencias[0];
                    this.selectedAgency = primeraAgencia.Id;
                    this.defaultAgencyService.seleccionarAgencia(primeraAgencia.Id);
                    this.cdr.markForCheck();
                  }
                },
                error: (error) => {
                  console.error('Error estableciendo agencia predeterminada:', error);
                  // Si falla y hay agencias, seleccionar la primera
                  if (this.agencias.length > 0) {
                    const primeraAgencia = this.agencias[0];
                    this.selectedAgency = primeraAgencia.Id;
                    this.defaultAgencyService.seleccionarAgencia(primeraAgencia.Id);
                    this.cdr.markForCheck();
                  }
                }
              });
            }
          }, 150); // Aumentar el timeout para asegurar que las opciones se rendericen
        },
        error: (error) => {
          console.error('Error cargando agencias:', error);
          this.mostrarError('Error cargando agencias');
          this.agencias = [];
          this.selectedAgency = null;
          this.loadingAgencias = false;
          this.cdr.markForCheck();
        }
      });
  }

  /**
   * Recargar todos los datos del componente
   */
  recargarDatos() {

    // Resetear estados de carga
    this.loadingClientes = true;
    this.loadingAgencias = true;
    this.loadingProcesos = true;

    // Limpiar datos existentes
    this.clientesDataSource.data = [];
    this.procesos = [];
    this.selectedAgency = null;
    this.selectedProcess = null;
    this.selectedFase = '';
    this.searchTerm = '';

    // Recargar agencias y procesos
    this.cargarAgencias();
    this.cargarProcesos();

    // Limpiar selección de cliente y documentos
    this.clearSelection();

    // Mostrar mensaje de recarga
    this.snackBar.open('Recargando datos...', 'Cerrar', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  loadData() {
    // Los datos se cargarán cuando se seleccione agencia y proceso
    
  }

  // Métodos para estadísticas
  getIntegradosCount(): number {
    return this.clientesDataSource.data.filter(item => item.integracion).length;
  }

  getPendientesCount(): number {
    return this.clientesDataSource.data.filter(item => !item.integracion).length;
  }

  // Métodos de acción
  validarDocumento(id: number) {

    // Implementar lógica de validación
  }

  rechazarDocumento(documento: any) {

    // Verificar que el documento esté en estatus 4 (aprobado)
    if (documento.idEstatus !== '4') {
      this.snackBar.open('Solo se pueden rechazar documentos aprobados', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    // Crear dialog de confirmación
    const dialogRef = this.dialog.open(RechazarDocumentoDialogComponent, {
      width: '500px',
      data: {
        documento: documento
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.rechazado) {

        this.procesarRechazoDocumento(documento, result);
      }
    });
  }

  private procesarRechazoDocumento(documento: any, resultado: any): void {

    this.validacionService.aprobarDocumento(
      documento.idDocumentByFile,
      5, // 5 = Rechazado
      resultado.comentario || undefined
    ).subscribe({
      next: (response) => {

        this.snackBar.open(`Documento ${documento.documento} rechazado exitosamente`, 'Cerrar', {
          duration: 3000
        });

        // Recargar documentos para mostrar el estado actualizado
        this.cargarDocumentosCliente(this.selectedCliente.idFile);
      },
      error: (error) => {

        this.snackBar.open(
          `Error al rechazar documento: ${error.message || 'Error desconocido'}`,
          'Cerrar',
          { duration: 5000 }
        );
      }
    });
  }

  /**
   * Eliminar documento con confirmación
   */
  eliminarDocumento(documento: any): void {

    // Verificar que solo administradores (roles 7 y 8) puedan eliminar
    if (!this.isAdmin) {
      this.snackBar.open('No tienes permisos para eliminar documentos', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    // Crear dialog de confirmación
    const dialogRef = this.dialog.open(EliminarDocumentoDialogComponent, {
      width: '500px',
      data: {
        documento: documento
      }
    });

    dialogRef.afterClosed().subscribe((result: EliminarDocumentoResult) => {
      if (result && result.confirmado) {

        this.procesarEliminacionDocumento(documento);
      }
    });
  }

  /**
   * Procesar la eliminación del documento
   */
  private procesarEliminacionDocumento(documento: any): void {

    
    

    this.loadingDocumentos = true;

    const url = `${environment.apiBaseUrl}/api/document/${documento.idDocumentByFile}`;

    this.http.delete<any>(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {

          this.loadingDocumentos = false;

          this.snackBar.open(
            `Documento "${documento.documento}" eliminado exitosamente`,
            'Cerrar',
            { duration: 3000 }
          );

          // Recargar documentos para mostrar el estado actualizado
          if (this.selectedCliente) {

            this.cargarDocumentosCliente(this.selectedCliente.idFile);
          }
        },
        error: (error) => {

          this.loadingDocumentos = false;

          let errorMessage = 'Error desconocido al eliminar el documento';

          if (error.status === 403) {
            errorMessage = 'No tienes permisos para eliminar documentos';
          } else if (error.status === 401) {
            errorMessage = 'Sesión expirada. Por favor, inicia sesión nuevamente';
          } else if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }

          this.snackBar.open(
            `Error al eliminar documento: ${errorMessage}`,
            'Cerrar',
            { duration: 5000 }
          );
        }
      });
  }

  descargarArchivo() {

    // Implementar lógica de descarga
  }

  cancelarProceso() {

    // Implementar lógica de cancelación
  }

  crearExcepcion() {

    // Implementar lógica de excepción
  }

  /**
   * Manejar cambio en la selección de agencia
   */
  onAgenciaChange() {

    // Limpiar filtros y búsqueda cuando se cambia la agencia
    this.selectedFase = '';
    this.searchTerm = '';

    // Actualizar la agencia en el servicio compartido
    // seleccionarAgencia() ya actualiza el caché (cookie y BehaviorSubject)
    if (this.selectedAgency !== null) {
      this.defaultAgencyService.seleccionarAgencia(this.selectedAgency);
      
      // COMENTADO: Llamada HTTP deshabilitada para mejorar performance
      // La actualización del servidor se puede hacer de forma asíncrona o en otro momento
      // seleccionarAgencia() ya maneja el caché local
      /*
      // Actualizar la agencia predeterminada del usuario
      this.defaultAgencyService.actualizarAgenciaPredeterminada(this.selectedAgency).subscribe({
        next: (success) => {
          if (success) {

          } else {

          }
        },
        error: (error) => {

        }
      });
      */
    }
    // Si ya hay un proceso seleccionado (incl. "Todos los procesos"), cargar clientes
    if (this.selectedProcess !== null && this.selectedProcess !== undefined) {
      this.cargarClientes({ resetPage: true });
    }
    // Limpiar selección de cliente y documentos
    this.clearSelection();
  }

  /**
   * Manejar cambio en la selección de proceso
   */
  onProcesoChange() {

    // Limpiar filtros y búsqueda cuando se cambia el proceso
    this.selectedFase = '';
    this.searchTerm = '';

    if (this.selectedProcess !== null && this.selectedProcess !== undefined) {
      this.cargarClientes({ resetPage: true });
    }
    // Limpiar selección de cliente y documentos
    this.clearSelection();
  }

  /**
   * Manejar cambio en la selección de fase
   */
  onFaseChange(): void {
    this.cargarClientes({ resetPage: true });
  }

  /**
   * Cargar clientes desde la API (paginación y orden en servidor)
   */
  private cargarClientes(options?: { resetPage?: boolean }) {
    if (this.selectedAgency === null) {
      return;
    }
    if (this.selectedProcess === null || this.selectedProcess === undefined) {
      return;
    }

    if (options?.resetPage) {
      this.currentPage = 0;
    }

    const esTodosProcesos = this.selectedProcess === this.ALL_PROCESSES_VALUE;

    this.loadingClientes = true;

    const filtros: FiltrosValidacion = {
      agencia: this.selectedAgency,
      proceso: esTodosProcesos ? null : this.selectedProcess,
      showCancelled: this.showCancelledOrders
    };
    if (this.selectedFase && this.selectedFase !== '') {
      filtros.idCurrentState = parseInt(this.selectedFase, 10);
    }
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      filtros.q = this.searchTerm.trim();
    }
    if (this.sort?.active && this.sort.direction) {
      filtros.sort = this.sort.active;
      filtros.dir = this.sort.direction as 'asc' | 'desc';
    }

    this.validacionService
      .cargarClientes(filtros, this.currentPage + 1, this.pageSize)
      .pipe(
        takeUntil(this.destroy$),
        timeout(60000),
        catchError(() => {
          this.mostrarError('Error cargando clientes');
          this.clientesDataSource.data = [];
          this.totalRecords = 0;
          this.loadingClientes = false;
          return of({ clientes: [] as Cliente[], totalRecords: 0 });
        })
      )
      .subscribe({
        next: ({ clientes, totalRecords }) => {
          if (clientes.length === 0 && totalRecords > 0 && this.currentPage > 0) {
            this.currentPage--;
            this.cargarClientes();
            return;
          }

          this.totalRecords = totalRecords;
          this.clientesDataSource.data = clientes;

          const resetSelection = !!options?.resetPage;
          if (resetSelection) {
            if (clientes.length > 0) {
              this.seleccionarCliente(clientes[0]);
            } else {
              this.selectedCliente = null;
              this.documentosDataSource = [];
            }
          } else {
            const stillThere =
              this.selectedCliente &&
              clientes.some(c => c.idFile === this.selectedCliente.idFile);
            if (!stillThere) {
              if (clientes.length > 0) {
                this.seleccionarCliente(clientes[0]);
              } else {
                this.selectedCliente = null;
                this.documentosDataSource = [];
              }
            }
          }

          this.loadingClientes = false;
          this.cdr.markForCheck();
          setTimeout(() => this.connectSort(), 0);
        },
        error: () => {
          this.clientesDataSource.data = [];
          this.loadingClientes = false;
          this.cdr.markForCheck();
        }
      });
  }

  /**
   * Mostrar mensaje de error
   */
  private mostrarError(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }

  /**
   * Manejar cambio de página o tamaño de página (paginación en servidor)
   */
  onPageChange(event: { pageIndex: number; pageSize: number; previousPageIndex?: number }) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.cargarClientes();
  }

  /**
   * Manejar cambio en el término de búsqueda
   */
  onSearchChange(): void {
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      this.selectedCliente = null;
      this.documentosDataSource = [];
      this.advertenciaLiquidacionMostrada = false;
      this.advertenciaLiberacionMostrada = false;
      this.advertenciaLiberadoMostrada = false;
      this.cdr.markForCheck();
    }
    this.cargarClientes({ resetPage: true });
  }

  /**
   * Limpiar búsqueda
   */
  clearSearch(): void {
    this.searchTerm = '';
    this.selectedCliente = null;
    this.documentosDataSource = [];
    this.advertenciaLiquidacionMostrada = false;
    this.advertenciaLiberacionMostrada = false;
    this.advertenciaLiberadoMostrada = false;
    this.cdr.markForCheck();
    this.cargarClientes({ resetPage: true });
  }
}
