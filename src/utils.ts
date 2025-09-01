import { PaginationOptions, PaginationMeta, PaginationConfig } from './types';

/**
 * Validate and normalize pagination options
 */
export function validatePaginationOptions(
  options: Partial<PaginationOptions>,
  config: PaginationConfig = {}
): PaginationOptions {
  const {
    defaultPage = 1,
    defaultLimit = 10,
    maxLimit = 100,
    minLimit = 1
  } = config;

  let page = options.page || defaultPage;
  let limit = options.limit || defaultLimit;

  // Ensure page is positive
  page = Math.max(1, Math.floor(page));

  // Ensure limit is within bounds
  limit = Math.max(minLimit, Math.min(maxLimit, Math.floor(limit)));

  return { page, limit };
}

/**
 * Calculate pagination metadata
 */
export function calculatePaginationMeta(
  options: PaginationOptions,
  total: number
): PaginationMeta {
  const { page, limit } = options;
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;
  const nextPage = hasNext ? page + 1 : null;
  const prevPage = hasPrev ? page - 1 : null;

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext,
    hasPrev,
    nextPage,
    prevPage
  };
}

/**
 * Calculate offset for database queries
 */
export function calculateOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}

/**
 * Generate page numbers for pagination UI
 */
export function generatePageNumbers(
  currentPage: number,
  totalPages: number,
  maxVisible: number = 5
): number[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const halfVisible = Math.floor(maxVisible / 2);
  let start = Math.max(1, currentPage - halfVisible);
  const end = Math.min(totalPages, start + maxVisible - 1);

  // Adjust start if we're near the end
  if (end === totalPages) {
    start = Math.max(1, end - maxVisible + 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

/**
 * Format pagination for API response
 */
export function formatPaginationResponse<T>(
  data: T[],
  meta: PaginationMeta
) {
  return {
    data,
    pagination: meta
  };
} 