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

  // Validación de configuración existente
  configuracionExiste: boolean = false;
  validandoConfiguracion: boolean = false;
  mensajeValidacion: string = '';

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
        Enabled?: string;
      };
    },
    private snackBar: MatSnackBar
  ) { }

  trackById = (_: number, item: { Id: string | number }): string | number => item.Id;
  trackByValue = (_: number, value: string | number): string | number => value;

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
      // Determinar el estado: si no está definido o es '1' o es string vacío, se considera habilitado
      const enabledValue = this.data.configuracion.Enabled;
      const isEnabled = enabledValue === undefined || enabledValue === '' || enabledValue === '1' || String(enabledValue) === '1';
      
      this.documentoForm.patchValue({
        IdProcess: this.data.configuracion.IdProcess,
        IdAgency: this.data.configuracion.IdAgency,
        IdCostumerType: this.data.configuracion.IdCostumerType,
        IdOperationType: this.data.configuracion.IdOperationType,
        enabled: isEnabled
      });
    }

    // Solo en modo create, agregar listeners para validar en tiempo real
    if (this.data.mode === 'create') {
      // Escuchar cambios en los campos de configuración
      this.documentoForm.get('IdAgency')?.valueChanges.subscribe(() => {
        this.validarConfiguracionExistente();
      });
      this.documentoForm.get('IdProcess')?.valueChanges.subscribe(() => {
        this.validarConfiguracionExistente();
      });
      this.documentoForm.get('IdCostumerType')?.valueChanges.subscribe(() => {
        this.validarConfiguracionExistente();
      });
      this.documentoForm.get('IdOperationType')?.valueChanges.subscribe(() => {
        this.validarConfiguracionExistente();
      });
    }
  }

  private loadExistingDocuments(): void {

    // Cargar documentos existentes para esta configuración
    if (this.data.configuracion) {
      const filters = {
        IdProcess: this.data.configuracion.IdProcess,
        IdAgency: this.data.configuracion.IdAgency,
        IdCostumerType: this.data.configuracion.IdCostumerType,
        IdOperationType: this.data.configuracion.IdOperationType
      };

      this.documentoRequeridoService.getDocumentosRequeridos(filters).subscribe({
        next: (response: any) => {

          if (response?.success && response.data?.documentos) {
            // Extraer los IDs de los tipos de documento ya configurados
            const existingDocumentTypeIds = response.data.documentos.map((doc: any) => doc.IdDocumentType);

            
            
            // Actualizar el formulario con los documentos existentes

            this.selectedDocumentTypes = existingDocumentTypeIds;

            
            
            // Verificar que el formulario se actualizó correctamente
            setTimeout(() => {

              
              this.debugFormState();
            }, 100);
            
            // Actualizar la lista filtrada
            this.filteredTiposDocumento = [...this.tiposDocumento];
            this.applyFilters();
          } else {

          }
        },
        error: (error: any) => {

        }
      });
    } else {

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

        this.checkCatalogsLoaded();
      }
    });
  }

  private checkCatalogsLoaded(): void {
    this.catalogsProcessed++;

    // Si todos los catálogos han sido procesados, quitar el loading
    if (this.catalogsProcessed >= this.totalCatalogs) {

      this.loadingCatalogs = false;
      
      // Si estamos en modo edición, cargar documentos existentes DESPUÉS de que todos los catálogos estén listos
      if (this.data.mode === 'edit') {

        this.loadExistingDocuments();
      } else {

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

  /**
   * Validar si la configuración ya existe (en tiempo real)
   */
  validarConfiguracionExistente(): void {
    // Solo validar si todos los campos están completos
    const IdAgency = this.documentoForm.get('IdAgency')?.value;
    const IdProcess = this.documentoForm.get('IdProcess')?.value;
    const IdCostumerType = this.documentoForm.get('IdCostumerType')?.value;
    const IdOperationType = this.documentoForm.get('IdOperationType')?.value;

    if (!IdAgency || !IdProcess || !IdCostumerType || !IdOperationType) {
      // Si falta algún campo, resetear el estado
      this.configuracionExiste = false;
      this.mensajeValidacion = '';
      return;
    }

    this.validandoConfiguracion = true;
    this.mensajeValidacion = 'Verificando...';

    const filters = {
      IdProcess: IdProcess,
      IdAgency: IdAgency,
      IdCostumerType: IdCostumerType,
      IdOperationType: IdOperationType
    };

    this.documentoRequeridoService.getDocumentosRequeridos(filters).subscribe({
      next: (response) => {
        this.validandoConfiguracion = false;
        if (response.success && response.data && response.data.documentos && response.data.documentos.length > 0) {
          // Ya existe una configuración
          this.configuracionExiste = true;
          const procesoName = this.procesos.find(p => p.Id === IdProcess)?.Name || 'N/A';
          const agenciaName = this.agencias.find(a => a.Id === IdAgency)?.Name || 'N/A';
          const clienteName = this.tiposCliente.find(c => c.Id === IdCostumerType)?.Name || 'N/A';
          const operacionName = this.tiposOperacion.find(o => o.Id === IdOperationType)?.Name || 'N/A';
          this.mensajeValidacion = `Ya existe una configuración para: ${agenciaName} - ${procesoName} - ${clienteName} - ${operacionName}`;
        } else {
          // No existe, se puede crear
          this.configuracionExiste = false;
          this.mensajeValidacion = '';
        }
      },
      error: (error) => {
        this.validandoConfiguracion = false;

        // En caso de error, permitir crear (el backend también validará)
        this.configuracionExiste = false;
        this.mensajeValidacion = '';
      }
    });
  }

  private createDocumentoRequerido(): void {
    if (this.selectedDocumentTypes.length === 0) {
      this.snackBar.open('Debes seleccionar al menos un tipo de documento', 'Error', {
        duration: 3000
      });
      this.loading = false;
      return;
    }

    // Si ya sabemos que existe, no proceder
    if (this.configuracionExiste) {
      this.snackBar.open('Esta configuración ya existe. Por favor, edita la configuración existente o selecciona diferentes parámetros.', 'Advertencia', {
        duration: 5000
      });
      this.loading = false;
      return;
    }

    // Proceder con la creación
    this.proceedWithCreation();
  }

  private proceedWithCreation(): void {
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
            // Si el error es porque ya existe, mostrarlo
            if (response.message && response.message.toLowerCase().includes('existe') || 
                response.message && response.message.toLowerCase().includes('duplicado')) {

            }
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
              // Verificar si el error es por duplicado
              const errorMessage = error?.error?.message || error?.message || '';
              if (errorMessage.toLowerCase().includes('existe') || errorMessage.toLowerCase().includes('duplicado')) {
                this.snackBar.open('Esta configuración ya existe. Por favor, edita la configuración existente.', 'Advertencia', {
                  duration: 5000
                });
              } else {
                this.snackBar.open('Error al crear configuraciones', 'Error', {
                  duration: 3000
                });
              }
            }
            this.loading = false;
          }
        }
      });
    });
  }

  private updateDocumentoRequerido(): void {
    // Si no hay documento pero hay configuración, actualizar solo el estado de la configuración
    if (!this.data.documento && this.data.configuracion) {
      // Obtener el ID de la configuración buscando un documento de esa configuración
      const filters = {
        IdProcess: this.documentoForm.value.IdProcess,
        IdAgency: this.documentoForm.value.IdAgency,
        IdCostumerType: this.documentoForm.value.IdCostumerType,
        IdOperationType: this.documentoForm.value.IdOperationType
      };

      this.documentoRequeridoService.getDocumentosRequeridos(filters).subscribe({
        next: (response) => {
          if (response.success && response.data && response.data.documentos && response.data.documentos.length > 0) {
            // Obtener el IdConfigurationProcess del primer documento
            const firstDoc = response.data.documentos[0];
            const configProcessId = firstDoc.IdConfigurationProcess;

            // Actualizar el estado de la configuración usando el primer documento como referencia
            const documentoData: DocumentoRequeridoUpdateRequest = {
              Id: firstDoc.Id,
              IdProcess: this.documentoForm.value.IdProcess,
              IdAgency: this.documentoForm.value.IdAgency,
              IdCostumerType: this.documentoForm.value.IdCostumerType,
              IdOperationType: this.documentoForm.value.IdOperationType,
              IdDocumentType: firstDoc.IdDocumentType,
              Enabled: this.documentoForm.value.enabled ? '1' : '0'
            };

            // Actualizar documentos y luego actualizar el ConfigurationProcess
            this.documentoRequeridoService.updateDocumentoRequerido(firstDoc.Id, documentoData).subscribe({
              next: (updateResponse) => {
                if (updateResponse.success) {
                  // Ahora actualizar todos los documentos de esta configuración con el nuevo estado
                  // y actualizar el ConfigurationProcess
                  this.updateConfigurationProcessStatus(configProcessId, this.documentoForm.value.enabled);
                } else {
                  this.snackBar.open(updateResponse.message || 'Error al actualizar configuración', 'Error', {
                    duration: 3000
                  });
                  this.loading = false;
                }
              },
              error: (error) => {
                this.snackBar.open('Error al actualizar configuración', 'Error', {
                  duration: 3000
                });
                this.loading = false;
              }
            });
          } else {
            this.snackBar.open('No se encontró la configuración para actualizar', 'Error', {
              duration: 3000
            });
            this.loading = false;
          }
        },
        error: (error) => {
          this.snackBar.open('Error al buscar la configuración', 'Error', {
            duration: 3000
          });
          this.loading = false;
        }
      });
      return;
    }

    // Si hay documento específico, actualizar normalmente
    if (!this.data.documento) {
      this.loading = false;
      return;
    }

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
          // Actualizar también el ConfigurationProcess
          const configProcessId = this.data.documento?.IdConfigurationProcess;
          if (configProcessId) {
            this.updateConfigurationProcessStatus(configProcessId, this.documentoForm.value.enabled);
          } else {
            this.snackBar.open('Configuración actualizada exitosamente', 'Éxito', {
              duration: 2000
            });
            this.dialogRef.close(true);
            this.loading = false;
          }
        } else {
          this.snackBar.open(response.message || 'Error al actualizar configuración', 'Error', {
            duration: 3000
          });
          this.loading = false;
        }
      },
      error: (error) => {
        this.snackBar.open('Error al actualizar configuración', 'Error', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }

  /**
   * Actualizar el estado del ConfigurationProcess
   */
  private updateConfigurationProcessStatus(configProcessId: string, enabled: boolean): void {
    // El backend ahora actualiza automáticamente el ConfigurationProcess cuando se actualiza Enabled
    // Solo cerramos el diálogo
    this.snackBar.open('Configuración actualizada exitosamente', 'Éxito', {
      duration: 2000
    });
    this.dialogRef.close(true);
    this.loading = false;
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

    // Reaplicar filtros después del cambio
    this.applyFilters();
  }

  // Método para manejar el cambio en el filtro de solo seleccionados
  onShowOnlySelectedChange(event: any): void {
    this.showOnlySelected = event.checked;

    this.applyFilters();
  }

  // Método para limpiar solo el filtro de seleccionados
  clearShowOnlySelectedFilter(): void {
    this.showOnlySelected = false;

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

    let filtered = [...this.tiposDocumento];

    // Filtro por nombre
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(tipo => 
        tipo.Name.toLowerCase().includes(searchLower)
      );

    }

    // Filtro por fase
    if (this.selectedPhase) {
      filtered = filtered.filter(tipo => 
        tipo.ProcessTypeName === this.selectedPhase
      );

    }

    // Filtro por subfase
    if (this.selectedSubPhase) {
      filtered = filtered.filter(tipo => 
        tipo.SubProcessName === this.selectedSubPhase
      );

    }

    // Filtro por solo seleccionados
    if (this.showOnlySelected) {
      const beforeFilter = filtered.length;
      filtered = filtered.filter(tipo => 
        this.selectedDocumentTypes.includes(tipo.Id)
      );
      

      
    }

    this.filteredTiposDocumento = filtered;

  }
}
