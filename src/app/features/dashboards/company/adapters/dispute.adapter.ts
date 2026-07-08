import { StatusBadgeVariant } from '../../../../shared/components/status-badge/status-badge';
import {
  CreateDisputeRequest,
  CreateDisputeRequestDto,
  Dispute,
  DisputeDto,
  DisputeReason,
  DisputeStatus,
  NegotiationMessage,
  NegotiationMessageDto,
  NegotiationSenderType,
} from '../models/dispute.model';

// Backend enums from DomainEnums.cs
const DISPUTE_STATUS_MAP: Readonly<Record<string, DisputeStatus>> = {
  Opened: 'activeOpen',
  opened: 'activeOpen',
  UnderReview: 'underReview',
  underReview: 'underReview',
  Resolved: 'resolved',
  resolved: 'resolved',
  Cancelled: 'cancelled',
  cancelled: 'cancelled',
};

const DISPUTE_REASON_MAP: Readonly<Record<string, DisputeReason>> = {
  QualityIssue: 'productNotAsDescribed',
  qualityIssue: 'productNotAsDescribed',
  Delay: 'delay',
  delay: 'delay',
  NonPayment: 'nonPayment',
  nonPayment: 'nonPayment',
  WrongQuantity: 'quantityShortfall',
  wrongQuantity: 'quantityShortfall',
  Other: 'other',
  other: 'other',
};

const DISPUTE_REASON_LABEL: Readonly<Record<DisputeReason, string>> = {
  productNotAsDescribed: 'مشكلة في الجودة',
  lateDelivery: 'تأخر في التسليم',
  quantityShortfall: 'كمية خاطئة',
  delay: 'تأخير',
  nonPayment: 'عدم الدفع',
  other: 'أخرى',
};

const DISPUTE_REASON_DTO_MAP: Readonly<Record<DisputeReason, string>> = {
  productNotAsDescribed: 'QualityIssue',
  lateDelivery: 'Delay',
  quantityShortfall: 'WrongQuantity',
  delay: 'Delay',
  nonPayment: 'NonPayment',
  other: 'Other',
};

const NEGOTIATION_SENDER_TYPE_MAP: Readonly<Record<string, NegotiationSenderType>> = {
  System: 'system', system: 'system',
  Buyer: 'buyer', buyer: 'buyer',
  Seller: 'seller', seller: 'seller',
  Admin: 'admin', admin: 'admin',
};

interface DisputeStatusBadgeConfig {
  readonly labelKey: string;
  readonly variant: StatusBadgeVariant;
}

export const DISPUTE_STATUS_BADGE_MAP: Readonly<Record<DisputeStatus, DisputeStatusBadgeConfig>> = {
  activeOpen:  { labelKey: 'نشط ومفتوح',  variant: 'danger'  },
  underReview: { labelKey: 'قيد المراجعة', variant: 'warning' },
  resolved:    { labelKey: 'تم الحل',      variant: 'success' },
  cancelled:   { labelKey: 'ملغي',         variant: 'neutral' }, // تم تعديلها هنا لحل خطأ الـ TS
};

export function adaptDispute(dto: DisputeDto): Dispute {
  const id = dto.id ?? dto.Id ?? 0;
  const orderId = dto.orderId ?? dto.OrderId ?? 0;
  const rawReason = dto.reason ?? dto.Reason ?? '';
  const rawStatus = dto.status ?? dto.Status ?? '';
  const reason = DISPUTE_REASON_MAP[rawReason] ?? 'other';

  return {
    id: String(id),
    code: `DSP-${id}`,
    orderReference: `ORD-${orderId}`,
    reason,
    reasonLabel: DISPUTE_REASON_LABEL[reason],
    description: dto.description ?? dto.Description ?? '',
    filedAt: new Date(dto.createdAt ?? dto.CreatedAt ?? new Date()),
    status: DISPUTE_STATUS_MAP[rawStatus] ?? 'activeOpen',
    arbitrationStatusLabel: null,
  };
}

export function adaptDisputes(dtos: readonly DisputeDto[]): readonly Dispute[] {
  return dtos.map(adaptDispute);
}

export function adaptNegotiationMessage(dto: NegotiationMessageDto): NegotiationMessage {
  return {
    id: dto.id ?? dto.Id ?? '',
    senderType: NEGOTIATION_SENDER_TYPE_MAP[dto.senderType ?? dto.SenderType ?? ''] ?? 'system',
    senderLabel: dto.senderLabel ?? dto.SenderLabel ?? '',
    content: dto.content ?? dto.Content ?? '',
    sentAt: new Date(dto.sentAt ?? dto.SentAt ?? new Date()),
  };
}

export function adaptNegotiationMessages(dtos: readonly NegotiationMessageDto[]): readonly NegotiationMessage[] {
  return dtos.map(adaptNegotiationMessage);
}

export function adaptCreateDisputeRequest(request: CreateDisputeRequest): CreateDisputeRequestDto {
  return {
    orderId: request.orderId,
    reason: DISPUTE_REASON_DTO_MAP[request.reason],
    description: request.description,
  };
}