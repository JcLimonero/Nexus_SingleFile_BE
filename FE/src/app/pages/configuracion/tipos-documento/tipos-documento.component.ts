import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { DocumentType, DocumentTypeResponse } from '../../../core/interfaces/document-type.interface';
import { FASES_OCULTAS } from '../../../core/constants/catalogs';
import { DocumentTypeService } from '../../../core/services/document-type.service';
import { AuthService } from '../../../core/services/auth.service';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { DocumentTypeEditDialogComponent } from './document-type-edit-dialog/document-type-edit-dialog.component';
import { DocumentTypeConfigurationsDialogComponent } from './document-type-configurations-dialog/document-type-configurations-dialog.component';
import { AddToConfigurationsDialogComponent } from './add-to-configurations-dialog/add-to-configurations-dialog.component';

@Component({
  selector: 'app-tipos-documento',
  templateUrl: './tipos-documento.component.html',
  styleUrls: ['./tipos-documento.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatCardModule
  ]
})
export class TiposDocumentoComponent implements OnInit, AfterViewInit, OnDestroy {
  tiposDocumento: DocumentType[] = [];
  dataSource = new MatTableDataSource<DocumentType>([]);
  displayedColumns: string[] = [];
  loading = false;
  searchTerm = '';
  statusFilter = '';
  phaseFilter = '';
  requiredFilter = '';
  expirationFilter = '';
  availablePhases: any[] = [];
  
  // Paginación del lado del servidor
  totalItems = 0;
  pageSize = 10; // Tamaño de página por defecto
  currentPage = 0;
  pageSizeOptions = [10, 25, 50, 100, 200];
  
  // Mapeo de nombres de columnas para mostrar
  columnNames: { [key: string]: string } = {
    'id': 'ID',
    'name': 'Nombre',
    'process_type_name': 'Fase',
    'sub_process_name': 'Sub Fase',
    'required': 'Requerido',
    'req_expiration': 'Requiere expiración',
    'available_to_client': 'Disponible al cliente',
    'enabled': 'Estado',
    'configuraciones': 'Configuraciones',
    'acciones': 'Acciones'
  };

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private documentTypeService: DocumentTypeService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private confirmDialog: ConfirmDialogService
  ) { }

  ngOnInit(): void {
    this.displayedColumns = this.authService.getDisplayedColumnsWithOptionalId(['id', 'name', 'process_type_name', 'sub_process_name', 'required', 'req_expiration', 'available_to_client', 'enabled', 'configuraciones', 'acciones']);
    this.loadAvailablePhases();
    this.loadTiposDocumento();
  }

  loadAvailablePhases(): void {
    this.documentTypeService.getFileStatuses().subscribe({
      next: (response) => {
        if (response?.success && response?.data?.file_statuses) {
          const names = [...new Set(
            response.data.file_statuses
              .map((fs: any) => fs.name ?? fs.Name ?? '')
              .filter((n: string) => n && n !== 'N/A' && !FASES_OCULTAS.includes(n))
          )];
          this.availablePhases = names
            .sort((a, b) => a.localeCompare(b))
            .map(name => ({ name, value: name }));
        }
      }
    });
  }

  ngAfterViewInit(): void {
    // Paginación en servidor: NO asignar dataSource.paginator
    setTimeout(() => {
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
    });
  }
  
  /**
   * Manejar cambio de página
   */
  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadTiposDocumento();
  }
  
  ngOnDestroy(): void {
    // Limpiar recursos si es necesario
  }

  loadTiposDocumento(): void {
    this.loading = true;
    
    // Usar paginación del lado del servidor
    const params: any = {
      page: this.currentPage + 1, // El backend usa página basada en 1
      limit: this.pageSize
    };
    
    // Aplicar filtros
    if (this.statusFilter) {
      params.enabled = this.statusFilter;
    }
    if (this.searchTerm) {
      params.search = this.searchTerm;
    }
    if (this.phaseFilter) {
      params.phase = this.phaseFilter;
    }
    if (this.requiredFilter) {
      params.required = this.requiredFilter;
    }
    if (this.expirationFilter) {
      params.req_expiration = this.expirationFilter;
    }
    
    this.documentTypeService.getDocumentTypes(params).subscribe({
      next: (response) => {
        if (response?.success) {
          this.tiposDocumento = response.data.document_types || [];
          this.totalItems = response.data.total || 0;
          
          // Verificar que el conteo coincida con la cantidad real de configuraciones
          this.tiposDocumento.forEach(tipo => {
            const count = tipo.configurations_count ?? tipo.configurationsCount ?? 0;
            const actualLength = tipo.configurations?.length || 0;
            if (count !== actualLength) {
              tipo.configurations_count = tipo.configurationsCount = actualLength;
            }
          });
          
          this.dataSource.data = this.tiposDocumento;
        } else {
          this.snackBar.open('Error al cargar tipos de documento', 'Error', { duration: 3000 });
        }
        
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Error al cargar tipos de documento', 'Error', { duration: 3000 });
        this.loading = false;
      }
    });
  }
  
  applyFilter(): void {
    this.currentPage = 0;
    this.loadTiposDocumento();
  }
  

  refreshData(): void {
    this.loadTiposDocumento();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.phaseFilter = '';
    this.requiredFilter = '';
    this.expirationFilter = '';
    this.currentPage = 0;
    this.loadTiposDocumento();
    
    this.snackBar.open('Filtros limpiados', 'Info', {
      duration: 2000
    });
  }

  getPageRange(): string {
    if (this.totalItems === 0) {
      return '0-0';
    }
    
    const startIndex = this.currentPage * this.pageSize + 1;
    const endIndex = Math.min(startIndex + this.pageSize - 1, this.totalItems);
    
    return `${startIndex}-${endIndex}`;
  }

  openCreateDialog(): void {
    const dialogData = {
      documentType: {} as DocumentType,
      mode: 'create'
    };

    const dialogRef = this.dialog.open(DocumentTypeEditDialogComponent, {
      width: '600px',
      data: dialogData,
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshData();
      }
    });
  }

  openEditDialog(documentType: DocumentType): void {
    if (documentType.protected) {
      this.snackBar.open('El tipo de documento de Liquidación no puede editarse', 'Info', { duration: 3000 });
      return;
    }
    const dialogData = {
      documentType: documentType,
      mode: 'edit'
    };

    const dialogRef = this.dialog.open(DocumentTypeEditDialogComponent, {
      width: '600px',
      data: dialogData,
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshData();
      }
    });
  }

  deleteDocumentType(documentType: DocumentType): void {
    if (documentType.protected) {
      this.snackBar.open('El tipo de documento de Liquidación no puede eliminarse', 'Info', { duration: 3000 });
      return;
    }
    this.confirmDialog.confirmDelete(
      `¿Eliminar el tipo de documento "${documentType.name}"?`,
      'Eliminar tipo de documento'
    ).subscribe(ok => {
      if (!ok) return;
      this.documentTypeService.deleteDocumentType(documentType.id!).subscribe({
        next: (response) => {
          if (response.success) {
            this.tiposDocumento = this.tiposDocumento.filter(t => t.id !== documentType.id);
            this.applyFilter();
            this.snackBar.open('Tipo de documento eliminado exitosamente', 'Éxito', { duration: 2000 });
          } else {
            this.snackBar.open(response.message || 'Error al eliminar tipo de documento', 'Error', { duration: 3000 });
          }
        },
        error: () => {
          this.snackBar.open('Error al eliminar tipo de documento', 'Error', { duration: 3000 });
        }
      });
    });
  }

  toggleStatus(documentType: DocumentType): void {
    this.documentTypeService.toggleStatus(documentType.id!).subscribe({
      next: (response) => {
        if (response.success) {
          const index = this.tiposDocumento.findIndex(t => t.id === documentType.id);
          if (index !== -1) {
            this.tiposDocumento[index].enabled = this.tiposDocumento[index].enabled === '1' ? '0' : '1';
            this.applyFilter();
          }
          
          this.snackBar.open('Estado cambiado exitosamente', 'Éxito', {
            duration: 2000
          });
        } else {
          this.snackBar.open(response.message || 'Error al cambiar estado', 'Error', {
            duration: 3000
          });
        }
      },
              error: (error) => {
          this.snackBar.open('Error al cambiar estado', 'Error', {
            duration: 3000
          });
        }
    });
  }

  openConfigurationsDialog(documentType: DocumentType): void {
    if (!documentType.id) {
      this.snackBar.open('Error: El tipo de documento no tiene un ID válido', 'Error', { duration: 3000 });
      return;
    }

    const documentTypeId = parseInt(documentType.id, 10);
    if (isNaN(documentTypeId) || documentTypeId <= 0) {
      this.snackBar.open(`Error: ID de documento inválido: ${documentType.id}`, 'Error', { duration: 3000 });
      return;
    }

    const fullDocumentType = this.tiposDocumento.find(dt => dt.id === documentType.id) || documentType;
    const existsInOriginal = this.tiposDocumento.some(dt => dt.id === documentType.id);
    if (!existsInOriginal) {
      
    }

    // Siempre obtener las configuraciones desde el servidor para asegurar que tenemos todas
    // Esto evita problemas de sincronización entre el conteo y las configuraciones
    // Usar el ID convertido a string para asegurar consistencia
    this.documentTypeService.getConfigurations(String(documentTypeId)).subscribe({
      next: (response) => {
        if (response?.success && response?.data?.configurations) {
          const configurations = response.data.configurations || [];

          const dialogRef = this.dialog.open(DocumentTypeConfigurationsDialogComponent, {
            width: '90vw',
            maxWidth: '1400px',
            maxHeight: '90vh',
            data: {
              documentType: documentType,
              configurations: configurations
            }
          });
        } else {

          // Si falla, usar las configuraciones que tenemos
          const dialogRef = this.dialog.open(DocumentTypeConfigurationsDialogComponent, {
            width: '90vw',
            maxWidth: '1400px',
            maxHeight: '90vh',
            data: {
              documentType: documentType,
              configurations: fullDocumentType.configurations || []
            }
          });
        }
      },
      error: (error) => {

        // Si falla, usar las configuraciones que tenemos
        const dialogRef = this.dialog.open(DocumentTypeConfigurationsDialogComponent, {
          width: '90vw',
          maxWidth: '1400px',
          maxHeight: '90vh',
          data: {
            documentType: documentType,
            configurations: fullDocumentType.configurations || []
          }
        });
      }
    });
  }

  openAddToConfigurationsDialog(documentType: DocumentType): void {
    if (!documentType?.id) {
      this.snackBar.open('Error: El tipo de documento no tiene un ID válido', 'Error', { duration: 3000 });
      return;
    }
    const d = this.dialog.open(AddToConfigurationsDialogComponent, {
      width: '95vw',
      maxWidth: '1200px',
      data: { documentType }
    });
    d.afterClosed().subscribe((result: { added?: boolean } | undefined) => {
      if (result?.added) {
        this.refreshData();
      }
    });
  }

}
