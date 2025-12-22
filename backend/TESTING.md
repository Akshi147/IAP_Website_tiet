# IAP Website Backend - Testing Documentation

## Overview

This document provides comprehensive information about the testing setup for the IAP Website Backend. The test suite includes unit tests, integration tests, and code coverage reports to ensure code quality and reliability.

## Test Structure

```
backend/
├── tests/
│   ├── setup.js                    # Test configuration and setup
│   ├── student.controller.test.js  # Student controller unit tests
│   ├── admin.controller.test.js    # Admin controller unit tests
│   ├── mentor.controller.test.js   # Mentor controller unit tests
│   ├── integration.test.js         # API integration tests
│   ├── models.test.js             # Database model tests
│   └── middleware.test.js         # Authentication middleware tests
├── jest.config.js                 # Jest configuration
├── test-runner.js                 # Custom test runner script
└── package.json                   # Dependencies and scripts
```

## Testing Framework

- **Jest**: Primary testing framework
- **Supertest**: HTTP assertion library for integration tests
- **Mocking**: Extensive use of Jest mocks for isolated unit testing

## Test Categories

### 1. Unit Tests

**Purpose**: Test individual functions and components in isolation

**Coverage**:
- Controller functions (student, admin, mentor)
- Model methods (password hashing, token generation)
- Authentication middleware
- Validation logic

**Files**:
- `student.controller.test.js`
- `admin.controller.test.js`
- `mentor.controller.test.js`
- `models.test.js`
- `middleware.test.js`

### 2. Integration Tests

**Purpose**: Test API endpoints and component interactions

**Coverage**:
- Complete request/response cycles
- Authentication flows
- File upload functionality
- Error handling

**Files**:
- `integration.test.js`

### 3. Code Coverage

**Purpose**: Measure test coverage and identify untested code

**Metrics**:
- Line coverage
- Function coverage
- Branch coverage
- Statement coverage

## Installation

### Prerequisites

```bash
# Install Node.js dependencies
npm install

# Install testing dependencies (if not already installed)
npm install --save-dev jest supertest @types/jest
```

### Environment Setup

Create a test environment file or ensure your `.env` file includes:

```env
NODE_ENV=test
JWT_SECRET=your_test_jwt_secret
MONGODB_URI=mongodb://localhost:27017/iap_test
```

## Running Tests

### Using NPM Scripts

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Using Custom Test Runner

```bash
# Run all tests
node test-runner.js

# Run specific test types
node test-runner.js unit
node test-runner.js integration
node test-runner.js coverage

# Get help
node test-runner.js help
```

### Using Jest Directly

```bash
# Run all tests
npx jest

# Run specific test file
npx jest tests/student.controller.test.js

# Run tests with coverage
npx jest --coverage

# Run tests in watch mode
npx jest --watch
```

## Test Configuration

### Jest Configuration (`jest.config.js`)

```javascript
module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  testMatch: ['**/tests/**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js']
};
```

### Test Setup (`tests/setup.js`)

- Environment configuration
- Database connection handling
- Mock cleanup between tests

## Writing Tests

### Test Structure Example

```javascript
describe('Controller Name', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    // Setup mock objects
    mockReq = { body: {}, params: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('Function Name', () => {
    it('should handle success case', async () => {
      // Arrange
      mockReq.body = { /* test data */ };
      
      // Act
      await controllerFunction(mockReq, mockRes);
      
      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(/* expected response */);
    });

    it('should handle error case', async () => {
      // Test error scenarios
    });
  });
});
```

### Mocking Guidelines

1. **Mock External Dependencies**: Database models, email services, file systems
2. **Mock Authentication**: JWT verification, user sessions
3. **Mock HTTP Requests**: Use supertest for integration tests
4. **Clear Mocks**: Always clear mocks between tests

## Test Coverage

### Coverage Reports

After running tests with coverage, reports are generated in:

```
backend/coverage/
├── lcov-report/     # HTML coverage report
├── lcov.info        # LCOV format for CI/CD
└── coverage-final.json
```

### Coverage Thresholds

Current coverage targets:
- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 80%
- **Lines**: 80%

### Viewing Coverage

```bash
# Generate and open HTML coverage report
npm run test:coverage
open coverage/lcov-report/index.html
```

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm test
      - run: npm run test:coverage
```

## Test Data Management

### Mock Data

```javascript
const mockStudentData = {
  name: 'John Doe',
  email: 'john@test.com',
  rollNo: 'CS001',
  branch: 'CSE'
};

const mockAdminData = {
  email: 'admin@test.com',
  password: 'password123',
  branch: 'CSE'
};
```

### Test Database

- Use separate test database
- Clean up data between tests
- Use transactions for isolation

## Debugging Tests

### Common Issues

1. **Async/Await**: Ensure proper async handling
2. **Mock Cleanup**: Clear mocks between tests
3. **Database State**: Reset database state
4. **Environment Variables**: Use test-specific values

### Debugging Commands

```bash
# Run tests with verbose output
npx jest --verbose

# Run specific test with debugging
npx jest --testNamePattern="specific test name"

# Debug with Node.js debugger
node --inspect-brk node_modules/.bin/jest --runInBand
```

## Best Practices

### 1. Test Organization
- Group related tests in describe blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### 2. Mock Management
- Mock external dependencies
- Use factory functions for mock data
- Clear mocks between tests

### 3. Assertions
- Test both success and error cases
- Verify all side effects
- Use specific assertions

### 4. Performance
- Keep tests fast and isolated
- Use beforeEach/afterEach for setup/cleanup
- Avoid unnecessary database operations

## Troubleshooting

### Common Errors

1. **Module Not Found**: Check import paths and mock setup
2. **Timeout Errors**: Increase Jest timeout for async operations
3. **Mock Issues**: Ensure mocks are properly configured
4. **Database Errors**: Check test database connection

### Solutions

```javascript
// Increase timeout for specific tests
jest.setTimeout(10000);

// Proper async/await handling
await expect(asyncFunction()).resolves.toBe(expectedValue);

// Mock implementation
mockFunction.mockImplementation(() => Promise.resolve(mockData));
```

## Contributing

When adding new features:

1. Write tests for new functionality
2. Maintain or improve coverage
3. Follow existing test patterns
4. Update documentation

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

---

For questions or issues with the test suite, please refer to the project documentation or contact the development team.