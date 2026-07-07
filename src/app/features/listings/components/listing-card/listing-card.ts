import { Component, inject, input } from '@angular/core';
import { NgOptimizedImage, DecimalPipe } from '@angular/common';
import { Listing } from '../../models/listing.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listing-card',
  imports: [DecimalPipe],
  templateUrl: './listing-card.html',
  styleUrl: './listing-card.css',
})
export class ListingCardComponent {
  //  INPUTS
  listing = input.required<Listing>();
  viewMode = input<'grid' | 'list'>('grid');

  private router = inject(Router);


  //  ACTIONS
onViewDetails(): void {
  this.router.navigate(['/marketplace', this.listing().id]);
}
}