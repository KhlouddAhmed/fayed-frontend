import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Toast, ToastService } from '../../../core/services/toast.service';

/**
 * حاوية التوستات العامة — تُعرض مرة واحدة في جذر التطبيق.
 * التوستات القابلة للنقر (إشعارات SignalR) تنقل المستخدم لصفحة الإشعار.
 */
@Component({
  selector: 'app-toast-container',
  template: `
    <div class="toast-stack" dir="rtl" aria-live="polite">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="toast-item"
          [class.toast-item--success]="toast.type === 'success'"
          [class.toast-item--error]="toast.type === 'error'"
          [class.toast-item--warning]="toast.type === 'warning'"
          [class.toast-item--info]="toast.type === 'info'"
          [class.toast-item--clickable]="!!toast.onClick"
          role="status"
          (click)="onToastClick(toast)"
        >
          <div class="toast-item-content">
            @if (toast.title) {
              <strong class="toast-item-title">{{ toast.title }}</strong>
            }
            <span class="toast-item-message">{{ toast.message }}</span>
          </div>
          <button
            type="button"
            class="toast-item-close"
            aria-label="إغلاق"
            (click)="onDismiss($event, toast)"
          >
            ✕
          </button>
        </div>
      }
    </div>
  `,
  styles: `
    .toast-stack {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: min(380px, calc(100vw - 48px));
    }

    .toast-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px 16px;
      border-radius: 10px;
      background: #1e293b;
      color: #f8fafc;
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.25);
      border-inline-start: 4px solid #64748b;
      animation: toast-slide-in 0.25s ease-out;
      font-size: 13.5px;
      line-height: 1.6;
    }

    .toast-item--success { border-inline-start-color: #22c55e; }
    .toast-item--error   { border-inline-start-color: #ef4444; }
    .toast-item--warning { border-inline-start-color: #f59e0b; }
    .toast-item--info    { border-inline-start-color: #3b82f6; }

    .toast-item--clickable { cursor: pointer; }
    .toast-item--clickable:hover { background: #273449; }

    .toast-item-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
      flex: 1;
    }

    .toast-item-title { font-size: 14px; }

    .toast-item-close {
      background: transparent;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      font-size: 13px;
      padding: 2px;
      line-height: 1;
    }

    .toast-item-close:hover { color: #f8fafc; }

    @keyframes toast-slide-in {
      from { transform: translateY(12px); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastContainer {
  protected readonly toastService = inject(ToastService);

  protected onToastClick(toast: Toast): void {
    if (toast.onClick) {
      toast.onClick();
      this.toastService.dismiss(toast.id);
    }
  }

  protected onDismiss(event: Event, toast: Toast): void {
    event.stopPropagation();
    this.toastService.dismiss(toast.id);
  }
}
