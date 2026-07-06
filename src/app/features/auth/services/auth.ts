import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, delay } from 'rxjs';
import { map } from 'rxjs/operators';

import { LoginRequest, LoginResponseDto, LoginUser } from '../models/auth.models';
import { adaptLoginResponse } from '../adapters/auth.adapter';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private authState = inject(AuthStateService);
  private router = inject(Router);             

  // login(credentials: LoginRequest): Observable<LoginUser> {
  //   const mockResponse: LoginResponseDto = {
  //     Token: 'mock-jwt-token-12345',
  //     CompanyId: 'company-001',
  //     CompanyName: 'مصنع النيل للبلاستيك',
  //     KybStatus: 'Verified',
  //   };

  //   return of(mockResponse).pipe(
  //     delay(800),
  //     map(adaptLoginResponse)
  //   );
  // }

  login(credentials: LoginRequest): Observable<LoginUser> {
  return this.http.post<LoginResponseDto>(
    `${environment.apiUrl}/auth/login`,
    credentials
  ).pipe(
    map(adaptLoginResponse)
  );
}

  logout(): void {
    this.authState.logout();
    this.router.navigate(['/']); 
  }
}