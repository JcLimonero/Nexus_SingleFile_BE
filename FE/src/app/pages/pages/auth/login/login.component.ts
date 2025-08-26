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
import { AuthService, LoginRequest, LoginResponse } from '../../../../core/services/auth.service';
import { take } from 'rxjs/operators';

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

      const credentials: LoginRequest = {
        email: this.form.get('email')?.value || '',
        password: this.form.get('password')?.value || ''
      };

      this.authService.login(credentials).subscribe({
        next: (response: LoginResponse) => {
          this.loading = false;
          this.cd.markForCheck();
          
          if (response.success) {
            const roleInfo = response.user?.role_name || response.user?.role ? ` (${response.user.role_name || response.user.role})` : '';
            this.snackbar.open(`Inicio de sesión exitoso${roleInfo}`, 'OK', {
              duration: 3000
            });
            
            // Esperar a que el estado de autenticación se actualice
            this.authService.isAuthenticated$.pipe(take(1)).subscribe(isAuth => {
              if (isAuth) {
                this.router.navigate(['/']).then(() => {
                  // Navegación exitosa
                }).catch(error => {
                  // Error en navegación
                });
              } else {
                // Estado no se actualizó correctamente
              }
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
          
          this.snackbar.open(
            'Error de conexión. Verifica tu conexión a internet.',
            'Error',
            { duration: 5000 }
          );
        }
      });
    } else if (this.form.invalid) {
      this.snackbar.open('Por favor, completa todos los campos correctamente', 'Error', {
        duration: 3000
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

  // Método de prueba temporal
  testLogout() {
    this.authService.testLogout();
  }
}
