import { Component, output, signal } from '@angular/core';

export interface ListingFiltersValue {
  readonly materialType: string;
  readonly governorate: string;
  readonly quantityFrom: number | null;
  readonly quantityTo: number | null;
  readonly priceFrom: number | null;
  readonly priceTo: number | null;
}

@Component({
  selector: 'app-listing-filters',
  imports: [],
  templateUrl: './listing-filters.html',
  styleUrl: './listing-filters.css',
})
export class ListingFiltersComponent {

  /* =============================================
     FILTER STATE
     ============================================= */
  readonly materialType = signal('');
  readonly governorate = signal('');
  readonly quantityFrom = signal<number | null>(null);
  readonly quantityTo = signal<number | null>(null);
  readonly priceFrom = signal<number | null>(null);
  readonly priceTo = signal<number | null>(null);

  readonly applyFilters = output<ListingFiltersValue>();

  /* =============================================
     FIELD CHANGE HANDLERS
     ============================================= */
  onMaterialTypeChange(event: Event): void {
    this.materialType.set((event.target as HTMLSelectElement).value);
  }

  onGovernorateChange(event: Event): void {
    this.governorate.set((event.target as HTMLSelectElement).value);
  }

  onQuantityFromChange(event: Event): void {
    this.quantityFrom.set(this.parseNumberInput(event));
  }

  onQuantityToChange(event: Event): void {
    this.quantityTo.set(this.parseNumberInput(event));
  }

  onPriceFromChange(event: Event): void {
    this.priceFrom.set(this.parseNumberInput(event));
  }

  onPriceToChange(event: Event): void {
    this.priceTo.set(this.parseNumberInput(event));
  }

  /* =============================================
     ACTIONS
     ============================================= */
  onClearAll(): void {
    this.materialType.set('');
    this.governorate.set('');
    this.quantityFrom.set(null);
    this.quantityTo.set(null);
    this.priceFrom.set(null);
    this.priceTo.set(null);
  }

  onSubmit(): void {
    this.applyFilters.emit({
      materialType: this.materialType(),
      governorate: this.governorate(),
      quantityFrom: this.quantityFrom(),
      quantityTo: this.quantityTo(),
      priceFrom: this.priceFrom(),
      priceTo: this.priceTo(),
    });
  }

  /* =============================================
     HELPERS
     ============================================= */
  private parseNumberInput(event: Event): number | null {
    const value = (event.target as HTMLInputElement).value;
    return value === '' ? null : Number(value);
  }
}