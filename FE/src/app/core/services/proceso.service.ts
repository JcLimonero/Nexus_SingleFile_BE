import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Proceso,
  ProcesoCreateRequest,
  ProcesoUpdateRequest,
  ProcesoResponse
} from '../interfaces/proceso.interface';
import { ApiBaseService } from './api-base.service';

@Injectable({
  providedIn: 'root'
})
export class ProcesoService {
  private readonly API_URL = 'process';

  constructor(
    private http: HttpClient,
    private apiBaseService: ApiBaseService
  ) {}

  getProcesos(): Observable<ProcesoResponse> {
    return this.http.get<ProcesoResponse>(this.apiBaseService.buildApiUrl(this.API_URL));
  }

  getProceso(id: string): Observable<ProcesoResponse> {
    return this.http.get<ProcesoResponse>(this.apiBaseService.buildApiUrl(`${this.API_URL}/${id}`));
  }

  createProceso(proceso: ProcesoCreateRequest): Observable<ProcesoResponse> {
    return this.http.post<ProcesoResponse>(this.apiBaseService.buildApiUrl(this.API_URL), proceso);
  }

  updateProceso(proceso: ProcesoUpdateRequest): Observable<ProcesoResponse> {
    return this.http.put<ProcesoResponse>(this.apiBaseService.buildApiUrl(`${this.API_URL}/${proceso.Id}`), proceso);
  }

  deleteProceso(id: string, force: boolean = false): Observable<ProcesoResponse> {
    const params = force ? new HttpParams().set('force', 'true') : new HttpParams();
    return this.http.delete<ProcesoResponse>(this.apiBaseService.buildApiUrl(`${this.API_URL}/${id}`), { params });
  }

  toggleEstado(id: string, estado: string): Observable<ProcesoResponse> {
    return this.http.patch<ProcesoResponse>(this.apiBaseService.buildApiUrl(`${this.API_URL}/${id}/estado`), { estado });
  }
}
