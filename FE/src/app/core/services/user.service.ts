import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserCreateRequest, UserUpdateRequest, UserResponse, UserRole, UserRoleResponse, Agency, AgencyResponse } from '../interfaces/user.interface';
import { ApiBaseService } from './api-base.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = 'user';

  constructor(
    private http: HttpClient,
    private apiBaseService: ApiBaseService
  ) { }

  getUsers(limit?: number): Observable<UserResponse> {
    const params = limit ? `?limit=${limit}` : '';
    return this.http.get<UserResponse>(`${this.apiBaseService.buildApiUrl(this.API_URL)}${params}`);
  }

  getAllUsers(): Observable<UserResponse> {
    return this.http.get<UserResponse>(this.apiBaseService.buildApiUrl(this.API_URL));
  }

  getUsersByStatus(enabled: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiBaseService.buildApiUrl(this.API_URL)}?enabled=${enabled}`);
  }

  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.apiBaseService.buildApiUrl(this.API_URL)}/${id}`);
  }

  createUser(user: UserCreateRequest): Observable<any> {
    return this.http.post(this.apiBaseService.buildApiUrl(this.API_URL), user);
  }

  updateUser(id: string, user: UserUpdateRequest): Observable<any> {
    return this.http.put(`${this.apiBaseService.buildApiUrl(this.API_URL)}/${id}`, user);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiBaseService.buildApiUrl(this.API_URL)}/${id}`);
  }

  toggleStatus(id: string): Observable<any> {
    return this.http.patch(`${this.apiBaseService.buildApiUrl(this.API_URL)}/${id}/toggle-status`, {});
  }

  changePassword(id: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiBaseService.buildApiUrl(this.API_URL)}/${id}/change-password`, { new_password: newPassword });
  }

  resetPassword(id: string): Observable<any> {
    return this.http.post(`${this.apiBaseService.buildApiUrl(this.API_URL)}/${id}/reset-password`, {});
  }

  searchUsers(query: string): Observable<any> {
    return this.http.get(`${this.apiBaseService.buildApiUrl(this.API_URL)}/search?q=${query}`);
  }

  getStats(): Observable<any> {
    return this.http.get(`${this.apiBaseService.buildApiUrl(this.API_URL)}/stats`);
  }

  checkUsernameAvailability(username: string): Observable<any> {
    return this.http.get(`${this.apiBaseService.buildApiUrl(this.API_URL)}/check-username?username=${username}`);
  }

  checkEmailAvailability(email: string): Observable<any> {
    return this.http.get(`${this.apiBaseService.buildApiUrl(this.API_URL)}/check-email?email=${email}`);
  }

  // Métodos para obtener datos de referencia
  getUserRoles(): Observable<UserRoleResponse> {
    return this.http.get<UserRoleResponse>(this.apiBaseService.buildApiUrl('user-role'));
  }

  getAgencies(): Observable<AgencyResponse> {
    return this.http.get<AgencyResponse>(this.apiBaseService.buildApiUrl('agency'));
  }

  // Obtener agencias asignadas a un usuario específico
  getUserAgencies(userId: string): Observable<any> {
    return this.http.get(`${this.apiBaseService.buildApiUrl('user')}/${userId}/agencies`);
  }

  // Obtener usuarios por agencia
  getUsersByAgency(agencyId?: number): Observable<UserResponse> {
    const params = agencyId ? `?default_agency=${agencyId}` : '';
    return this.http.get<UserResponse>(`${this.apiBaseService.buildApiUrl(this.API_URL)}${params}`);
  }
}
