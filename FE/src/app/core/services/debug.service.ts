import { Injectable } from '@angular/core';
import { ApiBaseService } from './api-base.service';

@Injectable({
  providedIn: 'root'
})
export class DebugService {

  constructor(private apiBaseService: ApiBaseService) { }

  /**
   * Debug: Verificar URLs construidas
   */
  debugUrls() {
    // Servicio de debug - sin logs en producción
  }

  /**
   * Debug: Verificar environment
   */
  debugEnvironment() {
    // Servicio de debug - sin logs en producción
  }
}
