import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponseWithData } from '../../../core/models/api-response.model';
import { Notification, NotificationDto } from '../models/notification.model';
import { adaptNotifications } from '../adapters/notification.adapter';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<Notification[]> {
    return this.http
      .get<ApiResponseWithData<NotificationDto[]>>(`${environment.apiUrl}/notifications`)
      .pipe(map(res => adaptNotifications(res.Data ?? [])));
  }

  getUnreadCount(): Observable<number> {
    return this.http
      .get<ApiResponseWithData<number>>(`${environment.apiUrl}/notifications/unread-count`)
      .pipe(map(res => res.Data ?? 0));
  }

  markAsRead(id: string): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/notifications/${id}/read`, {});
  }

  markAllAsRead(): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/notifications/read-all`, {});
  }
}