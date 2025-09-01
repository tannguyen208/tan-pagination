import {
  validatePaginationOptions,
  calculatePaginationMeta,
  calculateOffset,
  generatePageNumbers,
  formatPaginationResponse
} from '../utils';
import { PaginationConfig } from '../types';

describe('Utils', () => {
  describe('validatePaginationOptions', () => {
    it('should validate and normalize options with defaults', () => {
      const result = validatePaginationOptions({});
      
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('should use custom config defaults', () => {
      const config: PaginationConfig = {
        defaultPage: 2,
        defaultLimit: 20,
        maxLimit: 50,
        minLimit: 5
      };
      
      const result = validatePaginationOptions({}, config);
      
      expect(result.page).toBe(2);
      expect(result.limit).toBe(20);
    });

    it('should clamp limit to max value', () => {
      const config: PaginationConfig = { maxLimit: 10 };
      const result = validatePaginationOptions({ limit: 20 }, config);
      
      expect(result.limit).toBe(10);
    });

    it('should clamp limit to min value', () => {
      const config: PaginationConfig = { minLimit: 5 };
      const result = validatePaginationOptions({ limit: 1 }, config);
      
      expect(result.limit).toBe(5);
    });

    it('should ensure page is positive', () => {
      const result = validatePaginationOptions({ page: -1 });
      
      expect(result.page).toBe(1);
    });

    it('should floor decimal values', () => {
      const result = validatePaginationOptions({ page: 2.7, limit: 15.3 });
      
      expect(result.page).toBe(2);
      expect(result.limit).toBe(15);
    });
  });

  describe('calculatePaginationMeta', () => {
    it('should calculate metadata correctly', () => {
      const meta = calculatePaginationMeta({ page: 3, limit: 10 }, 100);
      
      expect(meta.page).toBe(3);
      expect(meta.limit).toBe(10);
      expect(meta.total).toBe(100);
      expect(meta.totalPages).toBe(10);
      expect(meta.hasNext).toBe(true);
      expect(meta.hasPrev).toBe(true);
      expect(meta.nextPage).toBe(4);
      expect(meta.prevPage).toBe(2);
    });

    it('should handle first page', () => {
      const meta = calculatePaginationMeta({ page: 1, limit: 10 }, 100);
      
      expect(meta.hasPrev).toBe(false);
      expect(meta.prevPage).toBe(null);
      expect(meta.hasNext).toBe(true);
      expect(meta.nextPage).toBe(2);
    });

    it('should handle last page', () => {
      const meta = calculatePaginationMeta({ page: 10, limit: 10 }, 100);
      
      expect(meta.hasNext).toBe(false);
      expect(meta.nextPage).toBe(null);
      expect(meta.hasPrev).toBe(true);
      expect(meta.prevPage).toBe(9);
    });

    it('should handle single page', () => {
      const meta = calculatePaginationMeta({ page: 1, limit: 10 }, 5);
      
      expect(meta.totalPages).toBe(1);
      expect(meta.hasNext).toBe(false);
      expect(meta.hasPrev).toBe(false);
      expect(meta.nextPage).toBe(null);
      expect(meta.prevPage).toBe(null);
    });
  });

  describe('calculateOffset', () => {
    it('should calculate offset correctly', () => {
      expect(calculateOffset(1, 10)).toBe(0);
      expect(calculateOffset(2, 10)).toBe(10);
      expect(calculateOffset(3, 15)).toBe(30);
    });
  });

  describe('generatePageNumbers', () => {
    it('should generate page numbers for middle page', () => {
      const pages = generatePageNumbers(5, 10, 5);
      expect(pages).toEqual([3, 4, 5, 6, 7]);
    });

    it('should generate page numbers for first page', () => {
      const pages = generatePageNumbers(1, 10, 5);
      expect(pages).toEqual([1, 2, 3, 4, 5]);
    });

    it('should generate page numbers for last page', () => {
      const pages = generatePageNumbers(10, 10, 5);
      expect(pages).toEqual([6, 7, 8, 9, 10]);
    });

    it('should handle total pages less than max visible', () => {
      const pages = generatePageNumbers(2, 3, 5);
      expect(pages).toEqual([1, 2, 3]);
    });

    it('should handle edge case with even max visible', () => {
      const pages = generatePageNumbers(5, 10, 4);
      expect(pages).toEqual([3, 4, 5, 6]);
    });
  });

  describe('formatPaginationResponse', () => {
    it('should format response correctly', () => {
      const data = [{ id: 1 }, { id: 2 }];
      const meta = {
        page: 1,
        limit: 10,
        total: 100,
        totalPages: 10,
        hasNext: true,
        hasPrev: false,
        nextPage: 2,
        prevPage: null
      };
      
      const result = formatPaginationResponse(data, meta);
      
      expect(result.data).toBe(data);
      expect(result.pagination).toBe(meta);
    });
  });
}); 