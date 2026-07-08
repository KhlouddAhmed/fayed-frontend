import { Notification, NotificationDto, NotificationType } from '../models/notification.model';

function getTimeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `منذ ${minutes} دقيقة`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `منذ ${hours} ساعة`;
  const days = Math.floor(hours / 24);
  return `منذ ${days} يوم`;
}

const TYPE_MAP: Record<string, NotificationType> = {
  order: 'order',
  offer: 'offer',
  shipping: 'shipping',
  payment: 'payment',
  system: 'system',
  contract: 'contract',
  account_verified: 'account_verified',
  account_rejected: 'system',
  dispute_filed: 'dispute',
  dispute_resolved: 'dispute',
  delivery_confirmed: 'delivery',
  escrow_released: 'escrow',
  down_payment_received: 'payment',
  order_created: 'order',
  order_completed: 'order',
  offer_received: 'offer',
  offer_accepted: 'offer',
  offer_rejected: 'offer',
};

export function adaptNotification(dto: NotificationDto): Notification {
  return {
    id: String(dto.id),
    title: dto.title,
    body: dto.message,
    timeAgo: getTimeAgo(dto.createdAt),
    isUnread: !dto.isRead,
    type: TYPE_MAP[dto.type] ?? 'system',
    relatedLink: dto.relatedLink ?? null,
  };
}

export function adaptNotifications(dtos: NotificationDto[]): Notification[] {
  return dtos.map(adaptNotification);
}