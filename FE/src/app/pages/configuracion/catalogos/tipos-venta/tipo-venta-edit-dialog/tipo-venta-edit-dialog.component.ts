import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Proceso, ProcesoUpdateRequest } from '../../../../../core/interfaces/proceso.interface';
import { ProcesoService } from '../../../../../core/services/proceso.service';

export interface TipoVentaEditDialogData {
  proceso: Proceso;
  mode: 'edit' | 'create';
}

@Component({
  selector: 'app-tipo-venta-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './tipo-venta-edit-dialog.component.html'
})
export class TipoVentaEditDialogComponent implements OnInit {
  procesoForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private procesoService: ProcesoService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<TipoVentaEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TipoVentaEditDialogData
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    if (this.data.mode === 'edit') {
      this.populateForm();
    }
  }

  private initializeForm(): void {
    this.procesoForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(600)]],
      enabled: ['1', Validators.required]
    });
  }

  private populateForm(): void {
    if (this.data.proceso) {
      this.procesoForm.patchValue({
        name: this.data.proceso.name,
        enabled: this.data.proceso.enabled
      });
    }
  }

  onSubmit(): void {
    if (this.procesoForm.valid) {
      this.loading = true;
      
      if (this.data.mode === 'edit') {
        this.updateProceso();
      } else {
        this.createProceso();
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private updateProceso(): void {
    const v = this.procesoForm.value;
    const updateData: ProcesoUpdateRequest = {
      id: this.data.proceso.id,
      name: v.name,
      enabled: v.enabled
    };

    this.procesoService.updateProceso(updateData).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.snackBar.open('Proceso actualizado exitosamente', 'Éxito', {
            duration: 2000
          });
          this.dialogRef.close(true);
        } else {
          this.snackBar.open(response.message || 'Error al actualizar proceso', 'Error', {
            duration: 3000
          });
        }
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open('Error al actualizar proceso', 'Error', {
          duration: 3000
        });
      }
    });
  }

  private createProceso(): void {
    const v = this.procesoForm.value;
    this.procesoService.createProceso({ name: v.name, enabled: v.enabled }).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.snackBar.open('Proceso creado exitosamente', 'Éxito', {
            duration: 2000
          });
          this.dialogRef.close(true);
        } else {
          this.snackBar.open(response.message || 'Error al crear proceso', 'Error', {
            duration: 3000
          });
        }
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open('Error al crear proceso', 'Error', {
          duration: 3000
        });
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.procesoForm.controls).forEach(key => {
      const control = this.procesoForm.get(key);
      control?.markAsTouched();
    });
  }
}
