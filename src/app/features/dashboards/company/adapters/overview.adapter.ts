import {
  ActivityLogDto,
  ActivityItem,
  RecentOrderDto,
  OrderSummary,
  DashboardStatsDto,
  DashboardOverviewDto,
  DashboardStats,
  DashboardSummary,
} from '../models/overview.model';

export function adaptActivityLog(dto: ActivityLogDto): ActivityItem {
  return {
    title: dto.Title,
    timeAgo: dto.TimeAgo,
  };
}

export function adaptRecentOrder(dto: RecentOrderDto): OrderSummary {
  return {
    orderId: dto.OrderId,
    clientName: dto.ClientName,
    date: dto.Date,
    quantityWithUnit: dto.QuantityWithUnit,
    status: dto.Status,
  };
}

export function adaptDashboardStats(dto: DashboardStatsDto): DashboardStats {
  return {
    openDisputesCount: dto.OpenDisputesCount,
    unreadMessagesCount: dto.UnreadMessagesCount,
    newOffersCount: dto.NewOffersCount,
    unreadNotificationsCount: dto.UnreadNotificationsCount,
  };
}

export function adaptDashboardSummary(
  companyName: string,
  stats: DashboardStatsDto,
  overview: DashboardOverviewDto
): DashboardSummary {
  return {
    companyName,
    stats: adaptDashboardStats(stats),
    recentActivities: overview.RecentActivities.map(adaptActivityLog),
    recentOrders: overview.RecentOrders.map(adaptRecentOrder),
  };
}