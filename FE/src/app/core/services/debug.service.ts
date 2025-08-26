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
    console.log('🔍 Debug de URLs:');
    console.log('Environment API Base URL:', this.apiBaseService.getApiBaseUrl());
    console.log('URL para agency:', this.apiBaseService.buildApiUrl('agency'));
    console.log('URL para user:', this.apiBaseService.buildApiUrl('user'));
    console.log('URL para document:', this.apiBaseService.buildApiUrl('document'));
    
    // Verificar que no haya URLs relativas
    const agencyUrl = this.apiBaseService.buildApiUrl('agency');
    if (agencyUrl.startsWith('http://localhost:8080')) {
      console.log('✅ URL correcta para agency:', agencyUrl);
    } else {
      console.log('❌ URL incorrecta para agency:', agencyUrl);
    }
  }

  /**
   * Debug: Verificar environment
   */
  debugEnvironment() {
    console.log('🔍 Debug de Environment:');
    console.log('Environment completo:', this.apiBaseService.getApiBaseUrl());
  }
}
