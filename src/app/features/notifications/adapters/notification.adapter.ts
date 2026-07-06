import { Notification, NotificationDto, NotificationType } from '../models/notification.model';

function getTimeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `منذ ${minutes} دقيقة`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `منذ ${hours} ساعات`;
  const days = Math.floor(hours / 24);
  return `منذ ${days} أيام`;
}

function normalizeType(raw: string): NotificationType {
  const map: Record<string, NotificationType> = {
    order: 'order', offer: 'offer', shipping: 'shipping',
    payment: 'payment', system: 'system', contract: 'contract',
  };
  return map[raw?.toLowerCase()] ?? 'system';
}

export function adaptNotification(dto: NotificationDto): Notification {
  return {
    id:          String(dto.Id),
    title:       dto.Title,
    body:        dto.Message,
    timeAgo:     getTimeAgo(dto.CreatedAt),
    isUnread:    !dto.IsRead,
    type:        normalizeType(dto.Type),
    relatedLink: dto.RelatedLink ?? null,
  };
}

export function adaptNotifications(dtos: NotificationDto[]): Notification[] {
  return dtos.map(adaptNotification);
}