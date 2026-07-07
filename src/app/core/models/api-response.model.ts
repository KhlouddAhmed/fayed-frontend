export interface ApiResponse {
  readonly StatusCode: number;
  readonly isSuccess: boolean;
  readonly message: string;
  readonly Errors: readonly string[] | null;
}

export interface ApiResponseWithData<T> extends ApiResponse {
  readonly data: T | null;
}

export interface PagedResult<T> {
  readonly Items: readonly T[];
  readonly Page: number;
  readonly PageSize: number;
  readonly TotalCount: number;
  readonly TotalPages: number;
}
