import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
    ScrollingModule
  ],
  templateUrl: './validacion.component.html',
  styleUrl: './validacion.component.scss'
})
export class ValidacionComponent implements OnInit, OnDestroy {
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

  // Datos de filtros disponibles
  agencias: any[] = [];
  procesos: any[] = [];
  fases: any[] = [];

  // Tabla de clientes
  clientesDisplayedColumns: string[] = [
    'ndCliente', 'ndPedido', 'cliente', 'proceso', 'operacion', 
    'integracion', 'liquidacion', 'liberacion', 'excepcion', 'liberado', 'registro'
  ];
  clientesDataSource: any[] = [];
  
  // Paginación
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50];
  currentPage = 0;
  totalRecords = 0;
  allClientes: any[] = []; // Todos los clientes para paginación local

  // Tabla de documentos
  documentosDisplayedColumns: string[] = [
    'proceso', 'fase', 'documento', 'estatus', 'ver', 'validar', 
    'eliminar', 'requerido', 'fecha', 'comentario', 'asignado'
  ];
  documentosDataSource: any[] = [];

  constructor(
    private validacionService: ValidacionService,
    private defaultAgencyService: DefaultAgencyService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
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
    this.clientesDataSource = [];
    this.procesos = [];
    this.selectedAgency = null;
    this.selectedProcess = null;
    
    // Recargar agencias y procesos
    this.cargarAgencias();
    this.cargarProcesos();
    
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
    return this.clientesDataSource.filter(item => item.integracion).length;
  }

  getPendientesCount(): number {
    return this.clientesDataSource.filter(item => !item.integracion).length;
  }

  // Métodos de acción
  validarDocumento(id: number) {
    console.log('Validando documento:', id);
    // Implementar lógica de validación
  }

  rechazarDocumento(id: number) {
    console.log('Rechazando documento:', id);
    // Implementar lógica de rechazo
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
    // Actualizar la agencia en el servicio compartido
    if (this.selectedAgency !== null) {
      this.defaultAgencyService.seleccionarAgencia(this.selectedAgency);
    }
    // Si ya hay un proceso seleccionado, cargar clientes
    if (this.selectedProcess) {
      this.cargarClientes();
    }
  }

  /**
   * Manejar cambio en la selección de proceso
   */
  onProcesoChange() {
    console.log('⚙️ ValidacionComponent - Proceso seleccionado:', this.selectedProcess);
    if (this.selectedProcess !== null) {
      this.cargarClientes();
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
      proceso: this.selectedProcess
    };

    this.validacionService.cargarClientes(filtros)
      .pipe(
        takeUntil(this.destroy$),
        timeout(10000),
        catchError(error => {
          console.error('❌ ValidacionComponent - Error cargando clientes:', error);
          this.mostrarError('Error cargando clientes');
          this.clientesDataSource = [];
          this.loading = false;
          return of([]);
        })
      )
      .subscribe({
        next: (clientes) => {
          console.log('✅ ValidacionComponent - Clientes cargados:', clientes);
          this.allClientes = clientes; // Guardar todos los clientes
          this.totalRecords = clientes.length;
          this.currentPage = 0; // Volver a la primera página
          this.updatePaginatedData(); // Aplicar paginación
          this.loading = false;
        },
        error: (error) => {
          console.error('❌ ValidacionComponent - Error en subscribe de clientes:', error);
          this.clientesDataSource = [];
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
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedData();
  }

  /**
   * Actualizar datos paginados
   */
  private updatePaginatedData() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.clientesDataSource = this.allClientes.slice(startIndex, endIndex);
    this.totalRecords = this.allClientes.length;
  }

  /**
   * Cambiar tamaño de página
   */
  onPageSizeChange(event: any) {
    this.pageSize = event.value;
    this.currentPage = 0; // Volver a la primera página
    this.updatePaginatedData();
  }
}
