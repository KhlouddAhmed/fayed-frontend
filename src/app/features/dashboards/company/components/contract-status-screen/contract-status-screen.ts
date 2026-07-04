import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-contract-status-screen',
  templateUrl: './contract-status-screen.html',
  styleUrl: './contract-status-screen.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContractStatusScreen {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly actionLabel = input.required<string>();
  readonly actionConfirm = output<void>();
}
