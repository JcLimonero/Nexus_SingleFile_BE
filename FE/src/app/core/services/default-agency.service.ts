import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

/** Interfaz en snake_case (igual que BD) */
export interface Agencia {
  id: number;
  name: string;
  enabled: boolean | number | string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class DefaultAgencyService {
  private apiUrl = environment.apiBaseUrl;
  private readonly STORAGE_KEY_SELECTED_AGENCY = 'selected_agency_id';
  private readonly STORAGE_KEY_AGENCIAS = 'cached_agencies';
  private readonly STORAGE_KEY_AGENCIAS_TIMESTAMP = 'cached_agencies_timestamp';
  private readonly AGENCIAS_CACHE_EXPIRY_DAYS = 7; // Las agencias se cachean por 7 días

  // BehaviorSubject para mantener el estado de la agencia seleccionada
  private selectedAgencySubject = new BehaviorSubject<number | null>(null);
  public selectedAgency$ = this.selectedAgencySubject.asObservable();

  // BehaviorSubject para mantener el estado de las agencias disponibles
  private agenciasSubject = new BehaviorSubject<Agencia[]>([]);
  public agencias$ = this.agenciasSubject.asObservable();

  constructor(private http: HttpClient) {
    // Intentar cargar la agencia desde localStorage al inicializar el servicio
    const savedAgency = this.getAgenciaFromStorage();
    if (savedAgency !== null) {
      this.selectedAgencySubject.next(savedAgency);
    }
    
    // Intentar cargar agencias desde localStorage al inicializar (solo habilitadas)
    const cachedAgencies = this.getAgenciasFromStorage();
    if (cachedAgencies && cachedAgencies.length > 0) {
      const habilitadas = cachedAgencies.filter(ag => this.esAgenciaHabilitada(ag));
      this.agenciasSubject.next(habilitadas);
    }
  }

  /**
   * Guardar agencias en localStorage
   */
  private guardarAgenciasEnStorage(agencias: Agencia[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY_AGENCIAS, JSON.stringify(agencias));
      localStorage.setItem(this.STORAGE_KEY_AGENCIAS_TIMESTAMP, Date.now().toString());
    } catch (error) {
      console.warn('Error guardando agencias en localStorage:', error);
    }
  }

  /**
   * Obtener agencias de localStorage
   */
  private getAgenciasFromStorage(): Agencia[] | null {
    try {
      const cachedData = localStorage.getItem(this.STORAGE_KEY_AGENCIAS);
      const timestamp = localStorage.getItem(this.STORAGE_KEY_AGENCIAS_TIMESTAMP);
      
      if (!cachedData || !timestamp) {
        return null;
      }

      // Verificar si el cache está expirado
      const cacheAge = Date.now() - parseInt(timestamp, 10);
      const expiryTime = this.AGENCIAS_CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
      
      if (cacheAge > expiryTime) {
        // Cache expirado, limpiar
        localStorage.removeItem(this.STORAGE_KEY_AGENCIAS);
        localStorage.removeItem(this.STORAGE_KEY_AGENCIAS_TIMESTAMP);
        return null;
      }

      return JSON.parse(cachedData);
    } catch (error) {
      console.warn('Error leyendo agencias de localStorage:', error);
      return null;
    }
  }

  /**
   * Limpiar cache de agencias
   */
  private limpiarCacheAgencias(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY_AGENCIAS);
      localStorage.removeItem(this.STORAGE_KEY_AGENCIAS_TIMESTAMP);
    } catch (error) {
      console.warn('Error limpiando cache de agencias:', error);
    }
  }

  /**
   * Obtener agencias disponibles
   * Primero intenta leer de localStorage, si no existe o está expirado hace la llamada HTTP
   */
  obtenerAgencias(forceRefresh: boolean = false): Observable<Agencia[]> {
    // Si se fuerza la actualización, limpiar cache y hacer la llamada HTTP
    if (forceRefresh) {
      this.limpiarCacheAgencias();
    } else {
      // Intentar leer de localStorage primero
      const cachedAgencies = this.getAgenciasFromStorage();
      if (cachedAgencies && cachedAgencies.length > 0) {
        // Filtrar solo habilitadas por si el cache tiene datos antiguos
        const habilitadas = cachedAgencies.filter(ag => this.esAgenciaHabilitada(ag));
        this.agenciasSubject.next(habilitadas);
        return new Observable(observer => {
          observer.next(habilitadas);
          observer.complete();
        });
      }
      
      // Si ya hay agencias en el BehaviorSubject (cargadas en el constructor), usarlas
      if (this.agenciasSubject.value.length > 0) {
        return new Observable(observer => {
          observer.next(this.agenciasSubject.value);
          observer.complete();
        });
      }
    }

    // Si no hay en cache o se fuerza actualización, hacer la llamada HTTP (solo habilitadas para combos)
    return this.http.get<any>(`${this.apiUrl}/api/agency`, { params: { enabled: 'true' } }).pipe(
      map(response => {
        let agencias: Agencia[] = [];
        
        if (response && response.success && response.data && response.data.agencies) {
          agencias = response.data.agencies;
        } else if (Array.isArray(response)) {
          agencias = response;
        } else if (response && response.agencies && Array.isArray(response.agencies)) {
          agencias = response.agencies;
        }

        // Filtrar solo agencias habilitadas (por si la API no aplicó el filtro)
        agencias = agencias.filter(ag => this.esAgenciaHabilitada(ag));

        // Guardar en localStorage para próximas veces
        if (agencias.length > 0) {
          this.guardarAgenciasEnStorage(agencias);
        }

        return agencias;
      }),
      tap(agencias => {
        this.agenciasSubject.next(agencias);
      })
    );
  }

  /**
   * Forzar actualización de agencias desde el servidor
   */
  actualizarAgencias(): Observable<Agencia[]> {
    return this.obtenerAgencias(true);
  }

  /**
   * Guardar agencia seleccionada en localStorage
   */
  private guardarAgenciaEnStorage(agenciaId: number): void {
    if (agenciaId == null) {
      return;
    }
    try {
      localStorage.setItem(this.STORAGE_KEY_SELECTED_AGENCY, String(agenciaId));
    } catch (error) {
      console.warn('Error guardando agencia seleccionada en localStorage:', error);
    }
  }

  /**
   * Obtener agencia seleccionada de localStorage
   */
  private getAgenciaFromStorage(): number | null {
    try {
      const savedAgency = localStorage.getItem(this.STORAGE_KEY_SELECTED_AGENCY);
      if (savedAgency) {
        const agencyId = parseInt(savedAgency, 10);
        return isNaN(agencyId) ? null : agencyId;
      }
      return null;
    } catch (error) {
      console.warn('Error leyendo agencia seleccionada de localStorage:', error);
      return null;
    }
  }

  /**
   * Eliminar agencia seleccionada de localStorage
   */
  private eliminarAgenciaDeStorage(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY_SELECTED_AGENCY);
    } catch (error) {
      console.warn('Error eliminando agencia seleccionada de localStorage:', error);
    }
  }

  /**
   * Obtener agencia predeterminada del usuario
   * Primero intenta leer de localStorage, si no existe hace la llamada HTTP
   */
  obtenerAgenciaUsuario(): Observable<number | null> {
    // Primero intentar leer de localStorage
    const storedAgency = this.getAgenciaFromStorage();
    if (storedAgency !== null) {
      return new Observable(observer => {
        observer.next(storedAgency);
        observer.complete();
      });
    }

    // Si no hay en localStorage, hacer la llamada HTTP
    return this.http.get<any>(`${this.apiUrl}/api/user/profile`).pipe(
      map(response => {
        if (response && response.success && response.data) {
          const defaultAgency = response.data.default_agency ?? response.data.DefaultAgency;
          // Guardar en localStorage para próximas veces
          if (defaultAgency !== null && defaultAgency !== undefined) {
            this.guardarAgenciaEnStorage(defaultAgency);
          }
          return defaultAgency;
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

        this.obtenerAgenciaUsuario().subscribe({
          next: (defaultAgencyId) => {
            observer.next(defaultAgencyId);
            observer.complete();
          },
          error: (error) => {
            if (intentos < maxReintentos) {
              setTimeout(intentarObtener, delayMs);
            } else {
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
      // PRIMERO: Verificar si hay una agencia guardada en localStorage (prioridad máxima)
      const storedAgency = this.getAgenciaFromStorage();
      if (storedAgency !== null) {
        // Si hay agencias cargadas, verificar que la agencia guardada existe en la lista
        if (this.agenciasSubject.value.length > 0) {
          const agenciaEncontrada = this.agenciasSubject.value.find(ag => {
            const agId = ag.id ?? (ag as any).Id ?? (ag as any).IdAgency;
            return agId != null && Number(agId) === Number(storedAgency);
          });
          if (agenciaEncontrada) {
            // La agencia guardada existe y es válida, usarla SIN llamar al API
            this.selectedAgencySubject.next(storedAgency);
            observer.next(storedAgency);
            observer.complete();
            return;
          }
          // Si la agencia guardada NO existe en la lista de agencias disponibles,
          // NO limpiar localStorage inmediatamente. Podría ser un problema temporal.
          // En su lugar, usar la agencia guardada y dejar que el usuario la cambie si es necesario.
          // Esto evita llamadas innecesarias al API cuando la agencia es válida pero no está en la lista
          // (por ejemplo, si las agencias se están cargando o hay un problema de permisos temporal)
          console.warn(`Agencia guardada (${storedAgency}) no encontrada en la lista de agencias disponibles. Usando agencia guardada.`);
          this.selectedAgencySubject.next(storedAgency);
          observer.next(storedAgency);
          observer.complete();
          return;
        } else {
          // Si no hay agencias cargadas pero hay una guardada, usarla temporalmente SIN llamar al API
          this.selectedAgencySubject.next(storedAgency);
          observer.next(storedAgency);
          observer.complete();
          return;
        }
      }
      
      // SEGUNDO: Si ya hay agencias cargadas pero NO hay agencia guardada válida
      // Intentar obtener la agencia predeterminada del servidor
      // NO seleccionar automáticamente la primera agencia aquí
      if (this.agenciasSubject.value.length > 0 && !autoSelect) {
        observer.next(null);
        observer.complete();
        return;
      }

      // TERCERO: Obtener la agencia predeterminada del servidor
      // Esto se ejecuta cuando no hay agencia guardada o cuando las agencias no están cargadas
      this.obtenerAgenciaUsuarioConReintentos().subscribe({
        next: (defaultAgencyId) => {
          let agenciaSeleccionada: number | null = null;

          if (defaultAgencyId && this.agenciasSubject.value.length > 0) {
            // Buscar la agencia predeterminada del usuario en la lista
            const agenciaPredeterminada = this.agenciasSubject.value.find(ag => {
            const agId = ag.id ?? (ag as any).Id ?? (ag as any).IdAgency;
            return agId != null && Number(agId) === Number(defaultAgencyId);
          });
            if (agenciaPredeterminada) {
              agenciaSeleccionada = defaultAgencyId;
            } else {
              // Si no se encuentra la agencia predeterminada del servidor en la lista,
              // NO seleccionar automáticamente la primera
              // Dejar null para que el usuario seleccione manualmente
              // Esto evita que se establezca siempre la agencia 3 al cambiar de módulo
              agenciaSeleccionada = null;
            }
          } else {
            // Si el usuario no tiene agencia predeterminada del servidor,
            // NO seleccionar automáticamente la primera
            // Dejar null para que el usuario seleccione manualmente
            // Esto evita que se establezca siempre la agencia 3 al cambiar de módulo
            agenciaSeleccionada = null;
          }

          // Actualizar el BehaviorSubject
          if (agenciaSeleccionada) {
            this.selectedAgencySubject.next(agenciaSeleccionada);
            // Guardar en localStorage
            this.guardarAgenciaEnStorage(agenciaSeleccionada);
          }

          observer.next(agenciaSeleccionada);
          observer.complete();
        },
        error: (error) => {
          // En caso de error, intentar leer de localStorage primero
          const storedAgency = this.getAgenciaFromStorage();
          let agenciaSeleccionada: number | null = storedAgency;
          
          // Verificar que la agencia guardada existe en la lista de agencias disponibles
          if (agenciaSeleccionada !== null && this.agenciasSubject.value.length > 0) {
            const agenciaEncontrada = this.agenciasSubject.value.find(ag => {
              const agId = ag.id ?? (ag as any).Id ?? (ag as any).IdAgency;
              return agId != null && Number(agId) === Number(agenciaSeleccionada);
            });
            if (!agenciaEncontrada) {
              // La agencia guardada no existe en la lista, limpiar y no seleccionar nada
              this.eliminarAgenciaDeStorage();
              agenciaSeleccionada = null;
            }
          }
          
          // NO seleccionar automáticamente la primera agencia en caso de error
          // Dejar que el usuario seleccione manualmente
          // Solo si autoSelect está habilitado Y no hay agencia guardada válida, usar la primera
          if (agenciaSeleccionada === null && autoSelect && this.agenciasSubject.value.length > 0) {
            agenciaSeleccionada = this.agenciasSubject.value[0].id ?? (this.agenciasSubject.value[0] as any).Id;
          }
          
          if (agenciaSeleccionada !== null) {
            this.selectedAgencySubject.next(agenciaSeleccionada);
            // Guardar en localStorage solo si se seleccionó una agencia válida
            this.guardarAgenciaEnStorage(agenciaSeleccionada);
          }

          observer.next(agenciaSeleccionada);
          observer.complete();
        }
      });
    });
  }

  /**
   * Obtener la agencia guardada sin seleccionar automáticamente otra
   * Útil cuando se cambia de módulo para mantener la agencia seleccionada
   */
  getAgenciaGuardada(): number | null {
    return this.getAgenciaFromStorage();
  }

  /**
   * Seleccionar una agencia específica
   * Solo actualiza el caché local (localStorage y BehaviorSubject) sin hacer llamadas HTTP
   * para mejorar el rendimiento
   */
  seleccionarAgencia(agenciaId: number): void {
    if (agenciaId == null) {
      return;
    }
    // Actualizar el BehaviorSubject inmediatamente
    this.selectedAgencySubject.next(agenciaId);
    // Guardar en localStorage para persistencia
    this.guardarAgenciaEnStorage(agenciaId);
    
    // COMENTADO: Llamada HTTP deshabilitada para mejorar performance
    // La actualización del servidor se puede hacer de forma asíncrona o en otro momento
    // Si se necesita actualizar el servidor, usar el método actualizarAgenciaPredeterminada() explícitamente
    
    /* 
    // Obtener la agencia actual del caché
    const agenciaCache = this.getAgenciaFromStorage();
    
    // Si la agencia seleccionada es diferente a la del caché, actualizar la agencia default
    if (agenciaCache !== agenciaId) {
      // Actualizar la agencia predeterminada del usuario en el servidor
      this.actualizarAgenciaPredeterminada(agenciaId).subscribe({
        next: (success) => {
          if (success) {
            // El localStorage ya se actualiza en actualizarAgenciaPredeterminada
            this.selectedAgencySubject.next(agenciaId);
          } else {
            // Si falla la actualización, aún así actualizar localmente
            this.selectedAgencySubject.next(agenciaId);
            this.guardarAgenciaEnStorage(agenciaId);
          }
        },
        error: (error) => {
          console.error('Error actualizando agencia predeterminada:', error);
          // En caso de error, aún actualizar localmente
          this.selectedAgencySubject.next(agenciaId);
          this.guardarAgenciaEnStorage(agenciaId);
        }
      });
    } else {
      // Si es la misma agencia, solo actualizar el BehaviorSubject y localStorage
      this.selectedAgencySubject.next(agenciaId);
      this.guardarAgenciaEnStorage(agenciaId);
    }
    */
  }

  /**
   * Actualizar la agencia predeterminada del usuario
   */
  actualizarAgenciaPredeterminada(agenciaId: number): Observable<boolean> {
    return this.http.put<any>(`${this.apiUrl}/api/user/profile/default-agency`, {
      default_agency: agenciaId
    }).pipe(
      map(response => {
        if (response && response.success) {
          // Guardar en localStorage cuando se actualiza
          this.guardarAgenciaEnStorage(agenciaId);
          return true;
        }
        return false;
      })
    );
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
    this.eliminarAgenciaDeStorage();
  }

  /**
   * Verificar si una agencia está habilitada
   */
  esAgenciaHabilitada(agencia: Agencia): boolean {
    return agencia && this.esHabilitado(agencia.enabled ?? (agencia as any).Enabled);
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
