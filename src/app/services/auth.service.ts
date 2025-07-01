import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse, RefreshTokenRequest, RefreshTokenResponse } from '../models/auth.model';
import { API_CONSTANTS } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API_CONSTANTS.BASE_URL}${API_CONSTANTS.ENDPOINTS.AUTH.LOGIN}`, credentials);
  }

  refreshToken(request: RefreshTokenRequest): Observable<RefreshTokenResponse> {
    return this.http.post<RefreshTokenResponse>(`${API_CONSTANTS.BASE_URL}${API_CONSTANTS.ENDPOINTS.AUTH.REFRESH}`, request);
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(`${API_CONSTANTS.BASE_URL}${API_CONSTANTS.ENDPOINTS.AUTH.ME}`);
  }
}
