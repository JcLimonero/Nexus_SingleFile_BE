import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  TipoVenta,
  TipoVentaCreateRequest,
  TipoVentaUpdateRequest,
  TipoVentaResponse
} from '../interfaces/tipo-venta.interface';
import { ApiBaseService } from './api-base.service';

@Injectable({
  providedIn: 'root'
})
export class TipoVentaService {
  // DB rename Tier 3: process → sale_type, ruta /api/sale-type
  private readonly API_URL = 'sale-type';

  constructor(
    private http: HttpClient,
    private apiBaseService: ApiBaseService
  ) {}

  getTiposVenta(): Observable<TipoVentaResponse> {
    return this.http.get<TipoVentaResponse>(this.apiBaseService.buildApiUrl(this.API_URL));
  }

  getTipoVenta(id: string): Observable<TipoVentaResponse> {
    return this.http.get<TipoVentaResponse>(this.apiBaseService.buildApiUrl(`${this.API_URL}/${id}`));
  }

  createTipoVenta(tipoVenta: TipoVentaCreateRequest): Observable<TipoVentaResponse> {
    return this.http.post<TipoVentaResponse>(this.apiBaseService.buildApiUrl(this.API_URL), tipoVenta);
  }

  updateTipoVenta(tipoVenta: TipoVentaUpdateRequest): Observable<TipoVentaResponse> {
    return this.http.put<TipoVentaResponse>(this.apiBaseService.buildApiUrl(`${this.API_URL}/${tipoVenta.id}`), tipoVenta);
  }

  deleteTipoVenta(id: string, force: boolean = false): Observable<TipoVentaResponse> {
    const params = force ? new HttpParams().set('force', 'true') : new HttpParams();
    return this.http.delete<TipoVentaResponse>(this.apiBaseService.buildApiUrl(`${this.API_URL}/${id}`), { params });
  }

  toggleEstado(id: string, estado: string): Observable<TipoVentaResponse> {
    return this.http.patch<TipoVentaResponse>(this.apiBaseService.buildApiUrl(`${this.API_URL}/${id}/estado`), { estado });
  }
}
