# tan-pagination

A lightweight and flexible pagination utility library for Node.js applications. This library provides easy-to-use tools for handling pagination in your APIs and applications.

## Features

- 🚀 **Lightweight**: Minimal dependencies, fast performance
- 🔧 **Flexible**: Customizable configuration options
- 📦 **TypeScript**: Full TypeScript support with type definitions
- 🧪 **Tested**: Comprehensive test coverage
- 📚 **Well-documented**: Clear API documentation and examples
- 🎯 **Multiple use cases**: Array pagination, database queries, API responses

## Installation

```bash
npm install tan-pagination
```

## Quick Start

### Basic Usage

```javascript
import { Pagination } from 'tan-pagination';

const pagination = new Pagination();

// Paginate an array of data
const data = Array.from({ length: 100 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }));
const result = pagination.paginate(data, { page: 2, limit: 10 });

console.log(result);
// {
//   data: [{ id: 11, name: 'Item 11' }, ..., { id: 20, name: 'Item 20' }],
//   pagination: {
//     page: 2,
//     limit: 10,
//     total: 100,
//     totalPages: 10,
//     hasNext: true,
//     hasPrev: true,
//     nextPage: 3,
//     prevPage: 1
//   }
// }
```

### Using Default Instance

```javascript
import { pagination } from 'tan-pagination';

// Use the default instance
const result = pagination.paginate(data, { page: 1, limit: 20 });
```

## API Reference

### Pagination Class

#### Constructor

```javascript
new Pagination(config?: PaginationConfig)
```

**Configuration Options:**
- `defaultPage` (number): Default page number (default: 1)
- `defaultLimit` (number): Default items per page (default: 10)
- `maxLimit` (number): Maximum items per page (default: 100)
- `minLimit` (number): Minimum items per page (default: 1)

#### Methods

##### `paginate(data, options)`

Paginate an array of data.

```javascript
const result = pagination.paginate(data, { page: 2, limit: 10 });
```

##### `createMeta(options, total)`

Create pagination metadata without data.

```javascript
const meta = pagination.createMeta({ page: 2, limit: 10 }, 100);
```

##### `getQueryOptions(options)`

Get options for database queries (offset, limit, page).

```javascript
const queryOptions = pagination.getQueryOptions({ page: 3, limit: 15 });
// { offset: 30, limit: 15, page: 3 }
```

##### `getPageNumbers(currentPage, totalPages, maxVisible)`

Generate page numbers for UI pagination.

```javascript
const pageNumbers = pagination.getPageNumbers(5, 10, 5);
// [3, 4, 5, 6, 7]
```

##### `validate(options)`

Validate pagination parameters.

```javascript
const validation = pagination.validate({ page: 1, limit: 10 });
// { isValid: true, errors: [], normalized: { page: 1, limit: 10 } }
```

##### `createLinks(baseUrl, meta, queryParams)`

Create pagination links for API responses.

```javascript
const links = pagination.createLinks(
  'https://api.example.com/users',
  meta,
  { search: 'test' }
);
// {
//   first: 'https://api.example.com/users?page=1&limit=10&search=test',
//   last: 'https://api.example.com/users?page=10&limit=10&search=test',
//   next: 'https://api.example.com/users?page=3&limit=10&search=test',
//   prev: 'https://api.example.com/users?page=1&limit=10&search=test'
// }
```

### Utility Functions

#### `validatePaginationOptions(options, config)`

Validate and normalize pagination options.

#### `calculatePaginationMeta(options, total)`

Calculate pagination metadata.

#### `calculateOffset(page, limit)`

Calculate offset for database queries.

#### `generatePageNumbers(currentPage, totalPages, maxVisible)`

Generate page numbers for UI.

#### `formatPaginationResponse(data, meta)`

Format pagination response.

## Use Cases

### 1. API Response Pagination

```javascript
import { Pagination } from 'tan-pagination';

const pagination = new Pagination();

// In your API route
app.get('/users', (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  
  // Get total count from database
  const total = await User.countDocuments();
  
  // Get paginated data
  const users = await User.find()
    .skip((page - 1) * limit)
    .limit(limit);
  
  // Create pagination metadata
  const meta = pagination.createMeta({ page, limit }, total);
  
  // Create pagination links
  const links = pagination.createLinks(
    `${req.protocol}://${req.get('host')}${req.path}`,
    meta,
    req.query
  );
  
  res.json({
    data: users,
    pagination: meta,
    links
  });
});
```

### 2. Frontend Pagination

```javascript
import { pagination } from 'tan-pagination';

// Generate page numbers for UI
const pageNumbers = pagination.getPageNumbers(currentPage, totalPages, 5);

// Render pagination component
pageNumbers.map(page => (
  <button 
    key={page}
    onClick={() => setCurrentPage(page)}
    className={page === currentPage ? 'active' : ''}
  >
    {page}
  </button>
));
```

### 3. Database Query Optimization

```javascript
import { Pagination } from 'tan-pagination';

const pagination = new Pagination({ maxLimit: 50 });

// Get query options
const { offset, limit } = pagination.getQueryOptions({ page: 2, limit: 25 });

// Use in database query
const results = await db.query(
  'SELECT * FROM users LIMIT ? OFFSET ?',
  [limit, offset]
);
```

## TypeScript Support

The library includes full TypeScript support with type definitions:

```typescript
import { Pagination, PaginationOptions, PaginationResult } from 'tan-pagination';

interface User {
  id: number;
  name: string;
  email: string;
}

const pagination = new Pagination();
const result: PaginationResult<User> = pagination.paginate(users, { page: 1, limit: 10 });
```

## Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Building

Build the library:

```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Changelog

### 1.0.0
- Initial release
- Core pagination functionality
- TypeScript support
- Comprehensive test coverage
- Utility functions for common use cases
