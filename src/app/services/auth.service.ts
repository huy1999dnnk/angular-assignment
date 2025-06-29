import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse, RefreshTokenRequest, RefreshTokenResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://dummyjson.com/auth';

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, credentials);
  }

  refreshToken(request: RefreshTokenRequest): Observable<RefreshTokenResponse> {
    return this.http.post<RefreshTokenResponse>(`${this.baseUrl}/refresh`, request);
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.baseUrl}/me`);
  }
}
