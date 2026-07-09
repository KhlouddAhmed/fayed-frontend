import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponseWithData } from '../../../core/models/api-response.model';
import { Notification, NotificationDto, NotificationPageDto } from '../models/notification.model';
import { adaptNotification, adaptNotifications } from '../adapters/notification.adapter';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private readonly http = inject(HttpClient);

  /** عدد الإشعارات غير المقروءة — مشترك بين الجرس وصفحة الإشعارات ويُحدَّث فورياً عبر SignalR */
  readonly unreadCount = signal(0);

  private readonly _incoming = new Subject<Notification>();
  /** إشعار جديد وصل فورياً (بعد التهيئة عبر SignalR) */
  readonly incoming$ = this._incoming.asObservable();

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

  refreshUnreadCount(): void {
    this.getUnreadCount().subscribe({
      next: count => this.unreadCount.set(count),
      error: () => void 0,
    });
  }

  getUnreadCount(): Observable<number> {
    return this.http
      .get<ApiResponseWithData<number>>(`${environment.apiUrl}/notifications/unread-count`)
      .pipe(map(res => res.data ?? 0));
  }

  markAsRead(id: string): Observable<void> {
    return this.http
      .put<ApiResponseWithData<boolean>>(`${environment.apiUrl}/notifications/${id}/read`, {})
      .pipe(
        tap(() => this.unreadCount.update(count => Math.max(0, count - 1))),
        map(() => void 0)
      );
  }

  markAllAsRead(): Observable<void> {
    return this.http
      .put<ApiResponseWithData<boolean>>(`${environment.apiUrl}/notifications/read-all`, {})
      .pipe(
        tap(() => this.unreadCount.set(0)),
        map(() => void 0)
      );
  }

  /** يُستدعى من طبقة SignalR عند وصول ReceiveNotification */
  handleRealtimeNotification(dto: NotificationDto): void {
    this.unreadCount.update(count => count + 1);
    this._incoming.next(adaptNotification(dto));
  }
}
