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
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';

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
    MatTabsModule,
    MatTooltipModule,
    MatSnackBarModule,
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

        <!-- Contenido principal con tabs -->
        <div *ngIf="!loading">
          <mat-tab-group [(selectedIndex)]="selectedTabIndex" (selectedIndexChange)="onTabChange($event)" class="order-tabs">
            <!-- Tab de Pedidos Nuevos -->
            <mat-tab label="Pedidos Nuevos">
              <ng-template mat-tab-label>
                <mat-icon class="mr-2">add_circle</mat-icon>
                Pedidos Nuevos ({{ filteredOrders.length }})
              </ng-template>
              
              <div class="tab-content">
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
                  <span class="font-medium">{{ order.order_dms || 'N/A' }}</span>
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

            <!-- Monto Column -->
            <ng-container matColumnDef="monto">
              <th mat-header-cell *matHeaderCellDef class="text-right">Monto</th>
              <td mat-cell *matCellDef="let order" class="text-right">
                <span *ngIf="getOrderMonto(order); else noMonto" class="order-info font-medium">
                  {{ formatMonto(getOrderMonto(order)) }}
                </span>
                <ng-template #noMonto>
                  <span class="text-gray-400 italic order-info">-</span>
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
                <div *ngIf="filteredOrders.length === 0" class="text-center py-8">
                  <mat-icon class="text-gray-400 mb-2" style="font-size: 40px;">check_circle</mat-icon>
                  <p class="text-gray-500">Todos los pedidos del Grupo ya existen en el sistema</p>
                  <p class="text-sm text-gray-400 mt-2">No hay pedidos nuevos para agregar</p>
                </div>
              </div>
            </mat-tab>

            <!-- Tab de Pedidos Existentes (solo si hay alguno) -->
            <mat-tab *ngIf="existingOrders.length > 0" label="Pedidos Existentes">
              <ng-template mat-tab-label>
                <mat-icon class="mr-2">info</mat-icon>
                Pedidos Existentes ({{ existingOrders.length }})
              </ng-template>
              
              <div class="tab-content">
                <!-- Buscador para existentes -->
                <div class="mb-4">
                  <mat-form-field appearance="outline" class="w-full">
                    <mat-label>Buscar por número de orden</mat-label>
                    <input 
                      matInput 
                      [(ngModel)]="existingSearchTerm"
                      (input)="applyExistingFilter()"
                      placeholder="Ingresa el número de orden para buscar"
                      autocomplete="off">
                    <mat-icon matSuffix>search</mat-icon>
                  </mat-form-field>
                </div>
                
                <div class="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div class="flex items-start">
                    <mat-icon class="text-yellow-600 mr-2 mt-1">warning</mat-icon>
                    <div>
                      <p class="text-yellow-800 font-medium text-sm">Pedidos ya registrados en el sistema</p>
                      <p class="text-yellow-700 text-xs mt-1">
                        Estos pedidos ya están dados de alta pero pueden no aparecer en el listado 
                        si fueron creados con una relación de cliente incorrecta.
                      </p>
                    </div>
                  </div>
                </div>
                
                <p class="text-gray-600 mb-4 order-info">
                  Se encontraron {{ filteredExistingOrders.length }} pedidos existentes:
                </p>
              
                <div class="overflow-x-auto table-container">
                  <table mat-table [dataSource]="paginatedExistingOrders" class="w-full">
                    <!-- Order DMS Column -->
                    <ng-container matColumnDef="order_dms">
                      <th mat-header-cell *matHeaderCellDef>Order DMS</th>
                      <td mat-cell *matCellDef="let order">
                        <div class="flex items-center order-info">
                          <mat-icon class="mr-1 text-orange-600" style="font-size: 14px;">receipt</mat-icon>
                          <span class="font-medium">{{ order.order_dms || order.order?.order_dms || 'N/A' }}</span>
                        </div>
                      </td>
                    </ng-container>

                    <!-- Year Column -->
                    <ng-container matColumnDef="year">
                      <th mat-header-cell *matHeaderCellDef>Año</th>
                      <td mat-cell *matCellDef="let order">
                        <span *ngIf="order.order?.year; else noYear" class="order-info">{{ order.order.year }}</span>
                        <ng-template #noYear>
                          <span class="text-gray-400 italic order-info">-</span>
                        </ng-template>
                      </td>
                    </ng-container>

                    <!-- VIN Column -->
                    <ng-container matColumnDef="vin">
                      <th mat-header-cell *matHeaderCellDef>VIN</th>
                      <td mat-cell *matCellDef="let order">
                        <span *ngIf="order.order?.vin || order.order?.VIN || order.order?.Vin; else noVin" class="order-info font-mono">
                          {{ order.order.vin || order.order.VIN || order.order.Vin }}
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
                        <span *ngIf="order.order?.model; else noModel" class="order-info">{{ order.order.model }}</span>
                        <ng-template #noModel>
                          <span class="text-gray-400 italic order-info">Sin modelo</span>
                        </ng-template>
                      </td>
                    </ng-container>

                    <!-- Version Column -->
                    <ng-container matColumnDef="version">
                      <th mat-header-cell *matHeaderCellDef>Versión</th>
                      <td mat-cell *matCellDef="let order">
                        <span *ngIf="order.order?.version; else noVersion" class="order-info">{{ order.order.version }}</span>
                        <ng-template #noVersion>
                          <span class="text-gray-400 italic order-info">Sin versión</span>
                        </ng-template>
                      </td>
                    </ng-container>

                    <!-- Monto Column -->
                    <ng-container matColumnDef="monto">
                      <th mat-header-cell *matHeaderCellDef class="text-right">Monto</th>
                      <td mat-cell *matCellDef="let order" class="text-right">
                        <span *ngIf="getOrderMonto(order, true); else noMontoExisting" class="order-info font-medium">
                          {{ formatMonto(getOrderMonto(order, true)) }}
                        </span>
                        <ng-template #noMontoExisting>
                          <span class="text-gray-400 italic order-info">-</span>
                        </ng-template>
                      </td>
                    </ng-container>

                    <!-- File ID Column -->
                    <ng-container matColumnDef="fileId">
                      <th mat-header-cell *matHeaderCellDef>IdFile</th>
                      <td mat-cell *matCellDef="let order">
                        <span class="order-info font-mono text-blue-600">{{ order.fileId || 'N/A' }}</span>
                      </td>
                    </ng-container>

                    <!-- Acciones Column -->
                    <ng-container matColumnDef="actions">
                      <th mat-header-cell *matHeaderCellDef>Acciones</th>
                      <td mat-cell *matCellDef="let order">
                        <button 
                          mat-icon-button 
                          color="primary"
                          (click)="repairRelation(order)"
                          [disabled]="repairingFileId === order.fileId"
                          [matTooltip]="'Reparar relación de cliente (asigna el cliente del No Cliente y agencia seleccionados a este expediente)'"
                          class="repair-btn">
                          <mat-icon *ngIf="repairingFileId !== order.fileId">build_circle</mat-icon>
                          <mat-spinner *ngIf="repairingFileId === order.fileId" diameter="20" class="inline-block"></mat-spinner>
                        </button>
                      </td>
                    </ng-container>

                    <tr mat-header-row *matHeaderRowDef="existingDisplayedColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: existingDisplayedColumns;" 
                        class="hover:bg-gray-50">
                    </tr>
                  </table>
                  
                  <!-- Paginación para existentes -->
                  <mat-paginator 
                    [length]="filteredExistingOrders.length"
                    [pageSize]="existingPageSize"
                    [pageSizeOptions]="[5, 10, 20, 50]"
                    (page)="onExistingPageChange($event)"
                    showFirstLastButtons>
                  </mat-paginator>
                </div>

                <!-- Sin pedidos existentes -->
                <div *ngIf="filteredExistingOrders.length === 0" class="text-center py-8">
                  <mat-icon class="text-gray-400 mb-2" style="font-size: 40px;">check_circle</mat-icon>
                  <p class="text-gray-500">No hay pedidos existentes para mostrar</p>
                </div>
              </div>
            </mat-tab>
          </mat-tab-group>
        </div>

        <!-- Loading mientras se crea el expediente -->
        <div *ngIf="creating" class="mt-6 p-6 bg-blue-50 rounded-lg border border-blue-200 text-center">
          <mat-spinner diameter="40" class="mx-auto mb-4"></mat-spinner>
          <p class="text-blue-700 font-medium">Creando expediente...</p>
          <p class="text-sm text-blue-600 mt-2">Por favor espera mientras se crea el expediente y los documentos requeridos</p>
        </div>

        <!-- Configuración del Expediente (solo cuando hay pedido seleccionado y está en tab de nuevos) -->
        <div *ngIf="selectedOrder && !loading && !creating && selectedTabIndex === 0" class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
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
                matTooltip="Cargar procesos"
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
                matTooltip="Cargar tipos de cliente"
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
                matTooltip="Cargar tipos de operación"
                class="mt-1">
                <mat-icon [class.animate-spin]="loadingOperationTypes">refresh</mat-icon>
              </button>
            </div>
          </div>

          <!-- Resumen de selección -->
          <div class="mt-4 p-3 bg-white rounded border">
            <h4 class="font-medium text-gray-700 mb-2">Resumen de configuración:</h4>
            <div class="text-sm text-gray-600 space-y-1">
              <p><strong>Pedido:</strong> {{ selectedOrder.order_dms }}</p>
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
  styleUrls: ['./order-selection-dialog.component.scss']
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
    'colorInterior',
    'monto'
  ];

  get existingDisplayedColumns(): string[] {
    const base = ['order_dms', 'year', 'vin', 'model', 'version', 'monto', 'actions'];
    return this.isAdmin ? ['fileId', ...base] : base;
  }

  get isAdmin(): boolean {
    const user = this.authService.getCurrentUser();
    return user ? (String(user.role_id) === '7' || String(user.role_id) === '8') : false;
  }

  repairingFileId: number | string | null = null;

  selectedOrder: any = null;
  searchTerm: string = '';
  filteredOrders: any[] = [];
  paginatedOrders: any[] = [];
  pageSize: number = 5;
  currentPage: number = 0;
  loading: boolean = true;
  creating: boolean = false; // Estado de loading mientras se crea el expediente
  originalOrders: any[] = [];
  
  // Para pedidos existentes
  existingOrders: any[] = [];
  existingSearchTerm: string = '';
  filteredExistingOrders: any[] = [];
  paginatedExistingOrders: any[] = [];
  existingPageSize: number = 5;
  existingCurrentPage: number = 0;
  selectedTabIndex: number = 0; // 0 = Nuevos, 1 = Existentes

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
    @Inject(MAT_DIALOG_DATA) public data: { 
      orders: any[], 
      agencyId: number, 
      ndCliente?: string,
      existingOrders?: any[] // Pedidos existentes que se pasan desde el componente padre
    },
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.originalOrders = [...this.data.orders];
    this.loading = true;
    
    // Inicializar pedidos existentes si se pasaron desde el componente padre
    if (this.data.existingOrders && this.data.existingOrders.length > 0) {
      this.existingOrders = this.data.existingOrders;
      this.filteredExistingOrders = [...this.existingOrders];
      this.updatePaginatedExistingOrders();
    }
    
    // Cargar datos para los combos
    this.loadComboData();
    
    // Verificar pedidos existentes antes de mostrar la tabla
    this.checkExistingOrders();
  }

  private checkExistingOrders(): void {
    // Si ya se pasaron pedidos existentes desde el componente padre, usarlos
    if (this.data.existingOrders && this.data.existingOrders.length > 0) {
      this.existingOrders = this.data.existingOrders;
      this.filteredExistingOrders = [...this.existingOrders];
      this.updatePaginatedExistingOrders();
    }

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
          
          // Si no se pasaron pedidos existentes desde el padre, pero hay pedidos que ya existen,
          // verificar usando el endpoint de check-existing-orders
          if (!this.data.existingOrders || this.data.existingOrders.length === 0) {
            this.loadExistingOrdersFromCheck();
          }
        },
        error: (error) => {

          // Si hay error, mostrar todos los pedidos
          this.filteredOrders = [...this.originalOrders];
          this.loading = false;
          this.updatePaginatedOrders();
        }
      });
  }

  private loadExistingOrdersFromCheck(): void {
    // Llamar al endpoint que verifica pedidos existentes (con ndCliente para filtrar solo los de relación incorrecta)
    const requestData = {
      orders: this.originalOrders,
      agencyId: this.data.agencyId,
      ndCliente: this.data.ndCliente ?? undefined
    };

    this.http.post<any>(`${environment.apiBaseUrl}/api/files/check-existing-orders`, requestData)
      .subscribe({
        next: (response) => {
          if (response.success && response.data && response.data.existingOrders) {
            this.existingOrders = response.data.existingOrders;
            this.filteredExistingOrders = [...this.existingOrders];
            this.updatePaginatedExistingOrders();
          }
        },
        error: (error) => {
          // Si falla, simplemente no mostrar pedidos existentes
        }
      });
  }

  private filterNewOrders(existingFiles: any[]): any[] {
    // Crear un Set con los order_dms existentes para búsqueda rápida
    const existingOrderDms = new Set(
      existingFiles.map(file => {
        const orderDms = file.order_dms ?? '';
        return orderDms?.toString().toLowerCase();
      }).filter(Boolean)
    );
    
    // Filtrar pedidos de Vanguardia que no existen en la tabla de file
    const newOrders = this.originalOrders.filter(order => {
      const orderDms = (order.order_dms || '').toString().toLowerCase();
      return orderDms && !existingOrderDms.has(orderDms);
    });
    
    // Eliminar duplicados basándose en order_dms (o order_dms + vin si ambos están presentes)
    // Si hay múltiples pedidos con el mismo order_dms, mantener solo el primero
    const seenOrders = new Map<string, any>();
    const deduplicatedOrders: any[] = [];
    
    for (const order of newOrders) {
      const orderDms = (order.order_dms || '').toString().toLowerCase();
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
        const orderDms = (order.order_dms || '').toString().toLowerCase();
        const vin = (order.vin || order.VIN || order.Vin || '').toString().toLowerCase();
        const model = (order.model || order.Model || '').toString().toLowerCase();
        return orderDms.includes(searchLower) || vin.includes(searchLower) || model.includes(searchLower);
      });
      
      // Asegurar que no hay duplicados después del filtro de búsqueda
      const seenOrders = new Map<string, any>();
      const deduplicated: any[] = [];
      
      for (const order of filtered) {
        const orderDms = (order.order_dms || '').toString().toLowerCase();
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

  // Métodos para pedidos existentes
  applyExistingFilter(): void {
    if (!this.existingSearchTerm.trim()) {
      this.filteredExistingOrders = [...this.existingOrders];
    } else {
      const searchLower = this.existingSearchTerm.toLowerCase();
      this.filteredExistingOrders = this.existingOrders.filter(existing => {
        const orderDms = (existing.order_dms || existing.order?.order_dms || '').toString().toLowerCase();
        const vin = (existing.order?.vin || existing.order?.VIN || existing.order?.Vin || '').toString().toLowerCase();
        const model = (existing.order?.model || existing.order?.Model || '').toString().toLowerCase();
        const fileId = (existing.fileId || '').toString().toLowerCase();
        return orderDms.includes(searchLower) || vin.includes(searchLower) || model.includes(searchLower) || fileId.includes(searchLower);
      });
    }
    
    this.existingCurrentPage = 0;
    this.updatePaginatedExistingOrders();
  }

  updatePaginatedExistingOrders(): void {
    const startIndex = this.existingCurrentPage * this.existingPageSize;
    const endIndex = startIndex + this.existingPageSize;
    this.paginatedExistingOrders = this.filteredExistingOrders.slice(startIndex, endIndex);
  }

  onExistingPageChange(event: any): void {
    this.existingCurrentPage = event.pageIndex;
    this.existingPageSize = event.pageSize;
    this.updatePaginatedExistingOrders();
  }

  /**
   * Reparar relación de cliente del expediente.
   * Usa view_client_relations (ndCliente, idAgency) para obtener idCliente
   * y actualiza File.IdClient donde File.Id = idExpediente.
   */
  repairRelation(existingOrder: { fileId: number | string; order_dms?: string; order?: any }): void {
    const ndDMS = this.data.ndCliente;
    const idAgency = this.data.agencyId;
    const idExpediente = existingOrder.fileId;

    if (!ndDMS || ndDMS === '') {
      this.snackBar.open('No hay No Cliente seleccionado. Debe buscar y seleccionar un cliente antes de reparar la relación.', 'Cerrar', { duration: 5000 });
      return;
    }
    if (!idAgency) {
      this.snackBar.open('No hay agencia seleccionada.', 'Cerrar', { duration: 3000 });
      return;
    }
    if (!idExpediente) {
      this.snackBar.open('ID de expediente no disponible.', 'Cerrar', { duration: 3000 });
      return;
    }

    this.repairingFileId = idExpediente;

    const body = {
      ndDMS: String(ndDMS).trim(),
      idAgency: Number(idAgency),
      idExpediente: Number(idExpediente)
    };

    this.http.post<any>(`${environment.apiBaseUrl}/api/files/repair-client-relation`, body).subscribe({
      next: (response) => {
        this.repairingFileId = null;
        if (response?.success) {
          this.snackBar.open('Relación de cliente reparada correctamente. El pedido debería aparecer en el listado del cliente.', 'Cerrar', { duration: 5000 });
          this.dialogRef.close({ repaired: true, fileId: idExpediente, message: response.message });
        } else {
          this.snackBar.open(response?.message || 'Error al reparar relación', 'Cerrar', { duration: 5000 });
        }
      },
      error: (err) => {
        this.repairingFileId = null;
        const msg = err?.error?.message || err?.message || 'Error de conexión al reparar relación';
        this.snackBar.open(msg, 'Cerrar', { duration: 6000 });
      }
    });
  }

  selectOrder(order: any): void {
    this.selectedOrder = order;
  }

  onTabChange(index: number): void {
    this.selectedTabIndex = index;
    // Si se cambia al tab de existentes, limpiar la selección del pedido
    if (index === 1) {
      this.selectedOrder = null;
    }
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
            this.processes = Array.isArray(response.data.processes) ? response.data.processes : [];
            this.costumerTypes = Array.isArray(response.data.costumerTypes) ? response.data.costumerTypes : (Array.isArray(response.data.customerTypes) ? response.data.customerTypes : []);
            this.operationTypes = Array.isArray(response.data.operationTypes) ? response.data.operationTypes : [];
            this.allConfigurations = Array.isArray(response.data.configurations) ? response.data.configurations : [];
            
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
          // Asegurar arrays vacíos para evitar "not iterable"
          this.processes = [];
          this.costumerTypes = [];
          this.operationTypes = [];
          this.allConfigurations = [];
          this.availableCostumerTypes = [];
          this.availableOperationTypes = [];
          this.loadingProcesses = false;
          this.loadingCostumerTypes = false;
          this.loadingOperationTypes = false;
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
            const raw = response.data.costumerTypes ?? response.data;
            this.costumerTypes = Array.isArray(raw) ? raw : [];

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
            const raw = response.data.operationTypes ?? response.data;
            this.operationTypes = Array.isArray(raw) ? raw : [];

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
    const types = Array.isArray(this.costumerTypes) ? this.costumerTypes : [];
    if (!this.selectedProcess) {
      this.availableCostumerTypes = [...types];
      return;
    }

    const configs = Array.isArray(this.allConfigurations) ? this.allConfigurations : [];
    const configurationsWithProcess = configs.filter(config => 
      (config.IdProcess ?? config.id_process) === (this.selectedProcess?.Id ?? this.selectedProcess?.id)
    );

    const costumerTypeIds = [...new Set(configurationsWithProcess.map(config => config.IdCostumerType ?? config.id_customer_type))];
    
    this.availableCostumerTypes = types.filter(ct => 
      costumerTypeIds.includes(ct.Id ?? ct.id)
    );
  }

  private filterOperationTypesByProcessAndCostumerType(): void {
    const types = Array.isArray(this.operationTypes) ? this.operationTypes : [];
    if (!this.selectedProcess || !this.selectedCostumerType) {
      this.availableOperationTypes = [...types];
      return;
    }

    const configs = Array.isArray(this.allConfigurations) ? this.allConfigurations : [];
    const configurationsWithProcessAndCostumer = configs.filter(config => 
      (config.IdProcess ?? config.id_process) === (this.selectedProcess?.Id ?? this.selectedProcess?.id) && 
      (config.IdCostumerType ?? config.id_customer_type) === (this.selectedCostumerType?.Id ?? this.selectedCostumerType?.id)
    );

    const operationTypeIds = [...new Set(configurationsWithProcessAndCostumer.map(config => config.IdOperationType ?? config.id_operation_type))];
    
    this.availableOperationTypes = types.filter(ot => 
      operationTypeIds.includes(ot.Id ?? ot.id)
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
      customerType: this.selectedCostumerType,
      operationType: this.selectedOperationType,
      clientId: this.data.ndCliente,
      agencyId: this.data.agencyId
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

  getOrderMonto(order: any, isExisting = false): number | string | null {
    if (!order) return null;
    if (isExisting) {
      const o = order.order ?? order;
      const val = o?.amount ?? o?.monto ?? o?.Amount ?? o?.Monto ?? order.amount ?? order.monto;
      return val != null && val !== '' ? val : null;
    }
    const val = order.amount ?? order.monto ?? order.Amount ?? order.Monto
      ?? order.vanguardiaData?.amount ?? order.vanguardiaData?.monto;
    return val != null && val !== '' ? val : null;
  }

  formatMonto(value: number | string | null): string {
    if (value == null || value === '') return '-';
    const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : Number(value);
    if (isNaN(num)) return String(value);
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  }
}
