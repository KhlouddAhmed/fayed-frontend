// =============================================
// DTO — الشكل اللي بيجي من الباك اند
// =============================================
export interface NotificationDto {
  Id: string;
  Title: string;
  Body: string;
  CreatedAt: string;        // ISO date string
  IsRead: boolean;
  Type: 'order' | 'offer' | 'shipping' | 'payment' | 'system' | 'contract';
}

// =============================================
// UI Model — اللي بنستخدمه جوه التطبيق
// =============================================
export type NotificationType = 'order' | 'offer' | 'shipping' | 'payment' | 'system' | 'contract';
export type NotificationFilter = 'all' | 'unread' | 'orders' | 'offers' | 'payments' | 'system';

export interface Notification {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly timeAgo: string;
  readonly isUnread: boolean;
  readonly type: NotificationType;
}