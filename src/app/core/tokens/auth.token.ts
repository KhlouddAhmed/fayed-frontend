import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthUser, LoginRequest } from '../../features/auth/models/auth.models';

export interface IAuthService {
  login(request: LoginRequest): Observable<AuthUser | null>;
  logout(): void;
}

export const AUTH_SERVICE = new InjectionToken<IAuthService>('AUTH_SERVICE');