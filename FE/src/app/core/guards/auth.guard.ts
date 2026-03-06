import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    // Verificar autenticación de forma síncrona
    const isAuthenticated = this.authService.isAuthenticated();
    const token = this.authService.getToken();
    const currentUser = this.authService.getCurrentUser();
    
    if (isAuthenticated && token && currentUser) {
      // Si el token necesita renovación, renovarlo automáticamente
      if (this.authService.needsTokenRefresh()) {

        this.authService.refreshAccessToken().subscribe({
          next: (response) => {
            if (response.success) {

            }
          },
          error: (error) => {

          }
        });
      }
      
      return of(true);
    } else {
      // Usuario no autenticado, redirigir al login
      this.router.navigate(['/login']);
      return of(false);
    }
  }
}
