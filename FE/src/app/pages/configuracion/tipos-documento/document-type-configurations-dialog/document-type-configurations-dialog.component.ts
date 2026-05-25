import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { ViewChild, AfterViewInit } from '@angular/core';
import { DocumentType, DocumentTypeConfiguration } from '../../../../core/interfaces/document-type.interface';
import { DocumentTypeService } from '../../../../core/services/document-type.service';
import { ProcesoService } from '../../../../core/services/proceso.service';
import { AgencyService } from '../../../../core/services/agency.service';
import { CostumerTypeService } from '../../../../core/services/costumer-type.service';
import { TipoOperacionService } from '../../../../core/services/tipo-operacion.service';
import { ConfirmDialogService } from '../../../../core/services/confirm-dialog.service';
import { AddToConfigurationsDialogComponent } from '../add-to-configurations-dialog/add-to-configurations-dialog.component';

export interface DocumentTypeConfigurationsDialogData {
  documentType: DocumentType;
  configurations: DocumentTypeConfiguration[];
}

@Component({
  selector: 'app-document-type-configurations-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    MatPaginatorModule
  ],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title class="flex items-center gap-2 text-xl font-semibold mb-4">
        <mat-icon class="text-blue-600">info</mat-icon>
        Configuraciones del Tipo de Documento
      </h2>
      
      <div mat-dialog-content class="mb-6">
        <div class="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p class="text-sm text-blue-800">
            <strong>Tipo de Documento:</strong> {{ data.documentType.name }}
          </p>
          <p class="text-sm text-blue-700 mt-1">
            <strong>Total de configuraciones:</strong> {{ filteredConfigurations.length }} / {{ allConfigurations.length }}
          </p>
          <p class="text-xs text-blue-600 mt-2">
            <mat-icon class="text-xs align-middle">info</mat-icon>
            <span>El "Estado Config." indica si la combinación Proceso-Agencia-Tipo Cliente-Tipo Operación está habilitada (<strong>Activo</strong>) o deshabilitada (<strong>Inactivo</strong>)</span>
          </p>
        </div>

        <!-- Filtros -->
        <div *ngIf="allConfigurations.length > 0" class="mb-4 grid grid-cols-4 gap-3">
          <mat-form-field appearance="outline" class="text-sm">
            <mat-label>Agencia</mat-label>
            <mat-select [(ngModel)]="selectedAgency" (selectionChange)="applyFilters()">
              <mat-option value="">Todas</mat-option>
              <mat-option *ngFor="let agencia of agencias" [value]="agencia.id">
                {{ agencia.name }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="text-sm">
            <mat-label>Proceso</mat-label>
            <mat-select [(ngModel)]="selectedProcess" (selectionChange)="applyFilters()">
              <mat-option value="">Todos</mat-option>
              <mat-option *ngFor="let proceso of procesos" [value]="proceso.id">
                {{ proceso.name }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="text-sm">
            <mat-label>Tipo Cliente</mat-label>
            <mat-select [(ngModel)]="selectedCostumerType" (selectionChange)="applyFilters()">
              <mat-option value="">Todos</mat-option>
              <mat-option *ngFor="let tipoCliente of tiposCliente" [value]="tipoCliente.id">
                {{ tipoCliente.name }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="text-sm">
            <mat-label>Tipo Operación</mat-label>
            <mat-select [(ngModel)]="selectedOperationType" (selectionChange)="applyFilters()">
              <mat-option value="">Todos</mat-option>
              <mat-option *ngFor="let tipoOperacion of tiposOperacion" [value]="tipoOperacion.id">
                {{ tipoOperacion.name }}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div *ngIf="allConfigurations.length === 0" class="text-center py-8">
          <mat-icon class="text-gray-400 text-4xl mb-2">info</mat-icon>
          <p class="text-gray-500">Este tipo de documento no se está usando en ninguna configuración</p>
        </div>

        <div *ngIf="allConfigurations.length > 0" class="overflow-x-auto">
          <table mat-table [dataSource]="configurationsDataSource" class="w-full">
            <!-- Columna Agencia -->
            <ng-container matColumnDef="AgenciaName">
              <th mat-header-cell *matHeaderCellDef class="text-left py-2 px-3 bg-gray-50 text-xs font-medium text-gray-700">
                Agencia
              </th>
              <td mat-cell *matCellDef="let config" class="text-xs py-2 px-3">
                {{ config.agencia_name || 'N/A' }}
              </td>
            </ng-container>

            <!-- Columna Proceso -->
            <ng-container matColumnDef="ProcesoName">
              <th mat-header-cell *matHeaderCellDef class="text-left py-2 px-3 bg-gray-50 text-xs font-medium text-gray-700">
                Proceso
              </th>
              <td mat-cell *matCellDef="let config" class="text-xs py-2 px-3">
                {{ config.proceso_name || 'N/A' }}
              </td>
            </ng-container>

            <!-- Columna Tipo Cliente -->
            <ng-container matColumnDef="TipoClienteName">
              <th mat-header-cell *matHeaderCellDef class="text-left py-2 px-3 bg-gray-50 text-xs font-medium text-gray-700">
                Tipo Cliente
              </th>
              <td mat-cell *matCellDef="let config" class="text-xs py-2 px-3">
                {{ config.tipo_cliente_name || 'N/A' }}
              </td>
            </ng-container>

            <!-- Columna Tipo Operación -->
            <ng-container matColumnDef="TipoOperacionName">
              <th mat-header-cell *matHeaderCellDef class="text-left py-2 px-3 bg-gray-50 text-xs font-medium text-gray-700">
                Tipo Operación
              </th>
              <td mat-cell *matCellDef="let config" class="text-xs py-2 px-3">
                {{ config.tipo_operacion_name || 'N/A' }}
              </td>
            </ng-container>

            <!-- Columna Estado -->
            <ng-container matColumnDef="ConfigurationEnabled">
              <th mat-header-cell *matHeaderCellDef class="text-center py-2 px-3 bg-gray-50 text-xs font-medium text-gray-700" 
                  matTooltip="Estado de la configuración de proceso (Activo = habilitada, Inactivo = deshabilitada)">
                Estado Config.
              </th>
              <td mat-cell *matCellDef="let config" class="text-center py-2 px-3">
                <span class="px-2 py-1 rounded-full text-xs font-medium"
                      [ngClass]="(config.ConfigurationEnabled === 1 || config.ConfigurationEnabled === '1') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                      [matTooltip]="(config.ConfigurationEnabled === 1 || config.ConfigurationEnabled === '1') ? 'Configuración habilitada - Esta combinación está activa' : 'Configuración deshabilitada - Esta combinación no está activa'">
                  {{ (config.ConfigurationEnabled === 1 || config.ConfigurationEnabled === '1') ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
            </ng-container>

            <!-- Columna Acciones -->
            <ng-container matColumnDef="acciones">
              <th mat-header-cell *matHeaderCellDef class="text-center py-2 px-3 bg-gray-50 text-xs font-medium text-gray-700">
                Acciones
              </th>
              <td mat-cell *matCellDef="let config" class="text-center py-2 px-3">
                <button
                  mat-icon-button
                  color="warn"
                  (click)="deleteConfiguration(config)"
                  [matTooltip]="'Eliminar este tipo de documento de la configuración'"
                  class="!w-8 !h-8 !min-h-8 !p-0">
                  <mat-icon class="!text-sm">delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="hover:bg-gray-50"></tr>
          </table>
          
          <!-- Paginación -->
          <mat-paginator 
            [pageSizeOptions]="[10, 25, 50, 100, 200]"
            [pageSize]="25"
            showFirstLastButtons
            aria-label="Seleccionar página de configuraciones">
          </mat-paginator>
        </div>
      </div>

      <div mat-dialog-actions class="flex justify-end gap-2">
        <button
          mat-raised-button
          color="primary"
          (click)="openAddToConfigurationsDialog()"
          class="text-sm">
          <mat-icon class="mr-1" style="font-size: 18px; width: 18px; height: 18px;">add_circle</mat-icon>
          Agregar a configuraciones
        </button>
        <button mat-button (click)="onClose()" class="text-sm">
          Cerrar
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      min-width: 1000px;
      max-width: 1400px;
      width: 90vw;
    }
    
    mat-dialog-content {
      max-height: 75vh;
      overflow-y: auto;
      padding: 20px;
    }
    
    table {
      width: 100%;
    }
    
    th, td {
      border-bottom: 1px solid #e5e7eb;
    }

    .grid {
      display: grid;
    }

    .grid-cols-4 {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    .gap-3 {
      gap: 0.75rem;
    }
  `]
})
export class DocumentTypeConfigurationsDialogComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  displayedColumns: string[] = ['AgenciaName', 'ProcesoName', 'TipoClienteName', 'TipoOperacionName', 'ConfigurationEnabled', 'acciones'];
  configurationsDataSource = new MatTableDataSource<DocumentTypeConfiguration>([]);
  
  allConfigurations: DocumentTypeConfiguration[] = [];
  filteredConfigurations: DocumentTypeConfiguration[] = [];

  // Filtros
  selectedProcess: string = '';
  selectedAgency: string = '';
  selectedCostumerType: string = '';
  selectedOperationType: string = '';

  // Catálogos
  procesos: any[] = [];
  agencias: any[] = [];
  tiposCliente: any[] = [];
  tiposOperacion: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<DocumentTypeConfigurationsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DocumentTypeConfigurationsDialogData,
    private documentTypeService: DocumentTypeService,
    private procesoService: ProcesoService,
    private agencyService: AgencyService,
    private costumerTypeService: CostumerTypeService,
    private tipoOperacionService: TipoOperacionService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private confirmDialog: ConfirmDialogService
  ) {
    this.allConfigurations = data.configurations || [];
    this.filteredConfigurations = [...this.allConfigurations];
    this.configurationsDataSource.data = this.filteredConfigurations;
  }

  ngOnInit(): void {
    this.loadCatalogs();
  }

  ngAfterViewInit(): void {
    // Conectar el paginador al dataSource
    if (this.paginator) {
      this.configurationsDataSource.paginator = this.paginator;
    }
  }

  loadCatalogs(): void {
    // Cargar procesos
    this.procesoService.getProcesos().subscribe({
      next: (response: any) => {
        if (response?.success && response.data) {
          this.procesos = response.data.processes || [];
        }
      },
      error: (error: any) => {

      }
    });

    // Cargar agencias
    this.agencyService.getAgencies({}).subscribe({
      next: (response: any) => {
        if (response?.success && response.data) {
          this.agencias = response.data.agencies || [];
        }
      },
      error: (error: any) => {

      }
    });

    // Cargar tipos de cliente
    this.costumerTypeService.getCostumerTypes().subscribe({
      next: (response: any) => {
        if (response?.success && response.data) {
          this.tiposCliente = response.data.costumer_types || [];
        }
      },
      error: (error: any) => {

      }
    });

    // Cargar tipos de operación
    this.tipoOperacionService.getTiposOperacion().subscribe({
      next: (response: any) => {
        if (response?.success && response.data) {
          this.tiposOperacion = response.data.operationTypes || [];
        }
      },
      error: (error: any) => {

      }
    });
  }

  applyFilters(): void {
    this.filteredConfigurations = this.allConfigurations.filter(config => {
      const matchesProcess = !this.selectedProcess || String(config.id_sale_type) === String(this.selectedProcess);
      const matchesAgency = !this.selectedAgency || String(config.id_agency) === String(this.selectedAgency);
      const matchesCostumerType = !this.selectedCostumerType || String(config.id_customer_type) === String(this.selectedCostumerType);
      const matchesOperationType = !this.selectedOperationType || String(config.id_operation_type) === String(this.selectedOperationType);

      return matchesProcess && matchesAgency && matchesCostumerType && matchesOperationType;
    });

    this.configurationsDataSource.data = this.filteredConfigurations;
    
    // Reconectar el paginador y resetear a la primera página
    if (this.paginator) {
      this.configurationsDataSource.paginator = this.paginator;
      this.paginator.firstPage();
    }
  }

  loadConfigurationsFromServer(): void {
    const id = String(this.data.documentType.id!);
    this.documentTypeService.getConfigurations(id).subscribe({
      next: (response: any) => {
        const list = response?.data?.configurations ?? [];
        this.allConfigurations = list;
        this.applyFilters();
      },
      error: () => {
        this.snackBar.open('Error al recargar configuraciones', 'Cerrar', { duration: 3000 });
      }
    });
  }

  openAddToConfigurationsDialog(): void {
    const d = this.dialog.open(AddToConfigurationsDialogComponent, {
      width: '95vw',
      maxWidth: '1200px',
      data: { documentType: this.data.documentType }
    });
    d.afterClosed().subscribe((result: { added?: boolean } | undefined) => {
      if (result?.added) {
        this.loadConfigurationsFromServer();
      }
    });
  }

  deleteConfiguration(config: DocumentTypeConfiguration): void {
    const details = `Agencia: ${config.agencia_name}\nProceso: ${config.proceso_name}\nTipo Cliente: ${config.tipo_cliente_name}\nTipo Operación: ${config.tipo_operacion_name}`;

    this.confirmDialog.confirm({
      title: 'Eliminar de la configuración',
      message: '¿Eliminar este tipo de documento de la configuración?',
      details,
      variant: 'danger',
      confirmText: 'Eliminar'
    }).subscribe(ok => {
      if (!ok) return;

      const configurationId = config.id_configuration_process_document_type;
      if (!configurationId) {
        this.snackBar.open('Error: No se pudo identificar la configuración', 'Error', { duration: 3000 });
        return;
      }

      this.documentTypeService.deleteConfiguration(this.data.documentType.id!, configurationId).subscribe({
        next: (response: any) => {
          if (response?.success) {
            this.allConfigurations = this.allConfigurations.filter(c => c.id_configuration_process_document_type !== configurationId);
            this.applyFilters();
            this.snackBar.open('Tipo de documento eliminado de la configuración exitosamente', 'Éxito', { duration: 3000 });
          } else {
            this.snackBar.open(response?.message || 'Error al eliminar la configuración', 'Error', { duration: 3000 });
          }
        },
        error: () => {
          this.snackBar.open('Error al eliminar la configuración', 'Error', { duration: 3000 });
        }
      });
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
