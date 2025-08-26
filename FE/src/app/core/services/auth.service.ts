import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ApiBaseService } from './api-base.service';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: any;
  data?: any; // Added for new logic
}

export interface User {
  id?: number;
  name?: string;
  email?: string;
  role?: string;
  role_name?: string; // Campo real del backend
  avatar?: string;
  profile_image?: string;
  image_type?: string;
  role_id?: number;
  username?: string;
  enabled?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'auth';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private apiBaseService: ApiBaseService
  ) {
    // Verificar si hay un token guardado al inicializar
    this.checkAuthStatus();
    
    // Suscribirse al observable para debuggear
    this.isAuthenticated$.subscribe(isAuth => {
      // Verificar si hay inconsistencias
      if (isAuth !== this.isAuthenticatedSubject.value) {
        // Inconsistencia detectada entre observable y subject
      }
    });
    
    // También suscribirse al observable del usuario
    this.currentUser$.subscribe(user => {
      // Usuario actualizado
    });
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiBaseService.buildApiUrl(this.API_URL)}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success) {
            // Login exitoso, configurando sesión...
            
            // Intentar obtener token de diferentes ubicaciones
            let token = response.token;
            let user = response.user;
            
            if (!token && response.data) {
              token = response.data.token || response.data.access_token || response.data.jwt;
              user = response.data.user || response.data;
            }
            
            if (token) {
              this.setToken(token);
              
              if (user) {
                // Mapear el rol del campo role_name al campo role para compatibilidad
                if (user.role_name && !user.role) {
                  user.role = user.role_name;
                }
                
                this.setCurrentUser(user);
              }
              
              this.isAuthenticatedSubject.next(true);
              
              // Estado de autenticación actualizado a: true
                          } else {
                // No se pudo encontrar el token en la respuesta
              }
            } else {
              // Login fallido o sin token
            }
        })
      );
  }

  logout(): void {
    try {
      // Limpiar localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('current_user');
      
      // Actualizar observables
      this.isAuthenticatedSubject.next(false);
      this.currentUserSubject.next(null);
      
      // Navegar al login
      this.router.navigate(['/login']).then(() => {
        // Navegación al login completada
      }).catch(error => {
        // Error en navegación
      });
      
    } catch (error) {
      // Intentar limpiar de todas formas
      this.isAuthenticatedSubject.next(false);
      this.currentUserSubject.next(null);
    }
  }

  private setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  private setCurrentUser(user: User): void {
    localStorage.setItem('current_user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private checkAuthStatus(): void {
    const token = this.getToken();
    const userStr = localStorage.getItem('current_user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch (e) {
        this.logout();
      }
    }
  }

  isAuthenticated(): boolean {
    const result = this.isAuthenticatedSubject.value;
    return result;
  }

  // Método de prueba para debuggear
  testLogout(): void {
    this.logout();
  }
}
