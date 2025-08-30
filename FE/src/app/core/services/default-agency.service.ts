import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Agencia {
  Id: number;
  Name: string;
  Enabled: boolean | number | string; // Puede ser boolean, number o string
  [key: string]: any; // Para campos adicionales
}

@Injectable({
  providedIn: 'root'
})
export class DefaultAgencyService {
  private apiUrl = environment.apiBaseUrl;
  
  // BehaviorSubject para mantener el estado de la agencia seleccionada
  private selectedAgencySubject = new BehaviorSubject<number | null>(null);
  public selectedAgency$ = this.selectedAgencySubject.asObservable();
  
  // BehaviorSubject para mantener el estado de las agencias disponibles
  private agenciasSubject = new BehaviorSubject<Agencia[]>([]);
  public agencias$ = this.agenciasSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Obtener agencias disponibles
   */
  obtenerAgencias(): Observable<Agencia[]> {
    return this.http.get<any>(`${this.apiUrl}/api/agency`).pipe(
      map(response => {
        if (response && response.success && response.data && response.data.agencies) {
          return response.data.agencies;
        }
        if (Array.isArray(response)) {
          return response;
        }
        if (response && response.agencies && Array.isArray(response.agencies)) {
          return response.agencies;
        }
        return [];
      }),
      tap(agencias => {
        this.agenciasSubject.next(agencias);
      })
    );
  }

  /**
   * Obtener agencia predeterminada del usuario
   */
  obtenerAgenciaUsuario(): Observable<number | null> {
    return this.http.get<any>(`${this.apiUrl}/api/user/profile`).pipe(
      map(response => {
        if (response && response.success && response.data) {
          return response.data.DefaultAgency;
        }
        return null;
      })
    );
  }

  /**
   * Obtener la agencia predeterminada del usuario con reintentos
   */
  private obtenerAgenciaUsuarioConReintentos(maxReintentos: number = 3, delayMs: number = 1000): Observable<number | null> {
    return new Observable(observer => {
      let intentos = 0;
      
      const intentarObtener = () => {
        intentos++;
        console.log(`🔄 DefaultAgencyService - Intento ${intentos} de obtener agencia predeterminada del usuario`);
        
        this.obtenerAgenciaUsuario().subscribe({
          next: (defaultAgencyId) => {
            console.log(`✅ DefaultAgencyService - Agencia predeterminada obtenida exitosamente en intento ${intentos}:`, defaultAgencyId);
            observer.next(defaultAgencyId);
            observer.complete();
          },
          error: (error) => {
            console.warn(`⚠️ DefaultAgencyService - Intento ${intentos} falló:`, error);
            console.error(`🔍 DefaultAgencyService - Detalles del error:`, {
              status: error.status,
              statusText: error.statusText,
              message: error.message,
              error: error.error
            });
            
            if (intentos < maxReintentos) {
              console.log(`🔄 DefaultAgencyService - Reintentando en ${delayMs}ms... (${intentos}/${maxReintentos})`);
              setTimeout(intentarObtener, delayMs);
            } else {
              console.error(`❌ DefaultAgencyService - Todos los ${maxReintentos} intentos fallaron`);
              observer.error(error);
            }
          }
        });
      };
      
      intentarObtener();
    });
  }

  /**
   * Establecer agencia predeterminada del usuario
   * @param autoSelect Si es true, selecciona automáticamente una agencia
   * @returns Observable<number | null> que devuelve el ID de la agencia seleccionada
   */
  establecerAgenciaPredeterminada(autoSelect: boolean = true): Observable<number | null> {
    return new Observable(observer => {
      console.log('🔄 DefaultAgencyService - Iniciando establecimiento de agencia predeterminada...');
      console.log('📊 DefaultAgencyService - Agencias disponibles en el servicio:', this.agenciasSubject.value);
      
      // Intentar obtener la agencia predeterminada con reintentos
      this.obtenerAgenciaUsuarioConReintentos().subscribe({
        next: (defaultAgencyId) => {
          console.log('👤 DefaultAgencyService - Agencia predeterminada del usuario obtenida:', defaultAgencyId);
          let agenciaSeleccionada: number | null = null;
          
          if (defaultAgencyId && this.agenciasSubject.value.length > 0) {
            // Buscar la agencia predeterminada del usuario en la lista
            const agenciaPredeterminada = this.agenciasSubject.value.find(ag => ag.Id === defaultAgencyId);
            if (agenciaPredeterminada) {
              console.log('✅ DefaultAgencyService - Agencia predeterminada del usuario encontrada:', agenciaPredeterminada);
              agenciaSeleccionada = defaultAgencyId;
            } else {
              // Si no se encuentra la agencia predeterminada, seleccionar la primera
              if (autoSelect) {
                console.log('⚠️ DefaultAgencyService - Agencia predeterminada del usuario no encontrada, seleccionando primera agencia');
                agenciaSeleccionada = this.agenciasSubject.value[0].Id;
                console.log('🔍 DefaultAgencyService - Primera agencia de la lista:', this.agenciasSubject.value[0]);
              }
            }
          } else {
            // Si el usuario no tiene agencia predeterminada, seleccionar la primera de la lista
            if (autoSelect && this.agenciasSubject.value.length > 0) {
              console.log('ℹ️ DefaultAgencyService - Usuario sin agencia predeterminada, seleccionando primera agencia de la lista');
              agenciaSeleccionada = this.agenciasSubject.value[0].Id;
              console.log('🔍 DefaultAgencyService - Primera agencia de la lista:', this.agenciasSubject.value[0]);
            }
          }
          
          // Actualizar el BehaviorSubject
          if (agenciaSeleccionada) {
            console.log('🎯 DefaultAgencyService - Estableciendo agencia seleccionada:', agenciaSeleccionada);
            this.selectedAgencySubject.next(agenciaSeleccionada);
          }
          
          observer.next(agenciaSeleccionada);
          observer.complete();
        },
        error: (error) => {
          console.error('❌ DefaultAgencyService - Error obteniendo agencia predeterminada después de reintentos:', error);
          console.warn('⚠️ DefaultAgencyService - No se pudo obtener agencia predeterminada, seleccionando primera agencia de la lista');
          // En caso de error, seleccionar la primera agencia disponible si está habilitado
          let agenciaSeleccionada: number | null = null;
          if (autoSelect && this.agenciasSubject.value.length > 0) {
            agenciaSeleccionada = this.agenciasSubject.value[0].Id;
            console.log('ℹ️ DefaultAgencyService - Seleccionada primera agencia por defecto:', agenciaSeleccionada);
            console.log('🔍 DefaultAgencyService - Primera agencia de la lista:', this.agenciasSubject.value[0]);
            this.selectedAgencySubject.next(agenciaSeleccionada);
          }
          
          observer.next(agenciaSeleccionada);
          observer.complete();
        }
      });
    });
  }

  /**
   * Seleccionar una agencia específica
   */
  seleccionarAgencia(agenciaId: number): void {
    this.selectedAgencySubject.next(agenciaId);
  }

  /**
   * Obtener la agencia actualmente seleccionada
   */
  getAgenciaSeleccionada(): number | null {
    return this.selectedAgencySubject.value;
  }

  /**
   * Obtener las agencias disponibles
   */
  getAgencias(): Agencia[] {
    return this.agenciasSubject.value;
  }

  /**
   * Limpiar la selección de agencia
   */
  limpiarSeleccion(): void {
    this.selectedAgencySubject.next(null);
  }

  /**
   * Verificar si una agencia está habilitada
   */
  esAgenciaHabilitada(agencia: Agencia): boolean {
    return agencia && this.esHabilitado(agencia.Enabled);
  }

  /**
   * Método de utilidad para validar estado habilitado de cualquier campo
   */
  private esHabilitado(valor: any): boolean {
    if (valor === null || valor === undefined) {
      return false;
    }
    
    // Convertir a string para comparación segura
    const valorStr = String(valor).toLowerCase();
    return valorStr === 'true' || valorStr === '1' || valorStr === 'enabled';
  }

  /**
   * Obtener agencias habilitadas
   */
  getAgenciasHabilitadas(): Agencia[] {
    return this.agenciasSubject.value.filter(ag => this.esAgenciaHabilitada(ag));
  }

  /**
   * Obtener agencias por estado (habilitadas o deshabilitadas)
   */
  getAgenciasPorEstado(habilitadas: boolean = true): Agencia[] {
    return this.agenciasSubject.value.filter(ag => this.esAgenciaHabilitada(ag) === habilitadas);
  }

  /**
   * Verificar si hay agencias disponibles
   */
  tieneAgencias(): boolean {
    return this.agenciasSubject.value.length > 0;
  }

  /**
   * Verificar si hay agencias habilitadas
   */
  tieneAgenciasHabilitadas(): boolean {
    return this.getAgenciasHabilitadas().length > 0;
  }
}
