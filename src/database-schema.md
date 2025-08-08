# CRM Database Schema Documentation

## Overview
The M3Core CRM uses PostgreSQL 17.5 with a comprehensive schema designed for multi-tenant real estate management with role-based access control.

## Database Structure

### ID Generation Strategy
- Custom ID format using prefixes:
  - Companies: C0001, C0002, etc.
  - Users: U0001, U0002, etc.
  - Groups: G0001, G0002, etc.
  - Roles: R0001, R0002, etc.

### Core Tables

#### 1. **companies**
Stores tenant company information.
- `id`: VARCHAR(5) - Primary key (C0001 format)
- `name`: Company name
- `domain`: Optional company domain
- `subscription_plan`: Current plan (trial, basic, pro, enterprise)
- `timezone`: Company default timezone
- Includes contact info, location, and subscription details

#### 2. **users**
Comprehensive user profiles with extended attributes.
- `id`: VARCHAR(5) - Primary key (U0001 format)
- `company_id`: Links to company
- Personal info: salutation, first_name, middle_initial, last_name, gender
- Preferences: region, timezone, language, theme
- Security: email verification, 2FA status
- Supports multiple phone numbers via `user_phones` table

#### 3. **groups**
Organizational units within companies.
- Users can belong to multiple groups
- Groups can have multiple roles assigned
- Enables hierarchical permission management

#### 4. **roles**
Flexible permission system.
- JSON-based permissions array
- System roles (cannot be modified) and custom roles
- Default system roles:
  - `super_admin`: Full system access
  - `admin`: Company-wide management
  - `manager`: Department/group management
  - `agent`: Basic CRM operations
  - `viewer`: Read-only access

#### 5. **user_phones**
Multiple phone numbers per user.
- Types: mobile, work, home, other
- Primary phone designation
- Verification status

### Permission System

#### Permission Inheritance
1. Direct user roles via `user_roles`
2. Inherited roles from groups via `group_roles`
3. Combined permissions = Union of all assigned permissions

#### Permission Examples
```json
// Super Admin
["*"]

// Admin
["users.create", "users.read", "users.update", "users.delete", 
 "groups.create", "groups.read", "groups.update", "groups.delete",
 "properties.create", "properties.read", "properties.update", "properties.delete"]

// Agent
["users.read.own", 
 "properties.read", "properties.create", "properties.update.own",
 "leads.create", "leads.read.assigned", "leads.update.assigned"]
```

### Security Tables

#### Authentication & Verification
- `email_verifications`: Email confirmation tokens
- `password_resets`: Password reset tokens
- `two_factor_secrets`: TOTP secrets for 2FA
- `refresh_tokens`: JWT refresh token storage

#### Audit & Compliance
- `activity_logs`: Comprehensive audit trail
  - User actions, IP addresses, user agents
  - Metadata in JSONB format
  - Company-scoped for data isolation

### Relationships

```
companies
  ├── users (1:N)
  │   ├── user_phones (1:N)
  │   ├── user_roles (N:M with roles)
  │   └── user_groups (N:M with groups)
  ├── groups (1:N)
  │   └── group_roles (N:M with roles)
  └── roles (1:N)

invitations
  ├── company (N:1)
  ├── role (N:1)
  └── group (N:1)
```

### Key Features

1. **Multi-tenancy**: Complete data isolation by company
2. **Flexible Permissions**: JSON-based permission system
3. **Role Inheritance**: Users inherit permissions from groups
4. **Audit Trail**: Complete activity logging
5. **Security**: Built-in 2FA, email verification, secure tokens
6. **Scalability**: Optimized with indexes on foreign keys and frequently queried fields

### Database Triggers

- `updated_at` triggers on all main tables
- Automatic timestamp updates on record modification

### Performance Optimizations

- Indexes on all foreign keys
- Indexes on token fields for fast lookups
- Separate indexes for email, company_id lookups
- Connection pooling configured (max 20 connections)

## Migration Notes

The schema is designed to support future migration to:
- DigitalOcean Managed PostgreSQL
- Horizontal scaling with read replicas
- Partitioning by company_id if needed