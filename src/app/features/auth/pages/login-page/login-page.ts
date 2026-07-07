import { Component, signal, computed, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { LoginRequest } from '../../models/auth.models';
import { ROUTES } from '../../../../core/constants/routes';

@Component({
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly email = signal('');
  protected readonly password = signal('');
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly showPassword = signal(false);
  protected readonly passwordFocused = signal(false);
  protected readonly emailTouched = signal(false);
  protected readonly passwordTouched = signal(false);

  protected readonly eyeIcon = computed(() => {
    const open = this.showPassword();
    const active = this.passwordFocused();
    if (open && active) return 'assets/icons/login-icons/eye-open-active.png';
    if (open && !active) return 'assets/icons/login-icons/eye-open-inactive.png';
    if (!open && active) return 'assets/icons/login-icons/eye-closed-active.png';
    return 'assets/icons/login-icons/eye-closed-inactive.png';
  });

  protected readonly isEmailValid = computed(() => this.email().trim().length > 0);
  protected readonly isPasswordValid = computed(() => this.password().length > 0);
  protected readonly isFormValid = computed(() => this.isEmailValid() && this.isPasswordValid());

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
    };

    this.isLoading.set(true);

    this.authService.login(credentials).subscribe({
      next: user => {
        this.isLoading.set(false);
        if (!user) {
          this.errorMessage.set('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
          return;
        }
        const destination = user.role === 'Admin'
          ? `/${ROUTES.ADMIN.OVERVIEW}`
          : `/${ROUTES.DASHBOARD.OVERVIEW}`;
        this.router.navigateByUrl(destination);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
      },
    });
  }

  goBack(): void {
    this.router.navigateByUrl(`/${ROUTES.HOME}`);
  }
}