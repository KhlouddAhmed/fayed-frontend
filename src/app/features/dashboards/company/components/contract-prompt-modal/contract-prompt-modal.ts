import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'app-contract-prompt-modal',
  templateUrl: './contract-prompt-modal.html',
  styleUrl: './contract-prompt-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContractPromptModal {
  readonly confirm = output<void>();
  readonly dismiss = output<void>();
}
