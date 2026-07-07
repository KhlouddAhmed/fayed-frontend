import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgOptimizedImage, DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MarketplaceService } from '../../services/marketplace';
import { OfferPopup } from '../offer-popup/offer-popup';
import { NavbarComponent } from '../../../../layout/navbar/navbar';
import { ChatbotWidget } from '../../../ai/components/chatbot-widget/chatbot-widget';

@Component({
  selector: 'app-listing-details',
  imports: [NgOptimizedImage, DecimalPipe, OfferPopup, NavbarComponent, ChatbotWidget],
  templateUrl: './listing-details.html',
  styleUrl: './listing-details.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListingDetailsComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly marketplaceService = inject(MarketplaceService);

  protected readonly selectedImage = signal(0);
  protected readonly listing = signal<any>(null);
  protected readonly notFound = signal(false);
  protected readonly isPopupOpen = signal(false);
  protected readonly isLoading = signal(true);
  protected readonly isSubmitting = signal(false);
  protected readonly isContactingLoading = signal(false);
  protected readonly submitError = signal<string | null>(null);
  protected readonly submitSuccess = signal(false);
  protected readonly contactError = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (!id) {
      this.notFound.set(true);
      return;
    }
    this.loadListing(id);
  }

  private loadListing(id: string): void {
    this.isLoading.set(true);
    this.marketplaceService.getListingById(id).subscribe({
      next: (data) => {
        this.listing.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.notFound.set(true);
        this.isLoading.set(false);
      },
    });
  }

  protected selectImage(index: number): void {
    this.selectedImage.set(index);
  }

  protected goBack(): void {
    this.router.navigate(['/marketplace']);
  }

  protected onSendOffer(): void {
    this.submitError.set(null);
    this.submitSuccess.set(false);
    this.isPopupOpen.set(true);
  }

  protected onClosePopup(): void {
    this.isPopupOpen.set(false);
  }

  protected async onSubmitOffer(offerData: {
    quantity: number;
    price: number;
    message: string;
  }): Promise<void> {
    const currentListing = this.listing();
    if (!currentListing) return;

    this.isSubmitting.set(true);
    this.submitError.set(null);

    try {
      await firstValueFrom(
        this.marketplaceService.submitOffer({
          ListingId: Number(currentListing.id),
          OfferedQuantity: offerData.quantity,
          OfferedPricePerUnit: offerData.price,
          Notes: offerData.message,
        })
      );
      this.submitSuccess.set(true);
      this.isPopupOpen.set(false);
    } catch {
      this.submitError.set('حدث خطأ أثناء إرسال العرض. حاول مرة أخرى.');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  protected async onContactSeller(): Promise<void> {
    const currentListing = this.listing();
    if (!currentListing) return;

    this.isContactingLoading.set(true);
    this.contactError.set(null);

    try {
      const chatId = await firstValueFrom(
        this.marketplaceService.createOrGetChat(Number(currentListing.id))
      );
      await this.router.navigate(['/dashboard/company/messages'], {
        queryParams: { chatId: String(chatId) },
      });
    } catch {
      this.contactError.set('تعذر فتح المحادثة. حاول مرة أخرى.');
      this.isContactingLoading.set(false);
    }
  }
}