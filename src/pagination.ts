import { 
  PaginationOptions, 
  PaginationResult, 
  PaginationMeta, 
  PaginationConfig 
} from './types';
import {
  validatePaginationOptions,
  calculatePaginationMeta,
  calculateOffset,
  generatePageNumbers,
  formatPaginationResponse
} from './utils';

export class Pagination {
  private config: PaginationConfig;

  constructor(config: PaginationConfig = {}) {
    this.config = {
      defaultPage: 1,
      defaultLimit: 10,
      maxLimit: 100,
      minLimit: 1,
      ...config
    };
  }

  /**
   * Create pagination result from array data
   */
  paginate<T>(
    data: T[],
    options: Partial<PaginationOptions>
  ): PaginationResult<T> {
    const validatedOptions = validatePaginationOptions(options, this.config);
    const { page, limit } = validatedOptions;
    const total = data.length;
    
    const offset = calculateOffset(page, limit);
    const paginatedData = data.slice(offset, offset + limit);
    
    const meta = calculatePaginationMeta(validatedOptions, total);
    
    return formatPaginationResponse(paginatedData, meta);
  }

  /**
   * Create pagination metadata without data
   */
  createMeta(options: Partial<PaginationOptions>, total: number): PaginationMeta {
    const validatedOptions = validatePaginationOptions(options, this.config);
    return calculatePaginationMeta(validatedOptions, total);
  }

  /**
   * Get pagination options for database queries
   */
  getQueryOptions(options: Partial<PaginationOptions>): {
    offset: number;
    limit: number;
    page: number;
  } {
    const validatedOptions = validatePaginationOptions(options, this.config);
    const { page, limit } = validatedOptions;
    const offset = calculateOffset(page, limit);
    
    return { offset, limit, page };
  }

  /**
   * Generate page numbers for UI pagination
   */
  getPageNumbers(
    currentPage: number,
    totalPages: number,
    maxVisible: number = 5
  ): number[] {
    return generatePageNumbers(currentPage, totalPages, maxVisible);
  }

  /**
   * Validate pagination parameters
   */
  validate(options: Partial<PaginationOptions>): {
    isValid: boolean;
    errors: string[];
    normalized: PaginationOptions;
  } {
    const errors: string[] = [];
    
    try {
      const normalized = validatePaginationOptions(options, this.config);
      
      if (options.page !== undefined && options.page < 1) {
        errors.push('Page must be greater than 0');
      }
      
      if (options.limit !== undefined) {
        if (options.limit < this.config.minLimit!) {
          errors.push(`Limit must be at least ${this.config.minLimit}`);
        }
        if (options.limit > this.config.maxLimit!) {
          errors.push(`Limit cannot exceed ${this.config.maxLimit}`);
        }
      }
      
      return {
        isValid: errors.length === 0,
        errors,
        normalized
      };
    } catch (error) {
      return {
        isValid: false,
        errors: ['Invalid pagination options'],
        normalized: { page: 1, limit: 10 }
      };
    }
  }

  /**
   * Create pagination links for API responses
   */
  createLinks(
    baseUrl: string,
    meta: PaginationMeta,
    queryParams: Record<string, unknown> = {}
  ): {
    first: string;
    last: string;
    next: string | null;
    prev: string | null;
  } {
    const buildUrl = (page: number) => {
      const params = new URLSearchParams({
        ...queryParams,
        page: page.toString(),
        limit: meta.limit.toString()
      });
      return `${baseUrl}?${params.toString()}`;
    };

    return {
      first: buildUrl(1),
      last: buildUrl(meta.totalPages),
      next: meta.hasNext ? buildUrl(meta.nextPage!) : null,
      prev: meta.hasPrev ? buildUrl(meta.prevPage!) : null
    };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<PaginationConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get current configuration
   */
  getConfig(): PaginationConfig {
    return { ...this.config };
  }
} 