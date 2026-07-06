// =============================================
// API DTOs (.NET 8 — PascalCase as received from backend)
// =============================================

export interface DashboardStatsDto {
  readonly OpenDisputesCount: number;
  readonly UnreadMessagesCount: number;
  readonly NewOffersCount: number;
  readonly UnreadNotificationsCount: number;
}

export interface ActivityLogDto {
  readonly Title: string;
  readonly TimeAgo: string;
}

export interface RecentOrderDto {
  readonly OrderId: number;
  readonly ClientName: string;
  readonly Date: string;
  readonly QuantityWithUnit: string;
  readonly Status: string;
}

export interface DashboardOverviewDto {
  readonly RecentOrders: readonly RecentOrderDto[];
  readonly RecentActivities: readonly ActivityLogDto[];
}

// =============================================
// UI Models (camelCase, display-ready)
// =============================================

export interface ActivityItem {
  readonly title: string;
  readonly timeAgo: string;
}

export interface OrderSummary {
  readonly orderId: number;
  readonly clientName: string;
  readonly date: string;
  readonly quantityWithUnit: string;
  readonly status: string;
}

export interface DashboardStats {
  readonly openDisputesCount: number;
  readonly unreadMessagesCount: number;
  readonly newOffersCount: number;
  readonly unreadNotificationsCount: number;
}

export interface DashboardSummary {
  readonly companyName: string;
  readonly stats: DashboardStats;
  readonly recentActivities: readonly ActivityItem[];
  readonly recentOrders: readonly OrderSummary[];
}