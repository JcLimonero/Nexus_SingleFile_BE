import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoOperacion, TipoOperacionCreateRequest, TipoOperacionUpdateRequest, TipoOperacionResponse } from '../interfaces/tipo-operacion.interface';

@Injectable({
  providedIn: 'root'
})
export class TipoOperacionService {
  private readonly API_URL = '/api/operation-type';

  constructor(private http: HttpClient) { }

  getTiposOperacion(): Observable<TipoOperacionResponse> {
    return this.http.get<TipoOperacionResponse>(this.API_URL);
  }

  getTiposOperacionByStatus(enabled: string): Observable<TipoOperacionResponse> {
    return this.http.get<TipoOperacionResponse>(`${this.API_URL}?enabled=${enabled}`);
  }

  createTipoOperacion(tipoOperacion: TipoOperacionCreateRequest): Observable<any> {
    return this.http.post(this.API_URL, tipoOperacion);
  }

  updateTipoOperacion(id: string, tipoOperacion: TipoOperacionUpdateRequest): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}`, tipoOperacion);
  }

  deleteTipoOperacion(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  toggleEstado(id: string): Observable<any> {
    return this.http.patch(`${this.API_URL}/${id}/estado`, {});
  }

  searchTiposOperacion(query: string): Observable<any> {
    return this.http.get(`${this.API_URL}/search?q=${query}`);
  }

  getStats(): Observable<any> {
    return this.http.get(`${this.API_URL}/stats`);
  }
}
