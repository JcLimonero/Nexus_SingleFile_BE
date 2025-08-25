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
      Name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(600)]],
      Enabled: ['1', Validators.required]
    });
  }

  private populateForm(): void {
    if (this.data.costumerType && this.data.mode === 'edit') {
      this.costumerTypeForm.patchValue({
        Name: this.data.costumerType.Name,
        Enabled: this.data.costumerType.Enabled
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
    const costumerTypeData: CostumerTypeCreateRequest = {
      Name: this.costumerTypeForm.value.Name,
      Enabled: this.costumerTypeForm.value.Enabled
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
        console.error('Error creating costumer type:', error);
        this.snackBar.open('Error al crear tipo de cliente', 'Error', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }

  private updateCostumerType(): void {
    const costumerTypeData: CostumerTypeUpdateRequest = {
      Id: this.data.costumerType.Id!,
      Name: this.costumerTypeForm.value.Name,
      Enabled: this.costumerTypeForm.value.Enabled
    };

    this.costumerTypeService.updateCostumerType(this.data.costumerType.Id!, costumerTypeData).subscribe({
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
        console.error('Error updating costumer type:', error);
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
