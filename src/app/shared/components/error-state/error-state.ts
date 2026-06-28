import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-error-state',
  templateUrl: './error-state.html',
  styleUrl: './error-state.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorState {
  readonly message = input<string>('حدث خطأ غير متوقع، حاول مرة أخرى');

  readonly retry = output<void>();
}
