export interface NotificationDto {
  id: number;
  title: string;
  message: string;
  type: string;
  relatedLink: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationPageDto {
  items: NotificationDto[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export type NotificationType =
  | 'order' | 'offer' | 'shipping' | 'payment'
  | 'system' | 'contract' | 'account_verified'
  | 'dispute' | 'delivery' | 'escrow';

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