import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    // Verificar autenticación de forma síncrona
    const isAuthenticated = this.authService.isAuthenticated();
    
    if (isAuthenticated) {
      // Usuario ya autenticado, redirigir al dashboard
      this.router.navigate(['/']);
      return of(false);
    } else {
      // Usuario no autenticado, permitir acceso al login
      return of(true);
    }
  }
}
