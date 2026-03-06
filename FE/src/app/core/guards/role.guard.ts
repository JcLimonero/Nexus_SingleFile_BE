import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { canAccessRoute } from '../constants/route-access.config';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(_route: unknown, state: RouterStateSnapshot): Observable<boolean> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return of(false);
    }

    const path = (state.url || '/').split('?')[0] || '/';
    const allowed = canAccessRoute(user.role_id, path);
    if (!allowed) {
      this.router.navigate(['/']);
      return of(false);
    }
    return of(true);
  }
}
