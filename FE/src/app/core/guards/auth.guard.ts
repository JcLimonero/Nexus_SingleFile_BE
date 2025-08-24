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
    console.log('🔒 AuthGuard - Iniciando verificación...');
    
    return this.authService.isAuthenticated$.pipe(
      take(1),
      map(isAuthenticated => {
        const token = this.authService.getToken();
        const currentUser = this.authService.getCurrentUser();
        const syncAuth = this.authService.isAuthenticated();
        
        console.log('🔒 AuthGuard - Estado completo:', {
          observableValue: isAuthenticated,
          syncMethodValue: syncAuth,
          hasToken: !!token,
          hasUser: !!currentUser,
          token: token ? token.substring(0, 20) + '...' : null,
          currentRoute: this.router.url
        });
        
        // Verificar si hay inconsistencias
        if (isAuthenticated !== syncAuth) {
          console.warn('⚠️ Inconsistencia detectada entre observable y método síncrono');
        }
        
        if (isAuthenticated && token && currentUser) {
          console.log('✅ AuthGuard - Acceso permitido');
          return true;
        } else {
          console.log('❌ AuthGuard - Acceso denegado, redirigiendo a login');
          console.log('❌ Razones del rechazo:', {
            observableFalse: !isAuthenticated,
            noToken: !token,
            noUser: !currentUser
          });
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }
}
