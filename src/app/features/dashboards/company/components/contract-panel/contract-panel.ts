import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { Contract, ContractSignatureFormValue } from '../../models/messages.model';
import { ContractStatusScreen } from '../contract-status-screen/contract-status-screen';

type ContractView =
  | 'main'
  | 'amendment_notification'
  | 'amendment_requested_success'
  | 'terms_accepted_success'
  | 'signed_buyer_success'
  | 'signed_seller_success';

const CURRENT_COMPANY_CODE = 'FYD-2586';

@Component({
  selector: 'app-contract-panel',
  imports: [ContractStatusScreen],
  templateUrl: './contract-panel.html',
  styleUrl: './contract-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContractPanel {
  readonly contract = input.required<Contract>();
  readonly isSubmitting = input<boolean>(false);

  readonly close = output<void>();
  readonly acceptAmendment = output<string>();
  readonly requestAmendment = output<{ contractId: string; newTerms: string }>();
  readonly signContract = output<ContractSignatureFormValue>();
  readonly proceedToPayment = output<void>();

  protected readonly currentView = signal<ContractView>('main');
  protected readonly authorizedName = signal('');
  protected readonly newTermsInput = signal('');

  protected readonly isBuyerSigned = computed(() => !!this.contract().buyerSignature);
  protected readonly isSellerSigned = computed(() => !!this.contract().sellerSignature);
  protected readonly isFullySigned = computed(
    () => this.isBuyerSigned() && this.isSellerSigned(),
  );

  protected readonly isCurrentUserBuyer = computed(
    () => this.contract().buyerSignature?.partyCode === CURRENT_COMPANY_CODE,
  );

  protected onAcceptAmendment(): void {
    this.acceptAmendment.emit(this.contract().id);
    this.currentView.set('terms_accepted_success');
  }

  protected onRequestAmendment(): void {
    this.requestAmendment.emit({
      contractId: this.contract().id,
      newTerms: this.newTermsInput(),
    });
    this.currentView.set('amendment_requested_success');
  }

  protected onSign(): void {
    if (!this.authorizedName().trim()) return;
    this.signContract.emit({
      authorizedName: this.authorizedName(),
      signatureDataUrl: '',
    });

    if (this.isCurrentUserBuyer()) {
      this.currentView.set('signed_buyer_success');
    } else {
      this.currentView.set('signed_seller_success');
    }
  }

  protected showAmendmentNotification(): void {
    this.currentView.set('amendment_notification');
  }

  protected backToMain(): void {
    this.currentView.set('main');
  }
}
