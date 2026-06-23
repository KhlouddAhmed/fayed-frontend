export interface PaginatedResponse<T> {
  readonly items: T[];
  readonly totalCount: number;
  readonly page: number;
  readonly pageSize: number;
}