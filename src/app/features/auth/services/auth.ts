import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { map } from 'rxjs/operators';

import { LoginRequest, LoginResponseDto, LoginUser } from '../models/auth.models';
import { adaptLoginResponse } from '../adapters/auth.adapter';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  // Switch this to the real call once the backend is ready:
  // return this.http.post<LoginResponseDto>(`${environment.apiUrl}/auth/login`, credentials)
  //   .pipe(map(adaptLoginResponse));
  login(credentials: LoginRequest): Observable<LoginUser> {
    const mockResponse: LoginResponseDto = {
      Token: 'mock-jwt-token-12345',
      CompanyId: 'company-001',
      CompanyName: 'مصنع النيل للبلاستيك',
      KybStatus: 'Verified',
    };

    // Simulates a real network round-trip so loading states are visible in dev
    return of(mockResponse).pipe(
      delay(800),
      map(adaptLoginResponse)
    );
  }
}