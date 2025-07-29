# Testing Guide - Clínica Médica Cuyún Gaitán

This document provides comprehensive information about the testing setup and practices for the medical clinic dashboard application.

## Overview

The project uses a comprehensive testing strategy covering:
- **Unit Tests**: Individual component and function testing
- **Integration Tests**: API endpoint and database interaction testing
- **End-to-End Tests**: Full user workflow testing
- **Coverage Reporting**: Code coverage analysis and reporting

## Testing Stack

### Backend Testing
- **Jest**: Testing framework
- **Supertest**: HTTP assertion library for API testing
- **MongoDB Memory Server**: In-memory MongoDB for isolated testing
- **TypeScript**: Type-safe test development

### Frontend Testing
- **Vitest**: Fast testing framework for Vite projects
- **React Testing Library**: Component testing utilities
- **Jest DOM**: Custom Jest matchers for DOM testing
- **User Event**: User interaction simulation

## Project Structure

```
├── server/
│   ├── src/
│   │   ├── __tests__/
│   │   │   ├── models/
│   │   │   │   └── Patient.test.ts
│   │   │   ├── routes/
│   │   │   │   └── api.test.ts
│   │   │   ├── testUtils.ts
│   │   │   └── testApp.ts
│   │   └── ...
│   ├── jest.config.js
│   └── package.json
├── ui/
│   ├── src/
│   │   ├── components/
│   │   │   └── __tests__/
│   │   │       ├── StatsCard.test.tsx
│   │   │       └── PatientSearch.test.tsx
│   │   ├── test/
│   │   │   └── setup.ts
│   │   └── ...
│   ├── vitest.config.ts
│   └── package.json
└── .github/
    └── workflows/
        └── ci.yml
```

## Running Tests

### Backend Tests

```bash
# Navigate to server directory
cd server

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI (no watch mode)
npm run test:ci
```

### Frontend Tests

```bash
# Navigate to UI directory
cd ui

# Run all tests
npm test

# Run tests in watch mode (default)
npm test

# Run tests once (for CI)
npm run test:run

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### Full Project Testing

```bash
# Run all tests from project root
npm run test:all

# Run with coverage for both frontend and backend
npm run test:coverage:all
```

## Test Categories

### 1. Unit Tests

#### Backend Unit Tests
- **Model Tests**: Mongoose schema validation, methods, and static functions
- **Utility Tests**: Helper functions and shared utilities
- **Service Tests**: Business logic and data processing

Example model test:
```typescript
describe('Patient Model', () => {
  it('should create a valid patient', async () => {
    const patientData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      // ... other fields
    };
    
    const patient = new Patient(patientData);
    const savedPatient = await patient.save();
    
    expect(savedPatient._id).toBeDefined();
    expect(savedPatient.firstName).toBe('Juan');
  });
});
```

#### Frontend Unit Tests
- **Component Tests**: React component rendering and behavior
- **Hook Tests**: Custom React hooks functionality
- **Utility Tests**: Frontend helper functions

Example component test:
```typescript
describe('StatsCard', () => {
  it('renders stats card with label and value', () => {
    render(
      <StatsCard
        label="Total Patients"
        value={42}
        icon="👥"
      />
    );

    expect(screen.getByText('Total Patients')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });
});
```

### 2. Integration Tests

#### API Integration Tests
- **Route Testing**: HTTP endpoints with real database operations
- **Authentication**: Login and authorization flows
- **Data Flow**: End-to-end data processing

Example API test:
```typescript
describe('GET /api/patients', () => {
  it('should return all patients', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/patients'
    });

    expect(response.statusCode).toBe(200);
    const data = JSON.parse(response.payload);
    expect(data.patients).toHaveLength(2);
  });
});
```

#### Database Integration Tests
- **CRUD Operations**: Create, read, update, delete operations
- **Data Validation**: Schema validation and constraints
- **Relationships**: Data relationships and references

### 3. End-to-End Tests

#### User Workflow Tests
- **Patient Management**: Complete patient lifecycle
- **Search Functionality**: Patient search and filtering
- **Dashboard Interactions**: Statistics and navigation

## Test Configuration

### Backend Configuration (Jest)

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts',
  ],
  coverageDirectory: 'coverage',
  testTimeout: 30000,
};
```

### Frontend Configuration (Vitest)

```typescript
// vitest.config.ts
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
});
```

## Coverage Requirements

### Minimum Coverage Targets
- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 80%
- **Lines**: 80%

### Critical Components (90%+ Coverage Required)
- Patient model and validation
- API routes and controllers
- Authentication and authorization
- Data transformation utilities

## Mocking Strategies

### Backend Mocking
- **Database**: MongoDB Memory Server for isolated testing
- **External APIs**: Mock HTTP requests and responses
- **File System**: Mock file operations

### Frontend Mocking
- **API Calls**: Mock HTTP requests using MSW or Vitest mocks
- **Browser APIs**: Mock localStorage, sessionStorage, etc.
- **Third-party Libraries**: Mock external dependencies

Example mock:
```typescript
// Mock usePatients hook
vi.mock('../../hooks/usePatients', () => ({
  usePatients: vi.fn(() => ({
    data: { patients: mockPatients },
    loading: false,
    fetchPatients: vi.fn()
  }))
}));
```

## Continuous Integration

### GitHub Actions Workflow
The CI pipeline includes:
1. **Dependency Installation**: Install and cache dependencies
2. **Linting**: Code style and quality checks
3. **Unit Tests**: Run all unit tests with coverage
4. **Integration Tests**: API and database integration tests
5. **Build Verification**: Ensure applications build successfully
6. **Security Scanning**: Vulnerability assessment
7. **Coverage Reporting**: Upload coverage to Codecov

### Pipeline Stages
```yaml
jobs:
  backend-tests:
    # Backend testing with MongoDB service
  frontend-tests:
    # Frontend testing with Vitest
  integration-tests:
    # Full integration testing
  security-scan:
    # Security vulnerability scanning
  build:
    # Build verification
```

## Best Practices

### Writing Tests
1. **Descriptive Names**: Use clear, descriptive test names
2. **Arrange-Act-Assert**: Follow the AAA pattern
3. **Single Responsibility**: One assertion per test when possible
4. **Test Edge Cases**: Include boundary conditions and error cases
5. **Clean Setup/Teardown**: Proper test isolation

### Test Organization
1. **Group Related Tests**: Use `describe` blocks for organization
2. **Shared Setup**: Use `beforeEach` and `afterEach` for common setup
3. **Test Data**: Create reusable test data factories
4. **Helper Functions**: Extract common test utilities

### Performance
1. **Parallel Execution**: Run tests in parallel when possible
2. **Selective Testing**: Run only affected tests during development
3. **Fast Feedback**: Prioritize fast-running tests
4. **Resource Cleanup**: Properly clean up test resources

## Debugging Tests

### Backend Debugging
```bash
# Run specific test file
npm test -- Patient.test.ts

# Run with verbose output
npm test -- --verbose

# Debug with Node.js inspector
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Frontend Debugging
```bash
# Run specific test
npm test -- StatsCard.test.tsx

# Run with UI for debugging
npm run test:ui

# Debug in browser
npm test -- --reporter=verbose
```

## Common Issues and Solutions

### Backend Issues
1. **Database Connection**: Ensure MongoDB Memory Server is properly configured
2. **Async Operations**: Use proper async/await patterns
3. **Test Isolation**: Clear database between tests

### Frontend Issues
1. **Component Rendering**: Ensure proper component wrapping
2. **Async Updates**: Use `waitFor` for async state changes
3. **Mock Cleanup**: Clear mocks between tests

## Coverage Reports

### Viewing Coverage
- **Backend**: Open `server/coverage/lcov-report/index.html`
- **Frontend**: Open `ui/coverage/index.html`
- **CI**: View reports on Codecov dashboard

### Coverage Exclusions
Files excluded from coverage:
- Configuration files
- Test files
- Type definitions
- Build artifacts

## Contributing

### Adding New Tests
1. Create test files alongside source files
2. Follow existing naming conventions
3. Include both positive and negative test cases
4. Update documentation for new testing patterns

### Test Review Checklist
- [ ] Tests cover all public methods/components
- [ ] Edge cases and error conditions tested
- [ ] Mocks are properly configured
- [ ] Tests are deterministic and isolated
- [ ] Coverage meets minimum requirements

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Vitest Documentation](https://vitest.dev/guide/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server)
- [Supertest Documentation](https://github.com/visionmedia/supertest)

---

For questions or issues with testing, please refer to the project documentation or create an issue in the repository.