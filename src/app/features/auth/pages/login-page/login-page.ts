import { Component, signal, computed, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth';
import { LoginRequest } from '../../models/auth.models';

@Component({
  imports: [NgOptimizedImage],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  private authService = inject(AuthService);
  private router = inject(Router);

  /* =============================================
     FORM STATE
     ============================================= */
  email = signal('');
  password = signal('');
  rememberMe = signal(false);

  /* =============================================
     UI STATE
     ============================================= */
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  showPassword = signal(false);

  /* =============================================
     FIELD-LEVEL VALIDATION
     ============================================= */
  emailTouched = signal(false);
  passwordTouched = signal(false);

  isEmailValid = computed(() => this.email().trim().length > 0);
  isPasswordValid = computed(() => this.password().length > 0);
  isFormValid = computed(() => this.isEmailValid() && this.isPasswordValid());

  /* =============================================
     ACTIONS
     ============================================= */
  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  onRememberMeChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.rememberMe.set(input.checked);
  }

  onSubmit(): void {
    this.emailTouched.set(true);
    this.passwordTouched.set(true);
    this.errorMessage.set(null);

    if (!this.isFormValid()) {
      this.errorMessage.set('يرجى إدخال البريد الإلكتروني وكلمة المرور.');
      return;
    }

    const credentials: LoginRequest = {
      email: this.email().trim(),
      password: this.password(),
      rememberMe: this.rememberMe(),
    };

    this.isLoading.set(true);

    this.authService.login(credentials).subscribe({
      next: (user) => {
        this.isLoading.set(false);
        if (user.kybStatus === 'pending') {
          this.router.navigate(['/auth/kyb-pending']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
      },
    });
  }

  onGoogleLogin(): void {
    // Placeholder — wire up OAuth redirect when backend provides the endpoint
  }

  onPhoneLogin(): void {
    this.router.navigate(['/auth/phone-login']);
  }

  onForgotPassword(): void {
    this.router.navigate(['/auth/forgot-password']);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}