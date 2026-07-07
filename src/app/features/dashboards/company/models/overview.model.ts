// =============================================
// API DTOs (.NET 8 — PascalCase as received from backend)
// =============================================

export interface DashboardSummaryDto {
  readonly CompanyName: string;
  readonly SmartAlertsCount: number;
  readonly NewOffersCount: number;
  readonly NewMessagesCount: number;
  readonly OpenDisputesCount: number;
  readonly RequiresUrgentAction: boolean;
  readonly RecentActivities: readonly ActivityItemDto[];
  readonly RecentOrders: readonly OrderSummaryDto[];
}

export interface ActivityItemDto {
  readonly Id: string;
  readonly TitleKey: string;
  readonly DescriptionKey: string;
  readonly RelatedEntityCode: string;
  readonly OccurredAt: string;
}

export interface OrderSummaryDto {
  readonly OrderCode: string;
  readonly ClientCode: string;
  readonly Quantity: number;
  readonly Unit: string;
  readonly Status: string;
  readonly RequestDate: string;
}

// =============================================
// UI Models (camelCase, normalized, display-ready)
// =============================================

export type OrderStatus =
  | 'pendingWaiting'
  | 'underReview'
  | 'shipped'
  | 'paid'
  | 'rejected';

export interface ActivityItem {
  readonly id: string;
  readonly titleKey: string;
  readonly descriptionKey: string;
  readonly relatedEntityCode: string;
  readonly occurredAt: Date;
}

export interface OrderSummary {
  readonly orderCode: string;
  readonly clientCode: string;
  readonly quantity: number;
  readonly unit: string;
  readonly status: OrderStatus;
  readonly requestDate: Date;
}

export interface DashboardSummary {
  readonly companyName: string;
  readonly smartAlertsCount: number;
  readonly newOffersCount: number;
  readonly newMessagesCount: number;
  readonly openDisputesCount: number;
  readonly requiresUrgentAction: boolean;
  readonly recentActivities: readonly ActivityItem[];
  readonly recentOrders: readonly OrderSummary[];
}