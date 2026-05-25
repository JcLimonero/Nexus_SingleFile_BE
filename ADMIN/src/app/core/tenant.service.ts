import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type TenantStatus = 'active' | 'grace' | 'readonly' | 'suspended' | 'terminated';

export interface Tenant {
  id: number;
  slug: string;
  name: string;
  status: TenantStatus;
  db_host: string;
  db_port: number;
  db_name: string;
  db_username: string;
  created_at?: string;
  updated_at?: string;
  created_by_super_admin?: number | null;
}

export interface TenantSubscription {
  id: number;
  id_tenant: number;
  plan: string;
  current_period_start: string | null;
  current_period_end: string | null;
  grace_started_at: string | null;
  readonly_started_at: string | null;
  suspended_at: string | null;
  last_payment_at: string | null;
  next_billing_at: string | null;
}

export interface TenantConfigEntry {
  id?: number;
  id_tenant: number;
  config_key: string;
  config_value: string;
  category: string | null;
  sensitive: number;
  /** Server-side hint: true when the row has a non-empty value (sensitive rows return •••• as the value). */
  _has_value?: boolean;
  updated_at?: string;
}

export interface TenantStatusHistory {
  id: number;
  id_tenant: number;
  status_from: string | null;
  status_to: string;
  changed_at: string;
  changed_by_super_admin: number | null;
  reason: string | null;
}

export interface TenantDetailResponse {
  success: boolean;
  data?: {
    tenant: Tenant;
    subscription: TenantSubscription | null;
    config: TenantConfigEntry[];
    status_history: TenantStatusHistory[];
  };
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
  db_password: string;
}

@Injectable({ providedIn: 'root' })
export class TenantService {
  constructor(private http: HttpClient) {}

  list(): Observable<TenantsResponse> {
    return this.http.get<TenantsResponse>(`${environment.apiBaseUrl}/api/admin/tenants`);
  }

  get(id: number): Observable<TenantDetailResponse> {
    return this.http.get<TenantDetailResponse>(`${environment.apiBaseUrl}/api/admin/tenants/${id}`);
  }

  create(payload: TenantCreatePayload): Observable<{ success: boolean; data?: { tenant: Tenant } }> {
    return this.http.post<{ success: boolean; data?: { tenant: Tenant } }>(
      `${environment.apiBaseUrl}/api/admin/tenants`,
      payload,
    );
  }

  setStatus(id: number, status: TenantStatus, reason?: string): Observable<{ success: boolean }> {
    return this.http.patch<{ success: boolean }>(
      `${environment.apiBaseUrl}/api/admin/tenants/${id}/status`,
      { status, reason },
    );
  }

  setConfig(id: number, entries: Partial<TenantConfigEntry>[]): Observable<{ success: boolean }> {
    return this.http.put<{ success: boolean }>(
      `${environment.apiBaseUrl}/api/admin/tenants/${id}/config`,
      { entries },
    );
  }

  extendSubscription(id: number, days: number): Observable<{ success: boolean; data?: { new_period_end: string } }> {
    return this.http.post<{ success: boolean; data?: { new_period_end: string } }>(
      `${environment.apiBaseUrl}/api/admin/tenants/${id}/extend-subscription`,
      { days },
    );
  }
}
