import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserCreateRequest, UserUpdateRequest, UserResponse, UserRole, UserRoleResponse, Agency, AgencyResponse } from '../interfaces/user.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = environment.usuariosApi;

  constructor(private http: HttpClient) { }

  getUsers(limit?: number): Observable<UserResponse> {
    console.log('🔍 getUsers llamado',this.API_URL);
    const params = limit ? `?limit=${limit}` : '';
    return this.http.get<UserResponse>(`${this.API_URL}${params}`);
  }

  getAllUsers(): Observable<UserResponse> {
    console.log('🔍 getAllUsers llamado',this.API_URL);
    return this.http.get<UserResponse>(this.API_URL);
  }

  getUsersByStatus(enabled: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.API_URL}?enabled=${enabled}`);
  }

  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.API_URL}/${id}`);
  }

  createUser(user: UserCreateRequest): Observable<any> {
    return this.http.post(this.API_URL, user);
  }

  updateUser(id: string, user: UserUpdateRequest): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}`, user);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  toggleStatus(id: string): Observable<any> {
    return this.http.patch(`${this.API_URL}/${id}/toggle-status`, {});
  }

  changePassword(id: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.API_URL}/${id}/change-password`, { new_password: newPassword });
  }

  resetPassword(id: string): Observable<any> {
    return this.http.post(`${this.API_URL}/${id}/reset-password`, {});
  }

  searchUsers(query: string): Observable<any> {
    return this.http.get(`${this.API_URL}/search?q=${query}`);
  }

  getStats(): Observable<any> {
    return this.http.get(`${this.API_URL}/stats`);
  }

  checkUsernameAvailability(username: string): Observable<any> {
    return this.http.get(`${this.API_URL}/check-username?username=${username}`);
  }

  checkEmailAvailability(email: string): Observable<any> {
    return this.http.get(`${this.API_URL}/check-email?email=${email}`);
  }

  // Métodos para obtener datos de referencia
  getUserRoles(): Observable<UserRoleResponse> {
    return this.http.get<UserRoleResponse>(`${environment.apiUrl}/user-role`);
  }

  getAgencies(): Observable<AgencyResponse> {
    return this.http.get<AgencyResponse>(`${environment.apiUrl}/agency`);
  }
}
