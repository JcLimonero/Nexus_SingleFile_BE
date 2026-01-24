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
      // Intentar obtener la agencia predeterminada con reintentos
      this.obtenerAgenciaUsuarioConReintentos().subscribe({
        next: (defaultAgencyId) => {
          let agenciaSeleccionada: number | null = null;

          if (defaultAgencyId && this.agenciasSubject.value.length > 0) {
            // Buscar la agencia predeterminada del usuario en la lista
            const agenciaPredeterminada = this.agenciasSubject.value.find(ag => ag.Id === defaultAgencyId);
            if (agenciaPredeterminada) {
              agenciaSeleccionada = defaultAgencyId;
            } else {
              // Si no se encuentra la agencia predeterminada, seleccionar la primera
              if (autoSelect) {
                agenciaSeleccionada = this.agenciasSubject.value[0].Id;
              }
            }
          } else {
            // Si el usuario no tiene agencia predeterminada, seleccionar la primera de la lista
            if (autoSelect && this.agenciasSubject.value.length > 0) {
              agenciaSeleccionada = this.agenciasSubject.value[0].Id;
            }
          }

          // Actualizar el BehaviorSubject
          if (agenciaSeleccionada) {
            this.selectedAgencySubject.next(agenciaSeleccionada);
          }

          observer.next(agenciaSeleccionada);
          observer.complete();
        },
        error: (error) => {
          // En caso de error, seleccionar la primera agencia disponible si está habilitado
          let agenciaSeleccionada: number | null = null;
          if (autoSelect && this.agenciasSubject.value.length > 0) {
            agenciaSeleccionada = this.agenciasSubject.value[0].Id;
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
   * Actualizar la agencia predeterminada del usuario
   */
  actualizarAgenciaPredeterminada(agenciaId: number): Observable<boolean> {
    return this.http.put<any>(`${this.apiUrl}/api/user/profile/default-agency`, {
      defaultAgency: agenciaId
    }).pipe(
      map(response => {
        if (response && response.success) {

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
