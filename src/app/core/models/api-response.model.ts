// Backend confirmed returns camelCase
// Supporting both to be safe

export interface ApiResponse {
  // camelCase — actual backend
  readonly statusCode?: number;
  readonly isSuccess?: boolean;
  readonly message?: string;
  readonly errors?: readonly string[] | null;
  // PascalCase — fallback
  readonly StatusCode?: number;
  readonly IsSuccess?: boolean;
  readonly Message?: string;
  readonly Errors?: readonly string[] | null;
}

export interface ApiResponseWithData<T> extends ApiResponse {
  // camelCase — actual backend
  readonly data?: T | null;
  // PascalCase — fallback
  readonly Data?: T | null;
}

export interface PagedResult<T> {
  // camelCase — actual backend
  readonly items?: readonly T[];
  readonly page?: number;
  readonly pageSize?: number;
  readonly totalCount?: number;
  readonly totalPages?: number;
  // PascalCase — fallback
  readonly Items?: readonly T[];
  readonly Page?: number;
  readonly PageSize?: number;
  readonly TotalCount?: number;
  readonly TotalPages?: number;
}

// Helper functions to safely read either casing
export function getResponseData<T>(response: ApiResponseWithData<T>): T | null {
  return response.data ?? response.Data ?? null;
}

export function isResponseSuccess(response: ApiResponse): boolean {
  return response.isSuccess ?? response.IsSuccess ?? false;
}

export function getResponseMessage(response: ApiResponse): string {
  return response.message ?? response.Message ?? '';
}

export function getPagedItems<T>(result: PagedResult<T>): readonly T[] {
  return result.items ?? result.Items ?? [];
}

export function getPagedTotalCount(result: PagedResult<unknown>): number {
  return result.totalCount ?? result.TotalCount ?? 0;
}