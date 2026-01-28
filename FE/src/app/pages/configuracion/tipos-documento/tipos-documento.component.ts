import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
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
import { DocumentType, DocumentTypeResponse } from '../../../core/interfaces/document-type.interface';
import { DocumentTypeService } from '../../../core/services/document-type.service';
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
    MatTooltipModule
  ]
})
export class TiposDocumentoComponent implements OnInit, AfterViewInit {
  tiposDocumento: DocumentType[] = [];
  dataSource = new MatTableDataSource<DocumentType>([]);
  displayedColumns: string[] = ['Id', 'Name', 'ProcessTypeName', 'SubProcessName', 'Required', 'ReqExpiration', 'AvailableToClient', 'Enabled', 'configuraciones', 'acciones'];
  loading = false;
  searchTerm = '';
  statusFilter = '';
  phaseFilter = '';
  requiredFilter = '';
  expirationFilter = '';
  availablePhases: any[] = [];
  
  // Mapeo de nombres de columnas para mostrar
  columnNames: { [key: string]: string } = {
    'Id': 'ID',
    'Name': 'Nombre',
    'ProcessTypeName': 'Fase',
    'SubProcessName': 'Sub Fase',
    'Required': 'Requerido',
    'ReqExpiration': 'Requiere expiración',
    'AvailableToClient': 'Disponible al cliente',
    'Enabled': 'Estado',
    'configuraciones': 'Configuraciones',
    'acciones': 'Acciones'
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private documentTypeService: DocumentTypeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadTiposDocumento();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Configurar filtro personalizado
    this.dataSource.filterPredicate = (data: DocumentType, filter: string) => {
      const searchTerm = filter.toLowerCase();
      return data.Name.toLowerCase().includes(searchTerm);
    };
    
    // Asegurar que el paginador esté configurado después de la vista
    setTimeout(() => {
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  loadTiposDocumento(): void {
    this.loading = true;
    
    this.documentTypeService.getAllDocumentTypes().subscribe({
      next: (response) => {
        if (response?.success) {
          this.tiposDocumento = response.data.document_types || [];
          
          // Verificar que el conteo coincida con la cantidad real de configuraciones
          this.tiposDocumento.forEach(tipo => {
            const count = tipo.configurationsCount || 0;
            const actualLength = tipo.configurations?.length || 0;
            if (count !== actualLength) {
              
              // Corregir el conteo si hay discrepancia
              tipo.configurationsCount = actualLength;
            }
          });
          
          this.dataSource.data = this.tiposDocumento;
          
          // Extraer fases únicas
          const uniquePhases = [...new Set(
            this.tiposDocumento
              .map(tipo => tipo.ProcessTypeName)
              .filter(phase => phase && phase !== 'N/A')
          )];
          
          this.availablePhases = uniquePhases.map(phase => ({
            name: phase,
            value: phase
          }));
          
          this.applyFilter();
          
          // Asegurar que el paginador esté configurado
          setTimeout(() => {
            if (this.paginator) {
              this.dataSource.paginator = this.paginator;
            }
          });
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
    const filterValue = this.searchTerm.trim().toLowerCase();

    // Aplicar todos los filtros
    this.dataSource.data = this.tiposDocumento.filter(tipoDocumento => {
      // Filtro por búsqueda de texto
      const matchesSearch = filterValue === '' || 
        tipoDocumento.Name.toLowerCase().includes(filterValue);
      
      // Filtro por estado
      const matchesStatus = this.statusFilter === '' || 
        (this.statusFilter === '1' && tipoDocumento.Enabled === '1') ||
        (this.statusFilter === '0' && tipoDocumento.Enabled === '0');
      
      // Filtro por fase
      const matchesPhase = this.phaseFilter === '' || 
        tipoDocumento.ProcessTypeName === this.phaseFilter;
      
      // Filtro por requerido
      const matchesRequired = this.requiredFilter === '' || 
        (this.requiredFilter === '1' && tipoDocumento.Required === '1') ||
        (this.requiredFilter === '0' && tipoDocumento.Required === '0');
      
      // Filtro por requiere expiración
      const matchesExpiration = this.expirationFilter === '' || 
        (this.expirationFilter === '1' && tipoDocumento.ReqExpiration === '1') ||
        (this.expirationFilter === '0' && tipoDocumento.ReqExpiration === '0');
      
      // Debug para el primer elemento
      if (this.tiposDocumento.indexOf(tipoDocumento) === 0) {

      }
      
      return matchesSearch && matchesStatus && matchesPhase && matchesRequired && matchesExpiration;
    });
    
    // Reset paginator to first page
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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

    this.applyFilter();
    
    this.snackBar.open('Filtros limpiados', 'Info', {
      duration: 2000
    });
  }

  getPageRange(): string {
    if (!this.dataSource.paginator) {
      return '0-0';
    }
    
    const startIndex = this.dataSource.paginator.pageIndex * this.dataSource.paginator.pageSize + 1;
    const endIndex = Math.min(
      (this.dataSource.paginator.pageIndex + 1) * this.dataSource.paginator.pageSize,
      this.dataSource.filteredData.length
    );
    
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
    if (confirm(`¿Estás seguro de que quieres eliminar el tipo de documento "${documentType.Name}"?`)) {
      this.documentTypeService.deleteDocumentType(documentType.Id!).subscribe({
        next: (response) => {
          if (response.success) {
            this.tiposDocumento = this.tiposDocumento.filter(t => t.Id !== documentType.Id);
            this.applyFilter();
            this.snackBar.open('Tipo de documento eliminado exitosamente', 'Éxito', {
              duration: 2000
            });
          } else {
            this.snackBar.open(response.message || 'Error al eliminar tipo de documento', 'Error', {
              duration: 3000
            });
          }
        },
        error: (error) => {
          this.snackBar.open('Error al eliminar tipo de documento', 'Error', {
            duration: 3000
          });
        }
      });
    }
  }

  toggleStatus(documentType: DocumentType): void {
    this.documentTypeService.toggleStatus(documentType.Id!).subscribe({
      next: (response) => {
        if (response.success) {
          // Actualizar el estado en la lista local
          const index = this.tiposDocumento.findIndex(t => t.Id === documentType.Id);
          if (index !== -1) {
            this.tiposDocumento[index].Enabled = this.tiposDocumento[index].Enabled === '1' ? '0' : '1';
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
    // Validar que el ID existe y es válido
    if (!documentType.Id) {

      this.snackBar.open('Error: El tipo de documento no tiene un ID válido', 'Error', { duration: 3000 });
      return;
    }

    // Convertir el ID a número para validación
    const documentTypeId = parseInt(documentType.Id, 10);
    if (isNaN(documentTypeId) || documentTypeId <= 0) {

      this.snackBar.open(`Error: ID de documento inválido: ${documentType.Id}`, 'Error', { duration: 3000 });
      return;
    }

    // Obtener el tipo de documento completo desde la lista original para asegurar que tenemos todas las configuraciones
    const fullDocumentType = this.tiposDocumento.find(dt => dt.Id === documentType.Id) || documentType;
    
    // Verificar que el documento existe en la lista original
    const existsInOriginal = this.tiposDocumento.some(dt => dt.Id === documentType.Id);
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
    if (!documentType?.Id) {
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
