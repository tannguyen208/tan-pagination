export interface PaginationOptions {
  page: number;
  limit: number;
  total?: number;
}

export interface PaginationResult<T = unknown> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export interface PaginationConfig {
  defaultPage?: number;
  defaultLimit?: number;
  maxLimit?: number;
  minLimit?: number;
} 