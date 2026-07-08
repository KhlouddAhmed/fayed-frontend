// import { Injectable } from '@angular/core';
// import { ContractDto, ConversationDto, MessageDto } from '../models/messages.model';
// import { MessagesRepository } from './messages-repository.token';

// const CURRENT_COMPANY_CODE = 'FYD-2586';
// const DELAY = 400;

// const MOCK_CONVERSATIONS: ConversationDto[] = [
//   {
//     Id: 'conv-1',
//     ParticipantCode: 'FYD-2827',
//     ParticipantName: 'شركة المصانع المتحدة',
//     ParticipantInitial: 'C',
//     ParticipantColor: '#F87171',
//     LastMessage: 'مرحبا، هل الكمية متاحة بالكامل؟',
//     LastMessageAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
//     UnreadCount: 2,
//   },
//   {
//     Id: 'conv-2',
//     ParticipantCode: 'FYD-284',
//     ParticipantName: 'مصنع الوطنية للبلاستيك',
//     ParticipantInitial: 'B',
//     ParticipantColor: '#FBBF24',
//     LastMessage: 'نرغب في تعديل الكمية...',
//     LastMessageAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
//     UnreadCount: 0,
//   },
//   {
//     Id: 'conv-3',
//     ParticipantCode: 'FYD-287',
//     ParticipantName: 'الشركة العربية للتدوير',
//     ParticipantInitial: 'A',
//     ParticipantColor: '#34D399',
//     LastMessage: 'شكرا، سنراجع العرض ونرد عليك قريبا.',
//     LastMessageAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
//     UnreadCount: 0,
//   },
//   {
//     Id: 'conv-4',
//     ParticipantCode: 'FYD-2849',
//     ParticipantName: 'مجموعة الدلتا الصناعية',
//     ParticipantInitial: 'D',
//     ParticipantColor: '#A78BFA',
//     LastMessage: 'تم إرسال عرض سعر جديد',
//     LastMessageAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
//     UnreadCount: 1,
//   },
//   {
//     Id: 'conv-5',
//     ParticipantCode: 'FYD-2247',
//     ParticipantName: 'شركة النيل للصناعات',
//     ParticipantInitial: 'E',
//     ParticipantColor: '#EF4444',
//     LastMessage: 'تم إرفاق ملف المواصفات الفنية',
//     LastMessageAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
//     UnreadCount: 0,
//   },
// ];

// const MOCK_MESSAGES: Record<string, MessageDto[]> = {
//   'conv-1': [
//     {
//       Id: 'msg-1',
//       ConversationId: 'conv-1',
//       SenderCode: 'FYD-2827',
//       Content: 'مرحبا، هل الكمية متاحة بالكامل؟',
//       Type: 'Text',
//       SentAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
//     },
//     {
//       Id: 'msg-2',
//       ConversationId: 'conv-1',
//       SenderCode: CURRENT_COMPANY_CODE,
//       Content: 'أهلا بكم. نعم الكمية متاحة بالكامل وجاهزة للشحن.',
//       Type: 'Text',
//       SentAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
//     },
//     {
//       Id: 'msg-ai-1',
//       ConversationId: 'conv-1',
//       SenderCode: 'SYSTEM',
//       Content: 'اقتراح ذكي من فايض: لقد اكتشفنا اتفاقًا بين الطرفين على السعر والكمية. نوصي ببدء إجراءات التعاقد وإصدار العقد القانوني الآن.',
//       Type: 'AiSuggestion',
//       SentAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
//     },
//   ],
//   'conv-2': [
//     {
//       Id: 'msg-3',
//       ConversationId: 'conv-2',
//       SenderCode: 'FYD-284',
//       Content: 'نرغب في تعديل الكمية إلى 10 طن بدلاً من 15 طن.',
//       Type: 'Text',
//       SentAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
//     },
//   ],
//   'conv-3': [],
//   'conv-4': [],
//   'conv-5': [],
// };

// const MOCK_CONTRACT: ContractDto = {
//   Id: 'ctr-001',
//   Code: 'CTR-2026-00124',
//   Status: 'PendingSignatures',
//   SellerName: 'شركة النيل للصناعات البلاستيكية والبوليمرات',
//   BuyerName: 'شركة النور للمنتجات البلاستيكية المحدودة',
//   DealDate: '18 يونيو 2026',
//   MaterialName: 'بولي إيثيلين عالي الكثافة HDPE (فائض إنتاج)',
//   TotalQuantity: 12.5,
//   PricePerTon: 13400,
//   TotalValue: 420500,
//   DeliveryTerms: 'خلال 5 أيام عمل من إشعار إيداع الدفعة بحساب الضمان.',
//   DeliveryLocation: 'مستودع المورد بالمنطقة الصناعية الثانية بالقاهره.',
//   EscrowTerms: 'يلتزم المشتري بإيداع كامل القيمة بالإضافة لرسوم الخدمة البالغة 2% في حساب الضمان البنكي الآمن لمنصة فايض. ولا يتم تحرير الدفعة للبائع إلا بعد تأكيد استلام الشحنة ومطابقتها للمواصفات.',
//   QualityNotes: 'تخضع البضاعة للفحص الفني والمطابقة البصرية من قبل ممثل المشتري خلال 48 ساعة من تاريخ وصولها للمستودع النهائي.',
//   AdditionalTerms: null,
//   PendingAmendment: null,
//   BuyerSignature: null,
//   SellerSignature: null,
// };

// @Injectable()
// export class MockMessagesRepository implements MessagesRepository {
//   private conversations = [...MOCK_CONVERSATIONS];
//   private messages = { ...MOCK_MESSAGES };
//   private contract = { ...MOCK_CONTRACT };

//   getConversations(): Promise<readonly ConversationDto[]> {
//     return new Promise((resolve) => setTimeout(() => resolve(this.conversations), DELAY));
//   }

//   getMessages(conversationId: string): Promise<readonly MessageDto[]> {
//     return new Promise((resolve) =>
//       setTimeout(() => resolve(this.messages[conversationId] ?? []), DELAY),
//     );
//   }

//   sendMessage(conversationId: string, content: string): Promise<MessageDto> {
//     const message: MessageDto = {
//       Id: `msg-${Date.now()}`,
//       ConversationId: conversationId,
//       SenderCode: CURRENT_COMPANY_CODE,
//       Content: content,
//       Type: 'Text',
//       SentAt: new Date().toISOString(),
//     };

//     return new Promise((resolve) => {
//       setTimeout(() => {
//         this.messages[conversationId] = [...(this.messages[conversationId] ?? []), message];
//         resolve(message);
//       }, DELAY);
//     });
//   }

//   getContract(conversationId: string): Promise<ContractDto | null> {
//     return new Promise((resolve) =>
//       setTimeout(() => resolve(conversationId === 'conv-1' ? this.contract : null), DELAY),
//     );
//   }

//   createContract(conversationId: string): Promise<ContractDto> {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         this.contract = { ...MOCK_CONTRACT, Status: 'Draft' };
//         resolve(this.contract);
//       }, DELAY);
//     });
//   }

//   acceptAmendment(contractId: string): Promise<ContractDto> {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         this.contract = { ...this.contract, Status: 'PendingSignatures', PendingAmendment: null };
//         resolve(this.contract);
//       }, DELAY);
//     });
//   }

//   requestAmendment(contractId: string, newTerms: string): Promise<ContractDto> {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         this.contract = {
//           ...this.contract,
//           Status: 'PendingAmendment',
//           PendingAmendment: {
//             PreviousTerms: this.contract.AdditionalTerms ?? 'لا توجد شروط إضافية حاليًا.',
//             NewTerms: newTerms,
//           },
//         };
//         resolve(this.contract);
//       }, DELAY);
//     });
//   }

//   signContract(contractId: string, authorizedName: string): Promise<ContractDto> {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         const now = new Date().toISOString();
//         const buyerSigned = !!this.contract.BuyerSignature;
//         this.contract = {
//           ...this.contract,
//           BuyerSignature: buyerSigned
//             ? this.contract.BuyerSignature
//             : { PartyCode: CURRENT_COMPANY_CODE, SignedAt: now },
//           SellerSignature: buyerSigned
//             ? { PartyCode: 'FYD-5324', SignedAt: now }
//             : this.contract.SellerSignature,
//           Status: buyerSigned ? 'Signed' : 'PendingSignatures',
//         };
//         resolve(this.contract);
//       }, DELAY);
//     });
//   }
// }
