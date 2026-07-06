import { Component, signal, computed, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { AUTH_SERVICE } from '../../../../core/tokens/auth.token';
import { LoginRequest } from '../../models/auth.models';
import { ROUTES } from '../../../../core/constants/routes';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  private readonly authService = inject(AUTH_SERVICE);
  private readonly router      = inject(Router);

  // FORM STATE
  email      = signal('');
  password   = signal('');
  rememberMe = signal(false);

  // UI STATE
  isLoading    = signal(false);
  errorMessage = signal<string | null>(null);
  showPassword = signal(false);

  // PASSWORD EYE ICON
  passwordFocused = signal(false);

  eyeIcon = computed(() => {
    const open   = this.showPassword();
    const active = this.passwordFocused();

    if (open  && active)  return 'assets/icons/login-icons/eye-open-active.png';
    if (open  && !active) return 'assets/icons/login-icons/eye-open-inactive.png';
    if (!open && active)  return 'assets/icons/login-icons/eye-closed-active.png';
    return                       'assets/icons/login-icons/eye-closed-inactive.png';
  });

  // FIELD-LEVEL VALIDATION
  emailTouched    = signal(false);
  passwordTouched = signal(false);

  isEmailValid    = computed(() => this.email().trim().length > 0);
  isPasswordValid = computed(() => this.password().length > 0);
  isFormValid     = computed(() => this.isEmailValid() && this.isPasswordValid());

  // ACTIONS
  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }

  onPasswordFocus(): void {
    this.passwordFocused.set(true);
  }

  onPasswordBlur(): void {
    this.passwordFocused.set(false);
    this.passwordTouched.set(true);
  }

  onRememberMeChange(event: Event): void {
    this.rememberMe.set((event.target as HTMLInputElement).checked);
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
      email:    this.email().trim(),
      password: this.password(),
    };

    this.isLoading.set(true);

    this.authService.login(credentials).subscribe({
      next: (user) => {
        this.isLoading.set(false);
        if (!user) {
          this.errorMessage.set('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
          return;
        }
        if (user.role === 'Admin') {
          this.router.navigate([ROUTES.ADMIN.OVERVIEW]);
        } else {
          this.router.navigate([ROUTES.DASHBOARD.ROOT]);
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
      },
    });
  }

  onForgotPassword(): void {
    this.router.navigate([ROUTES.AUTH.FORGOT_PASSWORD]);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}