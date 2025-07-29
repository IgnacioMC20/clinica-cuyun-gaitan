# Authentication Implementation Guide

## Overview

This implementation provides a complete authentication system for the Clínica Médica Cuyún Gaitán application using:

- **Backend**: Custom session-based authentication with Fastify + MongoDB
- **Frontend**: React with TanStack Query for state management
- **Security**: Rate limiting, secure cookies, password hashing with Argon2

## Features

### Backend Features
- ✅ User registration and login
- ✅ Session-based authentication with secure cookies
- ✅ Password hashing with Argon2
- ✅ Role-based access control (admin, doctor, nurse, assistant)
- ✅ Rate limiting for auth endpoints
- ✅ Protected API routes
- ✅ Session management and cleanup

### Frontend Features
- ✅ Login and signup forms
- ✅ Protected routes with role-based access
- ✅ User menu with logout functionality
- ✅ Authentication state management with TanStack Query
- ✅ Automatic session validation
- ✅ Error handling and user feedback

## Setup Instructions

### 1. Backend Setup

1. **Install dependencies** (already done):
   ```bash
   cd server
   yarn install
   ```

2. **Environment Configuration**:
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/clinica-medica
   PORT=3000
   COOKIE_SECRET=your-super-secret-cookie-signing-key
   FRONTEND_URL=http://localhost:5173
   ```

3. **Start the server**:
   ```bash
   yarn dev
   ```

### 2. Frontend Setup

The frontend is already configured. Just ensure the API URL is correct in `ui/src/lib/api/client.ts`.

### 3. Database Setup

The authentication system will automatically create the necessary collections:
- `users` - User accounts
- `sessions` - Active sessions

## API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info

### Protected Routes (`/api`)

All existing patient routes are now protected and require authentication:
- `GET /api/stats` - Patient statistics
- `GET /api/patients` - List patients
- `POST /api/patients` - Create patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient (admin/doctor only)

## User Roles

1. **Assistant** - Basic access to view and create patients
2. **Nurse** - Same as assistant plus additional medical functions
3. **Doctor** - Can delete patients and access all medical functions
4. **Admin** - Full system access including user management

## Security Features

### Backend Security
- **Password Hashing**: Argon2 for secure password storage
- **Session Management**: Secure, httpOnly cookies with automatic expiration
- **Rate Limiting**: 
  - 5 auth attempts per 15 minutes
  - 100 general requests per minute
- **CORS**: Configured for frontend domain only
- **Input Validation**: Email and password requirements

### Frontend Security
- **Protected Routes**: Automatic redirect to login for unauthenticated users
- **Role-based Access**: Components hidden/shown based on user role
- **Secure Cookies**: Automatic inclusion in API requests
- **Session Validation**: Automatic check on app load and route changes

## Usage Examples

### Creating a New User
```typescript
const { mutate: signup } = useSignup();

signup({
  email: 'doctor@clinic.com',
  password: 'securePassword123',
  role: 'doctor'
});
```

### Protecting a Route
```tsx
<ProtectedRoute roles={['admin', 'doctor']}>
  <AdminPanel />
</ProtectedRoute>
```

### Checking User Role
```typescript
const hasAdminAccess = useHasRole('admin');
const canDeletePatients = useHasAnyRole(['admin', 'doctor']);
```

## File Structure

### Backend Files
```
server/src/
├── auth/
│   └── lucia.ts              # Custom session management
├── plugins/
│   ├── cookies.ts            # Cookie configuration
│   ├── auth.ts               # Auth middleware
│   └── rateLimiting.ts       # Rate limiting setup
├── models/
│   └── authModels.ts         # User and Session models
├── routes/
│   └── auth.ts               # Authentication routes
├── middleware/
│   └── requireAuth.ts        # Route protection middleware
└── index.ts                  # Server setup with auth plugins
```

### Frontend Files
```
ui/src/
├── lib/api/
│   ├── client.ts             # API client with credentials
│   └── auth.ts               # Auth API functions
├── hooks/
│   └── useAuth.ts            # Authentication hooks
├── components/auth/
│   ├── ProtectedRoute.tsx    # Route protection component
│   ├── LoginForm.tsx         # Login form
│   ├── SignupForm.tsx        # Registration form
│   └── UserMenu.tsx          # User menu with logout
└── routes.tsx                # Protected route definitions
```

## Testing the Implementation

1. **Start the backend server**:
   ```bash
   cd server && yarn dev
   ```

2. **Start the frontend**:
   ```bash
   cd ui && yarn dev
   ```

3. **Test the flow**:
   - Visit `http://localhost:5173`
   - You should be redirected to `/login`
   - Create a new account via `/signup`
   - Login and access the dashboard
   - Try accessing protected routes
   - Test logout functionality

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure `FRONTEND_URL` in `.env` matches your frontend URL
2. **Cookie Issues**: Check that `withCredentials: true` is set in API client
3. **Database Connection**: Verify MongoDB is running and connection string is correct
4. **Rate Limiting**: If blocked, wait for the timeout period or restart server

### Environment Variables

Make sure all required environment variables are set:
- `MONGODB_URI` - Database connection
- `COOKIE_SECRET` - For signing cookies (use a strong secret in production)
- `FRONTEND_URL` - For CORS configuration
- `NODE_ENV` - Set to 'production' for production builds

## Production Considerations

1. **Use HTTPS**: Set `secure: true` for cookies in production
2. **Strong Secrets**: Use cryptographically strong secrets
3. **Database Security**: Use MongoDB authentication and encryption
4. **Rate Limiting**: Adjust limits based on expected traffic
5. **Session Cleanup**: Implement periodic cleanup of expired sessions
6. **Monitoring**: Add logging and monitoring for auth events

## Next Steps

1. **User Management**: Add admin interface for managing users
2. **Password Reset**: Implement password reset functionality
3. **Email Verification**: Add email verification for new accounts
4. **Audit Logging**: Track authentication and authorization events
5. **Two-Factor Auth**: Add 2FA for enhanced security