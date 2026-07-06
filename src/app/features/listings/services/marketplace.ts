import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponseWithData, PagedResult } from '../../../core/models/api-response.model';
import { Listing, ListingDto, ListingSearchParams } from '../models/listing.model';
import { adaptListings } from '../adapters/listing.adapter';
import { PaginatedResponse } from '../../../core/models/pagination.model';

@Injectable({ providedIn: 'root' })
export class MarketplaceService {
  private readonly http = inject(HttpClient);

  getListings(
    page: number,
    pageSize: number,
    sort: string = 'newest',
    filters?: Partial<ListingSearchParams>
  ): Observable<PaginatedResponse<Listing>> {
    let params = new HttpParams()
      .set('PageNumber', page)
      .set('PageSize', pageSize)
      .set('SortBy', sort);

    if (filters?.searchTerm) params = params.set('SearchTerm', filters.searchTerm);
    if (filters?.categoryId) params = params.set('CategoryId', filters.categoryId);
    if (filters?.location)   params = params.set('Location', filters.location);
    if (filters?.minPrice)   params = params.set('MinPrice', filters.minPrice);
    if (filters?.maxPrice)   params = params.set('MaxPrice', filters.maxPrice);
    if (filters?.minQuantity) params = params.set('MinQuantity', filters.minQuantity);
    if (filters?.maxQuantity) params = params.set('MaxQuantity', filters.maxQuantity);

    return this.http
      .get<ApiResponseWithData<PagedResult<ListingDto>>>(
        `${environment.apiUrl}/listings`,
        { params }
      )
      .pipe(
        map(res => ({
          items: adaptListings(res.Data?.Items ?? []),
          totalCount: res.Data?.TotalCount ?? 0,
          page: res.Data?.Page ?? page,
          pageSize: res.Data?.PageSize ?? pageSize,
        }))
      );
  }
}