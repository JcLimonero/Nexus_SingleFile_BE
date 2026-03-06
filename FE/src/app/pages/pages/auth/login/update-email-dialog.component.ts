import {
  Component,
  Inject,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';

export interface UpdateEmailDialogData {
  user_id: number;
  username: string;
  name: string;
  password: string; // Contraseña ya verificada del login
}

@Component({
  selector: 'vex-update-email-dialog',
  templateUrl: './update-email-dialog.component.html',
  styleUrls: ['./update-email-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    NgIf
  ]
})
export class UpdateEmailDialogComponent {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  loading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UpdateEmailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UpdateEmailDialogData,
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private cd: ChangeDetectorRef
  ) {
    // Pre-llenar la contraseña que ya fue verificada
    this.form.patchValue({
      password: data.password
    });
  }

  onSubmit() {
    if (this.form.valid && !this.loading) {
      this.loading = true;
      this.cd.markForCheck();

      const email = this.form.get('email')?.value || '';
      const password = this.form.get('password')?.value || '';

      this.authService.updateEmail(this.data.user_id, email, password).subscribe({
        next: (response) => {
          this.loading = false;
          this.cd.markForCheck();

          if (response.success) {
            this.snackbar.open(response.message, 'Éxito', {
              duration: 3000
            });
            
            // Cerrar diálogo y retornar el email actualizado
            this.dialogRef.close({ success: true, email: email });
          } else {
            this.snackbar.open(response.message || 'Error al actualizar email', 'Error', {
              duration: 5000
            });
          }
        },
        error: (error: any) => {
          this.loading = false;
          this.cd.markForCheck();

          let errorMessage = 'Error al actualizar email';
          
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          this.snackbar.open(errorMessage, 'Error', {
            duration: 5000
          });
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close({ success: false });
  }

  getErrorMessage(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName === 'email' ? 'Email' : 'Contraseña'} es requerido`;
    }
    if (field?.hasError('email')) {
      return 'Email inválido';
    }
    return '';
  }
}

