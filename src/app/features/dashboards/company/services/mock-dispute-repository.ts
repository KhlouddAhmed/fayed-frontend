import { Injectable } from '@angular/core';
import { DisputeRepository } from './dispute-repository.token';
import { CreateDisputeRequestDto, DisputeDto, NegotiationMessageDto } from '../models/dispute.model';

// =============================================
// MOCK DATA — for demo/dev only.
// Mirrors the values shown in the Figma reference screens.
// Swap MockDisputeRepository for a real HTTP-backed implementation
// once the .NET 8 disputes endpoints are confirmed and ready.
// =============================================

const MOCK_DISPUTES: readonly DisputeDto[] = [
  {
    Id: 'dispute-1',
    Code: 'DIS-6309',
    OrderReference: 'ORD-301',
    Reason: 'ProductNotAsDescribed',
    ReasonLabel: 'المنتج غير مطابق للوصف',
    Description: 'المنتج لا يطابق المواصفات المتفق عليها',
    FiledAt: '2026-06-05T00:00:00Z',
    Status: 'ActiveOpen',
    ArbitrationStatusLabel: 'قيد المراجعة بواسطة مسؤول النزاعات.',
  },
  {
    Id: 'dispute-2',
    Code: 'DIS-4508',
    OrderReference: 'ORD-556',
    Reason: 'LateDelivery',
    ReasonLabel: 'تأخر التوصيل لأكثر من 14 يوماً',
    Description: 'تأخر التوصيل لأكثر من 14 يوماً',
    FiledAt: '2026-06-03T00:00:00Z',
    Status: 'UnderReview',
    ArbitrationStatusLabel: 'قيد المراجعة بواسطة مسؤول النزاعات.',
  },
  {
    Id: 'dispute-3',
    Code: 'DIS-5274',
    OrderReference: 'ORD-904',
    Reason: 'QuantityShortfall',
    ReasonLabel: 'استلام كمية أقل من المتفق عليها',
    Description: 'استلام كمية أقل من المتفق عليها',
    FiledAt: '2026-05-23T00:00:00Z',
    Status: 'Resolved',
    ArbitrationStatusLabel: null,
  },
];

const MOCK_NEGOTIATION_LOGS: Readonly<Record<string, readonly NegotiationMessageDto[]>> = {
  'dispute-1': [
    {
      Id: 'msg-1',
      SenderType: 'System',
      SenderLabel: 'رسالة النظام',
      Content: 'تم تسجيل قضية النزاع رسمياً وحجز وتجميد أموال المعاملة في الضمان المالي الآمن',
      SentAt: '2026-06-05T09:00:00Z',
    },
    {
      Id: 'msg-2',
      SenderType: 'Buyer',
      SenderLabel: 'المشتري (أنت)',
      Content: 'وصلت أداة المعايرة الدقيقة ولكنها تعطي كود خطأ في الشاشة بمجرد تشغيلها. يرجى إيضاح المشكلة',
      SentAt: '2026-06-05T10:30:00Z',
    },
    {
      Id: 'msg-3',
      SenderType: 'Seller',
      SenderLabel: 'رد التاجر',
      Content: 'يرجى التحقق من إعدادات الجهد الكهربي وضبطها على 220 فولت وتأكيد استخدام المحول الأصلي المرفق',
      SentAt: '2026-06-05T14:15:00Z',
    },
  ],
  'dispute-2': [
    {
      Id: 'msg-4',
      SenderType: 'System',
      SenderLabel: 'رسالة النظام',
      Content: 'تم تسجيل قضية النزاع رسمياً وحجز وتجميد أموال المعاملة في الضمان المالي الآمن',
      SentAt: '2026-06-03T08:00:00Z',
    },
  ],
  'dispute-3': [
    {
      Id: 'msg-5',
      SenderType: 'System',
      SenderLabel: 'رسالة النظام',
      Content: 'تم حل النزاع وإغلاق القضية',
      SentAt: '2026-05-23T16:00:00Z',
    },
  ],
};

const MOCK_NETWORK_DELAY_MS = 400;

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

@Injectable()
export class MockDisputeRepository implements DisputeRepository {
  private disputes: DisputeDto[] = [...MOCK_DISPUTES];

  async getAll(): Promise<readonly DisputeDto[]> {
    await delay(MOCK_NETWORK_DELAY_MS);
    return this.disputes;
  }

  async getNegotiationLog(disputeId: string): Promise<readonly NegotiationMessageDto[]> {
    await delay(MOCK_NETWORK_DELAY_MS);
    return MOCK_NEGOTIATION_LOGS[disputeId] ?? [];
  }

  async create(request: CreateDisputeRequestDto): Promise<DisputeDto> {
    await delay(MOCK_NETWORK_DELAY_MS);

    const reasonLabelMap: Record<string, string> = {
      ProductNotAsDescribed: 'المنتج غير مطابق للوصف',
      LateDelivery: 'تأخر التوصيل لأكثر من 14 يوماً',
      QuantityShortfall: 'استلام كمية أقل من المتفق عليها',
    };

    const newDispute: DisputeDto = {
      Id: `dispute-${this.disputes.length + 1}`,
      Code: `DIS-${Math.floor(1000 + Math.random() * 9000)}`,
      OrderReference: request.OrderReference,
      Reason: request.Reason,
      ReasonLabel: reasonLabelMap[request.Reason] ?? request.Reason,
      Description: request.Description,
      FiledAt: new Date().toISOString(),
      Status: 'ActiveOpen',
      ArbitrationStatusLabel: 'قيد المراجعة بواسطة مسؤول النزاعات.',
    };

    this.disputes = [newDispute, ...this.disputes];
    return newDispute;
  }
}