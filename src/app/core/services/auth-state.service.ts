import { Injectable, signal, computed } from '@angular/core';
import { AuthUser } from '../../features/auth/models/auth.models';
import { decodeJwt } from '../../features/auth/adapters/auth.adapter';

const TOKEN_KEY = 'fayed_token';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private readonly _token = signal<string | null>(this.loadToken());
  private readonly _user = signal<AuthUser | null>(this.buildUser(this.loadToken()));

  readonly currentUser = computed(() => this._user());
  readonly isLoggedIn = computed(() => this._user() !== null);
  readonly isAdmin = computed(() => this._user()?.role === 'Admin');
  readonly isVerified = computed(() => this._user()?.factoryId !== '');
  readonly token = computed(() => this._token());

  setSession(token: string, user: AuthUser): void {
    localStorage.setItem(TOKEN_KEY, token);
    this._token.set(token);
    this._user.set(user);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this._token.set(null);
    this._user.set(null);
  }

  private loadToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private buildUser(token: string | null): AuthUser | null {
    if (!token) return null;
    const payload = decodeJwt(token);
    if (!payload) return null;

    const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    return {
      id: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
      email: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
      name: payload.FullName,
      factoryId: payload.FactoryId ?? '',
      logoUrl: payload.LogoUrl ?? '',
      role: role === 'Admin' ? 'Admin' : 'Factory',
      expiresOn: new Date(payload.exp * 1000),
    };
  }
}