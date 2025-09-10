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
    this.documentTypeForm.get('IdProcessType')?.valueChanges.subscribe(selectedPhase => {
      console.log('🔄 Fase cambiada a:', selectedPhase);
      this.isSubPhaseEnabled = selectedPhase === 'Liberación';
      console.log('🔒 Sub fase habilitada:', this.isSubPhaseEnabled);
      
      if (!this.isSubPhaseEnabled) {
        // Si la fase no es "Liberación", resetear sub fase a "Sin sub fase"
        console.log('❌ Fase no es Liberación, reseteando sub fase a "Sin sub fase"');
        this.documentTypeForm.patchValue({ IdSubProcess: '0' });
        console.log('🔄 Valor de IdSubProcess establecido a "0" (Sin sub fase)');
      } else {
        console.log('✅ Fase es Liberación, sub fase habilitada');
      }
    });
  }

  private initializeForm(): void {
    this.documentTypeForm = this.fb.group({
      Name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(600)]],
      Enabled: ['1', Validators.required],
      ReqExpiration: ['0'],
      IdProcessType: ['Liberación'], // Valor por defecto: Liberación
      Required: ['1'],
      IdSubProcess: ['0'], // Por defecto "Sin sub fase"
      AvailableToClient: ['1'] // Por defecto disponible al cliente
    });
    
    // Inicializar el estado de la sub fase
    this.isSubPhaseEnabled = true; // Por defecto es "Liberación"
    console.log('🚀 Formulario inicializado, sub fase habilitada:', this.isSubPhaseEnabled);
  }

  private loadCatalogs(): void {
    console.log('🔄 Cargando catálogos...');
    this.loadingCatalogs = true;
    
    // Cargar estados de archivo (File_Status)
    this.documentTypeService.getActiveFileStatuses().subscribe({
      next: (fileStatusesResponse) => {
        console.log('📋 Respuesta de File_Status:', fileStatusesResponse);
        if (fileStatusesResponse?.success) {
          this.fileStatuses = fileStatusesResponse.data.file_statuses || [];
          console.log('✅ Estados de archivo cargados:', this.fileStatuses);
        } else {
          console.error('❌ Error en respuesta de File_Status:', fileStatusesResponse);
        }
        this.checkCatalogsLoaded();
      },
      error: (error) => {
        console.error('❌ Error cargando estados de archivo:', error);
        this.checkCatalogsLoaded();
      }
    });

    // Cargar subestados de archivo (File_SubStatus)
    this.documentTypeService.getActiveSubProcesses().subscribe({
      next: (subProcessesResponse) => {
        console.log('📋 Respuesta de File_SubStatus:', subProcessesResponse);
        if (subProcessesResponse?.success) {
          this.subProcesses = subProcessesResponse.data.file_sub_statuses || [];
          console.log('✅ Subestados de archivo cargados:', this.subProcesses);
        } else {
          console.error('❌ Error en respuesta de File_SubStatus:', subProcessesResponse);
        }
        this.checkCatalogsLoaded();
      },
      error: (error) => {
        console.error('❌ Error cargando subestados de archivo:', error);
        this.checkCatalogsLoaded();
      }
    });
  }

  private checkCatalogsLoaded(): void {
    // Verificar si ambos catálogos han terminado de cargar (exitosamente o con error)
    if (this.fileStatuses.length > 0 || this.subProcesses.length > 0) {
      this.loadingCatalogs = false;
      console.log('✅ Catálogos cargados - File_Status:', this.fileStatuses.length, 'File_SubStatus:', this.subProcesses.length);
      
      // Poblar el formulario después de que los catálogos estén listos
      this.populateForm();
    }
  }

  private populateForm(): void {
    if (this.data.documentType && this.data.mode === 'edit') {
      const selectedPhase = this.data.documentType.IdProcessType || '0';
      
      
      this.documentTypeForm.patchValue({
        Name: this.data.documentType.Name,
        Enabled: this.data.documentType.Enabled,
        ReqExpiration: this.data.documentType.ReqExpiration || '0',
        IdProcessType: selectedPhase,
        Required: this.data.documentType.Required || '1',
        IdSubProcess: selectedPhase === 'Liberación' ? (this.data.documentType.IdSubProcess || '0') : '0',
        AvailableToClient: this.data.documentType.AvailableToClient !== undefined ? this.data.documentType.AvailableToClient : '1'
      });
      
      
      // Actualizar el estado de la sub fase
      this.isSubPhaseEnabled = selectedPhase === 'Liberación';
      console.log('📝 Formulario poblado, sub fase habilitada:', this.isSubPhaseEnabled);
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
    const documentTypeData: DocumentTypeCreateRequest = {
      Name: this.documentTypeForm.value.Name,
      Enabled: this.documentTypeForm.value.Enabled,
      ReqExpiration: this.documentTypeForm.value.ReqExpiration,
      IdProcessType: this.documentTypeForm.value.IdProcessType,
      Required: this.documentTypeForm.value.Required,
      IdSubProcess: this.documentTypeForm.value.IdSubProcess,
      AvailableToClient: this.documentTypeForm.value.AvailableToClient
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
    const documentTypeData: DocumentTypeUpdateRequest = {
      Name: this.documentTypeForm.value.Name,
      Enabled: this.documentTypeForm.value.Enabled,
      ReqExpiration: this.documentTypeForm.value.ReqExpiration,
      IdProcessType: this.documentTypeForm.value.IdProcessType,
      Required: this.documentTypeForm.value.Required,
      IdSubProcess: this.documentTypeForm.value.IdSubProcess,
      AvailableToClient: this.documentTypeForm.value.AvailableToClient
    };


    this.documentTypeService.updateDocumentType(this.data.documentType!.Id!, documentTypeData).subscribe({
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
