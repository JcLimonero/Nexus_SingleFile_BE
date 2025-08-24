import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Proceso,
  ProcesoCreateRequest,
  ProcesoUpdateRequest,
  ProcesoResponse
} from '../interfaces/proceso.interface';

@Injectable({
  providedIn: 'root'
})
export class ProcesoService {
  private readonly API_URL = '/api/process';

  constructor(private http: HttpClient) {}

  getProcesos(): Observable<ProcesoResponse> {
    return this.http.get<ProcesoResponse>(this.API_URL);
  }

  getProceso(id: string): Observable<ProcesoResponse> {
    return this.http.get<ProcesoResponse>(`${this.API_URL}/${id}`);
  }

  createProceso(proceso: ProcesoCreateRequest): Observable<ProcesoResponse> {
    return this.http.post<ProcesoResponse>(this.API_URL, proceso);
  }

  updateProceso(proceso: ProcesoUpdateRequest): Observable<ProcesoResponse> {
    return this.http.put<ProcesoResponse>(`${this.API_URL}/${proceso.Id}`, proceso);
  }

  deleteProceso(id: string): Observable<ProcesoResponse> {
    return this.http.delete<ProcesoResponse>(`${this.API_URL}/${id}`);
  }

  toggleEstado(id: string, estado: string): Observable<ProcesoResponse> {
    return this.http.patch<ProcesoResponse>(`${this.API_URL}/${id}/estado`, { estado });
  }
}
