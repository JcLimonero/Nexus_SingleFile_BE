import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  Agencia, 
  AgenciaCreateRequest, 
  AgenciaUpdateRequest, 
  AgenciaResponse 
} from '../interfaces/agencia.interface';

@Injectable({
  providedIn: 'root'
})
export class AgenciaService {
  private readonly API_URL = '/api/agency';

  constructor(private http: HttpClient) {}

  // Obtener todas las agencias
  getAgencias(): Observable<AgenciaResponse> {
    return this.http.get<AgenciaResponse>(this.API_URL);
  }

  // Obtener una agencia por ID
  getAgencia(id: string): Observable<AgenciaResponse> {
    return this.http.get<AgenciaResponse>(`${this.API_URL}/${id}`);
  }

  // Crear una nueva agencia
  createAgencia(agencia: AgenciaCreateRequest): Observable<AgenciaResponse> {
    return this.http.post<AgenciaResponse>(this.API_URL, agencia);
  }

  // Actualizar una agencia existente
  updateAgencia(agencia: AgenciaUpdateRequest): Observable<AgenciaResponse> {
    return this.http.put<AgenciaResponse>(`${this.API_URL}/${agencia.Id}`, agencia);
  }

  // Eliminar una agencia
  deleteAgencia(id: string): Observable<AgenciaResponse> {
    return this.http.delete<AgenciaResponse>(`${this.API_URL}/${id}`);
  }

  // Cambiar estado de una agencia
  toggleEstado(id: string, estado: string): Observable<AgenciaResponse> {
    return this.http.patch<AgenciaResponse>(`${this.API_URL}/${id}/estado`, { estado });
  }
}
