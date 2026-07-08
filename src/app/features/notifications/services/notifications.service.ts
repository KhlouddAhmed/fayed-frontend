import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponseWithData } from '../../../core/models/api-response.model';
import { Notification, NotificationDto, NotificationPageDto } from '../models/notification.model';
import { adaptNotifications } from '../adapters/notification.adapter';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private readonly http = inject(HttpClient);

  getAll(page = 1, pageSize = 12): Observable<{ items: Notification[]; totalCount: number }> {
    return this.http
      .get<ApiResponseWithData<NotificationPageDto>>(
        `${environment.apiUrl}/notifications?page=${page}&pageSize=${pageSize}`
      )
      .pipe(
        map(res => ({
          items: adaptNotifications(res.data?.items ?? []),
          totalCount: res.data?.totalCount ?? 0,
        }))
      );
  }

  getUnreadCount(): Observable<number> {
    return this.http
      .get<ApiResponseWithData<number>>(`${environment.apiUrl}/notifications/unread-count`)
      .pipe(map(res => res.data ?? 0));
  }

  markAsRead(id: string): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/notifications/${id}/read`, {});
  }

  markAllAsRead(): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/notifications/read-all`, {});
  }
}