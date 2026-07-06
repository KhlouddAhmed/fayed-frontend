import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponseWithData, PagedResult } from '../../../core/models/api-response.model';
import { Listing, ListingDto, ListingDetailsDto, ListingSearchParams } from '../models/listing.model';
import { adaptListings, adaptListingDetails } from '../adapters/listing.adapter';

@Injectable({ providedIn: 'root' })
export class MarketplaceService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/listings`;

  getListings(
    page: number = 1,
    pageSize: number = 12,
    filters: Partial<ListingSearchParams> = {}
  ): Observable<any> {
    let params = new HttpParams()
      .set('Page', page.toString())
      .set('PageSize', pageSize.toString());

    if (filters.searchTerm) params = params.set('SearchTerm', filters.searchTerm);
    if (filters.categoryId) params = params.set('CategoryId', filters.categoryId!.toString());
    if (filters.location) params = params.set('Location', filters.location);
    if (filters.materialType) params = params.set('MaterialType', filters.materialType);
    if (filters.minQuantity != null) params = params.set('MinQuantity', filters.minQuantity.toString());
    if (filters.maxQuantity != null) params = params.set('MaxQuantity', filters.maxQuantity.toString());
    if (filters.minPrice != null) params = params.set('MinPrice', filters.minPrice.toString());
    if (filters.maxPrice != null) params = params.set('MaxPrice', filters.maxPrice.toString());
    if (filters.sortBy) {
  const direction = filters.sortBy === 'price_asc' ? 'asc' : 'desc';
  params = params.set('SortDirection', direction);
}

    return this.http
      .get<ApiResponseWithData<PagedResult<ListingDto>>>(this.apiUrl, { params })
      .pipe(
        map(res => ({
          items: adaptListings([...(res.Data?.Items ?? [])]),
          totalCount: res.Data?.TotalCount ?? 0,
          page: res.Data?.Page ?? page,
          pageSize: res.Data?.PageSize ?? pageSize,
        }))
      );
  }

  getListingById(id: string): Observable<any> {
    return this.http
      .get<ApiResponseWithData<ListingDetailsDto>>(`${this.apiUrl}/${id}`)
      .pipe(
        map(res => adaptListingDetails(res.Data!))
      );
  }

  smartSearch(query: string, page: number = 1, pageSize: number = 12): Observable<any> {
  let params = new HttpParams()
    .set('Page', page.toString())
    .set('PageSize', pageSize.toString())
    .set('query', query);

  return this.http
    .get<ApiResponseWithData<PagedResult<ListingDto>>>(`${this.apiUrl}/smart-search`, { params })
    .pipe(
      map(res => ({
        items: adaptListings([...(res.Data?.Items ?? [])]),
        totalCount: res.Data?.TotalCount ?? 0,
      }))
    );
}
}