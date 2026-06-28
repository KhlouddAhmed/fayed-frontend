import { Offer, OfferDirection, OfferDto, OfferStatus } from '../models/rfq-offer.model';

const OFFER_STATUS_MAP: Readonly<Record<string, OfferStatus>> = {
  Negotiating: 'negotiating',
  AwaitingResponse: 'awaitingResponse',
  Accepted: 'accepted',
  Rejected: 'rejected',
  Completed: 'completed',
};

const OFFER_DIRECTION_MAP: Readonly<Record<string, OfferDirection>> = {
  Sent: 'sent',
  Received: 'received',
};

const DEFAULT_OFFER_STATUS: OfferStatus = 'negotiating';
const DEFAULT_OFFER_DIRECTION: OfferDirection = 'received';

function adaptOfferStatus(rawStatus: string | undefined | null): OfferStatus {
  if (!rawStatus) {
    return DEFAULT_OFFER_STATUS;
  }

  return OFFER_STATUS_MAP[rawStatus] ?? DEFAULT_OFFER_STATUS;
}

function adaptOfferDirection(rawDirection: string | undefined | null): OfferDirection {
  if (!rawDirection) {
    return DEFAULT_OFFER_DIRECTION;
  }

  return OFFER_DIRECTION_MAP[rawDirection] ?? DEFAULT_OFFER_DIRECTION;
}

export function adaptOffer(dto: OfferDto): Offer {
  return {
    id: dto.Id,
    code: dto.Code,
    clientCode: dto.ClientCode,
    productName: dto.ProductName,
    requestedQuantity: dto.RequestedQuantity ?? 0,
    unit: dto.Unit,
    pricePerUnit: dto.PricePerUnit ?? 0,
    totalValue: dto.TotalValue ?? 0,
    status: adaptOfferStatus(dto.Status),
    direction: adaptOfferDirection(dto.Direction),
    message: dto.Message ?? null,
    sentAt: new Date(dto.SentAt),
  };
}

export function adaptOffers(dtos: readonly OfferDto[]): readonly Offer[] {
  return dtos.map(adaptOffer);
}
