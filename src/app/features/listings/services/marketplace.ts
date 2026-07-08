import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponseWithData, PagedResult, getPagedItems, getPagedTotalCount } from '../../../core/models/api-response.model';
import { Listing, ListingDto, ListingDetailsDto, ListingSearchParams } from '../models/listing.model';
import { adaptListings, adaptListingDetails } from '../adapters/listing.adapter';

export interface SubmitOfferRequest {
  readonly ListingId: number;
  readonly OfferedQuantity: number;
  readonly OfferedPricePerUnit: number;
  readonly Notes: string;
}

export interface CreateChatResponse {
  readonly id?: number;
  readonly Id?: number;
}

interface PagedResponse<T> {
  readonly items: readonly T[];
  readonly totalCount: number;
  readonly page: number;
  readonly pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class MarketplaceService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/listings`;
  private readonly offersUrl = `${environment.apiUrl}/purchaseoffers`;
  private readonly chatsUrl = `${environment.apiUrl}/chats`;

  getListings(
    page: number = 1,
    pageSize: number = 12,
    filters: Partial<ListingSearchParams> = {}
  ): Observable<PagedResponse<Listing>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (filters.searchTerm) params = params.set('searchTerm', filters.searchTerm);
    if (filters.categoryId) params = params.set('categoryId', filters.categoryId!.toString());
    if (filters.location) params = params.set('location', filters.location);
    if (filters.materialType) params = params.set('materialType', filters.materialType);
    if (filters.minQuantity != null) params = params.set('minQuantity', filters.minQuantity.toString());
    if (filters.maxQuantity != null) params = params.set('maxQuantity', filters.maxQuantity.toString());
    if (filters.minPrice != null) params = params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice != null) params = params.set('maxPrice', filters.maxPrice.toString());
    if (filters.sortBy) {
      const direction = filters.sortBy === 'price_asc' ? 'asc' : 'desc';
      params = params.set('sortDirection', direction);
    }

    return this.http
      .get<ApiResponseWithData<PagedResult<ListingDto>>>(this.apiUrl, { params })
      .pipe(
        map(res => {
          const paged = res.data ?? res.Data;
          return {
            items: adaptListings([...getPagedItems(paged ?? {})]),
            totalCount: getPagedTotalCount(paged ?? {}),
            page: paged?.page ?? paged?.Page ?? page,
            pageSize: paged?.pageSize ?? paged?.PageSize ?? pageSize,
          };
        })
      );
  }

  getListingById(id: string): Observable<Listing> {
    return this.http
      .get<ApiResponseWithData<ListingDetailsDto>>(`${this.apiUrl}/${id}`)
      .pipe(map(res => adaptListingDetails(res.data ?? res.Data!)));
  }

  // POST /api/listings/smart-search with JSON body
  smartSearch(
    query: string,
    page: number = 1,
    pageSize: number = 12
  ): Observable<PagedResponse<Listing>> {
    return this.http
      .post<ApiResponseWithData<PagedResult<ListingDto>>>(
        `${this.apiUrl}/smart-search`,
        { query }
      )
      .pipe(
        map(res => {
          const paged = res.data ?? res.Data;
          return {
            items: adaptListings([...getPagedItems(paged ?? {})]),
            totalCount: getPagedTotalCount(paged ?? {}),
            page: paged?.page ?? paged?.Page ?? page,
            pageSize: paged?.pageSize ?? paged?.PageSize ?? pageSize,
          };
        })
      );
  }

  submitOffer(payload: SubmitOfferRequest): Observable<void> {
    return this.http
      .post<ApiResponseWithData<unknown>>(`${this.offersUrl}/create`, payload)
      .pipe(map(() => void 0));
  }

  createOrGetChat(listingId: number): Observable<number> {
    return this.http
      .post<ApiResponseWithData<CreateChatResponse>>(this.chatsUrl, { ListingId: listingId })
      .pipe(map(res => {
        const data = res.data ?? res.Data;
        return data?.id ?? data?.Id ?? 0;
      }));
  }
}