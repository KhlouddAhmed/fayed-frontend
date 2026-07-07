export interface ApiResponse {
  readonly StatusCode: number;
  readonly IsSuccess: boolean;
  readonly Message: string;
  readonly Errors: readonly string[] | null;
}

export interface ApiResponseWithData<T> extends ApiResponse {
  readonly Data: T | null;
}

export interface PagedResult<T> {
  readonly Items: readonly T[];
  readonly Page: number;
  readonly PageSize: number;
  readonly TotalCount: number;
  readonly TotalPages: number;
}
