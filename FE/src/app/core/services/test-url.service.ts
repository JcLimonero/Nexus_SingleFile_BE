import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiBaseService } from './api-base.service';

@Injectable({
  providedIn: 'root'
})
export class TestUrlService {

  constructor(
    private http: HttpClient,
    private apiBaseService: ApiBaseService
  ) { }

  /**
   * Test directo de URL
   */
  testDirectUrl(): Observable<any> {
    const url = this.apiBaseService.buildApiUrl('agency');
    return this.http.get(url);
  }

  /**
   * Test con URL hardcodeada
   */
  testHardcodedUrl(): Observable<any> {
    const hardcodedUrl = 'http://localhost:8080/api/agency';
    return this.http.get(hardcodedUrl);
  }

  /**
   * Test con URL relativa
   */
  testRelativeUrl(): Observable<any> {
    const relativeUrl = '/api/agency';
    return this.http.get(relativeUrl);
  }
}
