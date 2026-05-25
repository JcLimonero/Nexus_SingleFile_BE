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
import { FASES_OCULTAS } from '../../../../core/constants/catalogs';
import { forkJoin, of } from 'rxjs';
import { switchMap, catchError, timeout } from 'rxjs/operators';

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
  private _loading = false;
  get loading(): boolean { return this._loading; }
  set loading(v: boolean) {
    this._loading = v;
    this.updateFormDisabledState();
  }
  private _loadingCatalogs = false;
  get loadingCatalogs(): boolean { return this._loadingCatalogs; }
  set loadingCatalogs(v: boolean) {
    this._loadingCatalogs = v;
    this.updateFormDisabledState();
  }
  
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
        id_sale_type: string;
        id_agency: string;
        id_customer_type: string;
        id_operation_type: string;
        enabled?: string;
      };
    },
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadCatalogs();
  }

  private initializeForm(): void {
    this.documentoForm = this.fb.group({
      id_sale_type: ['', Validators.required],
      id_agency: ['', Validators.required],
      id_customer_type: ['', Validators.required],
      id_operation_type: ['', Validators.required],
      enabled: [true] // Estado de la configuración (habilitada por defecto)
    });

    // Si estamos en modo edición, poblar el formulario
    if (this.data.mode === 'edit' && this.data.documento) {
      this.documentoForm.patchValue({
        id_sale_type: this.data.documento.id_sale_type,
        id_agency: this.data.documento.id_agency,
        id_customer_type: this.data.documento.id_customer_type,
        id_operation_type: this.data.documento.id_operation_type,
        enabled: this.data.documento.enabled === '1' // Convertir string a boolean
      });
    }

    // Si tenemos configuración predefinida, aplicarla
    if (this.data.configuracion) {
      // Determinar el estado: si no está definido o es '1' o es string vacío, se considera habilitado
      const enabledValue = this.data.configuracion.enabled;
      const isEnabled = enabledValue === undefined || enabledValue === '' || enabledValue === '1' || String(enabledValue) === '1';
      
      this.documentoForm.patchValue({
        id_sale_type: this.data.configuracion.id_sale_type,
        id_agency: this.data.configuracion.id_agency,
        id_customer_type: this.data.configuracion.id_customer_type,
        id_operation_type: this.data.configuracion.id_operation_type,
        enabled: isEnabled
      });
    }

    this.updateFormDisabledState();

    // Solo en modo create, agregar listeners para validar en tiempo real
    if (this.data.mode === 'create') {
      // Escuchar cambios en los campos de configuración
      this.documentoForm.get('id_agency')?.valueChanges.subscribe(() => {
        this.validarConfiguracionExistente();
      });
      this.documentoForm.get('id_sale_type')?.valueChanges.subscribe(() => {
        this.validarConfiguracionExistente();
      });
      this.documentoForm.get('id_customer_type')?.valueChanges.subscribe(() => {
        this.validarConfiguracionExistente();
      });
      this.documentoForm.get('id_operation_type')?.valueChanges.subscribe(() => {
        this.validarConfiguracionExistente();
      });
    }
  }

  private updateFormDisabledState(): void {
    if (!this.documentoForm) return;
    const enabledCtrl = this.documentoForm.get('enabled');
    if (enabledCtrl) {
      this._loading ? enabledCtrl.disable() : enabledCtrl.enable();
    }
    ['id_agency', 'id_sale_type', 'id_customer_type', 'id_operation_type'].forEach(name => {
      const c = this.documentoForm.get(name);
      if (c) (this._loadingCatalogs ? c.disable() : c.enable());
    });
  }

  private loadExistingDocuments(): void {
    const config = this.data.configuracion ?? (this.data.documento ? {
      id_sale_type: this.data.documento.id_sale_type,
      id_agency: this.data.documento.id_agency,
      id_customer_type: this.data.documento.id_customer_type,
      id_operation_type: this.data.documento.id_operation_type
    } : null);

    if (!config) {
      this.loadingCatalogs = false;
      return;
    }

    const filters = {
      id_sale_type: config.id_sale_type,
      id_agency: config.id_agency,
      id_customer_type: config.id_customer_type,
      id_operation_type: config.id_operation_type
    };

    this.documentoRequeridoService.getDocumentosRequeridos(filters).pipe(
      timeout(10000) // Fallback: mostrar contenido tras 10s si la petición tarda
    ).subscribe({
      next: (response: any) => {
        if (response?.success && response.data?.documentos) {
          const existingDocumentTypeIds = response.data.documentos.map((doc: any) => String(doc.id_document_type));
          this.selectedDocumentTypes = existingDocumentTypeIds;
        }
        this.filteredTiposDocumento = [...this.tiposDocumento];
        this.applyFilters();
        this.loadingCatalogs = false;
      },
      error: () => {
        this.filteredTiposDocumento = [...this.tiposDocumento];
        this.applyFilters();
        this.loadingCatalogs = false;
      }
    });
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

    // Cargar tipos de documento (excluir Liquidación - se agrega automáticamente al crear expediente)
    this.documentTypeService.getDocumentTypes().subscribe({
      next: (response: any) => {
        if (response?.success && response.data) {
          const all = response.data.document_types || [];
          // Excluir Liquidación (con o sin acento) - se agrega automáticamente al crear expediente
          const norm = (n: string | undefined) => (n ?? '').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          this.tiposDocumento = all.filter((t: DocumentType) => norm(t.name) !== 'liquidacion');
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

    if (this.catalogsProcessed >= this.totalCatalogs) {
      if (this.data.mode === 'edit') {
        // En modo edición: mantener loading hasta que loadExistingDocuments termine
        this.loadExistingDocuments();
      } else {
        this.loadingCatalogs = false;
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
    const id_agency = this.documentoForm.get('id_agency')?.value;
    const id_sale_type = this.documentoForm.get('id_sale_type')?.value;
    const id_customer_type = this.documentoForm.get('id_customer_type')?.value;
    const id_operation_type = this.documentoForm.get('id_operation_type')?.value;

    if (!id_agency || !id_sale_type || !id_customer_type || !id_operation_type) {
      // Si falta algún campo, resetear el estado
      this.configuracionExiste = false;
      this.mensajeValidacion = '';
      return;
    }

    this.validandoConfiguracion = true;
    this.mensajeValidacion = 'Verificando...';

    const filters = {
      id_sale_type,
      id_agency,
      id_customer_type,
      id_operation_type
    };

    this.documentoRequeridoService.getDocumentosRequeridos(filters).subscribe({
      next: (response) => {
        this.validandoConfiguracion = false;
        if (response.success && response.data && response.data.documentos && response.data.documentos.length > 0) {
          // Ya existe una configuración
          this.configuracionExiste = true;
          const procesoName = this.procesos.find(p => String(p.id) === String(id_sale_type))?.name || 'N/A';
          const agenciaName = this.agencias.find(a => String(a.id) === String(id_agency))?.name || 'N/A';
          const clienteName = this.tiposCliente.find(c => String(c.id) === String(id_customer_type))?.name || 'N/A';
          const operacionName = this.tiposOperacion.find(o => String(o.id) === String(id_operation_type))?.name || 'N/A';
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
    
    const formVal = this.documentoForm.getRawValue();
    this.selectedDocumentTypes.forEach((documentTypeId: string, index: number) => {
      const documentoData: DocumentoRequeridoCreateRequest = {
        id_sale_type: formVal.id_sale_type,
        id_agency: formVal.id_agency,
        id_customer_type: formVal.id_customer_type,
        id_operation_type: formVal.id_operation_type,
        id_document_type: documentTypeId
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
    if (this.selectedDocumentTypes.length === 0) {
      this.snackBar.open('Debes seleccionar al menos un tipo de documento', 'Error', { duration: 3000 });
      this.loading = false;
      return;
    }

    // Si no hay documento pero hay configuración: sincronizar documentos según selección (añadir nuevos, eliminar desmarcados)
    if (!this.data.documento && this.data.configuracion) {
      const formVal = this.documentoForm.getRawValue();
      const filters = {
        id_sale_type: formVal.id_sale_type,
        id_agency: formVal.id_agency,
        id_customer_type: formVal.id_customer_type,
        id_operation_type: formVal.id_operation_type
      };

      this.documentoRequeridoService.getDocumentosRequeridos(filters).pipe(
        switchMap((response) => {
          if (!response.success || !response.data?.documentos) {
            this.snackBar.open('No se encontró la configuración para actualizar', 'Error', { duration: 3000 });
            this.loading = false;
            return of(null);
          }

          const existingDocs = response.data.documentos as DocumentoRequerido[];
          const existingTypeIds = existingDocs.map(d => String(d.id_document_type));
          const selectedIds = this.selectedDocumentTypes.map(id => String(id));

          // Tipos a añadir (seleccionados pero no existentes)
          const typesToAdd = selectedIds.filter(id => !existingTypeIds.includes(id));
          // Documentos a eliminar (existentes pero no seleccionados)
          const docsToDelete = existingDocs.filter(d => !selectedIds.includes(String(d.id_document_type)));

          const createRequests = typesToAdd.map(idDocType => {
            const data: DocumentoRequeridoCreateRequest = {
              id_sale_type: formVal.id_sale_type,
              id_agency: formVal.id_agency,
              id_customer_type: formVal.id_customer_type,
              id_operation_type: formVal.id_operation_type,
              id_document_type: idDocType
            };
            return this.documentoRequeridoService.createDocumentoRequerido(data).pipe(
              catchError(() => of({ success: false }))
            );
          });

          const deleteRequests = docsToDelete.map(doc =>
            this.documentoRequeridoService.deleteDocumentoRequerido(doc.id).pipe(
              catchError(() => of({ success: false }))
            )
          );

          const allRequests = [...createRequests, ...deleteRequests];
          if (allRequests.length === 0) {
            // Solo actualizar enabled si no hay cambios de documentos
            const firstDoc = existingDocs[0];
            const updateData: DocumentoRequeridoUpdateRequest = {
              id: firstDoc.id,
              id_sale_type: formVal.id_sale_type,
              id_agency: formVal.id_agency,
              id_customer_type: formVal.id_customer_type,
              id_operation_type: formVal.id_operation_type,
              id_document_type: firstDoc.id_document_type,
              enabled: formVal.enabled ? '1' : '0'
            };
            return this.documentoRequeridoService.updateDocumentoRequerido(firstDoc.id, updateData);
          }

          return forkJoin(allRequests).pipe(
            switchMap(() => {
              // Documentos que se mantienen (existentes y aún seleccionados)
              const remainingDocs = existingDocs.filter(d => selectedIds.includes(String(d.id_document_type)));
              const docToUpdate = remainingDocs[0];
              if (docToUpdate) {
                const updateData: DocumentoRequeridoUpdateRequest = {
                  id: docToUpdate.id,
                  id_sale_type: formVal.id_sale_type,
                  id_agency: formVal.id_agency,
                  id_customer_type: formVal.id_customer_type,
                  id_operation_type: formVal.id_operation_type,
                  id_document_type: docToUpdate.id_document_type,
                  enabled: formVal.enabled ? '1' : '0'
                };
                return this.documentoRequeridoService.updateDocumentoRequerido(docToUpdate.id, updateData);
              }
              // Si se eliminaron todos y se añadieron nuevos, el enabled se aplica en los creates o en el backend
              return of({ success: true });
            })
          );
        })
      ).subscribe({
        next: (result) => {
          if (result !== null) {
            this.updateConfigurationProcessStatus('', formVal.enabled);
          }
        },
        error: () => {
          this.snackBar.open('Error al actualizar configuración', 'Error', { duration: 3000 });
          this.loading = false;
        }
      });
      return;
    }

    // Si hay documento específico: usar la misma lógica de sincronización (la config se obtiene del documento)
    if (this.data.documento) {
      const formVal = this.documentoForm.getRawValue();
      const filters = {
        id_sale_type: formVal.id_sale_type,
        id_agency: formVal.id_agency,
        id_customer_type: formVal.id_customer_type,
        id_operation_type: formVal.id_operation_type
      };

      this.documentoRequeridoService.getDocumentosRequeridos(filters).pipe(
        switchMap((response) => {
          if (!response.success || !response.data?.documentos) {
            this.snackBar.open('No se encontró la configuración para actualizar', 'Error', { duration: 3000 });
            this.loading = false;
            return of(null);
          }

          const existingDocs = response.data.documentos as DocumentoRequerido[];
          const existingTypeIds = existingDocs.map(d => String(d.id_document_type));
          const selectedIds = this.selectedDocumentTypes.map(id => String(id));

          const typesToAdd = selectedIds.filter(id => !existingTypeIds.includes(id));
          const docsToDelete = existingDocs.filter(d => !selectedIds.includes(String(d.id_document_type)));

          const createRequests = typesToAdd.map(idDocType => {
            const data: DocumentoRequeridoCreateRequest = {
              id_sale_type: formVal.id_sale_type,
              id_agency: formVal.id_agency,
              id_customer_type: formVal.id_customer_type,
              id_operation_type: formVal.id_operation_type,
              id_document_type: idDocType
            };
            return this.documentoRequeridoService.createDocumentoRequerido(data).pipe(
              catchError(() => of({ success: false }))
            );
          });

          const deleteRequests = docsToDelete.map(doc =>
            this.documentoRequeridoService.deleteDocumentoRequerido(doc.id).pipe(
              catchError(() => of({ success: false }))
            )
          );

          const allRequests = [...createRequests, ...deleteRequests];
          if (allRequests.length === 0) {
            const firstDoc = existingDocs[0];
            const updateData: DocumentoRequeridoUpdateRequest = {
              id: firstDoc.id,
              id_sale_type: formVal.id_sale_type,
              id_agency: formVal.id_agency,
              id_customer_type: formVal.id_customer_type,
              id_operation_type: formVal.id_operation_type,
              id_document_type: firstDoc.id_document_type,
              enabled: formVal.enabled ? '1' : '0'
            };
            return this.documentoRequeridoService.updateDocumentoRequerido(firstDoc.id, updateData);
          }

          return forkJoin(allRequests).pipe(
            switchMap(() => {
              const remainingDocs = existingDocs.filter(d => selectedIds.includes(String(d.id_document_type)));
              const docToUpdate = remainingDocs[0];
              if (docToUpdate) {
                const updateData: DocumentoRequeridoUpdateRequest = {
                  id: docToUpdate.id,
                  id_sale_type: formVal.id_sale_type,
                  id_agency: formVal.id_agency,
                  id_customer_type: formVal.id_customer_type,
                  id_operation_type: formVal.id_operation_type,
                  id_document_type: docToUpdate.id_document_type,
                  enabled: formVal.enabled ? '1' : '0'
                };
                return this.documentoRequeridoService.updateDocumentoRequerido(docToUpdate.id, updateData);
              }
              return of({ success: true });
            })
          );
        })
      ).subscribe({
        next: (result) => {
          if (result !== null) {
            this.updateConfigurationProcessStatus('', formVal.enabled);
          }
        },
        error: () => {
          this.snackBar.open('Error al actualizar configuración', 'Error', { duration: 3000 });
          this.loading = false;
        }
      });
      return;
    }

    this.loading = false;
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
    const processId = this.documentoForm.get('id_sale_type')?.value;
    const process = this.procesos.find(p => String(p.id) === String(processId));
    return process ? process.name : 'No seleccionado';
  }

  getAgencyText(): string {
    const agencyId = this.documentoForm.get('id_agency')?.value;
    const agency = this.agencias.find(a => String(a.id) === String(agencyId));
    return agency ? agency.name : 'No seleccionado';
  }

  getCustomerTypeText(): string {
    const customerTypeId = this.documentoForm.get('id_customer_type')?.value;
    const customerType = this.tiposCliente.find(t => String(t.id) === String(customerTypeId));
    return customerType ? customerType.name : 'No seleccionado';
  }

  getOperationTypeText(): string {
    const operationTypeId = this.documentoForm.get('id_operation_type')?.value;
    const operationType = this.tiposOperacion.find(t => String(t.id) === String(operationTypeId));
    return operationType ? operationType.name : 'No seleccionado';
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

  // Método para extraer fases y subfases disponibles (oculta Liberado, Cancelado, Liberado por Excepción)
  private extractAvailablePhases(): void {
    const phases = new Set<string>();
    const subPhases = new Set<string>();

    this.tiposDocumento.forEach(tipo => {
      if (tipo.process_type_name && !FASES_OCULTAS.includes(tipo.process_type_name)) {
        phases.add(tipo.process_type_name);
      }
      if (tipo.sub_process_name) {
        subPhases.add(tipo.sub_process_name);
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
          .filter(tipo => tipo.sub_process_name)
          .map(tipo => tipo.sub_process_name!)
      )).sort();
      return;
    }

    const subPhases = new Set<string>();
    this.tiposDocumento.forEach(tipo => {
      if (tipo.process_type_name === this.selectedPhase && tipo.sub_process_name) {
        subPhases.add(tipo.sub_process_name);
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
        tipo.name.toLowerCase().includes(searchLower)
      );

    }

    // Filtro por fase
    if (this.selectedPhase) {
      filtered = filtered.filter(tipo => 
        tipo.process_type_name === this.selectedPhase
      );

    }

    // Filtro por subfase
    if (this.selectedSubPhase) {
      filtered = filtered.filter(tipo => 
        tipo.sub_process_name === this.selectedSubPhase
      );

    }

    // Filtro por solo seleccionados
    if (this.showOnlySelected) {
      const beforeFilter = filtered.length;
      filtered = filtered.filter(tipo => 
        this.selectedDocumentTypes.includes(tipo.id)
      );
      

      
    }

    this.filteredTiposDocumento = filtered;

  }
}
