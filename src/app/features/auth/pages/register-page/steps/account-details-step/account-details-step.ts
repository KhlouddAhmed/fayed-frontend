import { Component, computed, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AccountDetailsResult } from '../../../../models/registration.models';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_PATTERN = /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/;

@Component({
  selector: 'app-account-details-step',
  imports: [RouterLink],
  templateUrl: './account-details-step.html',
  styleUrl: './account-details-step.css',
})
export class AccountDetailsStep {
  readonly completed = output<AccountDetailsResult>();

  // Form state
  protected readonly email = signal('');
  protected readonly password = signal('');
  protected readonly confirmPassword = signal('');
  protected readonly name = signal('');
  protected readonly nationalId = signal('');
  protected readonly factoryName = signal('');
  protected readonly address = signal('');
  protected readonly sector = signal('');
  protected readonly commercialRegistryNo = signal('');
  protected readonly taxCardNo = signal('');

  // UI state
  protected readonly showPassword = signal(false);
  protected readonly showConfirmPassword = signal(false);

  // Touched flags
  protected readonly emailTouched = signal(false);
  protected readonly passwordTouched = signal(false);
  protected readonly confirmPasswordTouched = signal(false);
  protected readonly nameTouched = signal(false);
  protected readonly nationalIdTouched = signal(false);
  protected readonly factoryNameTouched = signal(false);
  protected readonly addressTouched = signal(false);
  protected readonly sectorTouched = signal(false);
  protected readonly commercialRegistryNoTouched = signal(false);
  protected readonly taxCardNoTouched = signal(false);

  // Validation
  protected readonly isEmailValid = computed(() => EMAIL_PATTERN.test(this.email().trim()));
  protected readonly isPasswordValid = computed(() => PASSWORD_PATTERN.test(this.password()));
  protected readonly isPasswordMatch = computed(
    () => this.confirmPassword().length > 0 && this.password() === this.confirmPassword()
  );
  protected readonly isNameValid = computed(() => this.name().trim().length >= 3);
  protected readonly isNationalIdValid = computed(() => this.nationalId().trim().length === 14);
  protected readonly isFactoryNameValid = computed(() => this.factoryName().trim().length >= 2);
  protected readonly isAddressValid = computed(() => this.address().trim().length >= 5);
  protected readonly isSectorValid = computed(() => this.sector().trim().length >= 2);
  protected readonly isCommercialRegistryNoValid = computed(
    () => this.commercialRegistryNo().trim().length >= 4
  );
  protected readonly isTaxCardNoValid = computed(() => this.taxCardNo().trim().length >= 4);

  protected readonly isFormValid = computed(
    () =>
      this.isEmailValid() &&
      this.isPasswordValid() &&
      this.isPasswordMatch() &&
      this.isNameValid() &&
      this.isNationalIdValid() &&
      this.isFactoryNameValid() &&
      this.isAddressValid() &&
      this.isSectorValid() &&
      this.isCommercialRegistryNoValid() &&
      this.isTaxCardNoValid()
  );

  onSubmit(): void {
    this.emailTouched.set(true);
    this.passwordTouched.set(true);
    this.confirmPasswordTouched.set(true);
    this.nameTouched.set(true);
    this.nationalIdTouched.set(true);
    this.factoryNameTouched.set(true);
    this.addressTouched.set(true);
    this.sectorTouched.set(true);
    this.commercialRegistryNoTouched.set(true);
    this.taxCardNoTouched.set(true);

    if (!this.isFormValid()) return;

    const result: AccountDetailsResult = {
      email: this.email().trim(),
      password: this.password(),
      name: this.name().trim(),
      nationalId: this.nationalId().trim(),
      factoryName: this.factoryName().trim(),
      address: this.address().trim(),
      sector: this.sector().trim(),
      commercialRegistryNo: this.commercialRegistryNo().trim(),
      taxCardNo: this.taxCardNo().trim(),
    };

    this.completed.emit(result);
  }
}