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
import { FormsModule } from '@angular/forms';

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
    FormsModule
  ],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title class="text-xl font-semibold mb-4">
        <mat-icon class="mr-2">receipt</mat-icon>
        Seleccionar Pedido
      </h2>
      
      <div mat-dialog-content class="mb-6 dialog-content">
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
          Se encontraron {{ filteredOrders.length }} pedidos disponibles. Selecciona uno:
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
            [disabled]="!selectedOrder"
            class="text-sm">
            <mat-icon class="mr-1" style="font-size: 16px;">add</mat-icon>
            Agregar Pedido Seleccionado
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
      width: calc(100% - 20px);
      height: calc(100% - 20px);
      margin: 10px;
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
      max-height: 70vh;
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
  pageSize: number = 10;
  currentPage: number = 0;

  constructor(
    public dialogRef: MatDialogRef<OrderSelectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { orders: any[] }
  ) {}

  ngOnInit(): void {
    console.log('🎯 OrderSelectionDialogComponent ngOnInit');
    console.log('📊 Datos recibidos en el diálogo:', this.data);
    console.log('📊 Cantidad de orders:', this.data.orders?.length || 0);
    console.log('📊 Primer order (ejemplo):', this.data.orders?.[0]);
    
    this.filteredOrders = [...this.data.orders];
    console.log('📊 FilteredOrders inicial:', this.filteredOrders.length);
    this.updatePaginatedOrders();
    console.log('📊 PaginatedOrders inicial:', this.paginatedOrders.length);
  }

  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredOrders = [...this.data.orders];
    } else {
      const searchLower = this.searchTerm.toLowerCase();
      this.filteredOrders = this.data.orders.filter(order => {
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

  onConfirm(): void {
    if (this.selectedOrder) {
      this.dialogRef.close([this.selectedOrder]);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
