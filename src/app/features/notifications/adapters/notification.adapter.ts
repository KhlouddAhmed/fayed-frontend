import { Notification, NotificationDto } from '../models/notification.model';

function getTimeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60)  return `منذ ${minutes} دقيقة`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24)    return `منذ ${hours} ساعات`;
  const days = Math.floor(hours / 24);
  return `منذ ${days} أيام`;
}

export function adaptNotification(dto: NotificationDto): Notification {
  return {
    id:       dto.Id,
    title:    dto.Title,
    body:     dto.Body,
    timeAgo:  getTimeAgo(dto.CreatedAt),
    isUnread: !dto.IsRead,
    type:     dto.Type,
  };
}

export function adaptNotifications(dtos: NotificationDto[]): Notification[] {
  return dtos.map(adaptNotification);
}