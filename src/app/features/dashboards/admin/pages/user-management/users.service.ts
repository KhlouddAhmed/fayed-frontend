import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ApiResponseWithData } from '../../../../../core/models/api-response.model';

export interface ApiAdminUser {
  userId: number;
  userIdentifier: string;
  userName: string;
  factoryName: string;
  email: string;
  isSuspended: boolean;
  statusText: string;
  registrationDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private http = inject(HttpClient);

  getUsers(): Observable<ApiResponseWithData<ApiAdminUser[]>> {
    return this.http.get<ApiResponseWithData<ApiAdminUser[]>>(`${environment.apiUrl}/Admin/users`);
  }

  toggleSuspension(userId: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/Admin/toggle-suspension/${userId}`, {});
  }
}