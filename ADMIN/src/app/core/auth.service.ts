import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SuperAdminLoginResponse {
  success: boolean;
  message?: string;
  data?: { access_token: string; user: { id: number; email: string; name?: string } };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'admin_access_token';
  private readonly USER_KEY  = 'admin_user';

  readonly currentUser = signal<NonNullable<SuperAdminLoginResponse['data']>['user'] | null>(this.loadUser());

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<SuperAdminLoginResponse> {
    return this.http
      .post<SuperAdminLoginResponse>(`${environment.apiBaseUrl}/api/admin/auth/login`, { email, password })
      .pipe(
        tap((r) => {
          if (r.success && r.data) {
            sessionStorage.setItem(this.TOKEN_KEY, r.data.access_token);
            sessionStorage.setItem(this.USER_KEY, JSON.stringify(r.data.user));
            this.currentUser.set(r.data.user);
          }
        }),
      );
  }

  logout(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private loadUser() {
    const raw = sessionStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
}
