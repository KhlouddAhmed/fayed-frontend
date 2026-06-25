import { Component, computed, output, signal } from '@angular/core';

import { RegisterRequest } from '../../../../models/registration.models';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EGYPT_PHONE_PATTERN = /^[0-9]{10,11}$/;
const PASSWORD_PATTERN = /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/;

@Component({
  selector: 'app-account-details-step',
  imports: [],
  templateUrl: './account-details-step.html',
  styleUrl: './account-details-step.css',
})
export class AccountDetailsStep {
  readonly completed = output<RegisterRequest>();
 
  /* =============================================
     FORM STATE
     ============================================= */
  email = signal('');
  phoneNumber = signal('');
  password = signal('');
  confirmPassword = signal('');
 
  /* =============================================
     FIELD-LEVEL VALIDATION
     ============================================= */
  emailTouched = signal(false);
  phoneTouched = signal(false);
  passwordTouched = signal(false);
  confirmPasswordTouched = signal(false);
 
  isEmailValid = computed(() => EMAIL_PATTERN.test(this.email().trim()));
  isPhoneValid = computed(() => EGYPT_PHONE_PATTERN.test(this.phoneNumber().trim()));
  isPasswordValid = computed(() => PASSWORD_PATTERN.test(this.password()));
  isPasswordMatch = computed(() => this.confirmPassword().length > 0 && this.password() === this.confirmPassword());
 
  isFormValid = computed(() =>
    this.isEmailValid() && this.isPhoneValid() && this.isPasswordValid() && this.isPasswordMatch()
  );
 
  /* =============================================
     ACTIONS
     ============================================= */
  onSubmit(): void {
    this.emailTouched.set(true);
    this.phoneTouched.set(true);
    this.passwordTouched.set(true);
    this.confirmPasswordTouched.set(true);
 
    if (!this.isFormValid()) {
      return;
    }
 
    const request: RegisterRequest = {
      email: this.email().trim(),
      phoneNumber: `+20${this.phoneNumber().trim()}`,
      passwordHash: this.password(),
    };
 
    this.completed.emit(request);
  }
}
 