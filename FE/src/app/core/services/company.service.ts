import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiBaseService } from './api-base.service';

export interface Company {
  Id: number;
  Name: string;
}

export interface CompanyListResponse {
  success: boolean;
  message: string;
  data: {
    companies: Company[];
    total: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private readonly API_URL = 'company';
  private readonly STORAGE_KEY_COMPANIES = 'cached_companies';
  private readonly STORAGE_KEY_COMPANIES_TIMESTAMP = 'cached_companies_timestamp';

  constructor(
    private http: HttpClient,
    private apiBaseService: ApiBaseService
  ) {}

  /**
   * Obtener compañías. Si forceRefresh es false, intenta leer de localStorage primero.
   */
  getCompanies(forceRefresh: boolean = false): Observable<CompanyListResponse> {
    if (!forceRefresh) {
      const cached = this.getCompaniesFromStorage();
      if (cached && cached.length > 0) {
        return of({
          success: true,
          message: 'OK',
          data: { companies: cached, total: cached.length }
        });
      }
    }

    return this.http.get<CompanyListResponse>(this.apiBaseService.buildApiUrl(this.API_URL)).pipe(
      tap(response => {
        if (response?.success && response?.data?.companies?.length) {
          this.guardarCompaniesEnStorage(response.data.companies);
        }
      })
    );
  }

  private guardarCompaniesEnStorage(companies: Company[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY_COMPANIES, JSON.stringify(companies));
      localStorage.setItem(this.STORAGE_KEY_COMPANIES_TIMESTAMP, Date.now().toString());
    } catch (e) {
      console.warn('Error guardando companies en localStorage:', e);
    }
  }

  private getCompaniesFromStorage(): Company[] | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY_COMPANIES);
      const ts = localStorage.getItem(this.STORAGE_KEY_COMPANIES_TIMESTAMP);
      if (!data || !ts) return null;
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  /**
   * Limpiar cache de compañías. Llamar en logout.
   */
  limpiarCacheEnLogout(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY_COMPANIES);
      localStorage.removeItem(this.STORAGE_KEY_COMPANIES_TIMESTAMP);
    } catch (e) {
      console.warn('Error limpiando cache de companies:', e);
    }
  }
}
