import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Tenant {
  id: number;
  slug: string;
  name: string;
  status: 'active' | 'grace' | 'readonly' | 'suspended' | 'terminated';
  db_host: string;
  db_port: number;
  db_name: string;
  db_username: string;
  created_at?: string;
  updated_at?: string;
}

export interface TenantsResponse {
  success: boolean;
  data?: { tenants: Tenant[] };
}

export interface TenantCreatePayload {
  slug: string;
  name: string;
  db_host: string;
  db_port: number;
  db_name: string;
  db_username: string;
  db_password: string; // server-side encrypts
}

@Injectable({ providedIn: 'root' })
export class TenantService {
  constructor(private http: HttpClient) {}

  list(): Observable<TenantsResponse> {
    return this.http.get<TenantsResponse>(`${environment.apiBaseUrl}/api/admin/tenants`);
  }

  get(id: number): Observable<{ success: boolean; data?: { tenant: Tenant } }> {
    return this.http.get<{ success: boolean; data?: { tenant: Tenant } }>(
      `${environment.apiBaseUrl}/api/admin/tenants/${id}`,
    );
  }

  create(payload: TenantCreatePayload): Observable<{ success: boolean; data?: { tenant: Tenant } }> {
    return this.http.post<{ success: boolean; data?: { tenant: Tenant } }>(
      `${environment.apiBaseUrl}/api/admin/tenants`,
      payload,
    );
  }

  setStatus(id: number, status: Tenant['status'], reason?: string): Observable<{ success: boolean }> {
    return this.http.patch<{ success: boolean }>(
      `${environment.apiBaseUrl}/api/admin/tenants/${id}/status`,
      { status, reason },
    );
  }
}
