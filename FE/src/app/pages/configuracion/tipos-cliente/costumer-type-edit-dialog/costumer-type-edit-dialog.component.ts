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
import { CostumerType, CostumerTypeCreateRequest, CostumerTypeUpdateRequest, CostumerTypeEditDialogData } from '../../../../core/interfaces/costumer-type.interface';
import { CostumerTypeService } from '../../../../core/services/costumer-type.service';

@Component({
  selector: 'app-costumer-type-edit-dialog',
  templateUrl: './costumer-type-edit-dialog.component.html',
  styleUrls: ['./costumer-type-edit-dialog.component.scss'],
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
export class CostumerTypeEditDialogComponent implements OnInit {
  costumerTypeForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private costumerTypeService: CostumerTypeService,
    private dialogRef: MatDialogRef<CostumerTypeEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CostumerTypeEditDialogData,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.populateForm();
  }

  private initializeForm(): void {
    this.costumerTypeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(600)]],
      enabled: ['1', Validators.required]
    });
  }

  private populateForm(): void {
    if (this.data.costumerType && this.data.mode === 'edit') {
      const ct = this.data.costumerType;
      this.costumerTypeForm.patchValue({
        name: ct.name ?? (ct as any).Name,
        enabled: ct.enabled ?? (ct as any).Enabled
      });
    }
  }

  onSubmit(): void {
    if (this.costumerTypeForm.valid) {
      this.loading = true;

      if (this.data.mode === 'create') {
        this.createCostumerType();
      } else {
        this.updateCostumerType();
      }
    }
  }

  private createCostumerType(): void {
    const v = this.costumerTypeForm.value;
    const costumerTypeData: CostumerTypeCreateRequest = {
      name: v.name,
      enabled: v.enabled
    };

    this.costumerTypeService.createCostumerType(costumerTypeData).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Tipo de cliente creado exitosamente', 'Éxito', {
            duration: 2000
          });
          this.dialogRef.close(true);
        } else {
          this.snackBar.open(response.message || 'Error al crear tipo de cliente', 'Error', {
            duration: 3000
          });
        }
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Error al crear tipo de cliente', 'Error', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }

  private updateCostumerType(): void {
    const ct = this.data.costumerType;
    const v = this.costumerTypeForm.value;
    const costumerTypeData: CostumerTypeUpdateRequest = {
      id: ct.id ?? (ct as any).Id!,
      name: v.name,
      enabled: v.enabled
    };
    const id = ct.id ?? (ct as any).Id;
    this.costumerTypeService.updateCostumerType(id!, costumerTypeData).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Tipo de cliente actualizado exitosamente', 'Éxito', {
            duration: 2000
          });
          this.dialogRef.close(true);
        } else {
          this.snackBar.open(response.message || 'Error al actualizar tipo de cliente', 'Error', {
            duration: 3000
          });
        }
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Error al actualizar tipo de cliente', 'Error', {
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
    return this.data.mode === 'create' ? 'Crear Tipo de Cliente' : 'Editar Tipo de Cliente';
  }

  get submitButtonText(): string {
    return this.data.mode === 'create' ? 'Crear' : 'Actualizar';
  }
}
