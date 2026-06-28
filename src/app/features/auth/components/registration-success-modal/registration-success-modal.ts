import { Component, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';
 
import { ExtractedCompanyData } from '../../models/registration.models';
import { NgOptimizedImage } from '@angular/common';
 
@Component({
  selector: 'app-registration-success-modal',
  imports: [NgOptimizedImage],
  templateUrl: './registration-success-modal.html',
  styleUrl: './registration-success-modal.css',
})

export class RegistrationSuccessModal {
  private router = inject(Router);
 
  companyData = input.required<ExtractedCompanyData>();
 
  readonly closed = output<void>();
 
  onGoToDashboard(): void {
    // Temporary: redirect to home until the dashboard page exists.
    // Once the dashboard is built, this becomes this.router.navigate(['/dashboard'])
    // and the account is shown there in a "Pending Verification" state, not full access.
    this.router.navigate(['/']);
    this.closed.emit();
  }
}
 