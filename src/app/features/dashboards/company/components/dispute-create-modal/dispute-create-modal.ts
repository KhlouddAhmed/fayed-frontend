import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { form, FormField, required, minLength, submit } from '@angular/forms/signals';
import { CreateDisputeRequest, DisputeReason } from '../../models/dispute.model';

interface DisputeReasonOption {
  readonly value: DisputeReason;
  readonly label: string;
}

const DISPUTE_REASON_OPTIONS: readonly DisputeReasonOption[] = [
  { value: 'productNotAsDescribed', label: 'المنتج لا يطابق المواصفات المتفق عليها' },
  { value: 'lateDelivery',          label: 'تأخر التوصيل لأكثر من 14 يوماً'         },
  { value: 'quantityShortfall',     label: 'استلام كمية أقل من المتفق عليها'        },
  { value: 'delay',                 label: 'تأخير في التسليم'                        },
];

interface DisputeFormModel {
  orderId: string;
  title: string;
  reason: DisputeReason;
  description: string;
}

const EMPTY_FORM_MODEL: DisputeFormModel = {
  orderId: '',
  title: '',
  reason: 'productNotAsDescribed',
  description: '',
};

@Component({
  selector: 'app-dispute-create-modal',
  imports: [FormField],
  templateUrl: './dispute-create-modal.html',
  styleUrl: './dispute-create-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisputeCreateModal {
  readonly isSubmitting = input<boolean>(false);
  readonly close        = output<void>();
  readonly submitDispute = output<CreateDisputeRequest>();

  protected readonly reasonOptions = DISPUTE_REASON_OPTIONS;
  protected readonly formModel = signal<DisputeFormModel>({ ...EMPTY_FORM_MODEL });

  protected readonly disputeForm = form(this.formModel, (path) => {
    required(path.orderId,      { message: 'رقم الطلب مطلوب' });
    required(path.title,        { message: 'عنوان النزاع مطلوب' });
    required(path.reason,       { message: 'يجب اختيار السبب الرئيسي' });
    required(path.description,  { message: 'يرجى شرح تفاصيل المشكلة' });
    minLength(path.description, 20, { message: 'يرجى كتابة شرح أكثر تفصيلاً (20 حرف على الأقل)' });
  });

  protected onClose(): void {
    this.close.emit();
  }

  protected onFormSubmit(event: Event): void {
    event.preventDefault();
    submit(this.disputeForm, async () => {
      const value = this.formModel();
      this.submitDispute.emit({
        orderId:     Number(value.orderId),
        reason:      value.reason,
        title:       value.title,
        description: value.description,
      });
      return undefined;
    });
  }
}