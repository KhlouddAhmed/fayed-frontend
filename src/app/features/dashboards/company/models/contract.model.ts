// =============================================
// API DTOs — mirror BLL/DTOs/Contracts/* on the backend (camelCase JSON)
// سير عمل العقد:
// InProgress (المشتري يملأ النموذج) → ContractReview (مراجعة المورد)
// → PaymentPending (بانتظار العربون) → BuyerPaid "قيد التجهيز" (بعد الدفع)
// =============================================

/** Matches backend PartyInfoDto — بيانات ثابتة تأتي من الباك إند */
export interface PartyInfoDto {
  readonly userId: number;
  readonly name: string;
  readonly factoryName: string;
  readonly factoryCode: string;
  readonly nationalId: string | null;
  readonly commercialRegistryNo: string;
  readonly taxCardNo: string;
  readonly logoUrl: string | null;
}

/** Matches backend PenaltyClauseDto — بنود جزائية ثابتة من إعدادات المنصة */
export interface PenaltyClauseDto {
  readonly title: string;
  readonly arabicText: string;
  readonly rate: number | null;
  readonly maxCapRate: number | null;
  readonly terminationDays: number | null;
}

/** Matches backend ContractFormDto (GET /api/orders/{orderId}/contract/form) */
export interface ContractFormDto {
  readonly orderId: number;
  readonly orderCode: string;
  readonly listingId: number;
  readonly listingTitle: string;

  readonly buyer: PartyInfoDto;
  readonly seller: PartyInfoDto;

  // الحقول القابلة للتعديل (معبأة مسبقاً من العرض المقبول ويعدلها المشتري)
  readonly agreedQuantity: number;
  readonly agreedPricePerUnit: number;
  readonly agreedTotalPrice: number;
  readonly deliveryDate: string;
  readonly deliveryAddress: string;

  // شروط مالية ثابتة
  readonly downPaymentPercentage: number;
  readonly downPaymentAmount: number;
  readonly commissionRate: number;
  readonly platformCommission: number;
  readonly sellerTotalPayout: number;

  readonly penaltyClauses: readonly PenaltyClauseDto[];
}

/** Matches backend SubmitContractDto (PUT /api/orders/{orderId}/contract) */
export interface SubmitContractRequest {
  readonly agreedQuantity: number;
  readonly agreedPricePerUnit: number;
  readonly deliveryDate: string;
  readonly deliveryAddress: string;
}

/** Matches backend ContractResponseDto */
export interface ContractResponseDto {
  readonly orderId: number;
  readonly orderCode: string;
  readonly listingId: number;
  readonly listingTitle: string;
  /** نص عربي للعرض المباشر (مثل "قيد التجهيز") */
  readonly status: string;
  /** قيمة ثابتة للمنطق البرمجي: InProgress | ContractReview | PaymentPending | BuyerPaid | Completed | Cancelled */
  readonly statusCode: string;

  readonly buyer: PartyInfoDto;
  readonly seller: PartyInfoDto;

  readonly agreedQuantity: number;
  readonly agreedPricePerUnit: number;
  readonly agreedTotalPrice: number;
  readonly deliveryDate: string | null;
  readonly deliveryAddress: string | null;

  readonly downPaymentPercentage: number;
  readonly downPaymentAmount: number;
  readonly isDownPaymentPaid: boolean;
  readonly commissionRate: number;
  readonly platformCommission: number;
  readonly sellerTotalPayout: number;

  readonly penaltyClauses: readonly PenaltyClauseDto[];

  readonly isSignedByBuyer: boolean;
  readonly isSignedBySeller: boolean;
  readonly contractGeneratedAt: string | null;
  readonly sellerSignedAt: string | null;
  readonly buyerSignedAt: string | null;
  readonly declineReason: string | null;
  readonly contractUrl: string | null;
}

/** Matches backend DeclineContractDto */
export interface DeclineContractRequest {
  readonly reason: string;
}

/** Matches backend PaymentSummaryDto (GET /api/orders/{orderId}/contract/payment-summary) */
export interface PaymentSummaryDto {
  readonly orderId: number;
  readonly orderCode: string;
  readonly listingTitle: string;
  readonly agreedQuantity: number;
  readonly agreedPricePerUnit: number;
  readonly agreedTotalPrice: number;
  readonly downPaymentPercentage: number;
  readonly downPaymentAmount: number;
  readonly commissionRate: number;
}

/** Matches backend PaymentRequestDto (POST /api/payments/charge/{orderId}) */
export interface PaymentChargeRequest {
  readonly cardHolderName: string;
  /** 16 رقماً بدون مسافات */
  readonly cardNumber: string;
  /** بصيغة MM/yy */
  readonly expiryDate: string;
  readonly cvv: string;
  /** يجب أن يساوي downPaymentAmount من ملخص الدفع */
  readonly amount: number;
}

/** Matches backend PaymentChargeResponseDto */
export interface PaymentChargeResponse {
  readonly success: boolean;
  readonly message: string;
  readonly transactionId: string;
  readonly amountPaid: number;
  readonly contractPdfUrl: string | null;
}
