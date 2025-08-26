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
  fileStatuses: any[] = [];
  subProcesses: any[] = [];

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
    this.populateForm();
  }

  private initializeForm(): void {
    this.documentTypeForm = this.fb.group({
      Name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(600)]],
      Enabled: [1, Validators.required],
      ReqExpiration: [0],
      IdProcessType: [0],
      Required: [1],
      IdSubProcess: [0]
    });
  }

  private loadCatalogs(): void {
    // Cargar estados de archivo y subprocesos
    Promise.all([
      this.documentTypeService.getActiveFileStatuses().toPromise(),
      this.documentTypeService.getActiveSubProcesses().toPromise()
    ]).then(([fileStatusesResponse, subProcessesResponse]) => {
      if (fileStatusesResponse?.success) {
        this.fileStatuses = fileStatusesResponse.data.file_statuses || [];
      }
      if (subProcessesResponse?.success) {
        this.subProcesses = subProcessesResponse.data.processes || [];
      }
    }).catch(error => {
      console.error('Error loading catalogs:', error);
    });
  }

  private populateForm(): void {
    if (this.data.documentType && this.data.mode === 'edit') {
      this.documentTypeForm.patchValue({
        Name: this.data.documentType.Name,
        Enabled: this.data.documentType.Enabled,
        ReqExpiration: this.data.documentType.ReqExpiration || 0,
        IdProcessType: this.data.documentType.IdProcessType || 0,
        Required: this.data.documentType.Required || 1,
        IdSubProcess: this.data.documentType.IdSubProcess || 0
      });
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
      IdSubProcess: this.documentTypeForm.value.IdSubProcess
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
        console.error('Error creating document type:', error);
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
      IdSubProcess: this.documentTypeForm.value.IdSubProcess
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
        console.error('Error updating document type:', error);
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
