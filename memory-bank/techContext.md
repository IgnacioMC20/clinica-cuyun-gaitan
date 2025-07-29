# Technical Context - Clínica Médica Cuyún Gaitán

## Technology Stack

### Frontend Technologies
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Strict type checking for better code quality
- **Tailwind CSS**: Utility-first CSS framework with medical theme
- **TanStack Query**: Server state management and caching
- **React Router**: Client-side routing with protected routes
- **Vite**: Fast development server and build tool
- **Vitest**: Unit testing framework for components

### Backend Technologies
- **Fastify**: High-performance Node.js web framework
- **MongoDB**: Document database for flexible patient data
- **Mongoose**: ODM for MongoDB with TypeScript support
- **Lucia Auth**: Session-based authentication library
- **Argon2**: Password hashing for security
- **Jest**: API testing framework

### Development Tools
- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality gates
- **Docker**: Containerization for consistent environments
- **Nodemon**: Development server auto-restart

## Development Setup

### Prerequisites
- Node.js 18+ (LTS recommended)
- MongoDB 6.0+ (local or cloud)
- Git for version control
- VS Code (recommended IDE)

### Environment Configuration

#### Frontend (.env.development)
```bash
VITE_API_URL=http://localhost:4000/api
VITE_APP_NAME=Clínica Médica Cuyún Gaitán
VITE_APP_VERSION=1.0.0
VITE_DEBUG=true
```

#### Backend (.env)
```bash
NODE_ENV=development
PORT=4000
MONGODB_URI=mongodb://localhost:27017/clinica-cuyun-gaitan
SESSION_SECRET=your-session-secret-here
CORS_ORIGIN=http://localhost:5173
```

### Development Commands

#### Frontend (ui/)
```bash
npm run dev          # Start development server
npm run build        # Production build
npm run test         # Run tests
npm run lint         # Lint code
npm run type-check   # TypeScript checking
```

#### Backend (server/)
```bash
npm run dev          # Start with nodemon
npm run build        # Compile TypeScript
npm run start        # Production start
npm run test         # Run API tests
npm run seed         # Seed database
```

## Technical Constraints

### Performance Requirements
- **Page Load Time**: < 2 seconds on standard clinic hardware
- **API Response Time**: < 500ms for patient queries
- **Concurrent Users**: Support 10+ simultaneous users
- **Database Queries**: Optimized with proper indexing

### Browser Support
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+
- **Mobile Support**: Responsive design for tablets
- **Accessibility**: WCAG 2.1 AA compliance
- **Internet Explorer**: Not supported (modern clinic environment)

### Security Requirements
- **HTTPS**: Required in production
- **Session Security**: Secure cookies with proper expiration
- **Input Validation**: Both client and server-side validation
- **SQL Injection**: Protected by MongoDB and Mongoose
- **XSS Protection**: Input sanitization and CSP headers

## Database Design

### MongoDB Collections

#### Users Collection
```typescript
{
  _id: ObjectId,
  email: string,
  hashed_password: string,
  role: 'admin' | 'doctor' | 'nurse' | 'assistant',
  createdAt: Date,
  updatedAt: Date
}
```

#### Patients Collection
```typescript
{
  _id: ObjectId,
  firstName: string,
  lastName: string,
  email?: string,
  phone: string,
  address: string,
  dateOfBirth: Date,
  gender: 'male' | 'female' | 'child',
  age: number,
  visitDate: Date,
  notes: [{
    _id: ObjectId,
    title: string,
    content: string,
    date: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

#### Sessions Collection (Lucia Auth)
```typescript
{
  _id: string,
  user_id: string,
  expires_at: Date
}
```

### Database Indexes
```javascript
// Text search index for patient names
db.patients.createIndex({
  firstName: "text",
  lastName: "text",
  email: "text"
});

// Compound index for filtering
db.patients.createIndex({
  gender: 1,
  age: 1,
  visitDate: -1
});

// User email index
db.users.createIndex({ email: 1 }, { unique: true });
```

## API Design

### RESTful Endpoints

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/signup` - User registration
- `POST /auth/logout` - User logout
- `GET /auth/me` - Current user info

#### Patients
- `GET /api/patients` - List patients (with search/filter)
- `GET /api/patients/:id` - Get single patient
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient (admin/doctor only)

#### Patient Notes
- `POST /api/patients/:id/notes` - Add note
- `DELETE /api/patients/:id/notes/:noteId` - Delete note

#### Statistics
- `GET /api/stats` - Dashboard statistics

### Request/Response Patterns

#### Pagination
```typescript
// Request
GET /api/patients?limit=10&offset=20

// Response
{
  patients: Patient[],
  total: number,
  limit: number,
  offset: number
}
```

#### Search and Filtering
```typescript
// Request
GET /api/patients?query=juan&gender=male&ageMin=18&ageMax=65

// Response
{
  patients: Patient[],
  total: number,
  // ... pagination info
}
```

## Deployment Architecture

### Development Environment
- **Frontend**: Vite dev server (localhost:5173)
- **Backend**: Nodemon server (localhost:4000)
- **Database**: Local MongoDB instance
- **Hot Reload**: Enabled for both frontend and backend

### Production Environment
- **Frontend**: Static files served by CDN/web server
- **Backend**: Node.js server with PM2 process manager
- **Database**: MongoDB Atlas or dedicated MongoDB server
- **Reverse Proxy**: Nginx for SSL termination and load balancing

### Docker Configuration
```dockerfile
# Frontend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]

# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 4000
CMD ["npm", "start"]
```

## Testing Strategy

### Frontend Testing
- **Unit Tests**: Component testing with Vitest and React Testing Library
- **Integration Tests**: User workflow testing
- **E2E Tests**: Critical path testing with Playwright (planned)
- **Accessibility Tests**: Automated a11y testing

### Backend Testing
- **Unit Tests**: Individual function testing
- **Integration Tests**: API endpoint testing
- **Database Tests**: MongoDB operations testing
- **Authentication Tests**: Session and security testing

### Test Coverage Goals
- **Frontend**: 80% code coverage minimum
- **Backend**: 90% code coverage minimum
- **Critical Paths**: 100% coverage for auth and patient data

## Monitoring and Logging

### Development Logging
- **Frontend**: Console logging with debug levels
- **Backend**: Structured JSON logging with Fastify
- **Database**: MongoDB query logging for optimization

### Production Monitoring
- **Application Metrics**: Response times, error rates
- **Database Metrics**: Query performance, connection pool
- **User Analytics**: Feature usage and performance
- **Error Tracking**: Automated error reporting and alerting

## Security Considerations

### Authentication Security
- **Password Hashing**: Argon2 with proper salt
- **Session Management**: Secure cookies with HttpOnly flag
- **Session Expiration**: Automatic cleanup of expired sessions
- **Brute Force Protection**: Rate limiting on login attempts

### Data Security
- **Input Validation**: Comprehensive validation on all inputs
- **Output Encoding**: Prevent XSS attacks
- **Database Security**: Connection encryption and access controls
- **File Upload Security**: Validation and sanitization (future feature)

### Network Security
- **HTTPS**: Required for all production traffic
- **CORS**: Configured for specific origins only
- **CSP Headers**: Content Security Policy implementation
- **Rate Limiting**: API endpoint protection
