import { Component, input, output, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Listing } from '../../models/listing.model'; 

@Component({
  selector: 'app-offer-popup',
  imports: [DecimalPipe],
  templateUrl: './offer-popup.html',
  styleUrl: './offer-popup.css',
})
export class OfferPopup {
  //  INPUTS
  // قمنا بتوسيع الـ Interface هنا مباشرة ليتعرف الـ HTML على الخاصيتين المطلوبة بنجاح
  listing = input.required<Listing & { 
    company: { name: string }; 
    minOrder: number; 
  }>();

  //  OUTPUTS
  closeModal = output<void>(); 
  submitOffer = output<{ quantity: number; price: number; message: string }>();

  //  STATE (Signals)
  quantity = signal<number | null>(null);
  offerPrice = signal<number | null>(null);
  message = signal<string>('');
  isLoading = signal<boolean>(false);

  //  ACTIONS
  onClose(): void {
    this.closeModal.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onSubmit(): void {
    const currentQty = this.quantity();
    const currentPrice = this.offerPrice();

    if (!currentQty || !currentPrice) return; 

    this.isLoading.set(true);

    this.submitOffer.emit({
      quantity: currentQty,
      price: currentPrice,
      message: this.message(),
    });
  }
}