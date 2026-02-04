import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService, AuthResponse } from '../../../../core/services/auth.service';
import { UpdateEmailDialogComponent } from './update-email-dialog.component';
import { BrandingService } from '../../../../core/services/branding.service';
import { AsyncPipe } from '@angular/common';
import { map } from 'rxjs/operators';

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
    MatSnackBarModule,
    MatDialogModule,
    AsyncPipe
  ]
})
export class LoginComponent {
  logoLogin$ = this.brandingService.getBranding$().pipe(map((b) => b.logoLogin));

  form = this.fb.group({
    email: ['', [Validators.required]], // Removido Validators.email para permitir username también
    password: ['', Validators.required]
  });

  inputType = 'password';
  visible = false;
  loading = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly snackBar: MatSnackBar,
    private readonly cdr: ChangeDetectorRef,
    private readonly dialog: MatDialog,
    private readonly brandingService: BrandingService
  ) {}

  send() {
    if (this.form.valid && !this.loading) {
      this.loading = true;
      this.cdr.markForCheck();

      const identifier = this.form.get('email')?.value || ''; // Puede ser email o username
      const password = this.form.get('password')?.value || '';

      this.authService.login(identifier, password).subscribe({
        next: (response: AuthResponse) => {
          this.loading = false;
          this.cdr.markForCheck();
          
          // Verificar si requiere completar email
          if (response.requires_email && response.user_id) {
            this.openUpdateEmailDialog(response.user_id, response.username || '', response.name || '', password);
            return;
          }
          
          if (response.success && response.user && response.access_token) {
            const roleInfo = response.user?.role_name ? ` (${response.user.role_name})` : '';
            const loginMethod = response.login_method === 'username' ? ' (usuario)' : '';
            this.snackBar.open(`Inicio de sesión exitoso${roleInfo}${loginMethod}`, 'OK', {
              duration: 3000
            });
            
            // Esperar un momento para asegurar que los datos de autenticación estén guardados
            // antes de navegar (evita problemas de timing con el interceptor)
            setTimeout(() => {
              // Verificar que el token esté disponible antes de navegar
              const token = this.authService.getToken();
              if (token && this.authService.isAuthenticated()) {
                this.router.navigate(['/']).then(() => {

                }).catch(error => {

                });
              } else {

                // Si el token no está disponible aún, esperar un poco más
                setTimeout(() => {
                  this.router.navigate(['/']);
                }, 200);
              }
            }, 100);
          } else {
            this.snackBar.open(response.message || 'Error en el inicio de sesión', 'Error', {
              duration: 5000
            });
          }
        },
        error: (error: any) => {
          this.loading = false;
          this.cdr.markForCheck();

          let errorMessage = 'Error en el inicio de sesión';
          
          // Verificar si el error es requires_email
          if (error.error && error.error.requires_email) {
            this.openUpdateEmailDialog(
              error.error.user_id,
              error.error.username || '',
              error.error.name || '',
              password
            );
            return;
          }
          
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          this.snackBar.open(errorMessage, 'Error', {
            duration: 5000
          });
        }
      });
    }
  }

  /**
   * Abrir diálogo para actualizar email
   */
  private openUpdateEmailDialog(userId: number, username: string, name: string, password: string) {
    const dialogRef = this.dialog.open(UpdateEmailDialogComponent, {
      width: '500px',
      disableClose: true,
      data: {
        user_id: userId,
        username: username,
        name: name,
        password: password
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.success) {
        // Email actualizado exitosamente, intentar login nuevamente con el email
        this.snackBar.open('Email actualizado. Iniciando sesión...', 'Info', {
          duration: 2000
        });
        
        // Intentar login con el nuevo email
        setTimeout(() => {
          this.form.patchValue({ email: result.email });
          this.send();
        }, 500);
      }
    });
  }

  toggleVisibility() {
    if (this.visible) {
      this.inputType = 'password';
      this.visible = false;
      this.cdr.markForCheck();
    } else {
      this.inputType = 'text';
      this.visible = true;
      this.cdr.markForCheck();
    }
  }

  getErrorMessage(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName === 'email' ? 'Email/Usuario' : 'Contraseña'} es requerido`;
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
        this.snackBar.open('Logout exitoso', 'Info', { duration: 3000 });
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.snackBar.open('Error en logout', 'Error', { duration: 3000 });
      }
    });
  }
}
