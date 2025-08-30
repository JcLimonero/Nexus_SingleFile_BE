import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { DocumentoRequerido, DocumentoRequeridoCreateRequest, DocumentoRequeridoUpdateRequest } from '../../../../core/interfaces/documento-requerido.interface';
import { DocumentoRequeridoService } from '../../../../core/services/documento-requerido.service';
import { ProcesoService } from '../../../../core/services/proceso.service';
import { AgencyService, Agency } from '../../../../core/services/agency.service';
import { CostumerTypeService } from '../../../../core/services/costumer-type.service';
import { TipoOperacionService } from '../../../../core/services/tipo-operacion.service';
import { DocumentTypeService } from '../../../../core/services/document-type.service';

import { Proceso } from '../../../../core/interfaces/proceso.interface';
import { CostumerType } from '../../../../core/interfaces/costumer-type.interface';
import { TipoOperacion } from '../../../../core/interfaces/tipo-operacion.interface';
import { DocumentType } from '../../../../core/interfaces/document-type.interface';

@Component({
  selector: 'app-documento-requerido-edit-dialog',
  templateUrl: './documento-requerido-edit-dialog.component.html',
  styleUrls: ['./documento-requerido-edit-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatSlideToggleModule
  ]
})
export class DocumentoRequeridoEditDialogComponent implements OnInit {
  documentoForm!: FormGroup;
  loading = false;
  loadingCatalogs = false;
  
  // Contador de catálogos procesados
  private catalogsProcessed = 0;
  private readonly totalCatalogs = 5;
  
  // Catálogos
  procesos: Proceso[] = [];
  agencias: Agency[] = [];
  tiposCliente: CostumerType[] = [];
  tiposOperacion: TipoOperacion[] = [];
  tiposDocumento: DocumentType[] = [];
  
  // Buscador y filtros
  searchTerm: string = '';
  selectedPhase: string = '';
  selectedSubPhase: string = '';
  filteredTiposDocumento: DocumentType[] = [];
  availablePhases: string[] = [];
  availableSubPhases: string[] = [];
  
  // Propiedad para manejar los tipos de documento seleccionados
  selectedDocumentTypes: string[] = [];
  
  // Filtro para mostrar solo seleccionados
  showOnlySelected: boolean = false;

  constructor(
    private fb: FormBuilder,
    private documentoRequeridoService: DocumentoRequeridoService,
    private procesoService: ProcesoService,
    private agencyService: AgencyService,
    private costumerTypeService: CostumerTypeService,
    private tipoOperacionService: TipoOperacionService,
    private documentTypeService: DocumentTypeService,
    private dialogRef: MatDialogRef<DocumentoRequeridoEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      documento?: DocumentoRequerido; 
      mode: 'create' | 'edit';
      configuracion?: {
        IdProcess: string;
        IdAgency: string;
        IdCostumerType: string;
        IdOperationType: string;
      };
    },
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadCatalogs();
    
    // Timeout de seguridad para quitar el loading después de 5 segundos
    setTimeout(() => {
      this.loadingCatalogs = false;
    }, 5000);
  }

  private initializeForm(): void {
    this.documentoForm = this.fb.group({
      IdProcess: ['', Validators.required],
      IdAgency: ['', Validators.required],
      IdCostumerType: ['', Validators.required],
      IdOperationType: ['', Validators.required],
      enabled: [true] // Estado de la configuración (habilitada por defecto)
    });

    // Si estamos en modo edición, poblar el formulario
    if (this.data.mode === 'edit' && this.data.documento) {
      this.documentoForm.patchValue({
        IdProcess: this.data.documento.IdProcess,
        IdAgency: this.data.documento.IdAgency,
        IdCostumerType: this.data.documento.IdCostumerType,
        IdOperationType: this.data.documento.IdOperationType,
        enabled: this.data.documento.Enabled === '1' // Convertir string a boolean
      });
    }

    // Si tenemos configuración predefinida, aplicarla
    if (this.data.configuracion) {
      this.documentoForm.patchValue({
        IdProcess: this.data.configuracion.IdProcess,
        IdAgency: this.data.configuracion.IdAgency,
        IdCostumerType: this.data.configuracion.IdCostumerType,
        IdOperationType: this.data.configuracion.IdOperationType
      });
    }
  }

  private loadExistingDocuments(): void {
    console.log('🔄 Cargando documentos existentes...');
    console.log('📋 Configuración:', this.data.configuracion);
    console.log('📄 Tipos de documento disponibles:', this.tiposDocumento?.length || 0);
    
    // Cargar documentos existentes para esta configuración
    if (this.data.configuracion) {
      const filters = {
        IdProcess: this.data.configuracion.IdProcess,
        IdAgency: this.data.configuracion.IdAgency,
        IdCostumerType: this.data.configuracion.IdCostumerType,
        IdOperationType: this.data.configuracion.IdOperationType
      };

      console.log('🔍 Filtros para buscar documentos:', filters);

      this.documentoRequeridoService.getDocumentosRequeridos(filters).subscribe({
        next: (response: any) => {
          console.log('✅ Respuesta del servicio:', response);
          if (response?.success && response.data?.documentos) {
            // Extraer los IDs de los tipos de documento ya configurados
            const existingDocumentTypeIds = response.data.documentos.map((doc: any) => doc.IdDocumentType);
            console.log('📋 IDs de documentos existentes:', existingDocumentTypeIds);
            console.log('📋 Número de documentos encontrados:', response.data.documentos.length);
            console.log('📋 Primeros 3 documentos:', response.data.documentos.slice(0, 3));
            
            // Actualizar el formulario con los documentos existentes
            console.log('🔄 Antes de actualizar el formulario:');
            console.log('📝 selectedDocumentTypes actual:', this.selectedDocumentTypes);
            
            this.selectedDocumentTypes = existingDocumentTypeIds;
            
            console.log('🔄 Después de actualizar el formulario:');
            console.log('📝 selectedDocumentTypes nuevo:', this.selectedDocumentTypes);
            
            console.log('✅ Formulario actualizado con documentos existentes');
            console.log('📝 Estado del formulario:', this.documentoForm.value.selectedDocumentTypes);
            console.log('📝 Valor del control selectedDocumentTypes:', this.documentoForm.get('selectedDocumentTypes')?.value);
            
            // Verificar que el formulario se actualizó correctamente
            setTimeout(() => {
              console.log('🔄 Verificación después de 100ms:');
              console.log('📝 Estado del formulario:', this.documentoForm.value.selectedDocumentTypes);
              console.log('📝 Valor del control selectedDocumentTypes:', this.documentoForm.get('selectedDocumentTypes')?.value);
              this.debugFormState();
            }, 100);
            
            // Actualizar la lista filtrada
            this.filteredTiposDocumento = [...this.tiposDocumento];
            this.applyFilters();
          } else {
            console.log('⚠️ No se encontraron documentos existentes o respuesta inválida');
          }
        },
        error: (error: any) => {
          console.error('❌ Error cargando documentos existentes:', error);
        }
      });
    } else {
      console.log('⚠️ No hay configuración disponible para cargar documentos existentes');
    }
  }

  private loadCatalogs(): void {
    this.loadingCatalogs = true;
    this.catalogsProcessed = 0; // Resetear contador

    // Cargar procesos
    this.procesoService.getProcesos().subscribe({
      next: (response: any) => {
        if (response?.success && response.data) {
          this.procesos = response.data.processes || [];
        }
        this.checkCatalogsLoaded();
      },
      error: (error: any) => {
        console.error('Error cargando procesos:', error);
        this.checkCatalogsLoaded();
      }
    });

    // Cargar agencias
    this.agencyService.getAgencies({}).subscribe({
      next: (response: any) => {
        if (response?.success && response.data) {
          this.agencias = response.data.agencies || [];
        }
        this.checkCatalogsLoaded();
      },
      error: (error: any) => {
        console.error('Error cargando agencias:', error);
        this.checkCatalogsLoaded();
      }
    });

    // Cargar tipos de cliente
    this.costumerTypeService.getCostumerTypes().subscribe({
      next: (response: any) => {
        if (response?.success && response.data) {
          this.tiposCliente = response.data.costumer_types || [];
        }
        this.checkCatalogsLoaded();
      },
      error: (error: any) => {
        console.error('Error cargando tipos de cliente:', error);
        this.checkCatalogsLoaded();
      }
    });

    // Cargar tipos de operación
    this.tipoOperacionService.getTiposOperacion().subscribe({
      next: (response: any) => {
        if (response?.success && response.data) {
          this.tiposOperacion = response.data.operationTypes || [];
        }
        this.checkCatalogsLoaded();
      },
      error: (error: any) => {
        console.error('Error cargando tipos de operación:', error);
        this.checkCatalogsLoaded();
      }
    });

    // Cargar tipos de documento
    this.documentTypeService.getDocumentTypes().subscribe({
      next: (response: any) => {
        if (response?.success && response.data) {
          this.tiposDocumento = response.data.document_types || [];
          this.filteredTiposDocumento = [...this.tiposDocumento]; // Inicializar filtrado
          
          // Extraer fases y subfases únicas disponibles
          this.extractAvailablePhases();
          
          // NOTA: loadExistingDocuments() se llama desde checkCatalogsLoaded() 
          // cuando todos los catálogos estén listos para evitar problemas de timing
        }
        this.checkCatalogsLoaded();
      },
      error: (error: any) => {
        console.error('Error cargando tipos de documento:', error);
        this.checkCatalogsLoaded();
      }
    });
  }

  private checkCatalogsLoaded(): void {
    this.catalogsProcessed++;
    console.log(`📊 Catálogo procesado: ${this.catalogsProcessed}/${this.totalCatalogs}`);
    
    // Si todos los catálogos han sido procesados, quitar el loading
    if (this.catalogsProcessed >= this.totalCatalogs) {
      console.log('✅ Todos los catálogos han sido cargados');
      this.loadingCatalogs = false;
      
      // Si estamos en modo edición, cargar documentos existentes DESPUÉS de que todos los catálogos estén listos
      if (this.data.mode === 'edit') {
        console.log('🔄 Modo edición detectado, cargando documentos existentes...');
        console.log('📋 Configuración disponible:', this.data.configuracion);
        this.loadExistingDocuments();
      } else {
        console.log('🆕 Modo creación detectado, no se cargan documentos existentes');
      }
    }
  }

  onSubmit(): void {
    if (this.documentoForm.valid && this.selectedDocumentTypes.length > 0) {
      this.loading = true;

      if (this.data.mode === 'create') {
        this.createDocumentoRequerido();
      } else {
        this.updateDocumentoRequerido();
      }
    } else if (this.selectedDocumentTypes.length === 0) {
      this.snackBar.open('Debes seleccionar al menos un tipo de documento', 'Error', {
        duration: 3000
      });
    }
  }

  private createDocumentoRequerido(): void {
    if (this.selectedDocumentTypes.length === 0) {
      this.snackBar.open('Debes seleccionar al menos un tipo de documento', 'Error', {
        duration: 3000
      });
      this.loading = false;
      return;
    }

    // Crear múltiples documentos, uno por cada tipo seleccionado
    let createdCount = 0;
    let errorCount = 0;
    const totalToCreate = this.selectedDocumentTypes.length;
    
    this.selectedDocumentTypes.forEach((documentTypeId: string, index: number) => {
      const documentoData: DocumentoRequeridoCreateRequest = {
        IdProcess: this.documentoForm.value.IdProcess,
        IdAgency: this.documentoForm.value.IdAgency,
        IdCostumerType: this.documentoForm.value.IdCostumerType,
        IdOperationType: this.documentoForm.value.IdOperationType,
        IdDocumentType: documentTypeId
      };

      this.documentoRequeridoService.createDocumentoRequerido(documentoData).subscribe({
        next: (response) => {
          if (response.success) {
            createdCount++;
          } else {
            errorCount++;
          }
          
          // Verificar si todos los documentos han sido procesados
          if (createdCount + errorCount === totalToCreate) {
            if (errorCount === 0) {
              this.snackBar.open(`${createdCount} configuraciones creadas exitosamente`, 'Éxito', {
                duration: 3000
              });
              this.dialogRef.close(true);
            } else {
              this.snackBar.open(`${createdCount} configuraciones creadas, ${errorCount} errores`, 'Advertencia', {
                duration: 3000
              });
              this.dialogRef.close(true);
            }
            this.loading = false;
          }
        },
        error: (error) => {
          errorCount++;
          
          // Verificar si todos los documentos han sido procesados
          if (createdCount + errorCount === totalToCreate) {
            if (createdCount > 0) {
              this.snackBar.open(`${createdCount} configuraciones creadas, ${errorCount} errores`, 'Advertencia', {
                duration: 3000
              });
              this.dialogRef.close(true);
            } else {
              this.snackBar.open('Error al crear configuraciones', 'Error', {
                duration: 3000
              });
            }
            this.loading = false;
          }
        }
      });
    });
  }

  private updateDocumentoRequerido(): void {
    if (!this.data.documento) return;

    if (this.selectedDocumentTypes.length === 0) {
      this.snackBar.open('Debes seleccionar al menos un tipo de documento', 'Error', {
        duration: 3000
      });
      this.loading = false;
      return;
    }

    // Para edición, solo actualizamos el primer tipo seleccionado (compatibilidad)
    const documentoData: DocumentoRequeridoUpdateRequest = {
      Id: this.data.documento.Id,
      IdProcess: this.documentoForm.value.IdProcess,
      IdAgency: this.documentoForm.value.IdAgency,
      IdCostumerType: this.documentoForm.value.IdCostumerType,
      IdOperationType: this.documentoForm.value.IdOperationType,
      IdDocumentType: this.selectedDocumentTypes[0], // Tomar el primer tipo seleccionado
      Enabled: this.documentoForm.value.enabled ? '1' : '0' // Convertir boolean a string
    };

    this.documentoRequeridoService.updateDocumentoRequerido(this.data.documento.Id, documentoData).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Configuración actualizada exitosamente', 'Éxito', {
            duration: 2000
          });
          this.dialogRef.close(true);
        } else {
          this.snackBar.open(response.message || 'Error al actualizar configuración', 'Error', {
            duration: 3000
          });
        }
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Error al actualizar configuración', 'Error', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getTitle(): string {
    return this.data.mode === 'edit' ? 'Editar Configuración de Documentos' : 'Nueva Configuración';
  }

  getSubmitButtonText(): string {
    return this.data.mode === 'edit' ? 'Guardar Cambios' : 'Crear Configuración';
  }

  // Método para verificar si un tipo de documento está seleccionado
  isDocumentTypeSelected(documentTypeId: string): boolean {
    const isSelected = this.selectedDocumentTypes.includes(documentTypeId);
    
    // Solo mostrar logs para los primeros 5 documentos para no saturar la consola
    if (parseInt(documentTypeId) <= 5) {
      console.log(`🔍 Verificando si ${documentTypeId} está seleccionado: ${isSelected}`);
      console.log(`📋 Tipos seleccionados actuales:`, this.selectedDocumentTypes);
      console.log(`📝 Tipo de selectedTypes:`, typeof this.selectedDocumentTypes, Array.isArray(this.selectedDocumentTypes));
      console.log(`📝 documentTypeId:`, documentTypeId, typeof documentTypeId);
      console.log(`📝 Comparación:`, this.selectedDocumentTypes.includes(documentTypeId));
    }
    
    return isSelected;
  }

  // Método para manejar cambios en los checkboxes
  onDocumentTypeChange(event: any, documentTypeId: string): void {
    if (event.checked) {
      // Agregar el documento si no está ya seleccionado
      if (!this.selectedDocumentTypes.includes(documentTypeId)) {
        this.selectedDocumentTypes.push(documentTypeId);
      }
    } else {
      // Remover el documento si está seleccionado
      const index = this.selectedDocumentTypes.indexOf(documentTypeId);
      if (index > -1) {
        this.selectedDocumentTypes.splice(index, 1);
      }
    }
    
    console.log('🔄 Documento cambiado:', documentTypeId, 'checked:', event.checked);
    console.log('📋 Tipos seleccionados actualizados:', this.selectedDocumentTypes);
    
    // Reaplicar filtros después del cambio
    this.applyFilters();
  }

  // Método para manejar el cambio en el filtro de solo seleccionados
  onShowOnlySelectedChange(event: any): void {
    this.showOnlySelected = event.checked;
    console.log('🔄 Filtro "Solo seleccionados" cambiado:', this.showOnlySelected);
    console.log('📋 Tipos seleccionados actuales:', this.selectedDocumentTypes);
    console.log('📄 Total de tipos de documento:', this.tiposDocumento.length);
    this.applyFilters();
  }

  // Método para limpiar solo el filtro de seleccionados
  clearShowOnlySelectedFilter(): void {
    this.showOnlySelected = false;
    console.log('🔄 Filtro "Solo seleccionados" limpiado');
    this.applyFilters();
  }

  // Método para obtener el conteo de tipos de documento seleccionados
  getSelectedDocumentTypesCount(): number {
    return this.selectedDocumentTypes.length;
  }

  // Métodos para obtener textos de solo lectura
  getProcessText(): string {
    const processId = this.documentoForm.get('IdProcess')?.value;
    const process = this.procesos.find(p => p.Id === processId);
    return process ? process.Name : 'No seleccionado';
  }

  getAgencyText(): string {
    const agencyId = this.documentoForm.get('IdAgency')?.value;
    const agency = this.agencias.find(a => a.Id === agencyId);
    return agency ? agency.Name : 'No seleccionado';
  }

  getCustomerTypeText(): string {
    const customerTypeId = this.documentoForm.get('IdCostumerType')?.value;
    const customerType = this.tiposCliente.find(t => t.Id === customerTypeId);
    return customerType ? customerType.Name : 'No seleccionado';
  }

  getOperationTypeText(): string {
    const operationTypeId = this.documentoForm.get('IdOperationType')?.value;
    const operationType = this.tiposOperacion.find(t => t.Id === operationTypeId);
    return operationType ? operationType.Name : 'No seleccionado';
  }

  // Método temporal para debuggear el estado del formulario
  debugFormState(): void {
    console.log('🔍 DEBUG - Estado del formulario:');
    console.log('📝 selectedDocumentTypes:', this.selectedDocumentTypes);
    console.log('📝 Tipo de selectedDocumentTypes:', typeof this.selectedDocumentTypes);
    console.log('📝 Es array:', Array.isArray(this.selectedDocumentTypes));
    console.log('📝 Longitud:', this.selectedDocumentTypes.length);
    console.log('📝 Estado completo del formulario:', this.documentoForm.value);
  }

  // Método para filtrar tipos de documento
  onSearchChange(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.applyFilters();
  }

  // Método para cambiar filtro de fase
  onPhaseChange(phase: string): void {
    this.selectedPhase = phase;
    this.selectedSubPhase = ''; // Resetear subfase cuando cambia la fase
    this.updateAvailableSubPhases();
    this.applyFilters();
  }

  // Método para cambiar filtro de subfase
  onSubPhaseChange(subPhase: string): void {
    this.selectedSubPhase = subPhase;
    this.applyFilters();
  }

  // Método para limpiar búsqueda
  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
  }

  // Método para limpiar todos los filtros
  clearAllFilters(): void {
    this.searchTerm = '';
    this.selectedPhase = '';
    this.selectedSubPhase = '';
    this.showOnlySelected = false;
    this.applyFilters();
  }

  // Método para verificar si hay filtros activos
  hasActiveFilters(): boolean {
    return this.searchTerm.trim() !== '' || this.selectedPhase !== '' || this.selectedSubPhase !== '' || this.showOnlySelected;
  }

  // Método para extraer fases y subfases disponibles
  private extractAvailablePhases(): void {
    const phases = new Set<string>();
    const subPhases = new Set<string>();

    this.tiposDocumento.forEach(tipo => {
      if (tipo.ProcessTypeName) {
        phases.add(tipo.ProcessTypeName);
      }
      if (tipo.SubProcessName) {
        subPhases.add(tipo.SubProcessName);
      }
    });

    this.availablePhases = Array.from(phases).sort();
    this.availableSubPhases = Array.from(subPhases).sort();
  }

  // Método para actualizar subfases disponibles según la fase seleccionada
  private updateAvailableSubPhases(): void {
    if (!this.selectedPhase) {
      this.availableSubPhases = Array.from(new Set(
        this.tiposDocumento
          .filter(tipo => tipo.SubProcessName)
          .map(tipo => tipo.SubProcessName!)
      )).sort();
      return;
    }

    const subPhases = new Set<string>();
    this.tiposDocumento.forEach(tipo => {
      if (tipo.ProcessTypeName === this.selectedPhase && tipo.SubProcessName) {
        subPhases.add(tipo.SubProcessName);
      }
    });

    this.availableSubPhases = Array.from(subPhases).sort();
  }

  // Método para aplicar todos los filtros
  private applyFilters(): void {
    console.log('🔍 Aplicando filtros...');
    console.log('📝 showOnlySelected:', this.showOnlySelected);
    console.log('📝 selectedDocumentTypes:', this.selectedDocumentTypes);
    
    let filtered = [...this.tiposDocumento];
    console.log('📄 Total inicial:', filtered.length);

    // Filtro por nombre
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(tipo => 
        tipo.Name.toLowerCase().includes(searchLower)
      );
      console.log('🔍 Después de filtro por nombre:', filtered.length);
    }

    // Filtro por fase
    if (this.selectedPhase) {
      filtered = filtered.filter(tipo => 
        tipo.ProcessTypeName === this.selectedPhase
      );
      console.log('🔍 Después de filtro por fase:', filtered.length);
    }

    // Filtro por subfase
    if (this.selectedSubPhase) {
      filtered = filtered.filter(tipo => 
        tipo.SubProcessName === this.selectedSubPhase
      );
      console.log('🔍 Después de filtro por subfase:', filtered.length);
    }

    // Filtro por solo seleccionados
    if (this.showOnlySelected) {
      const beforeFilter = filtered.length;
      filtered = filtered.filter(tipo => 
        this.selectedDocumentTypes.includes(tipo.Id)
      );
      console.log('🔍 Después de filtro "Solo seleccionados":', filtered.length, '(antes:', beforeFilter, ')');
      console.log('🔍 IDs seleccionados:', this.selectedDocumentTypes);
      console.log('🔍 Tipos filtrados:', filtered.map(t => ({ id: t.Id, name: t.Name })));
    }

    this.filteredTiposDocumento = filtered;
    console.log('✅ Filtrado final:', this.filteredTiposDocumento.length);
  }
}
