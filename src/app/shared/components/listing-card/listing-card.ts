import { Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Listing } from '../../../features/listings/models/listing.model';

@Component({
  selector: 'app-listing-card',
  imports: [NgOptimizedImage],
  templateUrl: './listing-card.html',
  styleUrl: './listing-card.css',
})
export class ListingCardComponent {
  //  INPUTS
  listing = input.required<Listing>();
  viewMode = input<'grid' | 'list'>('grid');

  //  ACTIONS
  onViewDetails(): void {
    // TODO: navigate to listing-details page once route/feature is implemented
  }
}