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

            <!-- VIN Column -->
            <ng-container matColumnDef="vin">
              <th mat-header-cell *matHeaderCellDef>VIN</th>
              <td mat-cell *matCellDef="let order">
                <span *ngIf="order.vin || order.VIN || order.Vin; else noVin" class="order-info font-mono">
                  {{ order.vin || order.VIN || order.Vin }}
                </span>
                <ng-template #noVin>
                  <span class="text-gray-400 italic order-info">Sin VIN</span>
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

        <!-- Loading mientras se crea el expediente -->
        <div *ngIf="creating" class="mt-6 p-6 bg-blue-50 rounded-lg border border-blue-200 text-center">
          <mat-spinner diameter="40" class="mx-auto mb-4"></mat-spinner>
          <p class="text-blue-700 font-medium">Creando expediente...</p>
          <p class="text-sm text-blue-600 mt-2">Por favor espera mientras se crea el expediente y los documentos requeridos</p>
        </div>

        <!-- Configuración del Expediente (solo cuando hay pedido seleccionado) -->
        <div *ngIf="selectedOrder && !loading && !creating" class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 class="text-lg font-semibold text-blue-800 mb-4 flex items-center">
            <mat-icon class="mr-2">settings</mat-icon>
            Configuración del Expediente
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Proceso -->
            <div class="w-full flex items-start gap-2">
              <mat-form-field appearance="outline" class="flex-1">
                <mat-label>Proceso</mat-label>
                <mat-select [(ngModel)]="selectedProcess" (selectionChange)="onProcessChange()" [disabled]="creating || loadingProcesses" required>
                  <mat-option *ngIf="loadingProcesses" value="" disabled>
                    <mat-spinner diameter="16" class="inline mr-2"></mat-spinner>
                    Cargando procesos...
                  </mat-option>
                  <mat-option *ngIf="!loadingProcesses && processes.length === 0" value="" disabled>
                    No hay procesos disponibles
                  </mat-option>
                  <mat-option *ngFor="let process of processes" [value]="process">
                    {{ process.Name }}
                  </mat-option>
                </mat-select>
                <mat-icon matSuffix>business</mat-icon>
              </mat-form-field>
              <button
                mat-icon-button
                type="button"
                (click)="recargarProcesos()"
                [disabled]="loadingProcesses || creating"
                matTooltip="Recargar procesos"
                class="mt-1">
                <mat-icon [class.animate-spin]="loadingProcesses">refresh</mat-icon>
              </button>
            </div>

            <!-- Tipo de Cliente -->
            <div class="w-full flex items-start gap-2">
              <mat-form-field appearance="outline" class="flex-1">
                <mat-label>Tipo de Cliente</mat-label>
                <mat-select [(ngModel)]="selectedCostumerType" (selectionChange)="onCostumerTypeChange()" [disabled]="creating || loadingCostumerTypes" required>
                  <mat-option *ngIf="loadingCostumerTypes" value="" disabled>
                    <mat-spinner diameter="16" class="inline mr-2"></mat-spinner>
                    Cargando tipos de cliente...
                  </mat-option>
                  <mat-option *ngIf="!loadingCostumerTypes && availableCostumerTypes.length === 0" value="" disabled>
                    No hay tipos de cliente disponibles
                  </mat-option>
                  <mat-option *ngFor="let costumerType of availableCostumerTypes" [value]="costumerType">
                    {{ costumerType.Name }}
                  </mat-option>
                </mat-select>
                <mat-icon matSuffix>person</mat-icon>
              </mat-form-field>
              <button
                mat-icon-button
                type="button"
                (click)="recargarTiposCliente()"
                [disabled]="loadingCostumerTypes || creating"
                matTooltip="Recargar tipos de cliente"
                class="mt-1">
                <mat-icon [class.animate-spin]="loadingCostumerTypes">refresh</mat-icon>
              </button>
            </div>

            <!-- Tipo de Operación -->
            <div class="w-full flex items-start gap-2">
              <mat-form-field appearance="outline" class="flex-1">
                <mat-label>Tipo de Operación</mat-label>
                <mat-select [(ngModel)]="selectedOperationType" [disabled]="creating || loadingOperationTypes" required>
                  <mat-option *ngIf="loadingOperationTypes" value="" disabled>
                    <mat-spinner diameter="16" class="inline mr-2"></mat-spinner>
                    Cargando tipos de operación...
                  </mat-option>
                  <mat-option *ngIf="!loadingOperationTypes && availableOperationTypes.length === 0" value="" disabled>
                    No hay tipos de operación disponibles
                  </mat-option>
                  <mat-option *ngFor="let operationType of availableOperationTypes" [value]="operationType">
                    {{ operationType.Name }}
                  </mat-option>
                </mat-select>
                <mat-icon matSuffix>build</mat-icon>
              </mat-form-field>
              <button
                mat-icon-button
                type="button"
                (click)="recargarTiposOperacion()"
                [disabled]="loadingOperationTypes || creating"
                matTooltip="Recargar tipos de operación"
                class="mt-1">
                <mat-icon [class.animate-spin]="loadingOperationTypes">refresh</mat-icon>
              </button>
            </div>
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
          <button mat-button (click)="onCancel()" [disabled]="creating" class="text-sm">
            <mat-icon class="mr-1" style="font-size: 16px;">close</mat-icon>
            Cancelar
          </button>
          <button 
            mat-raised-button 
            color="primary" 
            (click)="onConfirm()" 
            [disabled]="!isFormValid() || creating"
            class="text-sm">
            <mat-spinner *ngIf="creating" diameter="16" style="display: inline-block; margin-right: 8px;"></mat-spinner>
            <mat-icon *ngIf="!creating" class="mr-1" style="font-size: 16px;">add</mat-icon>
            {{ creating ? 'Creando...' : 'Crear Expediente' }}
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
        
        .mat-column-vin {
          min-width: 150px !important;
          width: 18% !important;
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
    'vin',
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
  creating: boolean = false; // Estado de loading mientras se crea el expediente
  originalOrders: any[] = [];

  // Datos para los combos
  processes: any[] = [];
  costumerTypes: any[] = [];
  operationTypes: any[] = [];
  allConfigurations: any[] = []; // Todas las configuraciones habilitadas

  // Estados de carga
  loadingProcesses = false;
  loadingCostumerTypes = false;
  loadingOperationTypes = false;

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

    
    
    this.originalOrders = [...this.data.orders];
    this.loading = true;
    
    // Cargar datos para los combos
    this.loadComboData();
    
    // Verificar pedidos existentes antes de mostrar la tabla
    this.checkExistingOrders();
  }

  private checkExistingOrders(): void {

    // Obtener todos los pedidos existentes para la agencia
    let params = new HttpParams();
    params = params.set('agencyId', this.data.agencyId.toString());
    params = params.set('statusId', '1'); // ID para Integración
    params = params.set('ndCliente', this.data.ndCliente || '');

    this.http.get<any>(`${environment.apiBaseUrl}/api/files/by-agency-client`, { params })
      .subscribe({
        next: (response) => {

          let existingFiles: any[] = [];
          if (response && response.success && response.data && response.data.files) {
            existingFiles = response.data.files;
          }

          // Filtrar pedidos de Vanguardia que no existen en la tabla de file y eliminar duplicados
          const newOrders = this.filterNewOrders(existingFiles);

          this.filteredOrders = newOrders;
          this.loading = false;
          this.updatePaginatedOrders();
        },
        error: (error) => {

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
      existingFiles.map(file => {
        const orderDms = file.order_dms || file.numeroPedido || '';
        return orderDms?.toString().toLowerCase();
      }).filter(Boolean)
    );
    
    // Filtrar pedidos de Vanguardia que no existen en la tabla de file
    const newOrders = this.originalOrders.filter(order => {
      const orderDms = (order.order_dms || order.orderDMS || order.numeroPedido || '').toString().toLowerCase();
      return orderDms && !existingOrderDms.has(orderDms);
    });
    
    // Eliminar duplicados basándose en order_dms (o order_dms + vin si ambos están presentes)
    // Si hay múltiples pedidos con el mismo order_dms, mantener solo el primero
    const seenOrders = new Map<string, any>();
    const deduplicatedOrders: any[] = [];
    
    for (const order of newOrders) {
      const orderDms = (order.order_dms || order.orderDMS || order.numeroPedido || '').toString().toLowerCase();
      const vin = (order.vin || order.VIN || order.Vin || '').toString().toLowerCase();
      
      // Crear una clave única: order_dms + vin (si ambos existen) o solo order_dms
      const uniqueKey = orderDms && vin ? `${orderDms}_${vin}` : orderDms;
      
      if (uniqueKey && !seenOrders.has(uniqueKey)) {
        seenOrders.set(uniqueKey, order);
        deduplicatedOrders.push(order);
      }
    }

    return deduplicatedOrders;
  }

  applyFilter(): void {
    // Obtener los pedidos base (ya deduplicados desde filterNewOrders)
    const baseOrders = this.filteredOrders.length > 0 ? this.filteredOrders : this.originalOrders;
    
    let filtered: any[];
    
    if (!this.searchTerm.trim()) {
      // Si no hay término de búsqueda, mostrar todos los pedidos ya filtrados y deduplicados
      filtered = baseOrders;
    } else {
      // Aplicar filtro de búsqueda
      const searchLower = this.searchTerm.toLowerCase();
      filtered = baseOrders.filter(order => {
        const orderDms = (order.order_dms || order.orderDMS || order.numeroPedido || '').toString().toLowerCase();
        const vin = (order.vin || order.VIN || order.Vin || '').toString().toLowerCase();
        const model = (order.model || order.Model || '').toString().toLowerCase();
        return orderDms.includes(searchLower) || vin.includes(searchLower) || model.includes(searchLower);
      });
      
      // Asegurar que no hay duplicados después del filtro de búsqueda
      const seenOrders = new Map<string, any>();
      const deduplicated: any[] = [];
      
      for (const order of filtered) {
        const orderDms = (order.order_dms || order.orderDMS || order.numeroPedido || '').toString().toLowerCase();
        const vin = (order.vin || order.VIN || order.Vin || '').toString().toLowerCase();
        const uniqueKey = orderDms && vin ? `${orderDms}_${vin}` : orderDms;
        
        if (uniqueKey && !seenOrders.has(uniqueKey)) {
          seenOrders.set(uniqueKey, order);
          deduplicated.push(order);
        }
      }
      
      filtered = deduplicated;
    }
    
    // Actualizar paginación con los resultados filtrados
    this.currentPage = 0;
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedOrders = filtered.slice(startIndex, endIndex);
  }

  updatePaginatedOrders(): void {

    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    this.paginatedOrders = this.filteredOrders.slice(startIndex, endIndex);

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
    // No permitir cerrar el diálogo mientras se está creando el expediente
    if (this.creating) {
      return;
    }
    this.dialogRef.close();
  }

  private loadComboData(): void {

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
            
            // Resetear estados de carga
            this.loadingProcesses = false;
            this.loadingCostumerTypes = false;
            this.loadingOperationTypes = false;

          }
        },
        error: (error) => {

          // Fallback: cargar datos individuales si falla el endpoint de configuraciones
          this.loadIndividualComboData();
        }
      });
  }

  private loadIndividualComboData(): void {

    this.loadProcesses();
    this.loadCostumerTypes();
    this.loadOperationTypes();
  }

  recargarProcesos(): void {
    this.loadProcesses();
  }

  recargarTiposCliente(): void {
    this.loadCostumerTypes();
  }

  recargarTiposOperacion(): void {
    this.loadOperationTypes();
  }

  private loadProcesses(): void {
    this.loadingProcesses = true;
    this.http.get<any>(`${environment.apiBaseUrl}/api/process?enabled=1`)
      .subscribe({
        next: (response) => {
          if (response && response.success && response.data) {
            this.processes = response.data.processes || response.data;

            // Si había un proceso seleccionado, intentar mantenerlo
            if (this.selectedProcess && this.processes.length > 0) {
              const found = this.processes.find(p => p.Id === this.selectedProcess.Id);
              if (!found) {
                this.selectedProcess = null;
                this.onProcessChange();
              }
            }
          }
          this.loadingProcesses = false;
        },
        error: (error) => {

          this.loadingProcesses = false;
        }
      });
  }

  private loadCostumerTypes(): void {
    this.loadingCostumerTypes = true;
    this.http.get<any>(`${environment.apiBaseUrl}/api/costumer-type?enabled=1`)
      .subscribe({
        next: (response) => {
          if (response && response.success && response.data) {
            this.costumerTypes = response.data.costumerTypes || response.data;

            // Re-filtrar tipos de cliente disponibles si hay un proceso seleccionado
            if (this.selectedProcess) {
              this.filterCostumerTypesByProcess();
            } else {
              this.availableCostumerTypes = [...this.costumerTypes];
            }
            // Si había un tipo de cliente seleccionado, intentar mantenerlo
            if (this.selectedCostumerType && this.availableCostumerTypes.length > 0) {
              const found = this.availableCostumerTypes.find(ct => ct.Id === this.selectedCostumerType.Id);
              if (!found) {
                this.selectedCostumerType = null;
                this.onCostumerTypeChange();
              }
            }
          }
          this.loadingCostumerTypes = false;
        },
        error: (error) => {

          this.loadingCostumerTypes = false;
        }
      });
  }

  private loadOperationTypes(): void {
    this.loadingOperationTypes = true;
    this.http.get<any>(`${environment.apiBaseUrl}/api/operation-type?enabled=1`)
      .subscribe({
        next: (response) => {
          if (response && response.success && response.data) {
            this.operationTypes = response.data.operationTypes || response.data;

            // Re-filtrar tipos de operación disponibles si hay proceso y tipo de cliente seleccionados
            if (this.selectedProcess && this.selectedCostumerType) {
              this.filterOperationTypesByProcessAndCostumerType();
            } else {
              this.availableOperationTypes = [...this.operationTypes];
            }
            // Si había un tipo de operación seleccionado, intentar mantenerlo
            if (this.selectedOperationType && this.availableOperationTypes.length > 0) {
              const found = this.availableOperationTypes.find(ot => ot.Id === this.selectedOperationType.Id);
              if (!found) {
                this.selectedOperationType = null;
              }
            }
          }
          this.loadingOperationTypes = false;
        },
        error: (error) => {

          this.loadingOperationTypes = false;
        }
      });
  }

  onProcessChange(): void {

    // Limpiar selecciones dependientes
    this.selectedCostumerType = null;
    this.selectedOperationType = null;
    
    // Filtrar tipos de cliente disponibles para este proceso
    this.filterCostumerTypesByProcess();
    
    // Resetear tipos de operación
    this.availableOperationTypes = [];
  }

  onCostumerTypeChange(): void {

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
      this.createFileFromVanguardia();
    }
  }

  private createFileFromVanguardia(): void {

    // Activar estado de loading
    this.creating = true;
    
    const requestData = {
      order: this.selectedOrder,
      process: this.selectedProcess,
      costumerType: this.selectedCostumerType,
      operationType: this.selectedOperationType,
      clientId: this.data.ndCliente, // ID del cliente
      agencyId: this.data.agencyId   // ID de la agencia
    };

    this.http.post<any>(`${environment.apiBaseUrl}/api/files/create-from-vanguardia-new`, requestData)
      .subscribe({
        next: (response) => {
          this.creating = false; // Desactivar loading
          
          if (response && response.success) {

            this.dialogRef.close({
              success: true,
              fileId: response.data.fileId,
              documentsCreated: response.data.documentsCreated,
              message: response.message
            });
          } else {

            this.dialogRef.close({
              success: false,
              message: response.message || 'Error al crear el expediente'
            });
          }
        },
        error: (error) => {
          this.creating = false; // Desactivar loading en caso de error

          this.dialogRef.close({
            success: false,
            message: error.error?.message || 'Error de conexión al crear el expediente'
          });
        }
      });
  }
}
