import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserAccess, UserAccessResponse, Agency, Process, AgencyResponse, ProcessResponse } from '../interfaces/user-access.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserAccessService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Obtener accesos actuales de un usuario
  getUserAccess(userId: string): Observable<UserAccessResponse> {
    return this.http.get<UserAccessResponse>(`${this.API_URL}/user/${userId}/access`);
  }

  // Actualizar accesos de un usuario
  updateUserAccess(userId: string, access: UserAccess): Observable<any> {
    return this.http.put(`${this.API_URL}/user/${userId}/access`, access);
  }

  // Obtener todas las agencias activas
  getActiveAgencies(): Observable<AgencyResponse> {
    return this.http.get<AgencyResponse>(`${this.API_URL}/agency?enabled=1`);
  }

  // Obtener todos los procesos activos
  getActiveProcesses(): Observable<ProcessResponse> {
    return this.http.get<ProcessResponse>(`${this.API_URL}/process?enabled=1`);
  }

  // Obtener todas las agencias (activas e inactivas)
  getAllAgencies(): Observable<AgencyResponse> {
    return this.http.get<AgencyResponse>(`${this.API_URL}/agency`);
  }

  // Obtener todos los procesos (activos e inactivos)
  getAllProcesses(): Observable<ProcessResponse> {
    return this.http.get<ProcessResponse>(`${this.API_URL}/process`);
  }

  // Obtener agencias asignadas a un usuario
  getUserAgencies(userId: string): Observable<any> {
    return this.http.get(`${this.API_URL}/user/${userId}/agencies`);
  }

  // Obtener procesos asignados a un usuario
  getUserProcesses(userId: string): Observable<any> {
    return this.http.get(`${this.API_URL}/user/${userId}/processes`);
  }

  // Asignar agencias a un usuario
  assignAgenciesToUser(userId: string, agencyIds: string[]): Observable<any> {
    return this.http.post(`${this.API_URL}/user/${userId}/agencies`, { agencies: agencyIds });
  }

  // Asignar procesos a un usuario
  assignProcessesToUser(userId: string, processIds: string[]): Observable<any> {
    return this.http.post(`${this.API_URL}/user/${userId}/processes`, { processes: processIds });
  }

  // Remover agencia de un usuario
  removeAgencyFromUser(userId: string, agencyId: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/user/${userId}/agencies/${agencyId}`);
  }

  // Remover proceso de un usuario
  removeProcessFromUser(userId: string, processId: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/user/${userId}/processes/${processId}`);
  }
}
