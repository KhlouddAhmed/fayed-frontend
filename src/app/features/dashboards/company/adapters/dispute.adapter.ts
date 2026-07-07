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

const DISPUTE_STATUS_MAP: Readonly<Record<string, DisputeStatus>> = {
  ActiveOpen: 'activeOpen',
  UnderReview: 'underReview',
  Resolved: 'resolved',
};

const DISPUTE_REASON_MAP: Readonly<Record<string, DisputeReason>> = {
  ProductNotAsDescribed: 'productNotAsDescribed',
  LateDelivery: 'lateDelivery',
  QuantityShortfall: 'quantityShortfall',
  Delay: 'delay',
};

const NEGOTIATION_SENDER_TYPE_MAP: Readonly<Record<string, NegotiationSenderType>> = {
  System: 'system',
  Buyer: 'buyer',
  Seller: 'seller',
};

const DISPUTE_REASON_DTO_MAP: Readonly<Record<DisputeReason, string>> = {
  productNotAsDescribed: 'ProductNotAsDescribed',
  lateDelivery: 'LateDelivery',
  quantityShortfall: 'QuantityShortfall',
  delay: 'Delay',
};

const DEFAULT_DISPUTE_STATUS: DisputeStatus = 'activeOpen';
const DEFAULT_DISPUTE_REASON: DisputeReason = 'productNotAsDescribed';
const DEFAULT_SENDER_TYPE: NegotiationSenderType = 'system';

interface DisputeStatusBadgeConfig {
  readonly labelKey: string;
  readonly variant: StatusBadgeVariant;
}

export const DISPUTE_STATUS_BADGE_MAP: Readonly<Record<DisputeStatus, DisputeStatusBadgeConfig>> = {
  activeOpen:  { labelKey: 'نشط ومفتوح',    variant: 'danger'  },
  underReview: { labelKey: 'قيد المراجعة',   variant: 'warning' },
  resolved:    { labelKey: 'تم الحل',        variant: 'success' },
};

export function adaptDispute(dto: DisputeDto): Dispute {
  return {
    id:                     dto.Id,
    code:                   dto.Code,
    orderReference:         dto.OrderReference,
    reason:                 DISPUTE_REASON_MAP[dto.Reason] ?? DEFAULT_DISPUTE_REASON,
    reasonLabel:            dto.ReasonLabel,
    description:            dto.Description,
    filedAt:                new Date(dto.FiledAt),
    status:                 DISPUTE_STATUS_MAP[dto.Status] ?? DEFAULT_DISPUTE_STATUS,
    arbitrationStatusLabel: dto.ArbitrationStatusLabel ?? null,
  };
}

export function adaptDisputes(dtos: readonly DisputeDto[]): readonly Dispute[] {
  return dtos.map(adaptDispute);
}

export function adaptNegotiationMessage(dto: NegotiationMessageDto): NegotiationMessage {
  return {
    id:          dto.Id,
    senderType:  NEGOTIATION_SENDER_TYPE_MAP[dto.SenderType] ?? DEFAULT_SENDER_TYPE,
    senderLabel: dto.SenderLabel,
    content:     dto.Content,
    sentAt:      new Date(dto.SentAt),
  };
}

export function adaptNegotiationMessages(dtos: readonly NegotiationMessageDto[]): readonly NegotiationMessage[] {
  return dtos.map(adaptNegotiationMessage);
}

export function adaptCreateDisputeRequest(request: CreateDisputeRequest): CreateDisputeRequestDto {
  return {
    OrderId:     request.orderId,
    Reason:      DISPUTE_REASON_DTO_MAP[request.reason],
    Title:       request.title,
    Description: request.description,
  };
}