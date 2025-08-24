import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate() {
    return this.authService.isAuthenticated$.pipe(
      take(1),
      map(isAuthenticated => {
        if (isAuthenticated) {
          console.log('🔒 LoginGuard - Usuario ya autenticado, redirigiendo a /');
          this.router.navigate(['/']);
          return false;
        } else {
          console.log('✅ LoginGuard - Acceso permitido al login');
          return true;
        }
      })
    );
  }
}
