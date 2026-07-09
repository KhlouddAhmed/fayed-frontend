import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponseWithData } from '../../../../core/models/api-response.model';
import {
  ContractFormDto,
  ContractResponseDto,
  DeclineContractRequest,
  PaymentChargeRequest,
  PaymentChargeResponse,
  PaymentSummaryDto,
  SubmitContractRequest,
} from '../models/contract.model';

/**
 * العقود والدفع — mirrors /api/orders/{orderId}/contract and /api/payments.
 *
 * المشتري: نموذج العقد → تقديمه → (بعد قبول المورد) دفع العربون.
 * المورد: مراجعة العقد → قبول أو رفض بسبب.
 */
@Injectable({ providedIn: 'root' })
export class ContractService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  private contractUrl(orderId: number): string {
    return `${this.apiUrl}/orders/${orderId}/contract`;
  }

  /** نموذج العقد الأولي (للمشتري) — حقول ثابتة + حقول قابلة للتعديل */
  getForm(orderId: number): Observable<ContractFormDto> {
    return this.http
      .get<ApiResponseWithData<ContractFormDto>>(`${this.contractUrl(orderId)}/form`)
      .pipe(map(res => res.data!));
  }

  /** تقديم العقد للمورد — الحالة تتحول إلى ContractReview ويُرسل إشعار contract_generated */
  submitContract(orderId: number, payload: SubmitContractRequest): Observable<ContractResponseDto> {
    return this.http
      .put<ApiResponseWithData<ContractResponseDto>>(this.contractUrl(orderId), payload)
      .pipe(map(res => res.data!));
  }

  /** العقد الحالي بكل تفاصيله وتوقيعاته (للطرفين) */
  getContract(orderId: number): Observable<ContractResponseDto> {
    return this.http
      .get<ApiResponseWithData<ContractResponseDto>>(this.contractUrl(orderId))
      .pipe(map(res => res.data!));
  }

  /** قبول المورد للعقد — الحالة تتحول إلى PaymentPending ويُخطر المشتري بدفع العربون */
  acceptContract(orderId: number): Observable<ContractResponseDto> {
    return this.http
      .put<ApiResponseWithData<ContractResponseDto>>(`${this.contractUrl(orderId)}/accept`, {})
      .pipe(map(res => res.data!));
  }

  /** رفض المورد للعقد مع ذكر السبب — تعود الحالة إلى InProgress ويُخطر المشتري بالسبب */
  declineContract(orderId: number, payload: DeclineContractRequest): Observable<ContractResponseDto> {
    return this.http
      .put<ApiResponseWithData<ContractResponseDto>>(`${this.contractUrl(orderId)}/decline`, payload)
      .pipe(map(res => res.data!));
  }

  /** ملخص الدفع قبل إدخال بيانات البطاقة */
  getPaymentSummary(orderId: number): Observable<PaymentSummaryDto> {
    return this.http
      .get<ApiResponseWithData<PaymentSummaryDto>>(`${this.contractUrl(orderId)}/payment-summary`)
      .pipe(map(res => res.data!));
  }

  /**
   * دفع العربون ببطاقة مباشرة — عند النجاح تتحول حالة الطلب إلى BuyerPaid
   * ("قيد التجهيز") ويُرسل إشعار down_payment_received للمورد.
   */
  chargePayment(orderId: number, payload: PaymentChargeRequest): Observable<PaymentChargeResponse> {
    return this.http
      .post<ApiResponseWithData<PaymentChargeResponse>>(
        `${this.apiUrl}/payments/charge/${orderId}`,
        payload
      )
      .pipe(map(res => res.data!));
  }
}
