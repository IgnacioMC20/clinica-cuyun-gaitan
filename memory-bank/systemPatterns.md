# System Patterns - Clínica Médica Cuyún Gaitán

## Architecture Overview

### Frontend Architecture
```
ui/
├── src/
│   ├── components/
│   │   ├── atoms/          # Basic UI elements (Button, Input, Card)
│   │   ├── molecules/      # Simple combinations (FormField, PatientCard)
│   │   ├── organisms/      # Complex components (PatientForm, DashboardPanel)
│   │   ├── auth/          # Authentication components
│   │   └── ui/            # Shadcn/ui components
│   ├── pages/             # Route components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities and configurations
│   └── styles/            # CSS and theme files
```

### Backend Architecture
```
server/
├── src/
│   ├── models/            # MongoDB schemas (Patient, User)
│   ├── routes/            # API endpoints
│   ├── auth/              # Lucia Auth configuration
│   ├── middleware/        # Authentication and validation
│   └── plugins/           # Fastify plugins
```

## Key Technical Decisions

### Component Architecture - Atomic Design
**Decision**: Implement strict atomic design hierarchy
**Rationale**: 
- Ensures consistent UI patterns across the application
- Promotes component reusability and maintainability
- Scales well as the application grows
- Makes testing more manageable

**Implementation**:
- **Atoms**: Basic elements like Button, Input, Typography
- **Molecules**: Simple combinations like FormField, SearchInput
- **Organisms**: Complex components like PatientForm, DashboardPanel
- **Pages**: Route-level components that compose organisms

### State Management Strategy
**Decision**: TanStack Query for server state, React Context for auth state
**Rationale**:
- TanStack Query provides excellent caching and synchronization
- Reduces boilerplate compared to Redux
- Built-in loading and error states
- Optimistic updates for better UX

**Implementation**:
```typescript
// Query configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,  // 5 minutes
      gcTime: 10 * 60 * 1000,    // 10 minutes
    },
  },
});
```

### Authentication Architecture
**Decision**: Lucia Auth with session-based authentication
**Rationale**:
- More secure than JWT for web applications
- Better session management and invalidation
- TypeScript-first design
- Integrates well with Fastify

**Implementation**:
- Sessions stored in MongoDB
- Middleware validates sessions on protected routes
- Frontend uses React Context for auth state
- Automatic session refresh and cleanup

## Design Patterns

### API Response Pattern
**Consistent response structure across all endpoints**:
```typescript
// Success Response
{
  data: T,
  message?: string
}

// Error Response
{
  error: string,
  message: string,
  details?: ValidationError[]
}
```

### Error Handling Pattern
**Three-layer error handling**:
1. **API Layer**: Axios interceptors for network errors
2. **Query Layer**: TanStack Query error handling
3. **UI Layer**: Error boundaries and toast notifications

### Component Props Pattern
**Consistent prop interfaces**:
```typescript
interface ComponentProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
}
```

### Database Schema Pattern
**Consistent MongoDB document structure**:
```typescript
interface BaseDocument {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
```

## Component Relationships

### Patient Management Flow
```
DashboardPage
├── DashboardPanel (organism)
│   ├── StatsCard (molecule)
│   │   └── Typography, Card (atoms)
│   └── PatientSelector (organism)
│       ├── SearchInput (molecule)
│       └── PatientCard (molecule)
│           └── Button, Typography (atoms)
```

### Authentication Flow
```
App
├── ProtectedRoute (auth component)
│   ├── useMe (hook)
│   └── LoginForm (auth component)
│       ├── FormField (molecule)
│       │   ├── Input (atom)
│       │   └── Label (atom)
│       └── Button (atom)
```

## Data Flow Patterns

### Patient Data Flow
1. **User Action**: Search/filter patients
2. **Hook**: usePatients hook with TanStack Query
3. **API**: GET /api/patients with query parameters
4. **Backend**: Mongoose query with filters and pagination
5. **Response**: Transformed patient data
6. **UI Update**: Automatic re-render with new data

### Authentication Data Flow
1. **Login**: User submits credentials
2. **API**: POST /auth/login
3. **Backend**: Validate credentials, create session
4. **Response**: Set session cookie, return user data
5. **Frontend**: Update auth context, redirect to dashboard

## Performance Patterns

### Query Optimization
- **Debounced Search**: 300ms delay for search inputs
- **Pagination**: Limit results to 10-50 items per page
- **Selective Fields**: Only fetch required fields for list views
- **Cache Management**: Intelligent cache invalidation

### Bundle Optimization
- **Code Splitting**: Route-based lazy loading
- **Tree Shaking**: Import only used utilities
- **Asset Optimization**: Optimized images and fonts

## Security Patterns

### Input Validation
- **Frontend**: Form validation with TypeScript types
- **Backend**: Mongoose schema validation
- **Sanitization**: Input sanitization for XSS prevention

### Access Control
- **Route Protection**: ProtectedRoute component wrapper
- **API Protection**: Middleware on all protected endpoints
- **Role-Based Access**: Different permissions per user role

### Data Protection
- **Encryption**: Passwords hashed with Argon2
- **Session Security**: Secure session cookies
- **CORS**: Configured for production domains only

## Testing Patterns

### Component Testing
```typescript
// Test structure for components
describe('ComponentName', () => {
  it('renders correctly', () => {});
  it('handles user interactions', () => {});
  it('displays error states', () => {});
  it('meets accessibility requirements', () => {});
});
```

### API Testing
```typescript
// Test structure for API endpoints
describe('GET /api/patients', () => {
  it('returns patients for authenticated user', () => {});
  it('filters patients correctly', () => {});
  it('handles pagination', () => {});
  it('returns 401 for unauthenticated requests', () => {});
});
```

## Deployment Patterns

### Environment Configuration
- **Development**: Local MongoDB, hot reload
- **Staging**: Cloud MongoDB, production build
- **Production**: Optimized build, CDN assets, monitoring

### Database Patterns
- **Indexes**: Text search indexes on patient names
- **Aggregation**: Statistics calculated with MongoDB aggregation
- **Backup**: Automated daily backups with retention policy
