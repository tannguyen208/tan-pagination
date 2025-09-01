// Main exports
export { Pagination } from './pagination';

// Type exports
export type {
  PaginationOptions,
  PaginationResult,
  PaginationMeta,
  PaginationConfig
} from './types';

// Utility function exports
export {
  validatePaginationOptions,
  calculatePaginationMeta,
  calculateOffset,
  generatePageNumbers,
  formatPaginationResponse
} from './utils';

// Default instance
import { Pagination } from './pagination';
export const pagination = new Pagination(); 