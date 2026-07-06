export const VerificationStatus = {
  Pending: 'Pending',
  Verified: 'Verified',
  Rejected: 'Rejected',
} as const;
export type VerificationStatus = typeof VerificationStatus[keyof typeof VerificationStatus];

export const VerificationCaseStatus = {
  Pending: 'Pending',
  UnderReview: 'UnderReview',
  Decided: 'Decided',
} as const;
export type VerificationCaseStatus = typeof VerificationCaseStatus[keyof typeof VerificationCaseStatus];

export const VerificationDecision = {
  Approved: 'Approved',
  Rejected: 'Rejected',
} as const;
export type VerificationDecision = typeof VerificationDecision[keyof typeof VerificationDecision];

export const AIRecommendation = {
  Approve: 'Approve',
  Review: 'Review',
  Reject: 'Reject',
} as const;
export type AIRecommendation = typeof AIRecommendation[keyof typeof AIRecommendation];

export const GovCheckStatus = {
  NotChecked: 'NotChecked',
  Confirmed: 'Confirmed',
  NotFound: 'NotFound',
  Mismatch: 'Mismatch',
  Failed: 'Failed',
} as const;
export type GovCheckStatus = typeof GovCheckStatus[keyof typeof GovCheckStatus];

export const MaterialCondition = {
  New: 'New',
  Used: 'Used',
  Scrap: 'Scrap',
  ByProduct: 'ByProduct',
} as const;
export type MaterialCondition = typeof MaterialCondition[keyof typeof MaterialCondition];

export const DeliveryType = {
  SellerDelivery: 'SellerDelivery',
  BuyerPickup: 'BuyerPickup',
  Both: 'Both',
} as const;
export type DeliveryType = typeof DeliveryType[keyof typeof DeliveryType];

export const PaymentMethod = {
  BankTransfer: 'BankTransfer',
  Cash: 'Cash',
  Both: 'Both',
} as const;
export type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod];

export const ListingStatus = {
  Draft: 'Draft',
  PendingApproval: 'PendingApproval',
  Published: 'Published',
  Rejected: 'Rejected',
  Sold: 'Sold',
  Expired: 'Expired',
} as const;
export type ListingStatus = typeof ListingStatus[keyof typeof ListingStatus];

export const MediaType = {
  Image: 'Image',
  Video: 'Video',
} as const;
export type MediaType = typeof MediaType[keyof typeof MediaType];

export const ChatStatus = {
  Open: 'Open',
  Closed: 'Closed',
  Archived: 'Archived',
} as const;
export type ChatStatus = typeof ChatStatus[keyof typeof ChatStatus];

export const MessageType = {
  Text: 'Text',
  Offer: 'Offer',
  System: 'System',
} as const;
export type MessageType = typeof MessageType[keyof typeof MessageType];

export const OrderStatus = {
  Pending: 'Pending',
  InProgress: 'InProgress',
  Completed: 'Completed',
  Cancelled: 'Cancelled',
  ContractReview: 'ContractReview',
  PaymentPending: 'PaymentPending',
  BuyerPaid: 'BuyerPaid',
  PayoutSent: 'PayoutSent',
} as const;
export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

export const PartyRole = {
  Buyer: 'Buyer',
  Seller: 'Seller',
} as const;
export type PartyRole = typeof PartyRole[keyof typeof PartyRole];

export const TransactionType = {
  Deposit: 'Deposit',
  Withdrawal: 'Withdrawal',
  Freeze: 'Freeze',
  Unfreeze: 'Unfreeze',
  Commission: 'Commission',
  Refund: 'Refund',
} as const;
export type TransactionType = typeof TransactionType[keyof typeof TransactionType];

export const TransactionStatus = {
  Pending: 'Pending',
  Completed: 'Completed',
  Failed: 'Failed',
  Reversed: 'Reversed',
} as const;
export type TransactionStatus = typeof TransactionStatus[keyof typeof TransactionStatus];

export const DisputeStatus = {
  Opened: 'Opened',
  UnderReview: 'UnderReview',
  Resolved: 'Resolved',
  Cancelled: 'Cancelled',
} as const;
export type DisputeStatus = typeof DisputeStatus[keyof typeof DisputeStatus];

export const DisputeReason = {
  QualityIssue: 'QualityIssue',
  Delay: 'Delay',
  NonPayment: 'NonPayment',
  WrongQuantity: 'WrongQuantity',
  Other: 'Other',
} as const;
export type DisputeReason = typeof DisputeReason[keyof typeof DisputeReason];

export const OfferStatus = {
  Pending: 'Pending',
  Accepted: 'Accepted',
  Rejected: 'Rejected',
  Withdrawn: 'Withdrawn',
} as const;
export type OfferStatus = typeof OfferStatus[keyof typeof OfferStatus];
