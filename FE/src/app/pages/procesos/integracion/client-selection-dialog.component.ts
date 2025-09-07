import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-client-selection-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule
  ],
              template: `
                <div class="dialog-container">
                  <h2 mat-dialog-title class="text-xl font-semibold mb-4">
                    <mat-icon class="mr-2">people</mat-icon>
                    Seleccionar Cliente
                  </h2>
                  
                  <div mat-dialog-content class="mb-6 dialog-content">
                    <p class="text-gray-600 mb-4 client-info">
                      Se encontraron {{ data.clients.length }} clientes. Selecciona uno de la lista:
                    </p>
                    
                    <div class="overflow-x-auto table-container">
                      <table mat-table [dataSource]="data.clients" class="w-full">
            <!-- Número de Cliente Column -->
            <ng-container matColumnDef="ndCliente">
              <th mat-header-cell *matHeaderCellDef>N° Cliente</th>
              <td mat-cell *matCellDef="let client">
                <div class="flex items-center client-info">
                  <mat-icon class="mr-1 text-blue-600" style="font-size: 14px;">fingerprint</mat-icon>
                  <span class="font-medium">{{ client.ndCliente }}</span>
                </div>
              </td>
            </ng-container>

            <!-- Nombre Cliente Column -->
            <ng-container matColumnDef="cliente">
              <th mat-header-cell *matHeaderCellDef>Cliente</th>
              <td mat-cell *matCellDef="let client">
                <div class="client-info">
                  <div class="client-name">{{ client.cliente }}</div>
                  <div *ngIf="client.razonSocial && client.razonSocial !== client.cliente" class="client-rfc">Razón Social: {{ client.razonSocial }}</div>
                </div>
              </td>
            </ng-container>

            <!-- RFC Column -->
            <ng-container matColumnDef="rfc">
              <th mat-header-cell *matHeaderCellDef>RFC</th>
              <td mat-cell *matCellDef="let client">
                <span *ngIf="client.rfc; else noRfc" class="client-info">{{ client.rfc }}</span>
                <ng-template #noRfc>
                  <span class="text-gray-400 italic client-info">Sin RFC</span>
                </ng-template>
              </td>
            </ng-container>

            <!-- Email Column -->
            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let client">
                <span *ngIf="client.email; else noEmail" class="client-info">{{ client.email }}</span>
                <ng-template #noEmail>
                  <span class="text-gray-400 italic client-info">Sin email</span>
                </ng-template>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                class="hover:bg-gray-50 cursor-pointer"
                (click)="selectClient(row)"></tr>
          </table>
        </div>
      </div>

      <div mat-dialog-actions class="flex justify-end gap-2">
        <button mat-button (click)="onCancel()" class="text-sm">
          <mat-icon class="mr-1" style="font-size: 16px;">close</mat-icon>
          Cancelar
        </button>
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
                
                // Estilos específicos para las tablas (tomados de validación)
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
          cursor: pointer;
          
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
    
    .client-info {
      font-size: 12px;
      line-height: 1.2;
    }
    
    .client-name {
      font-weight: 500;
      color: #1f2937;
    }
    
    .client-rfc {
      color: #6b7280;
      font-size: 11px;
    }
    
    // Estilos específicos para columnas
    :host ::ng-deep {
      // Hacer la columna cliente más ancha
      mat-table {
        .mat-column-cliente {
          min-width: 300px !important;
          max-width: 400px !important;
          width: 35% !important;
        }
        
        .mat-column-ndCliente {
          min-width: 120px !important;
          width: 15% !important;
        }
        
        .mat-column-rfc {
          min-width: 150px !important;
          width: 20% !important;
        }
        
        .mat-column-email {
          min-width: 200px !important;
          width: 30% !important;
        }
      }
    }
  `]
})
export class ClientSelectionDialogComponent {
  displayedColumns: string[] = ['ndCliente', 'cliente', 'rfc', 'email'];

  constructor(
    public dialogRef: MatDialogRef<ClientSelectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { clients: any[] }
  ) {}

  selectClient(client: any): void {
    this.dialogRef.close(client);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
