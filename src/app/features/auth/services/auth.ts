import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponseWithData } from '../../../core/models/api-response.model';
import { AuthUser, LoginRequest, LoginRequestDto, LoginResponseDto } from '../models/auth.models';
import { adaptLoginResponse } from '../adapters/auth.adapter';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { ROUTES } from '../../../core/constants/routes';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly authState = inject(AuthStateService);
  private readonly router = inject(Router);

  login(request: LoginRequest): Observable<AuthUser | null> {
    const body: LoginRequestDto = {
      Email: request.email,
      Password: request.password,
    };

    return this.http
      .post<ApiResponseWithData<LoginResponseDto>>(
        `${environment.apiUrl}/auth/login`,
        body
      )
      .pipe(
        tap(response => {
          const token = response.Data?.Token;
          const user = adaptLoginResponse(response);
          if (token && user) {
            this.authState.setSession(token, user);
          }
        }),
        map(response => adaptLoginResponse(response))
      );
  }

  logout(): void {
    this.authState.logout();
    this.router.navigateByUrl(`/${ROUTES.AUTH.LOGIN}`);
  }
}