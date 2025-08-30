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
  selectedAgency = '';
  selectedProcess = '';
  selectedFase = '';

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

  // Tabla de documentos
  documentosDisplayedColumns: string[] = [
    'proceso', 'fase', 'documento', 'estatus', 'ver', 'validar', 
    'eliminar', 'requerido', 'fecha', 'comentario', 'asignado'
  ];
  documentosDataSource: any[] = [];

  constructor(
    private validacionService: ValidacionService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.cargarAgencias();
    this.cargarProcesos();
    this.loadData();
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
          } else {
            console.warn('⚠️ ValidacionComponent - No se encontraron procesos habilitados');
            this.selectedProcess = '';
          }
          
          this.loadingProcesos = false;
        },
        error: (error) => {
          console.error('❌ ValidacionComponent - Error en subscribe de procesos:', error);
          this.procesos = [];
          this.selectedProcess = '';
          this.loadingProcesos = false;
        }
      });
  }

  /**
   * Cargar agencias desde la API (solo activas y con permisos del usuario)
   */
  private cargarAgencias() {
    console.log('🔄 ValidacionComponent - Iniciando carga de agencias...');
    this.loadingAgencias = true;
    
    this.validacionService.cargarAgencias()
      .pipe(
        takeUntil(this.destroy$),
        timeout(10000), // 10 segundos de timeout
        catchError(error => {
          if (error.name === 'TimeoutError') {
            console.error('⏰ ValidacionComponent - Timeout cargando agencias');
            this.mostrarError('Timeout: La carga de agencias tardó demasiado');
          } else {
            console.error('❌ ValidacionComponent - Error cargando agencias:', error);
            this.mostrarError('Error cargando agencias');
          }
          this.agencias = [];
          return of([]);
        })
      )
      .subscribe({
        next: (agencias) => {
          console.log('📥 ValidacionComponent - Respuesta de agencias recibida:', agencias);
          
          // Verificar que agencias sea un array
          if (!Array.isArray(agencias)) {
            console.error('❌ ValidacionComponent - La respuesta no es un array:', agencias);
            this.agencias = [];
            this.loadingAgencias = false;
            return;
          }
          
          console.log('📊 ValidacionComponent - Total de agencias recibidas:', agencias.length);
          
          console.log('🔍 ValidacionComponent - Todas las agencias recibidas:', agencias);
          console.log('🔍 ValidacionComponent - Ejemplo de estructura de agencia:', agencias[0]);
          
          // TEMPORAL: Para debugging, mostrar todas las agencias primero
          console.log('🔍 TEMPORAL: Mostrando TODAS las agencias para debugging');
          this.agencias = agencias.filter(agencia => agencia);
          
          // COMENTADO: Filtrado original que se activará después del debugging
          /*
          // Mostrar solo agencias habilitadas (Enabled = 1, true, "1", etc.)
          this.agencias = agencias.filter(agencia => {
            if (!agencia) return false;
            
            const enabled = agencia.Enabled;
            const isEnabled = enabled === 1 || 
                            enabled === true || 
                            enabled === "1" || 
                            enabled === "true" ||
                            enabled === "enabled" ||
                            enabled === "ENABLED";
            
            console.log(`🔍 Filtrado agencia "${agencia.Name}":`, {
              enabled: enabled,
              isEnabled: isEnabled,
              type: typeof enabled
            });
            
            return isEnabled;
          });
          */
          
          console.log('✅ ValidacionComponent - Solo agencias habilitadas:', this.agencias);
          console.log('📊 ValidacionComponent - Total de agencias habilitadas:', this.agencias.length);
          
          // Debug: mostrar el estado de cada agencia
          agencias.forEach((agencia, index) => {
            console.log(`🔍 Agencia ${index}:`, {
              id: agencia.IdAgency,
              name: agencia.Name,
              enabled: agencia.Enabled,
              enabledType: typeof agencia.Enabled,
              enabledString: String(agencia.Enabled),
              enabledBoolean: Boolean(agencia.Enabled),
              enabledNumber: Number(agencia.Enabled),
              // Mostrar todos los campos disponibles para debugging
              allFields: agencia
            });
          });
          
          // Seleccionar la primera agencia por defecto si hay alguna
          if (this.agencias.length > 0) {
            this.selectedAgency = this.agencias[0].IdAgency;
            console.log('🎯 ValidacionComponent - Agencia seleccionada por defecto:', this.selectedAgency);
          } else {
            console.warn('⚠️ ValidacionComponent - No se encontraron agencias activas');
            this.selectedAgency = '';
          }
          
          this.loadingAgencias = false;
        },
        error: (error) => {
          console.error('❌ ValidacionComponent - Error en subscribe:', error);
          this.agencias = [];
          this.selectedAgency = '';
          this.loadingAgencias = false;
        }
      });
  }

  loadData() {
    this.loading = true;
    // Simular carga de datos
    setTimeout(() => {
      // Datos de clientes basados en la imagen
      this.clientesDataSource = [
        {
          ndCliente: 197697,
          ndPedido: 34910,
          cliente: 'COMERCIALIZADORA AVODICARE SA DE AUTOS NUEVOS',
          proceso: 'AUTOS NUEVOS',
          operacion: 'CONTADO',
          integracion: true,
          liquidacion: false,
          liberacion: true,
          excepcion: false,
          liberado: false,
          registro: '29/08/2025'
        },
        {
          ndCliente: 180783,
          ndPedido: 31959,
          cliente: 'EDGAR GERARDO AGUAYO NUÑO',
          proceso: 'AUTOS NUEVOS',
          operacion: 'HONDA FINANCE',
          integracion: true,
          liquidacion: false,
          liberacion: false,
          excepcion: false,
          liberado: false,
          registro: '08/09/2023'
        },
        {
          ndCliente: 195432,
          ndPedido: 32876,
          cliente: 'MARIA ISABEL RODRIGUEZ LOPEZ',
          proceso: 'AUTOS NUEVOS',
          operacion: 'CREDITO INTERNO',
          integracion: false,
          liquidacion: false,
          liberacion: false,
          excepcion: false,
          liberado: false,
          registro: '15/08/2025'
        }
      ];

      // Datos de documentos basados en la imagen
      this.documentosDataSource = [
        {
          proceso: 'AUTOS NUEVOS',
          fase: 'Integración',
          documento: 'ACTA CONSTITUTIVA',
          estatus: 'info',
          ver: true,
          validado: false,
          eliminar: true,
          requerido: true,
          fecha: '29/08/2025',
          comentario: '',
          asignado: ''
        },
        {
          proceso: 'AUTOS NUEVOS',
          fase: 'Integración',
          documento: 'COMPROBANTE DE DOMICILIO',
          estatus: 'info',
          ver: true,
          validado: true,
          eliminar: true,
          requerido: true,
          fecha: '29/08/2025',
          comentario: '',
          asignado: ''
        },
        {
          proceso: 'AUTOS NUEVOS',
          fase: 'Liquidación',
          documento: 'FACTURA',
          estatus: 'info',
          ver: true,
          validado: false,
          eliminar: true,
          requerido: true,
          fecha: '29/08/2025',
          comentario: '',
          asignado: ''
        },
        {
          proceso: 'AUTOS NUEVOS',
          fase: 'Liberación',
          documento: 'LEY ANTILAVADO',
          estatus: 'info',
          ver: true,
          validado: false,
          eliminar: true,
          requerido: true,
          fecha: '29/08/2025',
          comentario: '',
          asignado: ''
        }
      ];

      this.loading = false;
    }, 1000);
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
    // Aquí se puede implementar la lógica para recargar datos
    // basados en la nueva agencia seleccionada
  }

  /**
   * Manejar cambio en la selección de proceso
   */
  onProcesoChange() {
    console.log('⚙️ ValidacionComponent - Proceso seleccionado:', this.selectedProcess);
    // Aquí se puede implementar la lógica para recargar datos
    // basados en el nuevo proceso seleccionado
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
}
