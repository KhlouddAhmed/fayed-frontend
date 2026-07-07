// DTO — matches backend exactly
export interface NotificationDto {
  Id: number;
  Title: string;
  Message: string;       // backend uses Message not Body
  Type: string;
  RelatedLink: string | null;
  IsRead: boolean;
  CreatedAt: string;
}

// UI Model
export type NotificationType = 'order' | 'offer' | 'shipping' | 'payment' | 'system' | 'contract';
export type NotificationFilter = 'all' | 'unread' | 'orders' | 'offers' | 'payments' | 'system';

export interface Notification {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly timeAgo: string;
  readonly isUnread: boolean;
  readonly type: NotificationType;
  readonly relatedLink: string | null;
}