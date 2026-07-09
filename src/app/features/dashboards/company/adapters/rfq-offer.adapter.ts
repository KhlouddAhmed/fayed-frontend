import {
  Offer,
  OfferStatus,
  PurchaseOfferWithDirection,
} from '../models/rfq-offer.model';

// Backend OfferStatus enum names → UI statuses
const OFFER_STATUS_MAP: Readonly<Record<string, OfferStatus>> = {
  Pending: 'pending',
  Accepted: 'accepted',
  Rejected: 'rejected',
  Withdrawn: 'withdrawn',
};

const DEFAULT_OFFER_STATUS: OfferStatus = 'pending';

function adaptOfferStatus(rawStatus: string | undefined | null): OfferStatus {
  if (!rawStatus) {
    return DEFAULT_OFFER_STATUS;
  }

  return OFFER_STATUS_MAP[rawStatus] ?? DEFAULT_OFFER_STATUS;
}

export function adaptOffer(dto: PurchaseOfferWithDirection): Offer {
  return {
    id: String(dto.id),
    code: `OFF-${dto.id + 400}`,
    listingId: dto.listingId,
    clientCode: dto.counterpartyCode,
    productName: dto.listingTitle,
    requestedQuantity: dto.requestedQuantity ?? 0,
    unit: 'طن',
    pricePerUnit: dto.offeredPricePerTon ?? 0,
    totalValue: dto.totalValue ?? 0,
    status: adaptOfferStatus(dto.status),
    direction: dto.direction,
    message: dto.buyerMessage ?? null,
    sentAt: new Date(dto.createdAt),
    chatId: dto.chatId ?? null,
  };
}

export function adaptOffers(dtos: readonly PurchaseOfferWithDirection[]): readonly Offer[] {
  return dtos.map(adaptOffer);
}
