import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate() {
    return this.authService.isAuthenticated$.pipe(
      take(1),
      map(isAuthenticated => {
        const token = this.authService.getToken();
        const currentUser = this.authService.getCurrentUser();
        const syncAuth = this.authService.isAuthenticated();
        
        // Verificar si hay inconsistencias
        if (isAuthenticated !== syncAuth) {
          // Inconsistencia detectada entre observable y método síncrono
        }
        
        if (isAuthenticated && token && currentUser) {
          return true;
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }
}
