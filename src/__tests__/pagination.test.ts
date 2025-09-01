import { Pagination } from '../pagination';

describe('Pagination', () => {
  let pagination: Pagination;

  beforeEach(() => {
    pagination = new Pagination();
  });

  describe('constructor', () => {
    it('should create with default config', () => {
      const config = pagination.getConfig();
      expect(config.defaultPage).toBe(1);
      expect(config.defaultLimit).toBe(10);
      expect(config.maxLimit).toBe(100);
      expect(config.minLimit).toBe(1);
    });

    it('should create with custom config', () => {
      const customPagination = new Pagination({
        defaultPage: 2,
        defaultLimit: 20,
        maxLimit: 50,
        minLimit: 5
      });
      
      const config = customPagination.getConfig();
      expect(config.defaultPage).toBe(2);
      expect(config.defaultLimit).toBe(20);
      expect(config.maxLimit).toBe(50);
      expect(config.minLimit).toBe(5);
    });
  });

  describe('paginate', () => {
    const testData = Array.from({ length: 100 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }));

    it('should paginate data correctly', () => {
      const result = pagination.paginate(testData, { page: 2, limit: 10 });
      
      expect(result.data).toHaveLength(10);
      expect(result.data[0].id).toBe(11);
      expect(result.data[9].id).toBe(20);
      expect(result.pagination.page).toBe(2);
      expect(result.pagination.limit).toBe(10);
      expect(result.pagination.total).toBe(100);
      expect(result.pagination.totalPages).toBe(10);
      expect(result.pagination.hasNext).toBe(true);
      expect(result.pagination.hasPrev).toBe(true);
    });

    it('should handle first page', () => {
      const result = pagination.paginate(testData, { page: 1, limit: 10 });
      
      expect(result.data[0].id).toBe(1);
      expect(result.pagination.hasPrev).toBe(false);
      expect(result.pagination.prevPage).toBe(null);
    });

    it('should handle last page', () => {
      const result = pagination.paginate(testData, { page: 10, limit: 10 });
      
      expect(result.data[9].id).toBe(100);
      expect(result.pagination.hasNext).toBe(false);
      expect(result.pagination.nextPage).toBe(null);
    });

    it('should use default values when options are not provided', () => {
      const result = pagination.paginate(testData, {});
      
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(10);
    });
  });

  describe('createMeta', () => {
    it('should create pagination metadata', () => {
      const meta = pagination.createMeta({ page: 2, limit: 10 }, 100);
      
      expect(meta.page).toBe(2);
      expect(meta.limit).toBe(10);
      expect(meta.total).toBe(100);
      expect(meta.totalPages).toBe(10);
      expect(meta.hasNext).toBe(true);
      expect(meta.hasPrev).toBe(true);
    });
  });

  describe('getQueryOptions', () => {
    it('should return correct query options', () => {
      const options = pagination.getQueryOptions({ page: 3, limit: 15 });
      
      expect(options.page).toBe(3);
      expect(options.limit).toBe(15);
      expect(options.offset).toBe(30); // (3-1) * 15
    });
  });

  describe('getPageNumbers', () => {
    it('should generate page numbers for UI', () => {
      const pageNumbers = pagination.getPageNumbers(5, 10, 5);
      
      expect(pageNumbers).toEqual([3, 4, 5, 6, 7]);
    });

    it('should handle small total pages', () => {
      const pageNumbers = pagination.getPageNumbers(2, 3, 5);
      
      expect(pageNumbers).toEqual([1, 2, 3]);
    });
  });

  describe('validate', () => {
    it('should validate correct options', () => {
      const result = pagination.validate({ page: 1, limit: 10 });
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect invalid page', () => {
      const result = pagination.validate({ page: 0, limit: 10 });
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Page must be greater than 0');
    });

    it('should detect invalid limit', () => {
      const result = pagination.validate({ page: 1, limit: 0 });
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Limit must be at least 1');
    });
  });

  describe('createLinks', () => {
    it('should create pagination links', () => {
      const meta = pagination.createMeta({ page: 2, limit: 10 }, 100);
      const links = pagination.createLinks('https://api.example.com/users', meta);
      
      expect(links.first).toContain('page=1');
      expect(links.last).toContain('page=10');
      expect(links.next).toContain('page=3');
      expect(links.prev).toContain('page=1');
    });

    it('should handle query parameters', () => {
      const meta = pagination.createMeta({ page: 2, limit: 10 }, 100);
      const links = pagination.createLinks(
        'https://api.example.com/users',
        meta,
        { search: 'test', filter: 'active' }
      );
      
      expect(links.first).toContain('search=test');
      expect(links.first).toContain('filter=active');
      expect(links.first).toContain('page=1');
    });
  });

  describe('updateConfig', () => {
    it('should update configuration', () => {
      pagination.updateConfig({ defaultLimit: 25, maxLimit: 200 });
      
      const config = pagination.getConfig();
      expect(config.defaultLimit).toBe(25);
      expect(config.maxLimit).toBe(200);
    });
  });
}); 