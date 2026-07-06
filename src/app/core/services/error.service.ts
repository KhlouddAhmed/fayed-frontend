import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastService } from './toast.service';
import { ROUTES } from '../constants/routes';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  handle(error: HttpErrorResponse): void {
    switch (error.status) {
      case 0:
        this.toast.error('لا يوجد اتصال بالخادم. يرجى التحقق من الاتصال بالإنترنت.');
        break;
      case 400:
        this.handleBadRequest(error);
        break;
      case 401:
        this.toast.error('انتهت صلاحية الجلسة. يرجى تسجيل الدخول مجدداً.');
        this.router.navigateByUrl(`/${ROUTES.AUTH.LOGIN}`);
        break;
      case 403:
        this.toast.error('ليس لديك صلاحية للوصول إلى هذه الصفحة.');
        break;
      case 404:
        this.toast.error('البيانات المطلوبة غير موجودة.');
        break;
      case 422:
        this.handleValidation(error);
        break;
      case 500:
        this.toast.error('حدث خطأ في الخادم. يرجى المحاولة لاحقاً.');
        break;
      default:
        this.toast.error('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.');
    }
  }

  extractMessages(error: HttpErrorResponse): readonly string[] {
    const body = error.error as { Errors?: string[]; Message?: string } | null;
    if (body?.Errors?.length) return body.Errors;
    if (body?.Message) return [body.Message];
    return ['حدث خطأ غير متوقع.'];
  }

  private handleBadRequest(error: HttpErrorResponse): void {
    const messages = this.extractMessages(error);
    messages.forEach(msg => this.toast.error(msg));
  }

  private handleValidation(error: HttpErrorResponse): void {
    const messages = this.extractMessages(error);
    messages.forEach(msg => this.toast.warning(msg));
  }
}
