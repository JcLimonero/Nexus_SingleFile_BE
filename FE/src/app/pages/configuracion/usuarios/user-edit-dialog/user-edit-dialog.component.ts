import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { User, UserCreateRequest, UserUpdateRequest, UserRole, Agency } from '../../../../core/interfaces/user.interface';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-user-edit-dialog',
  templateUrl: './user-edit-dialog.component.html',
  styleUrls: ['./user-edit-dialog.component.scss'],
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
    MatTooltipModule,
    MatCheckboxModule
  ]
})
export class UserEditDialogComponent implements OnInit {
  userForm!: FormGroup;
  loading = false;
  showPassword = false;
  showConfirmPassword = false;
  roles: UserRole[] = [];
  agencies: Agency[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialogRef: MatDialogRef<UserEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User; mode: 'create' | 'edit' },
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadRoles();
    this.loadAgencies();
    this.populateForm();
  }

  private initializeForm(): void {
    this.userForm = this.fb.group({
      Name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      User: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
      Mail: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      Pass: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
      ConfirmPassword: ['', [Validators.required]],
      IdUserRol: ['', Validators.required],
      DefaultAgency: ['', Validators.required]
    }, { validators: this.passwordMatchValidator() });

    // En modo edición, la contraseña no es requerida
    if (this.data.mode === 'edit') {
      this.userForm.get('Pass')?.setValidators([Validators.minLength(6), Validators.maxLength(100)]);
      this.userForm.get('ConfirmPassword')?.setValidators([]);
    }
  }

  private passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('Pass');
      const confirmPassword = control.get('ConfirmPassword');
      
      if (password && confirmPassword && password.value !== confirmPassword.value) {
        return { passwordMismatch: true };
      }
      
      return null;
    };
  }

  private populateForm(): void {
    if (this.data.user && this.data.user.Id) {
      this.userForm.patchValue({
        Name: this.data.user.Name,
        User: this.data.user.User,
        Mail: this.data.user.Mail,
        IdUserRol: this.data.user.IdUserRol,
        DefaultAgency: this.data.user.DefaultAgency
      });
      
      // Limpiar campos de contraseña en edición
      this.userForm.get('Pass')?.setValue('');
      this.userForm.get('ConfirmPassword')?.setValue('');
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.loading = true;

      if (this.data.mode === 'create') {
        this.createUser();
      } else {
        this.updateUser();
      }
    }
  }

  private createUser(): void {
    const userData: UserCreateRequest = {
      Name: this.userForm.value.Name,
      User: this.userForm.value.User,
      Mail: this.userForm.value.Mail,
      Pass: this.userForm.value.Pass,
      IdUserRol: this.userForm.value.IdUserRol,
      DefaultAgency: this.userForm.value.DefaultAgency,
      Enabled: '1'
    };

    this.userService.createUser(userData).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Usuario creado exitosamente', 'Éxito', {
            duration: 2000
          });
          this.dialogRef.close(true);
        } else {
          this.snackBar.open(response.message || 'Error al crear usuario', 'Error', {
            duration: 3000
          });
        }
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Error al crear usuario', 'Error', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }

  private updateUser(): void {
    const userData: UserUpdateRequest = {
      Id: this.data.user.Id,
      Name: this.userForm.value.Name,
      User: this.userForm.value.User,
      Mail: this.userForm.value.Mail,
      IdUserRol: this.userForm.value.IdUserRol,
      DefaultAgency: this.userForm.value.DefaultAgency
    };

    // Solo incluir contraseña si se proporcionó una nueva
    if (this.userForm.value.Pass) {
      userData.Pass = this.userForm.value.Pass;
    }

    this.userService.updateUser(this.data.user.Id, userData).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Usuario actualizado exitosamente', 'Éxito', {
            duration: 2000
          });
          this.dialogRef.close(true);
        } else {
          this.snackBar.open(response.message || 'Error al actualizar usuario', 'Error', {
            duration: 3000
          });
        }
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Error al actualizar usuario', 'Error', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  private loadRoles(): void {
    this.userService.getUserRoles().subscribe({
      next: (response) => {
        if (response.success) {
          this.roles = response.data.roles || response.data;
        }
      },
      error: (error) => {
        // Error loading roles
      }
    });
  }

  private loadAgencies(): void {
    this.userService.getAgencies().subscribe({
      next: (response) => {
        if (response.success) {
          this.agencies = response.data.agencies || response.data;
        }
      },
      error: (error) => {
        // Error loading agencies
      }
    });
  }
}
