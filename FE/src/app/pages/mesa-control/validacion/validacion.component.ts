import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
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
import { VerDocumentoDialogComponent } from './ver-documento-dialog/ver-documento-dialog.component';
import { AprobarDocumentoDialogComponent, AprobarDocumentoData, AprobarDocumentoResult } from './aprobar-documento-dialog/aprobar-documento-dialog.component';
import { RechazarDocumentoDialogComponent, RechazarDocumentoData, RechazarDocumentoResult } from './rechazar-documento-dialog/rechazar-documento-dialog.component';
import { FASES_CATALOG, CatalogItem } from '../../../core/constants/catalogs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Subject, takeUntil, catchError, of, timeout } from 'rxjs';
import { ValidacionService, Cliente, Documento, FiltrosValidacion } from './validacion.service';
import { DefaultAgencyService, Agencia } from '../../../core/services/default-agency.service';

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
    VerDocumentoDialogComponent,
    AprobarDocumentoDialogComponent
  ],
  templateUrl: './validacion.component.html',
  styleUrl: './validacion.component.scss'
})
export class ValidacionComponent implements OnInit, OnDestroy, AfterViewInit {
  private destroy$ = new Subject<void>();

  // Estado del componente
  loading = false;
  loadingAgencias = false;
  loadingProcesos = false; // Specific loading state for processes
  error = '';

  // Filtros principales
  selectedAgency: number | null = null;
  selectedProcess: number | null = null;
  selectedFase: string = '';
  showCancelledOrders: boolean = false;

  // Datos de filtros disponibles
  agencias: any[] = [];
  procesos: any[] = [];
  fases: CatalogItem[] = FASES_CATALOG;

  // Tabla de clientes
  clientesDisplayedColumns: string[] = [
    'ndCliente', 'ndPedido', 'cliente', 'proceso', 'operacion', 'fase', 'fechaLiberacion', 'registro', 'acciones'
  ];
  clientesDataSource = new MatTableDataSource<any>([]);
  
  // Paginación
  pageSize = 7;
  pageSizeOptions = [5, 7, 10, 25, 50];
  currentPage = 0;
  totalRecords = 0;
  allClientes: any[] = []; // Todos los clientes para paginación local
  clientesOriginales: any[] = []; // Copia de respaldo de todos los clientes originales

  // Tabla de documentos
  documentosDisplayedColumns: string[] = [
    'proceso', 'fase', 'documento', 'estatus', 'ver', 'validar', 'rechazar',
    'eliminar', 'requerido', 'requiereExpiracion', 'fecha', 'fechaExpiracion', 'comentario', 'asignado'
  ];
  documentosDataSource: any[] = [];
  
  // Cliente seleccionado
  selectedCliente: any = null;

  // Búsqueda
  searchTerm: string = '';

  // Verificar si el usuario es gerente o administrador
  get isManagerOrAdmin(): boolean {
    // Aquí deberías obtener el rol del usuario desde tu servicio de autenticación
    // Por ahora retorno true para mostrar la opción, pero deberías implementar la lógica real
    const userRole = this.getCurrentUserRole(); // Implementar esta función
    return userRole === 'gerente' || userRole === 'administrador';
  }

  // Método auxiliar para el tooltip de fecha de expiración
  getFechaExpiracionTooltip(fechaExpiracion: string | null): string {
    return fechaExpiracion ? fechaExpiracion : '';
  }


  // Métodos para las acciones del menú
  onDescargarArchivo(cliente: any): void {
    console.log('Descargar archivo para cliente:', cliente);
    // Implementar lógica de descarga
    this.snackBar.open(`Descargando archivo para ${cliente.cliente}`, 'Cerrar', { duration: 3000 });
  }

  /**
   * Validar documento - abrir dialog para aprobar/rechazar
   */
  onValidarDocumento(documento: any): void {
    console.log('Validar documento:', documento);
    
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
        console.log('Resultado del dialog:', result);
        this.procesarAprobacionDocumento(documento, result);
      }
    });
  }

  /**
   * Ver documento - mostrar información del documento y validar si estatus es "2"
   */
  onVerDocumento(documento: any): void {
    console.log('Ver documento:', documento);
    
    // Si el estatus es "2", validar el documento automáticamente
    if (documento.idEstatus === '2') {
      this.validarDocumentoInterno(documento);
      return;
    }
    
    // Crear un dialog para mostrar la información del documento
    const dialogRef = this.dialog.open(VerDocumentoDialogComponent, {
      width: '500px',
      data: {
        documento: documento
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dialog cerrado:', result);
      }
    });
  }

  /**
   * Procesar aprobación/rechazo de documento
   */
  private procesarAprobacionDocumento(documento: any, resultado: AprobarDocumentoResult): void {
    console.log('Procesando aprobación de documento:', documento, resultado);
    
    const nuevoEstatus = resultado.aprobado ? 4 : 5; // 4 = Aprobado, 5 = Rechazado
    
    this.validacionService.aprobarDocumento(documento.idDocumentByFile, nuevoEstatus, resultado.comentario, resultado.fechaExpiracion)
      .pipe(
        takeUntil(this.destroy$),
        timeout(10000)
      )
      .subscribe({
        next: (response) => {
          console.log('✅ Documento procesado exitosamente:', response);
          const mensaje = resultado.aprobado ? 'Documento aprobado exitosamente' : 'Documento rechazado exitosamente';
          this.snackBar.open(mensaje, 'Cerrar', { duration: 3000 });
          
          // Recargar documentos para reflejar el cambio
          if (this.selectedCliente) {
            this.cargarDocumentosCliente(this.selectedCliente.idFile);
          }
        },
        error: (error) => {
          console.error('❌ Error procesando documento:', error);
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
    console.log('Preparando documento desde botón Ver:', documento);
    
    this.validacionService.prepararDocumento(documento.idDocumentByFile)
      .pipe(
        takeUntil(this.destroy$),
        timeout(10000)
      )
      .subscribe({
        next: (response) => {
          console.log('✅ Documento preparado exitosamente desde botón Ver:', response);
          this.snackBar.open('Documento preparado para validación exitosamente', 'Cerrar', { duration: 3000 });
          
          // Recargar documentos para reflejar el cambio
          if (this.selectedCliente) {
            this.cargarDocumentosCliente(this.selectedCliente.idFile);
          }
        },
        error: (error) => {
          console.error('❌ Error preparando documento desde botón Ver:', error);
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
    console.log('🔄 ValidacionComponent - Toggle pedidos cancelados:', this.showCancelledOrders);
    this.cargarClientes();
  }

  onCancelar(cliente: any): void {
    console.log('Cancelar para cliente:', cliente);
    
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
        console.log('Resultado de cancelación:', result);
        this.procesarCancelacion(cliente, result);
      }
    });
  }

  private procesarCancelacion(cliente: any, result: CancelarPedidoResult): void {
    console.log('Procesando cancelación:', {
      cliente: cliente,
      motivoId: result.motivoId,
      comentario: result.comentario
    });

    // Llamar al servicio para cancelar el pedido
    this.validacionService.cancelarPedido(
      cliente.idFile, 
      result.motivoId, 
      result.comentario
    ).subscribe({
      next: (response) => {
        console.log('Pedido cancelado exitosamente:', response);
        this.snackBar.open(
          `Pedido ${cliente.ndPedido} cancelado exitosamente`, 
          'Cerrar', 
          { duration: 5000 }
        );
        
        // Recargar los datos para reflejar el cambio
        this.cargarClientes();
      },
      error: (error) => {
        console.error('Error cancelando pedido:', error);
        this.snackBar.open(
          `Error al cancelar el pedido: ${error.message || 'Error desconocido'}`, 
          'Cerrar', 
          { duration: 5000 }
        );
      }
    });
  }

  onExcepcion(cliente: any): void {
    console.log('Excepción para cliente:', cliente);

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
        console.log('Resultado de excepción:', result);
        this.procesarExcepcion(cliente, result);
      }
    });
  }

  private procesarExcepcion(cliente: any, result: ExcepcionPedidoResult): void {
    console.log('Procesando excepción:', {
      cliente: cliente,
      motivoId: result.motivoId,
      comentario: result.comentario
    });

    // Llamar al servicio para crear la excepción
    this.validacionService.excepcionPedido(
      cliente.idFile, 
      result.motivoId, 
      result.comentario
    ).subscribe({
      next: (response) => {
        console.log('Excepción creada exitosamente:', response);
        this.snackBar.open(
          `Excepción creada para el pedido ${cliente.ndPedido}`, 
          'Cerrar', 
          { duration: 5000 }
        );
        
        // Recargar los datos para reflejar el cambio
        this.cargarClientes();
      },
      error: (error) => {
        console.error('Error creando excepción:', error);
        this.snackBar.open(
          `Error al crear la excepción: ${error.message || 'Error desconocido'}`, 
          'Cerrar', 
          { duration: 5000 }
        );
      }
    });
  }

  onAdministrar(cliente: any): void {
    console.log('Administrar para cliente:', cliente);
    // Este método ya no se usa directamente, ahora abre el submenú
  }

  onEliminar(cliente: any): void {
    console.log('Eliminar para cliente:', cliente);

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
        console.log('Confirmación de eliminación:', result);
        this.procesarEliminacion(cliente);
      }
    });
  }

  private procesarEliminacion(cliente: any): void {
    console.log('Procesando eliminación:', cliente);

    // Llamar al servicio para eliminar el pedido
    this.validacionService.eliminarPedido(cliente.idFile).subscribe({
      next: (response) => {
        console.log('Pedido eliminado exitosamente:', response);
        this.snackBar.open(
          `Pedido ${cliente.ndPedido} eliminado exitosamente`, 
          'Cerrar', 
          { duration: 5000 }
        );
        
        // Recargar los datos para reflejar el cambio
        this.cargarClientes();
      },
      error: (error) => {
        console.error('Error eliminando pedido:', error);
        this.snackBar.open(
          `Error al eliminar el pedido: ${error.message || 'Error desconocido'}`, 
          'Cerrar', 
          { duration: 5000 }
        );
      }
    });
  }

  onCambiarEstatus(cliente: any): void {
    console.log('Cambiar estatus para cliente:', cliente);

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
        console.log('Resultado de cambio de estatus:', result);
        this.procesarCambioEstatus(cliente, result);
      }
    });
  }

  private procesarCambioEstatus(cliente: any, result: CambiarEstatusResult): void {
    console.log('Procesando cambio de estatus:', {
      cliente: cliente,
      nuevoEstatus: result.nuevoEstatus,
      nuevoIdCurrentState: result.nuevoIdCurrentState
    });

    // Llamar al servicio para cambiar el estatus
    this.validacionService.cambiarEstatus(
      cliente.idFile, 
      result.nuevoIdCurrentState
    ).subscribe({
      next: (response) => {
        console.log('Estatus cambiado exitosamente:', response);
        this.snackBar.open(
          `Estatus del pedido ${cliente.ndPedido} cambiado a ${result.nuevoEstatus}`, 
          'Cerrar', 
          { duration: 5000 }
        );
        
        // Recargar los datos para reflejar el cambio
        this.cargarClientes();
      },
      error: (error) => {
        console.error('Error cambiando estatus:', error);
        this.snackBar.open(
          `Error al cambiar el estatus: ${error.message || 'Error desconocido'}`, 
          'Cerrar', 
          { duration: 5000 }
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
    private dialog: MatDialog
  ) {
    console.log('🔧 ValidacionComponent - Constructor ejecutado');
  }

  ngOnInit() {
    console.log('🔧 ValidacionComponent - ngOnInit ejecutado');
    this.cargarAgencias();
    this.cargarProcesos();
    this.loadData();
    
    // Suscribirse a los cambios de agencia del servicio compartido
    this.defaultAgencyService.selectedAgency$.subscribe(agenciaId => {
      if (agenciaId !== null) {
        this.selectedAgency = agenciaId;
        console.log('🔄 ValidacionComponent - Agencia actualizada desde servicio:', agenciaId);
        // Si hay proceso seleccionado, cargar clientes
        if (this.selectedProcess !== null) {
          this.cargarClientes();
        }
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit() {
    // Configurar ordenamiento después de que la vista esté inicializada
    console.log('🔧 ValidacionComponent - ngAfterViewInit ejecutado');
    console.log('🔧 ValidacionComponent - MatSort disponible:', this.sort);
    console.log('🔧 ValidacionComponent - Tipo de MatSort:', typeof this.sort);
    console.log('🔧 ValidacionComponent - MatSort propiedades:', Object.keys(this.sort || {}));
    
    if (this.sort) {
      console.log('✅ ValidacionComponent - MatSort configurado correctamente');
      console.log('🔧 ValidacionComponent - Configurando suscripción a sortChange...');
      
      this.sort.sortChange.subscribe((sortEvent) => {
        console.log('🔄 ValidacionComponent - Evento de ordenamiento detectado:', sortEvent);
        console.log('🔧 ValidacionComponent - Evento completo:', JSON.stringify(sortEvent));
        this.aplicarOrdenamiento();
      });
      
      console.log('✅ ValidacionComponent - Suscripción a sortChange configurada');
      
      // Conectar MatSort al MatTableDataSource
      this.clientesDataSource.sort = this.sort;
      console.log('✅ ValidacionComponent - MatSort conectado al MatTableDataSource');
      
      // Configurar ordenamiento automático
      this.clientesDataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'ndCliente': return item.idFile;
          case 'ndPedido': return item.ndPedido;
          case 'cliente': return item.cliente;
          case 'proceso': return item.proceso;
          case 'operacion': return item.operacion;
          case 'fase': return item.fase;
          case 'registro': return new Date(item.registro);
          case 'fechaLiberacion': return new Date(item.fechaLiberacion);
          default: return item[property];
        }
      };
      
    } else {
      console.error('❌ ValidacionComponent - MatSort no está disponible');
    }
  }

  /**
   * Manejar la selección de un cliente de la tabla superior
   */
  onClienteSelect(cliente: any): void {
    console.log('🔍 ValidacionComponent - Cliente seleccionado:', cliente);
    
    // Guardar el cliente seleccionado
    this.selectedCliente = cliente;
    
    // Cargar los documentos del archivo específico
    this.cargarDocumentosCliente(cliente.idFile);
  }

  /**
   * Seleccionar cliente programáticamente (para selección automática)
   */
  private seleccionarCliente(cliente: any): void {
    console.log('🤖 ValidacionComponent - Selección automática del primer cliente:', cliente);
    this.onClienteSelect(cliente);
  }

  /**
   * Limpiar la selección del cliente
   */
  clearSelection(): void {
    console.log('🧹 ValidacionComponent - Limpiando selección de cliente');
    this.selectedCliente = null;
    this.documentosDataSource = [];
  }

  /**
   * Cargar documentos de un archivo específico
   */
  private cargarDocumentosCliente(idFile: number): void {
    console.log('📄 ValidacionComponent - Cargando documentos para archivo:', idFile);
    this.loading = true;
    
    this.validacionService.cargarDocumentos(idFile)
      .pipe(
        takeUntil(this.destroy$),
        timeout(10000)
      )
      .subscribe({
        next: (documentos) => {
          console.log('📥 ValidacionComponent - Documentos recibidos:', documentos);
          this.documentosDataSource = documentos;
          this.loading = false;
        },
        error: (error) => {
          console.error('❌ ValidacionComponent - Error cargando documentos:', error);
          this.mostrarError('Error cargando documentos del archivo');
          this.documentosDataSource = [];
          this.loading = false;
        }
      });
  }

  /**
   * Cargar procesos desde la API
   */
  private cargarProcesos() {
    console.log('🔄 ValidacionComponent - Iniciando carga de procesos...');
    this.loadingProcesos = true;
    
    this.validacionService.cargarProcesos()
      .pipe(
        takeUntil(this.destroy$),
        timeout(10000), // 10 segundos de timeout
        catchError(error => {
          if (error.name === 'TimeoutError') {
            console.error('⏰ ValidacionComponent - Timeout cargando procesos');
            this.mostrarError('Timeout: La carga de procesos tardó demasiado');
          } else {
            console.error('❌ ValidacionComponent - Error cargando procesos:', error);
            this.mostrarError('Error cargando procesos');
          }
          this.procesos = [];
          this.loadingProcesos = false;
          return of([]);
        })
      )
      .subscribe({
        next: (procesos) => {
          console.log('📥 ValidacionComponent - Respuesta de procesos recibida:', procesos);
          
          // Verificar que procesos sea un array
          if (!Array.isArray(procesos)) {
            console.error('❌ ValidacionComponent - La respuesta no es un array:', procesos);
            this.procesos = [];
            this.loadingProcesos = false;
            return;
          }
          
          console.log('📊 ValidacionComponent - Total de procesos recibidos:', procesos.length);
          
          // Debug: mostrar el estado de cada proceso
          procesos.forEach((proceso, index) => {
            console.log(`🔍 Proceso ${index}:`, {
              id: proceso.Id,
              name: proceso.Name,
              enabled: proceso.Enabled,
              enabledType: typeof proceso.Enabled,
              enabledString: String(proceso.Enabled),
              enabledBoolean: Boolean(proceso.Enabled),
              enabledNumber: Number(proceso.Enabled),
              allFields: proceso
            });
          });
          
          // TEMPORAL: Mostrar todos los procesos para debugging
          this.procesos = procesos.filter(proceso => proceso);
          
          // ORIGINAL: Mostrar solo procesos habilitados (Enabled = 1)
          // this.procesos = procesos.filter(proceso => proceso && proceso.Enabled === 1);
          
          console.log('✅ ValidacionComponent - Procesos mostrados (todos):', this.procesos);
          console.log('📊 ValidacionComponent - Total de procesos mostrados:', this.procesos.length);
          
          // Seleccionar el primer proceso por defecto si hay alguno
          if (this.procesos.length > 0) {
            this.selectedProcess = this.procesos[0].Id;
            console.log('🎯 ValidacionComponent - Proceso seleccionado por defecto:', this.selectedProcess);
            
            // Si ya hay agencia seleccionada, cargar clientes automáticamente
            if (this.selectedAgency !== null) {
              console.log('🔄 ValidacionComponent - Cargando clientes automáticamente con proceso seleccionado');
              this.cargarClientes();
            }
          } else {
            console.warn('⚠️ ValidacionComponent - No se encontraron procesos habilitados');
            this.selectedProcess = null;
          }
          
          this.loadingProcesos = false;
        },
        error: (error) => {
          console.error('❌ ValidacionComponent - Error en subscribe de procesos:', error);
          this.procesos = [];
          this.selectedProcess = null;
          this.loadingProcesos = false;
        }
      });
  }

  /**
   * Cargar agencias desde la API usando el servicio compartido
   */
  private cargarAgencias() {
    console.log('🔄 ValidacionComponent - Iniciando carga de agencias...');
    this.loadingAgencias = true;
    
    this.defaultAgencyService.obtenerAgencias()
      .pipe(
        takeUntil(this.destroy$),
        timeout(10000) // 10 segundos de timeout
      )
      .subscribe({
        next: (agencias) => {
          console.log('📥 ValidacionComponent - Agencias cargadas desde servicio compartido:', agencias);
          this.agencias = agencias;
          this.loadingAgencias = false;
          
          // Esperar un momento para asegurar que las agencias estén disponibles en el servicio
          setTimeout(() => {
            // Establecer agencia predeterminada usando el servicio compartido
            this.defaultAgencyService.establecerAgenciaPredeterminada(true).subscribe({
              next: (agenciaId) => {
                if (agenciaId) {
                  console.log('✅ ValidacionComponent - Agencia predeterminada establecida:', agenciaId);
                } else {
                  console.warn('⚠️ ValidacionComponent - No se pudo establecer agencia predeterminada');
                }
              },
              error: (error) => {
                console.error('❌ ValidacionComponent - Error estableciendo agencia predeterminada:', error);
                // Si falla, intentar seleccionar la primera agencia disponible
                if (this.agencias.length > 0) {
                  const primeraAgencia = this.agencias[0];
                  console.log('🔄 ValidacionComponent - Seleccionando primera agencia disponible como fallback:', primeraAgencia);
                  this.selectedAgency = primeraAgencia.Id;
                  this.defaultAgencyService.seleccionarAgencia(primeraAgencia.Id);
                }
              }
            });
          }, 100);
        },
        error: (error) => {
          console.error('❌ ValidacionComponent - Error cargando agencias:', error);
          this.mostrarError('Error cargando agencias');
          this.agencias = [];
          this.selectedAgency = null;
          this.loadingAgencias = false;
        }
      });
  }

  /**
   * Recargar todos los datos del componente
   */
  recargarDatos() {
    console.log('🔄 ValidacionComponent - Recargando todos los datos...');
    
    // Resetear estados de carga
    this.loading = true;
    this.loadingAgencias = true;
    this.loadingProcesos = true;
    
    // Limpiar datos existentes
    this.allClientes = [];
    this.clientesOriginales = [];
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
    console.log('🔄 ValidacionComponent - loadData() llamado, esperando selección de agencia y proceso');
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
    console.log('Validando documento:', id);
    // Implementar lógica de validación
  }

  rechazarDocumento(documento: any) {
    console.log('Rechazando documento:', documento);
    
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
        console.log('Procesando rechazo:', result);
        this.procesarRechazoDocumento(documento, result);
      }
    });
  }

  private procesarRechazoDocumento(documento: any, resultado: any): void {
    console.log('Procesando rechazo de documento:', documento, resultado);
    
    this.validacionService.aprobarDocumento(
      documento.idDocumentByFile, 
      5, // 5 = Rechazado
      resultado.comentario || undefined
    ).subscribe({
      next: (response) => {
        console.log('Documento rechazado exitosamente:', response);
        this.snackBar.open(`Documento ${documento.documento} rechazado exitosamente`, 'Cerrar', {
          duration: 3000
        });
        
        // Recargar documentos para mostrar el estado actualizado
        this.cargarDocumentosCliente(this.selectedCliente.idFile);
      },
      error: (error) => {
        console.error('Error rechazando documento:', error);
        this.snackBar.open(
          `Error al rechazar documento: ${error.message || 'Error desconocido'}`, 
          'Cerrar', 
          { duration: 5000 }
        );
      }
    });
  }

  descargarArchivo() {
    console.log('Descargando archivo...');
    // Implementar lógica de descarga
  }

  cancelarProceso() {
    console.log('Cancelando proceso...');
    // Implementar lógica de cancelación
  }

  crearExcepcion() {
    console.log('Creando excepción...');
    // Implementar lógica de excepción
  }

  /**
   * Manejar cambio en la selección de agencia
   */
  onAgenciaChange() {
    console.log('🏢 ValidacionComponent - Agencia seleccionada:', this.selectedAgency);
    
    // Limpiar filtros y búsqueda cuando se cambia la agencia
    this.selectedFase = '';
    this.searchTerm = '';
    
    // Actualizar la agencia en el servicio compartido
    if (this.selectedAgency !== null) {
      this.defaultAgencyService.seleccionarAgencia(this.selectedAgency);
    }
    // Si ya hay un proceso seleccionado, cargar clientes
    if (this.selectedProcess) {
      this.cargarClientes();
    }
    // Limpiar selección de cliente y documentos
    this.clearSelection();
  }

  /**
   * Manejar cambio en la selección de proceso
   */
  onProcesoChange() {
    console.log('⚙️ ValidacionComponent - Proceso seleccionado:', this.selectedProcess);
    
    // Limpiar filtros y búsqueda cuando se cambia el proceso
    this.selectedFase = '';
    this.searchTerm = '';
    
    if (this.selectedProcess !== null) {
      this.cargarClientes();
    }
    // Limpiar selección de cliente y documentos
    this.clearSelection();
  }

  /**
   * Manejar cambio en la selección de fase
   */
  onFaseChange(): void {
    console.log('🔄 ValidacionComponent - Fase seleccionada:', this.selectedFase);
    console.log('🔄 ValidacionComponent - Tipo de fase seleccionada:', typeof this.selectedFase);
    console.log('🔄 ValidacionComponent - Clientes originales disponibles:', this.clientesOriginales.length);
    console.log('🔄 ValidacionComponent - Búsqueda activa:', this.searchTerm);
    
    // Si hay búsqueda activa, aplicar búsqueda (que incluye filtro de fase)
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      console.log('🔄 ValidacionComponent - Aplicando búsqueda con filtro de fase');
      this.aplicarBusqueda();
    } else {
      // Solo aplicar filtro de fase
      console.log('🔄 ValidacionComponent - Aplicando solo filtro de fase');
      this.aplicarFiltroFase();
    }
    
    // Si hay un cliente seleccionado, recargar sus documentos
    if (this.selectedCliente) {
      this.cargarDocumentosCliente(this.selectedCliente.idFile);
    }
  }

  /**
   * Aplicar filtro de fase a la tabla de clientes
   */
  private aplicarFiltroFase(): void {
    console.log('🔍 ValidacionComponent - Aplicando filtro de fase:', this.selectedFase);
    console.log('🔍 ValidacionComponent - Clientes originales:', this.clientesOriginales.length);
    
    if (!this.selectedFase || this.selectedFase === '') {
      console.log('🔍 ValidacionComponent - Sin filtro de fase, restaurando todos los clientes');
      // Sin filtro, restaurar todos los clientes originales
      let clientesRestaurados = [...this.clientesOriginales];
      
      // Aplicar filtro de cancelados
      if (this.showCancelledOrders) {
        // Solo mostrar cancelados
        clientesRestaurados = clientesRestaurados.filter(cliente => String(cliente.IdCurrentState) === '5');
        console.log('🔍 ValidacionComponent - Mostrando solo cancelados (sin filtro de fase):', clientesRestaurados.length);
      } else {
        // Excluir cancelados
        clientesRestaurados = clientesRestaurados.filter(cliente => String(cliente.IdCurrentState) !== '5');
        console.log('🔍 ValidacionComponent - Excluyendo cancelados (sin filtro de fase):', clientesRestaurados.length);
      }
      
      this.allClientes = clientesRestaurados;
      this.totalRecords = this.allClientes.length;
      this.currentPage = 0;
      this.updatePaginatedData();
      
      // Seleccionar automáticamente el primer registro si hay clientes
      if (this.allClientes.length > 0) {
        this.seleccionarCliente(this.allClientes[0]);
      } else {
        this.selectedCliente = null;
      }
      return;
    }

    console.log('🔍 ValidacionComponent - Filtrando clientes por fase:', this.selectedFase);
    // Filtrar clientes por fase desde los datos originales usando ID
    const clientesFiltrados = this.clientesOriginales.filter(cliente => {
      console.log(`🔍 ValidacionComponent - Cliente ${cliente.idFile} - IdCurrentState: ${cliente.IdCurrentState} (tipo: ${typeof cliente.IdCurrentState})`);
      
      // Aplicar filtro de cancelados
      if (this.showCancelledOrders) {
        // Solo mostrar cancelados
        if (String(cliente.IdCurrentState) !== '5') {
          console.log(`🔍 ValidacionComponent - Excluyendo cliente no cancelado ${cliente.idFile} (toggle activado)`);
          return false;
        }
      } else {
        // Excluir cancelados
        if (String(cliente.IdCurrentState) === '5') {
          console.log(`🔍 ValidacionComponent - Excluyendo cliente cancelado ${cliente.idFile} (toggle desactivado)`);
          return false;
        }
      }
      
      let resultado = false;
      switch (this.selectedFase) {
        case '1':
          resultado = String(cliente.IdCurrentState) === '1'; // Integración
          console.log(`🔍 ValidacionComponent - Integración: ${cliente.IdCurrentState} === '1' = ${resultado}`);
          break;
        case '2':
          resultado = String(cliente.IdCurrentState) === '2'; // Liquidación
          console.log(`🔍 ValidacionComponent - Liquidación: ${cliente.IdCurrentState} === '2' = ${resultado}`);
          break;
        case '3':
          resultado = String(cliente.IdCurrentState) === '3'; // Liberación
          console.log(`🔍 ValidacionComponent - Liberación: ${cliente.IdCurrentState} === '3' = ${resultado}`);
          break;
        case '4':
          resultado = String(cliente.IdCurrentState) === '4'; // Liberado
          console.log(`🔍 ValidacionComponent - Liberado: ${cliente.IdCurrentState} === '4' = ${resultado}`);
          break;
        case '5':
          resultado = String(cliente.IdCurrentState) === '5'; // Cancelado
          console.log(`🔍 ValidacionComponent - Cancelado: ${cliente.IdCurrentState} === '5' = ${resultado}`);
          break;
        case '6':
          resultado = String(cliente.IdCurrentState) === '6'; // Liberado por Excepción
          console.log(`🔍 ValidacionComponent - Excepción: ${cliente.IdCurrentState} === '6' = ${resultado}`);
          break;
        default:
          resultado = true;
          console.log(`🔍 ValidacionComponent - Default: ${resultado}`);
          break;
      }
      return resultado;
    });

    console.log('📊 ValidacionComponent - Clientes filtrados:', clientesFiltrados.length, 'de', this.clientesOriginales.length);
    
    // Actualizar los datos filtrados y aplicar paginación
    this.allClientes = [...clientesFiltrados];
    this.totalRecords = clientesFiltrados.length;
    this.currentPage = 0; // Volver a la primera página
    this.updatePaginatedData(); // Aplicar paginación con el tamaño de página configurado
    
    // Seleccionar automáticamente el primer registro filtrado si hay resultados
    if (clientesFiltrados.length > 0) {
      this.seleccionarCliente(clientesFiltrados[0]);
    } else {
      this.selectedCliente = null;
    }
  }

  /**
   * Cargar clientes desde la API
   */
  private cargarClientes() {
    if (this.selectedAgency === null || this.selectedProcess === null) {
      console.log('⚠️ ValidacionComponent - No se puede cargar clientes: agencia o proceso no seleccionado');
      return;
    }

    console.log('🔄 ValidacionComponent - Cargando clientes para agencia:', this.selectedAgency, 'proceso:', this.selectedProcess);
    this.loading = true;

    const filtros: FiltrosValidacion = {
      agencia: this.selectedAgency,
      proceso: this.selectedProcess,
      showCancelled: this.showCancelledOrders
    };

    this.validacionService.cargarClientes(filtros)
      .pipe(
        takeUntil(this.destroy$),
        timeout(10000),
        catchError(error => {
          console.error('❌ ValidacionComponent - Error cargando clientes:', error);
          this.mostrarError('Error cargando clientes');
          this.clientesDataSource.data = [];
          this.loading = false;
          return of([]);
        })
      )
      .subscribe({
        next: (clientes) => {
          console.log('✅ ValidacionComponent - Clientes cargados:', clientes);
          console.log('🔍 ValidacionComponent - Primer cliente (si existe):', clientes.length > 0 ? clientes[0] : 'No hay clientes');
          console.log('🔍 ValidacionComponent - Campos del primer cliente:', clientes.length > 0 ? Object.keys(clientes[0]) : 'No hay clientes');
          
          // Verificar específicamente el campo IdCurrentState
          if (clientes.length > 0) {
            console.log('🔍 ValidacionComponent - IdCurrentState del primer cliente:', clientes[0].IdCurrentState);
            console.log('🔍 ValidacionComponent - Tipo de IdCurrentState:', typeof clientes[0].IdCurrentState);
            
            // Mostrar todos los IdCurrentState únicos
            const estadosUnicos = [...new Set(clientes.map(c => c.IdCurrentState))];
            console.log('🔍 ValidacionComponent - Estados únicos encontrados:', estadosUnicos);
          }
          
          this.clientesOriginales = [...clientes]; // Guardar copia de respaldo
          this.allClientes = [...clientes]; // Guardar todos los clientes
          this.currentPage = 0; // Volver a la primera página
          
          // Aplicar filtro de fase si está seleccionado
          if (this.selectedFase && this.selectedFase !== '') {
            this.aplicarFiltroFase();
          } else {
            // Aplicar filtro de cancelados
            if (this.showCancelledOrders) {
              // Solo mostrar cancelados
              this.allClientes = this.allClientes.filter(cliente => String(cliente.IdCurrentState) === '5');
              console.log('🔍 ValidacionComponent - Mostrando solo cancelados:', this.allClientes.length);
            } else {
              // Excluir cancelados
              this.allClientes = this.allClientes.filter(cliente => String(cliente.IdCurrentState) !== '5');
              console.log('🔍 ValidacionComponent - Excluyendo cancelados:', this.allClientes.length);
            }
            this.updatePaginatedData(); // Aplicar paginación normal
          }
          
          // Seleccionar automáticamente el primer registro si hay clientes (usar datos filtrados)
          if (this.allClientes.length > 0) {
            this.seleccionarCliente(this.allClientes[0]);
          } else {
            this.selectedCliente = null;
          }
          
          this.loading = false;
        },
        error: (error) => {
          console.error('❌ ValidacionComponent - Error en subscribe de clientes:', error);
          this.clientesDataSource.data = [];
          this.loading = false;
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
   * Manejar cambio de página
   */
  onPageChange(event: any) {
    console.log('🔄 ValidacionComponent - Cambio de página:', event);
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    console.log('📊 ValidacionComponent - Nueva página:', this.currentPage, 'Tamaño:', this.pageSize);
    this.updatePaginatedData();
  }

  /**
   * Actualizar datos paginados
   */
  private updatePaginatedData() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.clientesDataSource.data = this.allClientes.slice(startIndex, endIndex);
    this.totalRecords = this.allClientes.length;
    
    // Aplicar ordenamiento si está configurado
    if (this.sort) {
      this.clientesDataSource.sort = this.sort;
    }
  }

  /**
   * Cambiar tamaño de página
   */
  onPageSizeChange(event: any) {
    this.pageSize = event.value;
    this.currentPage = 0; // Volver a la primera página
    this.updatePaginatedData();
  }

  /**
   * Aplicar ordenamiento a los datos
   */
  private aplicarOrdenamiento() {
    console.log('🔄 ValidacionComponent - Aplicando ordenamiento...');
    console.log('🔧 ValidacionComponent - MatSort disponible:', !!this.sort);
    console.log('🔧 ValidacionComponent - Total de clientes:', this.allClientes.length);
    
    if (!this.sort || !this.allClientes.length) {
      console.warn('⚠️ ValidacionComponent - No se puede aplicar ordenamiento:', {
        sort: !!this.sort,
        clientes: this.allClientes.length
      });
      return;
    }

    const direction = this.sort.direction;
    const active = this.sort.active;
    
    console.log('🔧 ValidacionComponent - Columna activa:', active);
    console.log('🔧 ValidacionComponent - Dirección:', direction);

    if (direction === '') {
      console.log('🔄 ValidacionComponent - Sin dirección, actualizando paginación');
      this.updatePaginatedData();
      return;
    }

    console.log('🔄 ValidacionComponent - Iniciando ordenamiento de', this.allClientes.length, 'registros');
    
    // Ordenar todos los datos
    this.allClientes.sort((a, b) => {
      let aValue = this.getSortValue(a, active);
      let bValue = this.getSortValue(b, active);

      if (aValue === null || aValue === undefined) aValue = '';
      if (bValue === null || bValue === undefined) bValue = '';

      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    console.log('✅ ValidacionComponent - Ordenamiento completado');
    console.log('🔧 ValidacionComponent - Primer registro después del ordenamiento:', this.allClientes[0]);
    console.log('🔧 ValidacionComponent - Último registro después del ordenamiento:', this.allClientes[this.allClientes.length - 1]);

    // Actualizar datos paginados
    this.currentPage = 0;
    this.updatePaginatedData();
  }

  /**
   * Obtener valor para ordenamiento de una columna específica
   */
  private getSortValue(item: any, column: string): any {
    switch (column) {
      case 'ndCliente':
        return item.idFile;
      case 'ndPedido':
        return item.ndPedido;
      case 'cliente':
        return item.cliente;
      case 'proceso':
        return item.proceso;
      case 'operacion':
        return item.operacion;
      case 'fase':
        return item.fase;
      case 'registro':
        return new Date(item.registro);
      case 'fechaLiberacion':
        return new Date(item.fechaLiberacion);
      default:
        return item[column];
    }
  }

  /**
   * Método de prueba para verificar que el ordenamiento funciona
   */
  probarOrdenamiento() {
    console.log('🧪 ValidacionComponent - Probando ordenamiento...');
    console.log('🔧 ValidacionComponent - MatSort disponible:', !!this.sort);
    console.log('🔧 ValidacionComponent - Total de clientes:', this.allClientes.length);
    
    if (this.sort) {
      // Simular un evento de ordenamiento
      console.log('🧪 ValidacionComponent - Simulando ordenamiento por ND Cliente ascendente');
      
      // Opción 1: Intentar con el método sort
      try {
        this.sort.sort({
          id: 'ndCliente',
          start: 'asc',
          disableClear: false
        });
        console.log('✅ ValidacionComponent - Método sort() ejecutado');
      } catch (error) {
        console.error('❌ ValidacionComponent - Error en sort():', error);
      }
      
      // Opción 2: Llamar directamente al método de ordenamiento
      console.log('🧪 ValidacionComponent - Llamando directamente a aplicarOrdenamiento()');
      this.aplicarOrdenamiento();
      
    } else {
      console.error('❌ ValidacionComponent - MatSort no está disponible para la prueba');
    }
    
    // Mostrar información sobre la selección actual
    if (this.selectedCliente) {
      console.log('👤 ValidacionComponent - Cliente seleccionado:', this.selectedCliente);
      console.log('📄 ValidacionComponent - Documentos cargados:', this.documentosDataSource.length);
      console.log('🔍 ValidacionComponent - Filtros aplicados: File ID:', this.selectedCliente.idFile, 'Pedido ID:', this.selectedCliente.ndPedido);
    } else {
      console.log('ℹ️ ValidacionComponent - No hay cliente seleccionado');
    }
  }

  /**
   * Manejar cambio en el término de búsqueda
   */
  onSearchChange(): void {
    console.log('🔍 ValidacionComponent - Término de búsqueda:', this.searchTerm);
    this.aplicarBusqueda();
  }

  /**
   * Limpiar búsqueda
   */
  clearSearch(): void {
    console.log('🧹 ValidacionComponent - Limpiando búsqueda');
    this.searchTerm = '';
    this.aplicarBusqueda();
  }

  /**
   * Aplicar búsqueda a los datos
   */
  private aplicarBusqueda(): void {
    console.log('🔍 ValidacionComponent - Aplicando búsqueda:', this.searchTerm);
    
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      // Sin búsqueda, aplicar solo filtro de fase si existe
      if (this.selectedFase && this.selectedFase !== '') {
        this.aplicarFiltroFase();
      } else {
        this.updatePaginatedData();
      }
      return;
    }

    const terminoBusqueda = this.searchTerm.toLowerCase().trim();
    console.log('🔍 ValidacionComponent - Término de búsqueda normalizado:', terminoBusqueda);

    // Filtrar clientes por término de búsqueda
    let clientesFiltrados = this.clientesOriginales.filter(cliente => {
      // Buscar en ID de archivo
      const idFile = String(cliente.idFile).toLowerCase();
      if (idFile.includes(terminoBusqueda)) {
        return true;
      }

      // Buscar en número de pedido
      const ndPedido = String(cliente.ndPedido).toLowerCase();
      if (ndPedido.includes(terminoBusqueda)) {
        return true;
      }

      // Buscar en nombre del cliente
      const nombreCliente = cliente.cliente.toLowerCase();
      if (nombreCliente.includes(terminoBusqueda)) {
        return true;
      }

      return false;
    });

    console.log('📊 ValidacionComponent - Clientes encontrados en búsqueda:', clientesFiltrados.length);

    // Si hay filtro de fase, aplicarlo también
    if (this.selectedFase && this.selectedFase !== '') {
      clientesFiltrados = clientesFiltrados.filter(cliente => {
        // Aplicar filtro de cancelados
        if (this.showCancelledOrders) {
          // Solo mostrar cancelados
          if (String(cliente.IdCurrentState) !== '5') {
            return false;
          }
        } else {
          // Excluir cancelados
          if (String(cliente.IdCurrentState) === '5') {
            return false;
          }
        }
        
        switch (this.selectedFase) {
          case '1':
            return String(cliente.IdCurrentState) === '1'; // Integración
          case '2':
            return String(cliente.IdCurrentState) === '2'; // Liquidación
          case '3':
            return String(cliente.IdCurrentState) === '3'; // Liberación
          case '4':
            return String(cliente.IdCurrentState) === '4'; // Liberado
          case '5':
            return String(cliente.IdCurrentState) === '5'; // Cancelado
          case '6':
            return String(cliente.IdCurrentState) === '6'; // Liberado por Excepción
          default:
            return true;
        }
      });
      console.log('📊 ValidacionComponent - Clientes después de filtro de fase:', clientesFiltrados.length);
    } else {
      // Si no hay filtro de fase, aplicar filtro de cancelados
      if (this.showCancelledOrders) {
        // Solo mostrar cancelados
        clientesFiltrados = clientesFiltrados.filter(cliente => String(cliente.IdCurrentState) === '5');
        console.log('📊 ValidacionComponent - Mostrando solo cancelados (sin filtro de fase):', clientesFiltrados.length);
      } else {
        // Excluir cancelados
        clientesFiltrados = clientesFiltrados.filter(cliente => String(cliente.IdCurrentState) !== '5');
        console.log('📊 ValidacionComponent - Excluyendo cancelados (sin filtro de fase):', clientesFiltrados.length);
      }
    }

    // Actualizar datos paginados con los resultados de búsqueda
    this.allClientes = [...clientesFiltrados];
    this.totalRecords = clientesFiltrados.length;
    this.currentPage = 0; // Volver a la primera página
    this.updatePaginatedData();
  }
}
