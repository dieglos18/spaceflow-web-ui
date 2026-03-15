export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  size: number;
  total: number;
}
