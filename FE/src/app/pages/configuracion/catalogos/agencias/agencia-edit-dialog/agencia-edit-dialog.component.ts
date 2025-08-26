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

import { Agency } from '../../../../../core/services/agency.service';
import { AgencyService } from '../../../../../core/services/agency.service';

export interface AgenciaEditDialogData {
  agencia: Agency;
  mode: 'edit' | 'create';
}

@Component({
  selector: 'app-agencia-edit-dialog',
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
  templateUrl: './agencia-edit-dialog.component.html'
})
export class AgenciaEditDialogComponent implements OnInit {
  agenciaForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private agencyService: AgencyService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AgenciaEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AgenciaEditDialogData
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    if (this.data.mode === 'edit') {
      this.populateForm();
    }
  }

  private initializeForm(): void {
    this.agenciaForm = this.fb.group({
      Name: ['', [Validators.required, Validators.minLength(3)]],
      IdAgency: ['', [Validators.required, Validators.minLength(1)]],
      Enabled: ['1', Validators.required]
    });
  }

  private populateForm(): void {
    if (this.data.agencia) {
      this.agenciaForm.patchValue({
        Name: this.data.agencia.Name,
        IdAgency: this.data.agencia.IdAgency,
        Enabled: this.data.agencia.Enabled
      });
    }
  }



  onSubmit(): void {
    if (this.agenciaForm.valid) {
      this.loading = true;
      
      if (this.data.mode === 'edit') {
        this.updateAgencia();
      } else {
        this.createAgencia();
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private updateAgencia(): void {
    const updateData = {
      Id: this.data.agencia.Id,
      ...this.agenciaForm.value
    };

    this.agencyService.updateAgency(Number(updateData.Id), updateData).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.snackBar.open('Agencia actualizada exitosamente', 'Éxito', {
            duration: 3000
          });
          this.dialogRef.close(true);
        } else {
          this.snackBar.open(response.message || 'Error al actualizar agencia', 'Error', {
            duration: 3000
          });
        }
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open('Error de conexión al actualizar agencia', 'Error', {
          duration: 3000
        });
      }
    });
  }

  private createAgencia(): void {
    const createData = this.agenciaForm.value;

    this.agencyService.createAgency(createData).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.snackBar.open('Agencia creada exitosamente', 'Éxito', {
            duration: 3000
          });
          this.dialogRef.close(true);
        } else {
          this.snackBar.open(response.message || 'Error al crear agencia', 'Error', {
            duration: 3000
          });
        }
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open('Error de conexión al crear agencia', 'Error', {
          duration: 3000
        });
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.agenciaForm.controls).forEach(key => {
      const control = this.agenciaForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
