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

    this.documentTypeForm.get('id_sale_type')?.valueChanges.subscribe(selectedPhaseId => {
      this.isSubPhaseEnabled = selectedPhaseId != null && selectedPhaseId !== '' && selectedPhaseId !== '0';
      if (this.isSubPhaseEnabled) {
        this.documentTypeForm.patchValue({ id_sub_sale_type: null }, { emitEvent: false });
        this.loadSubProcessesByPhase(selectedPhaseId);
      } else {
        this.documentTypeForm.patchValue({ id_sub_sale_type: null }, { emitEvent: false });
        this.subProcesses = [];
      }
    });
  }

  private initializeForm(): void {
    this.documentTypeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(600)]],
      enabled: ['1', Validators.required],
      req_expiration: ['0'],
      id_sale_type: [null as number | null],
      required: ['1'],
      id_sub_sale_type: [null as number | null],
      available_to_client: ['1']
    });
  }

  private loadCatalogs(): void {
    this.loadingCatalogs = true;

    this.documentTypeService.getActiveFileStates().subscribe({
      next: (fileStatusesResponse) => {
        if (fileStatusesResponse?.success) {
          this.fileStatuses = fileStatusesResponse.data.file_states || [];
        }
        this.checkCatalogsLoaded();
      },
      error: () => this.checkCatalogsLoaded()
    });
  }

  private checkCatalogsLoaded(): void {
    if (this.fileStatuses.length > 0) {
      this.loadingCatalogs = false;
      this.populateForm();
    }
  }

  /** Cargar sub fases filtradas por id_expedient_state (relación expedient_state - expedient_sub_state) */
  private loadSubProcessesByPhase(phaseId: number | string): void {
    const id = typeof phaseId === 'string' ? parseInt(phaseId, 10) : phaseId;
    if (isNaN(id)) {
      this.subProcesses = [];
      return;
    }
    this.documentTypeService.getActiveSubProcesses(id).subscribe({
      next: (res) => {
        this.subProcesses = res?.data?.file_sub_states || [];
      },
      error: () => { this.subProcesses = []; }
    });
  }

  private populateForm(): void {
    const defaultPhase = this.fileStatusesForForm.find(fs => (fs.name ?? fs.Name) === 'Liberación')
      ?? this.fileStatusesForForm[0];
    const defaultPhaseId = defaultPhase ? (defaultPhase.id ?? defaultPhase.Id) : null;

    if (this.data.documentType && this.data.mode === 'edit') {
      const dt = this.data.documentType;
      const selectedPhaseId = dt.id_sale_type ?? (dt as any).IdProcessType ?? defaultPhaseId;
      const selectedSubProcess = dt.id_sub_sale_type ?? (dt as any).IdSubProcess ?? null;
      this.documentTypeForm.patchValue({
        name: dt.name ?? (dt as any).Name,
        enabled: dt.enabled ?? (dt as any).Enabled,
        req_expiration: dt.req_expiration ?? (dt as any).ReqExpiration ?? '0',
        id_sale_type: selectedPhaseId,
        required: dt.required ?? (dt as any).Required ?? '1',
        id_sub_sale_type: selectedSubProcess,
        available_to_client: dt.available_to_client ?? (dt as any).AvailableToClient ?? '1'
      }, { emitEvent: false });
      this.isSubPhaseEnabled = selectedPhaseId != null && selectedPhaseId !== '' && selectedPhaseId !== '0';
      if (this.isSubPhaseEnabled) this.loadSubProcessesByPhase(selectedPhaseId);
    } else {
      this.documentTypeForm.patchValue({
        id_sale_type: defaultPhaseId,
        id_sub_sale_type: null
      }, { emitEvent: false });
      this.isSubPhaseEnabled = defaultPhaseId != null;
      if (this.isSubPhaseEnabled) this.loadSubProcessesByPhase(defaultPhaseId);
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
      id_sale_type: v.id_sale_type,
      required: v.required,
      id_sub_sale_type: v.id_sub_sale_type,
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
      id_sale_type: v.id_sale_type,
      required: v.required,
      id_sub_sale_type: v.id_sub_sale_type,
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

  /** Fases disponibles: en modo crear se oculta Liquidación (documento del sistema) */
  get fileStatusesForForm(): any[] {
    if (this.data.mode !== 'create') {
      return this.fileStatuses;
    }
    return this.fileStatuses.filter(
      fs => (fs.name ?? fs.Name ?? '') !== 'Liquidación'
    );
  }
}
