import {
  ActivityItem,
  ActivityItemDto,
  DashboardSummary,
  DashboardSummaryDto,
  OrderStatus,
  OrderSummary,
  OrderSummaryDto,
} from '../models/overview.model';

const ORDER_STATUS_MAP: Readonly<Record<string, OrderStatus>> = {
  PendingWaiting: 'pendingWaiting',
  UnderReview: 'underReview',
  Shipped: 'shipped',
  Paid: 'paid',
  Rejected: 'rejected',
};

const DEFAULT_ORDER_STATUS: OrderStatus = 'pendingWaiting';

function adaptOrderStatus(rawStatus: string | undefined | null): OrderStatus {
  if (!rawStatus) {
    return DEFAULT_ORDER_STATUS;
  }

  return ORDER_STATUS_MAP[rawStatus] ?? DEFAULT_ORDER_STATUS;
}

function adaptActivityItem(dto: ActivityItemDto): ActivityItem {
  return {
    id: dto.Id,
    titleKey: dto.TitleKey,
    descriptionKey: dto.DescriptionKey,
    relatedEntityCode: dto.RelatedEntityCode,
    occurredAt: new Date(dto.OccurredAt),
  };
}

function adaptOrderSummary(dto: OrderSummaryDto): OrderSummary {
  return {
    orderCode: dto.OrderCode,
    clientCode: dto.ClientCode,
    quantity: dto.Quantity,
    unit: dto.Unit,
    status: adaptOrderStatus(dto.Status),
    requestDate: new Date(dto.RequestDate),
  };
}

export function adaptDashboardSummary(dto: DashboardSummaryDto): DashboardSummary {
  return {
    companyName: dto.CompanyName,
    smartAlertsCount: dto.SmartAlertsCount ?? 0,
    newOffersCount: dto.NewOffersCount ?? 0,
    newMessagesCount: dto.NewMessagesCount ?? 0,
    openDisputesCount: dto.OpenDisputesCount ?? 0,
    requiresUrgentAction: dto.RequiresUrgentAction ?? false,
    recentActivities: (dto.RecentActivities ?? []).map(adaptActivityItem),
    recentOrders: (dto.RecentOrders ?? []).map(adaptOrderSummary),
  };
}