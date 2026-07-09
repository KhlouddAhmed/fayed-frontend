import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  readonly id: number;
  readonly type: ToastType;
  readonly message: string;
  readonly duration: number;
  /** عنوان اختياري يظهر بخط أعرض فوق الرسالة (يُستخدم لإشعارات SignalR) */
  readonly title?: string;
  /** يُنفَّذ عند الضغط على التوست (مثلاً: الانتقال لصفحة الإشعار) */
  readonly onClick?: () => void;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _counter = 0;
  readonly toasts = signal<readonly Toast[]>([]);

  success(message: string, duration = 4000): void {
    this.add({ type: 'success', message, duration });
  }

  error(message: string, duration = 6000): void {
    this.add({ type: 'error', message, duration });
  }

  warning(message: string, duration = 5000): void {
    this.add({ type: 'warning', message, duration });
  }

  info(message: string, duration = 4000): void {
    this.add({ type: 'info', message, duration });
  }

  /** توست إشعار فوري قابل للنقر (يُستخدم عند وصول ReceiveNotification عبر SignalR) */
  notification(title: string, message: string, onClick?: () => void, duration = 6000): void {
    this.add({ type: 'info', title, message, duration, onClick });
  }

  dismiss(id: number): void {
    this.toasts.update(toasts => toasts.filter(t => t.id !== id));
  }

  private add(options: Omit<Toast, 'id'>): void {
    const id = ++this._counter;
    const toast: Toast = { id, ...options };
    this.toasts.update(toasts => [...toasts, toast]);
    setTimeout(() => this.dismiss(id), options.duration);
  }
}
