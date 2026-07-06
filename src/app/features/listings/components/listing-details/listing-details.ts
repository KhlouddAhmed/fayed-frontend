import { Component, inject, signal, OnInit } from '@angular/core';
import { NgOptimizedImage, DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MarketplaceService } from '../../services/marketplace';
import { OfferPopup } from '../offer-popup/offer-popup';
import { NavbarComponent } from "../../../../layout/navbar/navbar";
import { ChatbotWidget } from "../../../ai/components/chatbot-widget/chatbot-widget";

@Component({
  selector: 'app-listing-details',
  imports: [NgOptimizedImage, DecimalPipe, OfferPopup, NavbarComponent, ChatbotWidget],
  templateUrl: './listing-details.html',
  styleUrl: './listing-details.css',
})
export class ListingDetailsComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private marketplaceService = inject(MarketplaceService);

  selectedImage = signal(0);
  listing = signal<any>(null);
  notFound = signal(false);
  isPopupOpen = signal(false);
  isLoading = signal(true);

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
      }
    });
  }

  selectImage(index: number): void {
    this.selectedImage.set(index);
  }

  goBack(): void {
    this.router.navigate(['/marketplace']);
  }

  onSendOffer(): void {
    this.isPopupOpen.set(true);
  }

  onClosePopup(): void {
    this.isPopupOpen.set(false);
  }

  onSubmitOffer(offerData: { quantity: number; price: number; message: string }): void {
    console.log('Offer submitted:', offerData);
    this.isPopupOpen.set(false);
  }

  onContactSeller(): void {
    console.log('Contact seller for listing:', this.listing()?.id);
  }
}