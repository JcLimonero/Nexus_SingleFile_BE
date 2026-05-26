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
import { DefaultAgencyService } from '../../../../core/services/default-agency.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ConfirmDialogService } from '../../../../core/services/confirm-dialog.service';
import { CompanyAgencyFilterComponent } from '../../../../shared/components/company-agency-filter/company-agency-filter.component';

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
    MatCheckboxModule,
    CompanyAgencyFilterComponent
  ]
})
export class UserEditDialogComponent implements OnInit {
  userForm!: FormGroup;
  loading = false;
  showPassword = false;
  showConfirmPassword = false;
  roles: UserRole[] = [];
  /** Roles visibles en el selector. Demo (15) nunca se muestra - rol interno para presentaciones. */
  get rolesForSelect(): UserRole[] {
    let list = this.roles.filter(r => String(r.id) !== '15');
    if (this.data?.mode === 'create') {
      if (this.isLoggedInAdmin) return list;
      return list.filter(r => String(r.id) !== '7' && String(r.id) !== '8');
    }
    return list;
  }

  get isLoggedInAdmin(): boolean {
    const user = this.authService.getCurrentUser();
    return user ? String(user.role_id) === '7' : false;
  }
  agencies: Agency[] = [];
  loadingAgencies = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private defaultAgencyService: DefaultAgencyService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<UserEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User; mode: 'create' | 'edit' },
    private snackBar: MatSnackBar,
    private confirmDialog: ConfirmDialogService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadRoles();
    this.loadAgencies();
    this.populateForm();
  }

  private initializeForm(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      user: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
      mail: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      pass: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
      confirmPassword: ['', [Validators.required]],
      id_user_role: ['', Validators.required],
      default_agency: ['', Validators.required],
      enabled: ['1']
    }, { validators: this.passwordMatchValidator() });

    // En modo edición, la contraseña no es requerida
    if (this.data.mode === 'edit') {
      this.userForm.get('pass')?.setValidators([Validators.minLength(6), Validators.maxLength(100)]);
      this.userForm.get('confirmPassword')?.setValidators([]);
    }
  }

  private passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('pass');
      const confirmPassword = control.get('confirmPassword');
      
      if (password && confirmPassword && password.value !== confirmPassword.value) {
        return { passwordMismatch: true };
      }
      
      return null;
    };
  }

  private populateForm(): void {
    if (this.data.user && this.data.user.id) {
      this.userForm.patchValue({
        name: this.data.user.name,
        user: this.data.user.user,
        mail: this.data.user.mail,
        id_user_role: this.data.user.id_user_role,
        default_agency: this.data.user.default_agency,
        enabled: this.data.user.enabled || '1'
      });
      
      this.userForm.get('pass')?.setValue('');
      this.userForm.get('confirmPassword')?.setValue('');
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
    const v = this.userForm.value;
    const userData: UserCreateRequest = {
      name: v.name,
      user: v.user,
      mail: v.mail,
      pass: v.pass,
      id_user_role: v.id_user_role,
      default_agency: v.default_agency,
      enabled: '1'
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
    const v = this.userForm.value;
    const userData: UserUpdateRequest = {
      id: this.data.user.id,
      name: v.name,
      user: v.user,
      mail: v.mail,
      id_user_role: v.id_user_role,
      default_agency: v.default_agency,
      enabled: v.enabled
    };
    if (v.pass) {
      userData.pass = v.pass;
    }
    this.userService.updateUser(this.data.user.id, userData).subscribe({
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

  /**
   * Manejar cambio de estado del usuario
   */
  onStatusChange(checked: boolean): void {
    const enabledValue = checked ? '1' : '0';
    const previousValue = this.userForm.get('enabled')?.value;
    
    if (previousValue !== enabledValue) {
      this.userForm.patchValue({ enabled: enabledValue });
      
      // Mostrar mensaje informativo
      const statusMessage = checked ? 
        'Usuario habilitado - Podrá acceder al sistema' : 
        'Usuario deshabilitado - No podrá acceder al sistema';
      
      this.snackBar.open(statusMessage, 'Info', { 
        duration: 3000,
        panelClass: checked ? 'success-snackbar' : 'warning-snackbar'
      });
    }
  }

  /**
   * Cambiar estado del usuario con confirmación
   */
  toggleUserStatus(): void {
    const currentStatus = this.userForm.get('enabled')?.value === '1';
    const newStatus = !currentStatus;
    const actionText = newStatus ? 'habilitar' : 'deshabilitar';
    const userName = this.userForm.get('name')?.value;

    this.confirmDialog.confirm({
      title: `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} usuario`,
      message: `¿${actionText.charAt(0).toUpperCase() + actionText.slice(1)} al usuario "${userName}"?`,
      variant: newStatus ? 'info' : 'warning',
      confirmText: actionText.charAt(0).toUpperCase() + actionText.slice(1)
    }).subscribe(ok => {
      if (ok) this.onStatusChange(newStatus);
    });
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
    this.loadingAgencies = true;
    // Usar DefaultAgencyService que maneja caché en localStorage
    this.defaultAgencyService.obtenerAgencias().subscribe({
      next: (agencias) => {
        // Convertir al formato esperado (Agency[]) - Id debe ser string, Enabled debe ser string
        this.agencies = agencias.map(ag => {
          const agAny = ag as any;
          let enabledStr: string;
          const en = agAny.enabled ?? agAny.Enabled;
          if (typeof en === 'boolean') {
            enabledStr = en ? '1' : '0';
          } else if (typeof en === 'string') {
            enabledStr = (en === 'true' || en === '1') ? '1' : '0';
          } else {
            enabledStr = (en === 1) ? '1' : '0';
          }
          return {
            id: String(agAny.id ?? agAny.Id),
            name: agAny.name ?? agAny.Name,
            enabled: enabledStr
          } as Agency;
        });
        
        if (this.agencies.length === 0) {
          this.snackBar.open('No se encontraron agencias disponibles', 'Advertencia', {
            duration: 3000
          });
        }
        this.loadingAgencies = false;
      },
      error: (error) => {
        this.snackBar.open('Error al cargar agencias. Intenta recargar.', 'Error', {
          duration: 3000
        });
        this.loadingAgencies = false;
      }
    });
  }

  recargarAgencias(): void {
    this.loadAgencies();
  }
}
