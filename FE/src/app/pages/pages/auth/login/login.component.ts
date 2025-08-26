import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService, AuthResponse } from '../../../../core/services/auth.service';

@Component({
  selector: 'vex-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUp400ms],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgIf,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatCheckboxModule,
    RouterLink,
    MatSnackBarModule
  ]
})
export class LoginComponent {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  inputType = 'password';
  visible = false;
  loading = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private snackbar: MatSnackBar,
    private authService: AuthService
  ) {}

  send() {
    if (this.form.valid && !this.loading) {
      this.loading = true;
      this.cd.markForCheck();

      const email = this.form.get('email')?.value || '';
      const password = this.form.get('password')?.value || '';

      this.authService.login(email, password).subscribe({
        next: (response: AuthResponse) => {
          this.loading = false;
          this.cd.markForCheck();
          
          if (response.success) {
            const roleInfo = response.user?.role_name ? ` (${response.user.role_name})` : '';
            this.snackbar.open(`Inicio de sesión exitoso${roleInfo}`, 'OK', {
              duration: 3000
            });
            
            // Navegar al dashboard después del login exitoso
            this.router.navigate(['/']).then(() => {
              console.log('✅ Navegación exitosa al dashboard');
            }).catch(error => {
              console.error('❌ Error en navegación:', error);
            });
          } else {
            this.snackbar.open(response.message || 'Error en el inicio de sesión', 'Error', {
              duration: 5000
            });
          }
        },
        error: (error: any) => {
          this.loading = false;
          this.cd.markForCheck();
          
          console.error('Error en login:', error);
          let errorMessage = 'Error en el inicio de sesión';
          
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

  toggleVisibility() {
    if (this.visible) {
      this.inputType = 'password';
      this.visible = false;
      this.cd.markForCheck();
    } else {
      this.inputType = 'text';
      this.visible = true;
      this.cd.markForCheck();
    }
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

  // Método para probar logout (solo para desarrollo)
  testLogout() {
    this.authService.logout().subscribe({
      next: () => {
        this.snackbar.open('Logout exitoso', 'Info', { duration: 3000 });
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.snackbar.open('Error en logout', 'Error', { duration: 3000 });
      }
    });
  }
}
