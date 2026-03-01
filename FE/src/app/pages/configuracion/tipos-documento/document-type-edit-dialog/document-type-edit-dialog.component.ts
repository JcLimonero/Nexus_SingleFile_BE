import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DocumentType, DocumentTypeCreateRequest, DocumentTypeUpdateRequest, DocumentTypeEditDialogData } from '../../../../core/interfaces/document-type.interface';
import { DocumentTypeService } from '../../../../core/services/document-type.service';

@Component({
  selector: 'app-document-type-edit-dialog',
  templateUrl: './document-type-edit-dialog.component.html',
  styleUrls: ['./document-type-edit-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
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
export class DocumentTypeEditDialogComponent implements OnInit {
  documentTypeForm!: FormGroup;
  loading = false;
  loadingCatalogs = false;
  fileStatuses: any[] = [];
  subProcesses: any[] = [];

  // Propiedad para controlar si la sub fase está habilitada
  isSubPhaseEnabled: boolean = false;

  constructor(
    private fb: FormBuilder,
    private documentTypeService: DocumentTypeService,
    private dialogRef: MatDialogRef<DocumentTypeEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DocumentTypeEditDialogData,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadCatalogs();
    
    // Escuchar cambios en la fase para habilitar/deshabilitar sub fase
    this.documentTypeForm.get('id_process_type')?.valueChanges.subscribe(selectedPhase => {

      this.isSubPhaseEnabled = selectedPhase === 'Liberación';

      if (!this.isSubPhaseEnabled) {
        this.documentTypeForm.patchValue({ id_sub_process: '0' });
        
      } else {

      }
    });
  }

  private initializeForm(): void {
    this.documentTypeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(600)]],
      enabled: ['1', Validators.required],
      req_expiration: ['0'],
      id_process_type: ['Liberación'],
      required: ['1'],
      id_sub_process: ['0'],
      available_to_client: ['1']
    });
    
    // Inicializar el estado de la sub fase
    this.isSubPhaseEnabled = true; // Por defecto es "Liberación"

  }

  private loadCatalogs(): void {

    this.loadingCatalogs = true;
    
    // Cargar estados de archivo (File_Status)
    this.documentTypeService.getActiveFileStatuses().subscribe({
      next: (fileStatusesResponse) => {

        if (fileStatusesResponse?.success) {
          this.fileStatuses = fileStatusesResponse.data.file_statuses || [];

        } else {

        }
        this.checkCatalogsLoaded();
      },
      error: (error) => {

        this.checkCatalogsLoaded();
      }
    });

    // Cargar subestados de archivo (File_SubStatus)
    this.documentTypeService.getActiveSubProcesses().subscribe({
      next: (subProcessesResponse) => {

        if (subProcessesResponse?.success) {
          this.subProcesses = subProcessesResponse.data.file_sub_statuses || [];

        } else {

        }
        this.checkCatalogsLoaded();
      },
      error: (error) => {

        this.checkCatalogsLoaded();
      }
    });
  }

  private checkCatalogsLoaded(): void {
    // Verificar si ambos catálogos han terminado de cargar (exitosamente o con error)
    if (this.fileStatuses.length > 0 || this.subProcesses.length > 0) {
      this.loadingCatalogs = false;

      // Poblar el formulario después de que los catálogos estén listos
      this.populateForm();
    }
  }

  private populateForm(): void {
    if (this.data.documentType && this.data.mode === 'edit') {
      const dt = this.data.documentType;
      const selectedPhase = dt.id_process_type ?? (dt as any).IdProcessType ?? '0';
      this.documentTypeForm.patchValue({
        name: dt.name ?? (dt as any).Name,
        enabled: dt.enabled ?? (dt as any).Enabled,
        req_expiration: dt.req_expiration ?? (dt as any).ReqExpiration ?? '0',
        id_process_type: selectedPhase,
        required: dt.required ?? (dt as any).Required ?? '1',
        id_sub_process: selectedPhase === 'Liberación' ? (dt.id_sub_process ?? (dt as any).IdSubProcess ?? '0') : '0',
        available_to_client: dt.available_to_client ?? (dt as any).AvailableToClient ?? '1'
      });
      
      
      // Actualizar el estado de la sub fase
      this.isSubPhaseEnabled = selectedPhase === 'Liberación';

    }
  }

  onSubmit(): void {
    if (this.documentTypeForm.valid) {
      this.loading = true;

      if (this.data.mode === 'create') {
        this.createDocumentType();
      } else {
        this.updateDocumentType();
      }
    }
  }

  private createDocumentType(): void {
    const v = this.documentTypeForm.value;
    const documentTypeData: DocumentTypeCreateRequest = {
      name: v.name,
      enabled: v.enabled,
      req_expiration: v.req_expiration,
      id_process_type: v.id_process_type,
      required: v.required,
      id_sub_process: v.id_sub_process,
      available_to_client: v.available_to_client
    };

    this.documentTypeService.createDocumentType(documentTypeData).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Tipo de documento creado exitosamente', 'Éxito', {
            duration: 2000
          });
          this.dialogRef.close(true);
        } else {
          this.snackBar.open(response.message || 'Error al crear tipo de documento', 'Error', {
            duration: 3000
          });
        }
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Error al crear tipo de documento', 'Error', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }

  private updateDocumentType(): void {
    const v = this.documentTypeForm.value;
    const documentTypeData: DocumentTypeUpdateRequest = {
      name: v.name,
      enabled: v.enabled,
      req_expiration: v.req_expiration,
      id_process_type: v.id_process_type,
      required: v.required,
      id_sub_process: v.id_sub_process,
      available_to_client: v.available_to_client
    };
    const id = this.data.documentType!.id ?? (this.data.documentType as any).Id;
    this.documentTypeService.updateDocumentType(id!, documentTypeData).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Tipo de documento actualizado exitosamente', 'Éxito', {
            duration: 2000
          });
          this.dialogRef.close(true);
        } else {
          this.snackBar.open(response.message || 'Error al actualizar tipo de documento', 'Error', {
            duration: 3000
          });
        }
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Error al actualizar tipo de documento', 'Error', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  get dialogTitle(): string {
    return this.data.mode === 'create' ? 'Crear Tipo de Documento' : 'Editar Tipo de Documento';
  }

  get submitButtonText(): string {
    return this.data.mode === 'create' ? 'Crear' : 'Actualizar';
  }
}
