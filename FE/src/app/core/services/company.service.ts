import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiBaseService } from './api-base.service';

export interface Company {
  Id: number;
  Name: string;
}

export interface CompanyListResponse {
  success: boolean;
  message: string;
  data: {
    companies: Company[];
    total: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private readonly API_URL = 'company';

  constructor(
    private http: HttpClient,
    private apiBaseService: ApiBaseService
  ) {}

  getCompanies(): Observable<CompanyListResponse> {
    return this.http.get<CompanyListResponse>(this.apiBaseService.buildApiUrl(this.API_URL));
  }
}
