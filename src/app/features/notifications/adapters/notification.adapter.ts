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
  commission_deducted: 'payment',
  down_payment_received: 'payment',
  payment_confirmed: 'payment',
  order_created: 'order',
  order_completed: 'order',
  order_cancelled: 'order',
  offer_received: 'offer',
  offer_accepted: 'offer',
  offer_rejected: 'offer',
  offer_updated: 'offer',
  contract_generated: 'contract',
  contract_accepted: 'contract',
  contract_declined: 'contract',
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

// =============================================
// relatedLink → Angular route mapping
// الباك إند يرسل روابط قياسية (/orders/5/contract مثلاً) —
// نحوّلها هنا إلى مسارات الفرونت الفعلية تحت /dashboard/company
// =============================================

export interface NotificationRoute {
  readonly path: string;
  readonly queryParams?: Record<string, string>;
}

const COMPANY_BASE = '/dashboard/company';

export function mapRelatedLinkToRoute(relatedLink: string | null): NotificationRoute {
  const fallback: NotificationRoute = { path: `${COMPANY_BASE}/notifications` };
  if (!relatedLink) return fallback;

  const link = relatedLink.trim();

  // /chat/{chatId} — محادثة التفاوض (يفتحها إشعار offer_accepted)
  const chatMatch = link.match(/^\/chat\/(\d+)$/);
  if (chatMatch) {
    return { path: `${COMPANY_BASE}/messages`, queryParams: { chatId: chatMatch[1] } };
  }

  // /offers/received | /offers/sent — عروض الشراء المبدئية
  if (link === '/offers/received') {
    return { path: `${COMPANY_BASE}/rfq-offers`, queryParams: { tab: 'received' } };
  }
  if (link === '/offers/sent') {
    return { path: `${COMPANY_BASE}/rfq-offers`, queryParams: { tab: 'sent' } };
  }

  // /orders/{id}/contract/form — نموذج العقد (للمشتري)
  const contractFormMatch = link.match(/^\/orders\/(\d+)\/contract\/form$/);
  if (contractFormMatch) {
    return { path: `${COMPANY_BASE}/contracts/${contractFormMatch[1]}/form` };
  }

  // /orders/{id}/contract — مراجعة/عرض العقد (يفتحها إشعار contract_generated / contract_declined)
  const contractMatch = link.match(/^\/orders\/(\d+)\/contract$/);
  if (contractMatch) {
    return { path: `${COMPANY_BASE}/contracts/${contractMatch[1]}` };
  }

  // /orders/{id}/payment — دفع العربون (يفتحها إشعار contract_accepted)
  const paymentMatch = link.match(/^\/orders\/(\d+)\/payment$/);
  if (paymentMatch) {
    return { path: `${COMPANY_BASE}/payment/${paymentMatch[1]}` };
  }

  // /orders/{id} — الطلب النشط (يفتحها إشعار down_payment_received وغيره)
  const orderMatch = link.match(/^\/orders\/(\d+)$/);
  if (orderMatch) {
    return { path: `${COMPANY_BASE}/orders`, queryParams: { orderId: orderMatch[1] } };
  }

  // رابط داخلي جاهز (يبدأ بمسار الفرونت فعلاً)
  if (link.startsWith(COMPANY_BASE) || link.startsWith('/marketplace')) {
    return { path: link };
  }

  return fallback;
}
