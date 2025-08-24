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
  isLoading = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private snackbar: MatSnackBar
  ) {}

  send() {
    if (this.form.valid && !this.isLoading) {
      this.isLoading = true;
      this.cd.markForCheck();

      // Simular proceso de login
      setTimeout(() => {
        this.isLoading = false;
        this.cd.markForCheck();
        
        // Aquí se implementaría la lógica real de autenticación
        this.router.navigate(['/']);
        this.snackbar.open(
          '¡Bienvenido! Has iniciado sesión exitosamente.',
          'OK',
          {
            duration: 3000,
            panelClass: ['success-snackbar']
          }
        );
      }, 2000);
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      this.form.markAllAsTouched();
      this.cd.markForCheck();
      
      this.snackbar.open(
        'Por favor, completa todos los campos correctamente.',
        'Entendido',
        {
          duration: 3000,
          panelClass: ['error-snackbar']
        }
      );
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
}
