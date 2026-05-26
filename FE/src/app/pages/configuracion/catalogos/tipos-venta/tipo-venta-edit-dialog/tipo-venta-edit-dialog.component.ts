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

import { TipoVenta, TipoVentaUpdateRequest } from '../../../../../core/interfaces/tipo-venta.interface';
import { TipoVentaService } from '../../../../../core/services/tipo-venta.service';

export interface TipoVentaEditDialogData {
  tipoVenta: TipoVenta;
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
  tipoVentaForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private tipoVentaService: TipoVentaService,
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
    this.tipoVentaForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(600)]],
      enabled: ['1', Validators.required]
    });
  }

  private populateForm(): void {
    if (this.data.tipoVenta) {
      this.tipoVentaForm.patchValue({
        name: this.data.tipoVenta.name,
        enabled: this.data.tipoVenta.enabled
      });
    }
  }

  onSubmit(): void {
    if (this.tipoVentaForm.valid) {
      this.loading = true;

      if (this.data.mode === 'edit') {
        this.updateTipoVenta();
      } else {
        this.createTipoVenta();
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private updateTipoVenta(): void {
    const v = this.tipoVentaForm.value;
    const updateData: TipoVentaUpdateRequest = {
      id: this.data.tipoVenta.id,
      name: v.name,
      enabled: v.enabled
    };

    this.tipoVentaService.updateTipoVenta(updateData).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.snackBar.open('Tipo de venta actualizado exitosamente', 'Éxito', {
            duration: 2000
          });
          this.dialogRef.close(true);
        } else {
          this.snackBar.open(response.message || 'Error al actualizar tipo de venta', 'Error', {
            duration: 3000
          });
        }
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open('Error al actualizar tipo de venta', 'Error', {
          duration: 3000
        });
      }
    });
  }

  private createTipoVenta(): void {
    const v = this.tipoVentaForm.value;
    this.tipoVentaService.createTipoVenta({ name: v.name, enabled: v.enabled }).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.snackBar.open('Tipo de venta creado exitosamente', 'Éxito', {
            duration: 2000
          });
          this.dialogRef.close(true);
        } else {
          this.snackBar.open(response.message || 'Error al crear tipo de venta', 'Error', {
            duration: 3000
          });
        }
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open('Error al crear tipo de venta', 'Error', {
          duration: 3000
        });
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.tipoVentaForm.controls).forEach(key => {
      const control = this.tipoVentaForm.get(key);
      control?.markAsTouched();
    });
  }
}
