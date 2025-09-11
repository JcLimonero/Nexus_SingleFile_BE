import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-order-selection-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    FormsModule
  ],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title class="text-xl font-semibold mb-4">
        <mat-icon class="mr-2">receipt</mat-icon>
        Seleccionar Pedido
      </h2>
      
      <div mat-dialog-content class="mb-6 dialog-content">
        <!-- Loading spinner -->
        <div *ngIf="loading" class="flex justify-center py-8">
          <mat-spinner diameter="40"></mat-spinner>
          <p class="ml-4 text-gray-600">Verificando pedidos existentes...</p>
        </div>

        <!-- Contenido principal -->
        <div *ngIf="!loading">
          <!-- Buscador -->
          <div class="mb-4">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Buscar por número de orden</mat-label>
              <input 
                matInput 
                [(ngModel)]="searchTerm"
                (input)="applyFilter()"
                placeholder="Ingresa el número de orden para buscar"
                autocomplete="off">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>
          
          <p class="text-gray-600 mb-4 order-info">
            Se encontraron {{ filteredOrders.length }} pedidos nuevos disponibles. Selecciona uno:
          </p>
        
        <div class="overflow-x-auto table-container">
          <table mat-table [dataSource]="paginatedOrders" class="w-full">
            <!-- Radio Button Column -->
            <ng-container matColumnDef="select">
              <th mat-header-cell *matHeaderCellDef>Seleccionar</th>
              <td mat-cell *matCellDef="let order">
                <mat-radio-button 
                  [value]="order"
                  [checked]="selectedOrder === order"
                  (change)="selectOrder(order)">
                </mat-radio-button>
              </td>
            </ng-container>

            <!-- Order DMS Column -->
            <ng-container matColumnDef="order_dms">
              <th mat-header-cell *matHeaderCellDef>Order DMS</th>
              <td mat-cell *matCellDef="let order">
                <div class="flex items-center order-info">
                  <mat-icon class="mr-1 text-blue-600" style="font-size: 14px;">receipt</mat-icon>
                  <span class="font-medium">{{ order.order_dms || order.orderDMS || order.numeroPedido || 'N/A' }}</span>
                </div>
              </td>
            </ng-container>

            <!-- Year Column -->
            <ng-container matColumnDef="year">
              <th mat-header-cell *matHeaderCellDef>Año</th>
              <td mat-cell *matCellDef="let order">
                <span *ngIf="order.year; else noYear" class="order-info">{{ order.year }}</span>
                <ng-template #noYear>
                  <span class="text-gray-400 italic order-info">-</span>
                </ng-template>
              </td>
            </ng-container>

            <!-- Model Column -->
            <ng-container matColumnDef="model">
              <th mat-header-cell *matHeaderCellDef>Modelo</th>
              <td mat-cell *matCellDef="let order">
                <span *ngIf="order.model; else noModel" class="order-info">{{ order.model }}</span>
                <ng-template #noModel>
                  <span class="text-gray-400 italic order-info">Sin modelo</span>
                </ng-template>
              </td>
            </ng-container>

            <!-- Version Column -->
            <ng-container matColumnDef="version">
              <th mat-header-cell *matHeaderCellDef>Versión</th>
              <td mat-cell *matCellDef="let order">
                <span *ngIf="order.version; else noVersion" class="order-info">{{ order.version }}</span>
                <ng-template #noVersion>
                  <span class="text-gray-400 italic order-info">Sin versión</span>
                </ng-template>
              </td>
            </ng-container>

            <!-- Color Exterior Column -->
            <ng-container matColumnDef="colorExterior">
              <th mat-header-cell *matHeaderCellDef>Color Exterior</th>
              <td mat-cell *matCellDef="let order">
                <span *ngIf="order.external_color; else noColorExterior" class="order-info">
                  {{ order.external_color }}
                </span>
                <ng-template #noColorExterior>
                  <span class="text-gray-400 italic order-info">Sin color</span>
                </ng-template>
              </td>
            </ng-container>

            <!-- Color Interior Column -->
            <ng-container matColumnDef="colorInterior">
              <th mat-header-cell *matHeaderCellDef>Color Interior</th>
              <td mat-cell *matCellDef="let order">
                <span *ngIf="order.internal_color; else noColorInterior" class="order-info">
                  {{ order.internal_color }}
                </span>
                <ng-template #noColorInterior>
                  <span class="text-gray-400 italic order-info">Sin color</span>
                </ng-template>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                class="hover:bg-gray-50">
            </tr>
          </table>
          
          <!-- Paginación -->
          <mat-paginator 
            [length]="filteredOrders.length"
            [pageSize]="pageSize"
            [pageSizeOptions]="[5, 10, 20, 50]"
            (page)="onPageChange($event)"
            showFirstLastButtons>
          </mat-paginator>
        </div>

        <!-- Sin pedidos nuevos -->
        <div *ngIf="!loading && filteredOrders.length === 0" class="text-center py-8">
          <mat-icon class="text-gray-400 mb-2" style="font-size: 40px;">check_circle</mat-icon>
          <p class="text-gray-500">Todos los pedidos de Vanguardia ya existen en el sistema</p>
          <p class="text-sm text-gray-400 mt-2">No hay pedidos nuevos para agregar</p>
        </div>
        </div>

        <!-- Configuración del File (solo cuando hay pedido seleccionado) -->
        <div *ngIf="selectedOrder && !loading" class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 class="text-lg font-semibold text-blue-800 mb-4 flex items-center">
            <mat-icon class="mr-2">settings</mat-icon>
            Configuración del File
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Proceso -->
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Proceso</mat-label>
              <mat-select [(ngModel)]="selectedProcess" (selectionChange)="onProcessChange()" required>
                <mat-option *ngFor="let process of processes" [value]="process">
                  {{ process.Name }}
                </mat-option>
              </mat-select>
              <mat-icon matSuffix>business</mat-icon>
            </mat-form-field>

            <!-- Tipo de Cliente -->
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Tipo de Cliente</mat-label>
              <mat-select [(ngModel)]="selectedCostumerType" (selectionChange)="onCostumerTypeChange()" required>
                <mat-option *ngFor="let costumerType of availableCostumerTypes" [value]="costumerType">
                  {{ costumerType.Name }}
                </mat-option>
              </mat-select>
              <mat-icon matSuffix>person</mat-icon>
            </mat-form-field>

            <!-- Tipo de Operación -->
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Tipo de Operación</mat-label>
              <mat-select [(ngModel)]="selectedOperationType" required>
                <mat-option *ngFor="let operationType of availableOperationTypes" [value]="operationType">
                  {{ operationType.Name }}
                </mat-option>
              </mat-select>
              <mat-icon matSuffix>build</mat-icon>
            </mat-form-field>
          </div>

          <!-- Resumen de selección -->
          <div class="mt-4 p-3 bg-white rounded border">
            <h4 class="font-medium text-gray-700 mb-2">Resumen de configuración:</h4>
            <div class="text-sm text-gray-600 space-y-1">
              <p><strong>Pedido:</strong> {{ selectedOrder.order_dms || selectedOrder.orderDMS || selectedOrder.numeroPedido }}</p>
              <p><strong>Proceso:</strong> {{ selectedProcess?.Name || 'No seleccionado' }}</p>
              <p><strong>Tipo Cliente:</strong> {{ selectedCostumerType?.Name || 'No seleccionado' }}</p>
              <p><strong>Operación:</strong> {{ selectedOperationType?.Name || 'No seleccionado' }}</p>
            </div>
            
            <!-- Estado de validación -->
            <div *ngIf="selectedProcess && selectedCostumerType && selectedOperationType" class="mt-3 pt-2 border-t">
              <div *ngIf="isConfigurationValid()" class="flex items-center text-green-600">
                <mat-icon class="mr-2" style="font-size: 16px;">check_circle</mat-icon>
                <span class="text-sm font-medium">Configuración válida</span>
              </div>
              <div *ngIf="!isConfigurationValid()" class="flex items-center text-red-600">
                <mat-icon class="mr-2" style="font-size: 16px;">error</mat-icon>
                <span class="text-sm font-medium">Esta combinación no está habilitada</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div mat-dialog-actions class="flex justify-between items-center">
        <div class="text-sm text-gray-600">
          {{ selectedOrder ? '1 pedido seleccionado' : 'Ningún pedido seleccionado' }}
        </div>
        <div class="flex gap-2">
          <button mat-button (click)="onCancel()" class="text-sm">
            <mat-icon class="mr-1" style="font-size: 16px;">close</mat-icon>
            Cancelar
          </button>
          <button 
            mat-raised-button 
            color="primary" 
            (click)="onConfirm()" 
            [disabled]="!isFormValid()"
            class="text-sm">
            <mat-icon class="mr-1" style="font-size: 16px;">add</mat-icon>
            Crear File
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .mat-mdc-dialog-container {
      --mdc-dialog-container-color: white;
    }
    
    // Contenedor principal del diálogo
    .dialog-container {
      width: 100%;
      min-width: 800px;
      max-width: 1200px;
      padding: 0;
      display: flex;
      flex-direction: column;
    }
    
    // Contenedor de contenido
    .dialog-content {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    
    // Contenedor de la tabla
    .table-container {
      flex: 1;
      overflow: auto;
      min-height: 0;
    }
    
    // Estilos específicos para las tablas
    :host ::ng-deep {
      mat-table {
        .mat-mdc-table {
          border-collapse: separate !important;
          border-spacing: 0 !important;
          width: 100% !important;
        }
        
        // Altura compacta para las filas
        .mat-mdc-row {
          min-height: 32px !important;
          height: 32px !important;
          max-height: 32px !important;
          border-bottom: 1px solid rgba(0,0,0,.12) !important;
          display: table-row !important;
          
          &:hover {
            background-color: #f1f5f9 !important;
          }
        }
        
        .mat-mdc-header-row {
          min-height: 32px !important;
          height: 32px !important;
          max-height: 32px !important;
          border-bottom: 1px solid rgba(0,0,0,.12) !important;
          display: table-row !important;
          background-color: #f8fafc !important;
        }
        
        // Padding compacto para las celdas
        .mat-mdc-cell {
          padding: 4px 8px !important;
          vertical-align: middle !important;
          line-height: 1.2 !important;
          font-size: 12px !important;
          border: none !important;
          height: 32px !important;
          max-height: 32px !important;
          overflow: hidden !important;
          white-space: nowrap !important;
          text-overflow: ellipsis !important;
          text-align: left !important;
        }
        
        .mat-mdc-header-cell {
          padding: 4px 8px !important;
          vertical-align: middle !important;
          line-height: 1.2 !important;
          font-size: 12px !important;
          font-weight: 500 !important;
          border: none !important;
          height: 32px !important;
          max-height: 32px !important;
          overflow: hidden !important;
          white-space: nowrap !important;
          text-overflow: ellipsis !important;
          text-align: left !important;
        }
        
        // Eliminar cualquier espaciado extra
        .mat-mdc-cell, .mat-mdc-header-cell {
          margin: 0 !important;
          border-spacing: 0 !important;
        }
      }
      
      // Estilos específicos para elementos que puedan estar causando diferencias
      .mat-mdc-table-container {
        overflow: hidden !important;
      }
      
      .mat-mdc-table-wrapper {
        overflow: hidden !important;
      }
      
      // Estilos específicos para elementos internos
      .mat-mdc-cell div,
      .mat-mdc-cell span,
      .mat-mdc-header-cell div,
      .mat-mdc-header-cell span {
        line-height: 1.2 !important;
        margin: 0 !important;
        padding: 0 !important;
        font-size: 12px !important;
      }
    }
    
    // Estilos para el diálogo
    .dialog-content {
      max-height: 60vh;
      min-height: 400px;
      overflow-y: auto;
    }
    
    .order-info {
      font-size: 12px;
      line-height: 1.2;
    }
    
    // Estilos específicos para columnas
    :host ::ng-deep {
      mat-table {
        .mat-column-select {
          min-width: 50px !important;
          width: 8% !important;
        }
        
        .mat-column-order_dms {
          min-width: 120px !important;
          width: 20% !important;
        }
        
        .mat-column-year {
          min-width: 80px !important;
          width: 12% !important;
        }
        
        .mat-column-model {
          min-width: 120px !important;
          width: 18% !important;
        }
        
        .mat-column-version {
          min-width: 100px !important;
          width: 15% !important;
        }
        
        .mat-column-colorExterior {
          min-width: 120px !important;
          width: 15% !important;
        }
        
        .mat-column-colorInterior {
          min-width: 120px !important;
          width: 15% !important;
        }
      }
    }
  `]
})
export class OrderSelectionDialogComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
    'select',
    'order_dms',
    'year',
    'model',
    'version',
    'colorExterior',
    'colorInterior'
  ];

  selectedOrder: any = null;
  searchTerm: string = '';
  filteredOrders: any[] = [];
  paginatedOrders: any[] = [];
  pageSize: number = 5;
  currentPage: number = 0;
  loading: boolean = true;
  originalOrders: any[] = [];

  // Datos para los combos
  processes: any[] = [];
  costumerTypes: any[] = [];
  operationTypes: any[] = [];
  allConfigurations: any[] = []; // Todas las configuraciones habilitadas

  // Selecciones del usuario
  selectedProcess: any = null;
  selectedCostumerType: any = null;
  selectedOperationType: any = null;

  // Opciones filtradas disponibles
  availableCostumerTypes: any[] = [];
  availableOperationTypes: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<OrderSelectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { orders: any[], agencyId: number, ndCliente?: string },
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    console.log('🎯 OrderSelectionDialogComponent ngOnInit');
    console.log('📊 Datos recibidos en el diálogo:', this.data);
    console.log('📊 Cantidad de orders:', this.data.orders?.length || 0);
    console.log('📊 Agency ID:', this.data.agencyId);
    console.log('📊 Primer order (ejemplo):', this.data.orders?.[0]);
    
    this.originalOrders = [...this.data.orders];
    this.loading = true;
    
    // Cargar datos para los combos
    this.loadComboData();
    
    // Verificar pedidos existentes antes de mostrar la tabla
    this.checkExistingOrders();
  }

  private checkExistingOrders(): void {
    console.log('🔍 Verificando pedidos existentes en la tabla file...');
    
    // Obtener todos los pedidos existentes para la agencia
    let params = new HttpParams();
    params = params.set('agencyId', this.data.agencyId.toString());
    params = params.set('statusId', '1'); // ID para Integración
    params = params.set('ndCliente', this.data.ndCliente || '');

    this.http.get<any>(`${environment.apiBaseUrl}/api/files/by-agency`, { params })
      .subscribe({
        next: (response) => {
          console.log('📁 Files existentes encontrados:', response);
          
          let existingFiles: any[] = [];
          if (response && response.success && response.data && response.data.files) {
            existingFiles = response.data.files;
          }
          
          console.log('📊 Files existentes:', existingFiles.length);
          
          // Filtrar pedidos de Vanguardia que no existen en la tabla de file
          const newOrders = this.filterNewOrders(existingFiles);
          console.log('📊 Pedidos nuevos después del filtrado:', newOrders.length);
          
          this.filteredOrders = newOrders;
          this.loading = false;
          this.updatePaginatedOrders();
        },
        error: (error) => {
          console.error('❌ Error verificando pedidos existentes:', error);
          // Si hay error, mostrar todos los pedidos
          this.filteredOrders = [...this.originalOrders];
          this.loading = false;
          this.updatePaginatedOrders();
        }
      });
  }

  private filterNewOrders(existingFiles: any[]): any[] {
    // Crear un Set con los order_dms existentes para búsqueda rápida
    const existingOrderDms = new Set(
      existingFiles.map(file => file.order_dms?.toString().toLowerCase())
    );
    
    // Filtrar pedidos de Vanguardia que no existen en la tabla de file
    return this.originalOrders.filter(order => {
      const orderDms = (order.order_dms || order.orderDMS || order.numeroPedido || '').toString().toLowerCase();
      return !existingOrderDms.has(orderDms);
    });
  }

  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredOrders = [...this.originalOrders];
    } else {
      const searchLower = this.searchTerm.toLowerCase();
      this.filteredOrders = this.originalOrders.filter(order => {
        const orderDms = (order.order_dms || order.orderDMS || order.numeroPedido || '').toString().toLowerCase();
        return orderDms.includes(searchLower);
      });
    }
    this.currentPage = 0;
    this.updatePaginatedOrders();
  }

  updatePaginatedOrders(): void {
    console.log('🔄 Actualizando pedidos paginados...');
    console.log('📊 CurrentPage:', this.currentPage);
    console.log('📊 PageSize:', this.pageSize);
    console.log('📊 FilteredOrders length:', this.filteredOrders.length);
    
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    
    console.log('📊 StartIndex:', startIndex);
    console.log('📊 EndIndex:', endIndex);
    
    this.paginatedOrders = this.filteredOrders.slice(startIndex, endIndex);
    
    console.log('📊 PaginatedOrders result:', this.paginatedOrders.length);
    console.log('📊 PaginatedOrders data:', this.paginatedOrders);
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedOrders();
  }

  selectOrder(order: any): void {
    this.selectedOrder = order;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private loadComboData(): void {
    console.log('🔄 Cargando configuraciones habilitadas...');
    
    // Cargar configuraciones habilitadas filtradas por agencia
    const url = `${environment.apiBaseUrl}/api/configuration-process/enabled-by-agency/${this.data.agencyId}`;
    this.http.get<any>(url)
      .subscribe({
        next: (response) => {
          if (response && response.success && response.data) {
            this.processes = response.data.processes || [];
            this.costumerTypes = response.data.costumerTypes || [];
            this.operationTypes = response.data.operationTypes || [];
            this.allConfigurations = response.data.configurations || [];
            
            // Inicializar opciones disponibles
            this.availableCostumerTypes = [...this.costumerTypes];
            this.availableOperationTypes = [...this.operationTypes];
            
            console.log('✅ Configuraciones cargadas:');
            console.log('  - Procesos:', this.processes.length);
            console.log('  - Tipos de cliente:', this.costumerTypes.length);
            console.log('  - Tipos de operación:', this.operationTypes.length);
            console.log('  - Configuraciones totales:', this.allConfigurations.length);
          }
        },
        error: (error) => {
          console.error('❌ Error cargando configuraciones:', error);
          // Fallback: cargar datos individuales si falla el endpoint de configuraciones
          this.loadIndividualComboData();
        }
      });
  }

  private loadIndividualComboData(): void {
    console.log('🔄 Cargando datos individuales como fallback...');
    
    // Cargar procesos
    this.http.get<any>(`${environment.apiBaseUrl}/api/process?enabled=1`)
      .subscribe({
        next: (response) => {
          if (response && response.success && response.data) {
            this.processes = response.data.processes || response.data;
            console.log('✅ Procesos cargados:', this.processes.length);
          }
        },
        error: (error) => {
          console.error('❌ Error cargando procesos:', error);
        }
      });

    // Cargar tipos de cliente
    this.http.get<any>(`${environment.apiBaseUrl}/api/costumer-type?enabled=1`)
      .subscribe({
        next: (response) => {
          if (response && response.success && response.data) {
            this.costumerTypes = response.data.costumerTypes || response.data;
            console.log('✅ Tipos de cliente cargados:', this.costumerTypes.length);
          }
        },
        error: (error) => {
          console.error('❌ Error cargando tipos de cliente:', error);
        }
      });

    // Cargar tipos de operación
    this.http.get<any>(`${environment.apiBaseUrl}/api/operation-type?enabled=1`)
      .subscribe({
        next: (response) => {
          if (response && response.success && response.data) {
            this.operationTypes = response.data.operationTypes || response.data;
            console.log('✅ Tipos de operación cargados:', this.operationTypes.length);
          }
        },
        error: (error) => {
          console.error('❌ Error cargando tipos de operación:', error);
        }
      });
  }

  onProcessChange(): void {
    console.log('🔄 Proceso seleccionado:', this.selectedProcess);
    
    // Limpiar selecciones dependientes
    this.selectedCostumerType = null;
    this.selectedOperationType = null;
    
    // Filtrar tipos de cliente disponibles para este proceso
    this.filterCostumerTypesByProcess();
    
    // Resetear tipos de operación
    this.availableOperationTypes = [];
  }

  onCostumerTypeChange(): void {
    console.log('🔄 Tipo de cliente seleccionado:', this.selectedCostumerType);
    
    // Limpiar selección de operación
    this.selectedOperationType = null;
    
    // Filtrar tipos de operación disponibles para esta combinación proceso + tipo cliente
    this.filterOperationTypesByProcessAndCostumerType();
  }

  private filterCostumerTypesByProcess(): void {
    if (!this.selectedProcess) {
      this.availableCostumerTypes = [...this.costumerTypes];
      return;
    }

    // Buscar configuraciones que tengan este proceso
    const configurationsWithProcess = this.allConfigurations.filter(config => 
      config.IdProcess === this.selectedProcess.Id
    );

    // Extraer tipos de cliente únicos
    const costumerTypeIds = [...new Set(configurationsWithProcess.map(config => config.IdCostumerType))];
    
    // Filtrar tipos de cliente disponibles
    this.availableCostumerTypes = this.costumerTypes.filter(costumerType => 
      costumerTypeIds.includes(costumerType.Id)
    );

    console.log(`📋 Tipos de cliente disponibles para proceso "${this.selectedProcess.Name}":`, this.availableCostumerTypes.length);
  }

  private filterOperationTypesByProcessAndCostumerType(): void {
    if (!this.selectedProcess || !this.selectedCostumerType) {
      this.availableOperationTypes = [...this.operationTypes];
      return;
    }

    // Buscar configuraciones que tengan esta combinación proceso + tipo cliente
    const configurationsWithProcessAndCostumer = this.allConfigurations.filter(config => 
      config.IdProcess === this.selectedProcess.Id && 
      config.IdCostumerType === this.selectedCostumerType.Id
    );

    // Extraer tipos de operación únicos
    const operationTypeIds = [...new Set(configurationsWithProcessAndCostumer.map(config => config.IdOperationType))];
    
    // Filtrar tipos de operación disponibles
    this.availableOperationTypes = this.operationTypes.filter(operationType => 
      operationTypeIds.includes(operationType.Id)
    );

    console.log(`📋 Tipos de operación disponibles para "${this.selectedProcess.Name}" + "${this.selectedCostumerType.Name}":`, this.availableOperationTypes.length);
  }

  isFormValid(): boolean {
    return this.selectedOrder && 
           this.selectedProcess && 
           this.selectedCostumerType && 
           this.selectedOperationType &&
           this.isConfigurationValid();
  }

  isConfigurationValid(): boolean {
    if (!this.selectedProcess || !this.selectedCostumerType || !this.selectedOperationType) {
      return false;
    }

    // Verificar que esta combinación existe en las configuraciones habilitadas
    const validConfiguration = this.allConfigurations.find(config => 
      config.IdProcess === this.selectedProcess.Id &&
      config.IdCostumerType === this.selectedCostumerType.Id &&
      config.IdOperationType === this.selectedOperationType.Id
    );

    return !!validConfiguration;
  }

  onConfirm(): void {
    if (this.isFormValid()) {
      const fileData = {
        order: this.selectedOrder,
        process: this.selectedProcess,
        costumerType: this.selectedCostumerType,
        operationType: this.selectedOperationType
      };
      this.dialogRef.close(fileData);
    }
  }
}
