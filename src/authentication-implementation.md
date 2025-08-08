# Authentication System Implementation

## Overview
Complete authentication and authorization system for the M3Core CRM, built with Node.js, Express, TypeScript, and PostgreSQL.

## Architecture

### Repository Pattern
- **UserRepository**: CRUD operations for users, roles, permissions, and phone numbers
- **CompanyRepository**: Company management with automatic role creation
- **AuthRepository**: Token management (email verification, password reset, refresh tokens)

### Service Layer
- **JWTService**: Access token generation/validation with configurable expiry
- **PasswordService**: Bcrypt hashing, validation rules, and random generation
- **EmailService**: Email notifications (stub implementation, ready for Brevo integration)

### Middleware
- **authMiddleware**: JWT verification, permission checking, optional auth
- **validationMiddleware**: Request validation and input sanitization

### Controllers
- **AuthController**: Handles all authentication endpoints

## Features Implemented

### 1. User Registration
- Creates company and super admin user in single transaction
- Automatic role assignment
- Email verification required
- Password complexity validation
- Activity logging

### 2. Authentication Flow
```
Register → Email Verification → Login → JWT Token → Protected Routes
```

### 3. Security Features
- **Password Requirements**:
  - Minimum 8 characters
  - Uppercase and lowercase letters
  - Numbers and special characters
  
- **JWT Implementation**:
  - Access tokens (7 days default)
  - Refresh tokens (30 days)
  - Token revocation support

- **Role-Based Access Control**:
  - Direct role assignment
  - Group-based role inheritance
  - Permission aggregation
  - Wildcard support for super admins

### 4. API Endpoints

#### Public Endpoints
- `POST /api/auth/register` - Register new company and super admin
- `POST /api/auth/login` - User login
- `POST /api/auth/email/verify` - Verify email address
- `POST /api/auth/email/resend-verification` - Resend verification email
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/password/request-reset` - Request password reset
- `POST /api/auth/password/reset` - Reset password with token

#### Protected Endpoints
- `POST /api/auth/logout` - Logout user (requires authentication)

### 5. Database Integration
- Transaction support for data consistency
- Connection pooling (max 20 connections)
- Prepared statements for security
- Automatic timestamp updates via triggers

### 6. Error Handling
- Validation errors with field-specific messages
- Generic error messages for security
- Development mode detailed errors
- Activity logging for all auth events

## Request/Response Examples

### Registration
```json
POST /api/auth/register
{
  "email": "admin@example.com",
  "password": "SecurePass@123",
  "first_name": "John",
  "middle_initial": "D",
  "last_name": "Doe",
  "company_name": "Acme Real Estate",
  "salutation": "Mr.",
  "gender": "male"
}

Response:
{
  "message": "Registration successful. Please check your email to verify your account.",
  "user": {
    "id": "U0001",
    "email": "admin@example.com",
    "first_name": "John",
    "last_name": "Doe"
  },
  "company": {
    "id": "C0001",
    "name": "Acme Real Estate"
  }
}
```

### Login
```json
POST /api/auth/login
{
  "email": "admin@example.com",
  "password": "SecurePass@123"
}

Response:
{
  "user": { /* user object without password */ },
  "access_token": "eyJhbGc...",
  "refresh_token": "a1b2c3...",
  "expires_in": 604800
}
```

## Permission System

### System Roles
1. **super_admin**: Full system access (`["*"]`)
2. **admin**: Company-wide management
3. **manager**: Department/group management
4. **agent**: Basic CRM operations
5. **viewer**: Read-only access

### Permission Examples
- `users.create` - Create new users
- `users.read.own` - Read own user data
- `properties.update.own` - Update own properties
- `*` - Wildcard for all permissions

## Development Setup

### Environment Variables
```env
# Required in .env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
DATABASE_URL=postgresql://localhost/crm_dev
FRONTEND_URL=http://localhost:5173
```

### Running the Server
```bash
npm run dev  # Development with hot reload
npm run build  # Build for production
npm start  # Run production build
```

## Security Considerations

1. **Password Storage**: Bcrypt with 12 salt rounds
2. **Token Security**: Separate secrets for access/refresh tokens
3. **SQL Injection**: Parameterized queries throughout
4. **Rate Limiting**: Ready for implementation
5. **CORS**: Configured for frontend URL
6. **Input Validation**: All endpoints validate and sanitize input

## Next Steps

1. **Email Integration**: Connect Brevo for real email sending
2. **2FA Implementation**: Add TOTP support with Speakeasy
3. **File Upload**: Profile picture upload with Multer
4. **Invitation System**: User invitation flow
5. **Testing**: Unit and integration tests
6. **Rate Limiting**: Implement request throttling
7. **API Documentation**: OpenAPI/Swagger specs