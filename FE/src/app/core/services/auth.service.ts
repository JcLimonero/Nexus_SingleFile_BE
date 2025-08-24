import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

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
  private readonly API_URL = '/api/auth';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Verificar si hay un token guardado al inicializar
    this.checkAuthStatus();
    
    // Suscribirse al observable para debuggear
    this.isAuthenticated$.subscribe(isAuth => {
      console.log('🔍 Observable isAuthenticated$ cambió a:', isAuth);
      console.log('🔍 Estado actual del observable:', {
        observableValue: isAuth,
        subjectValue: this.isAuthenticatedSubject.value,
        hasToken: !!this.getToken(),
        hasUser: !!this.getCurrentUser()
      });
      
      // Verificar si hay inconsistencias
      if (isAuth !== this.isAuthenticatedSubject.value) {
        console.warn('⚠️ Inconsistencia detectada entre observable y subject');
      }
    });
    
    // También suscribirse al observable del usuario
    this.currentUser$.subscribe(user => {
      console.log('👤 Observable currentUser$ cambió a:', user);
    });
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    console.log('🔐 Iniciando login con:', credentials);
    
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap(response => {
          console.log('📡 Respuesta del servidor:', response);
          console.log('📡 Estructura de la respuesta:', {
            success: response.success,
            hasToken: !!response.token,
            hasUser: !!response.user,
            hasData: !!response.data,
            dataKeys: response.data ? Object.keys(response.data) : null
          });
          
          if (response.success) {
            console.log('✅ Login exitoso, configurando sesión...');
            
            // Verificar estado antes de actualizar
            console.log('🔍 Estado ANTES de actualizar:', {
              observableValue: this.isAuthenticatedSubject.value,
              hasToken: !!this.getToken(),
              hasUser: !!this.getCurrentUser()
            });
            
            // Intentar obtener token de diferentes ubicaciones
            let token = response.token;
            let user = response.user;
            
            if (!token && response.data) {
              token = response.data.token || response.data.access_token || response.data.jwt;
              user = response.data.user || response.data;
            }
            
            if (token) {
              console.log('🔑 Token encontrado:', token.substring(0, 20) + '...');
              this.setToken(token);
              
              if (user) {
                // Mapear el rol del campo role_name al campo role para compatibilidad
                if (user.role_name && !user.role) {
                  user.role = user.role_name;
                }
                
                console.log('👤 Configurando usuario:', user);
                console.log('👤 Rol del usuario:', user.role || user.role_name);
                this.setCurrentUser(user);
              }
              
              // Verificar estado después de actualizar usuario
              console.log('🔍 Estado DESPUÉS de actualizar usuario:', {
                observableValue: this.isAuthenticatedSubject.value,
                hasToken: !!this.getToken(),
                hasUser: !!this.getCurrentUser()
              });
              
              this.isAuthenticatedSubject.next(true);
              
              // Verificar estado después de actualizar observable
              console.log('🔍 Estado DESPUÉS de actualizar observable:', {
                observableValue: this.isAuthenticatedSubject.value,
                hasToken: !!this.getToken(),
                hasUser: !!this.getCurrentUser()
              });
              
              // Verificar que el observable se haya emitido
              console.log('🔍 Verificando emisión del observable...');
              setTimeout(() => {
                console.log('🔍 Estado del observable después de 100ms:', {
                  observableValue: this.isAuthenticatedSubject.value,
                  hasToken: !!this.getToken(),
                  hasUser: !!this.getCurrentUser()
                });
              }, 100);
              
              console.log('🔓 Estado de autenticación actualizado a: true');
            } else {
              console.log('❌ No se pudo encontrar el token en la respuesta');
            }
          } else {
            console.log('❌ Login fallido o sin token');
          }
        })
      );
  }

  logout(): void {
    try {
      console.log('🔄 Iniciando proceso de logout...');
      
      // Limpiar localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('current_user');
      console.log('🗑️ localStorage limpiado');
      
      // Actualizar observables
      this.isAuthenticatedSubject.next(false);
      this.currentUserSubject.next(null);
      console.log('📡 Observables actualizados');
      
      // Navegar al login
      console.log('🧭 Navegando al login...');
      this.router.navigate(['/login']).then(() => {
        console.log('✅ Navegación al login completada');
      }).catch(error => {
        console.error('❌ Error en navegación:', error);
      });
      
      console.log('✅ Logout completado');
    } catch (error) {
      console.error('❌ Error durante logout:', error);
      // Intentar limpiar de todas formas
      this.isAuthenticatedSubject.next(false);
      this.currentUserSubject.next(null);
    }
  }

  private setToken(token: string): void {
    console.log('🔑 setToken llamado con:', token.substring(0, 20) + '...');
    console.log('🔑 Estado ANTES de setToken:', {
      observableValue: this.isAuthenticatedSubject.value,
      hasToken: !!this.getToken(),
      hasUser: !!this.getCurrentUser()
    });
    
    localStorage.setItem('auth_token', token);
    console.log('🔑 Token guardado en localStorage');
    
    console.log('🔑 Estado DESPUÉS de setToken:', {
      observableValue: this.isAuthenticatedSubject.value,
      hasToken: !!this.getToken(),
      hasUser: !!this.getCurrentUser()
    });
  }

  private setCurrentUser(user: User): void {
    console.log('💾 setCurrentUser llamado con:', user);
    console.log('💾 Estado ANTES de setCurrentUser:', {
      observableValue: this.isAuthenticatedSubject.value,
      hasToken: !!this.getToken(),
      hasUser: !!this.getCurrentUser()
    });
    
    localStorage.setItem('current_user', JSON.stringify(user));
    console.log('💾 Usuario guardado en localStorage');
    
    this.currentUserSubject.next(user);
    console.log('📡 Usuario actualizado en observable currentUser$');
    
    console.log('💾 Estado DESPUÉS de setCurrentUser:', {
      observableValue: this.isAuthenticatedSubject.value,
      hasToken: !!this.getToken(),
      hasUser: !!this.getCurrentUser()
    });
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
    
    console.log('🔍 checkAuthStatus - Verificando estado inicial:', {
      hasToken: !!token,
      hasUserStr: !!userStr
    });
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        console.log('👤 Usuario encontrado en localStorage:', user);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
        console.log('✅ Estado inicial configurado correctamente');
      } catch (e) {
        console.error('❌ Error parsing user data:', e);
        this.logout();
      }
    } else {
      console.log('ℹ️ No hay sesión previa, estado inicial: no autenticado');
    }
  }

  isAuthenticated(): boolean {
    const result = this.isAuthenticatedSubject.value;
    const token = this.getToken();
    const user = this.getCurrentUser();
    
    console.log('🔍 isAuthenticated() llamado:', {
      observableValue: result,
      hasToken: !!token,
      hasUser: !!user,
      tokenPreview: token ? token.substring(0, 20) + '...' : null
    });
    
    return result;
  }

  // Método de prueba para debuggear
  testLogout(): void {
    console.log('🧪 Probando logout...');
    console.log('Estado actual:', {
      isAuthenticated: this.isAuthenticatedSubject.value,
      currentUser: this.currentUserSubject.value,
      token: this.getToken(),
      userInStorage: localStorage.getItem('current_user')
    });
    
    this.logout();
  }
}
