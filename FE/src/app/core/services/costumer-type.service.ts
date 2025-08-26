import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CostumerType, CostumerTypeCreateRequest, CostumerTypeUpdateRequest, CostumerTypeResponse } from '../interfaces/costumer-type.interface';
import { ApiBaseService } from './api-base.service';

@Injectable({
  providedIn: 'root'
})
export class CostumerTypeService {
  private readonly API_URL = 'costumer-type';

  constructor(
    private http: HttpClient,
    private apiBaseService: ApiBaseService
  ) { }

  getCostumerTypes(limit?: number): Observable<CostumerTypeResponse> {
    const params = limit ? `?limit=${limit}` : '';
    return this.http.get<CostumerTypeResponse>(`${this.apiBaseService.buildApiUrl(this.API_URL)}${params}`);
  }

  getAllCostumerTypes(): Observable<CostumerTypeResponse> {
    return this.http.get<CostumerTypeResponse>(this.apiBaseService.buildApiUrl(this.API_URL));
  }

  getCostumerTypesByStatus(enabled: string): Observable<CostumerTypeResponse> {
    return this.http.get<CostumerTypeResponse>(`${this.apiBaseService.buildApiUrl(this.API_URL)}?enabled=${enabled}`);
  }

  getCostumerTypeById(id: string): Observable<any> {
    return this.http.get(`${this.apiBaseService.buildApiUrl(this.API_URL)}/${id}`);
  }

  createCostumerType(costumerType: CostumerTypeCreateRequest): Observable<any> {
    return this.http.post(this.apiBaseService.buildApiUrl(this.API_URL), costumerType);
  }

  updateCostumerType(id: string, costumerType: CostumerTypeUpdateRequest): Observable<any> {
    return this.http.put(`${this.apiBaseService.buildApiUrl(this.API_URL)}/${id}`, costumerType);
  }

  deleteCostumerType(id: string): Observable<any> {
    return this.http.delete(`${this.apiBaseService.buildApiUrl(this.API_URL)}/${id}`);
  }

  toggleStatus(id: string): Observable<any> {
    return this.http.patch(`${this.apiBaseService.buildApiUrl(this.API_URL)}/${id}/toggle-status`, {});
  }

  searchCostumerTypes(query: string): Observable<any> {
    return this.http.get(`${this.apiBaseService.buildApiUrl(this.API_URL)}/search?q=${query}`);
  }

  getStats(): Observable<any> {
    return this.http.get(`${this.apiBaseService.buildApiUrl(this.API_URL)}/stats`);
  }

  getActiveCostumerTypes(): Observable<any> {
    return this.http.get(`${this.apiBaseService.buildApiUrl(this.API_URL)}/active`);
  }
}
