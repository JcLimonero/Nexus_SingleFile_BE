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
import { TipoOperacion, TipoOperacionCreateRequest, TipoOperacionUpdateRequest } from '../../../../../core/interfaces/tipo-operacion.interface';
import { TipoOperacionService } from '../../../../../core/services/tipo-operacion.service';

@Component({
  selector: 'app-tipo-operacion-edit-dialog',
  templateUrl: './tipo-operacion-edit-dialog.component.html',
  styleUrls: ['./tipo-operacion-edit-dialog.component.scss'],
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
export class TipoOperacionEditDialogComponent implements OnInit {
  tipoOperacionForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private tipoOperacionService: TipoOperacionService,
    private dialogRef: MatDialogRef<TipoOperacionEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { tipoOperacion: TipoOperacion; mode: 'create' | 'edit' },
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.populateForm();
  }

  private initializeForm(): void {
    this.tipoOperacionForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(600)]],
      enabled: ['1', Validators.required]
    });
  }

  private populateForm(): void {
    if (this.data.tipoOperacion) {
      const to = this.data.tipoOperacion;
      this.tipoOperacionForm.patchValue({
        name: to.name ?? (to as any).Name,
        enabled: to.enabled ?? (to as any).Enabled
      });
    }
  }

  onSubmit(): void {
    if (this.tipoOperacionForm.valid) {
      this.loading = true;

      if (this.data.mode === 'create') {
        this.createTipoOperacion();
      } else {
        this.updateTipoOperacion();
      }
    }
  }

  private createTipoOperacion(): void {
    const v = this.tipoOperacionForm.value;
    const tipoOperacionData: TipoOperacionCreateRequest = {
      name: v.name,
      enabled: v.enabled
    };

    this.tipoOperacionService.createTipoOperacion(tipoOperacionData).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Tipo de operación creado exitosamente', 'Éxito', {
            duration: 2000
          });
          this.dialogRef.close(true);
        } else {
          this.snackBar.open(response.message || 'Error al crear tipo de operación', 'Error', {
            duration: 3000
          });
        }
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Error al crear tipo de operación', 'Error', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }

  private updateTipoOperacion(): void {
    const to = this.data.tipoOperacion;
    const v = this.tipoOperacionForm.value;
    const tipoOperacionData: TipoOperacionUpdateRequest = {
      id: to.id ?? (to as any).Id!,
      name: v.name,
      enabled: v.enabled
    };
    const id = to.id ?? (to as any).Id;
    this.tipoOperacionService.updateTipoOperacion(id!, tipoOperacionData).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Tipo de operación actualizado exitosamente', 'Éxito', {
            duration: 2000
          });
          this.dialogRef.close(true);
        } else {
          this.snackBar.open(response.message || 'Error al actualizar tipo de operación', 'Error', {
            duration: 3000
          });
        }
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Error al actualizar tipo de operación', 'Error', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
