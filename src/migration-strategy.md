# CRM Migration Strategy - Local to DigitalOcean

## Overview
This document outlines the migration strategy from local development to DigitalOcean App Platform, Managed Database, and Spaces - without using Docker.

## Development Without Docker - Migration-Ready Architecture

### Phase 1: Local Development Setup
1. **PostgreSQL**: Install locally via Homebrew
   ```bash
   brew install postgresql
   ```
2. **Redis**: For caching/sessions
   ```bash
   brew install redis
   ```
3. **Elasticsearch**: For advanced search
   ```bash
   brew install elasticsearch
   ```
4. **File Storage**: Local filesystem with abstraction layer

### Architecture Design for Easy Migration

#### 1. Environment-Based Configuration
```typescript
// config/storage.ts
const storageConfig = {
  type: process.env.STORAGE_TYPE || 'local', // 'local' or 'spaces'
  local: {
    uploadPath: './uploads'
  },
  spaces: {
    endpoint: process.env.DO_SPACES_ENDPOINT,
    accessKey: process.env.DO_SPACES_KEY,
    secret: process.env.DO_SPACES_SECRET,
    bucket: process.env.DO_SPACES_BUCKET
  }
};

// config/database.ts
const dbConfig = {
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost/crm_dev',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

// config/cache.ts
const redisConfig = {
  url: process.env.REDIS_URL || 'redis://localhost:6379'
};
```

#### 2. Service Abstraction Layers

**Storage Service Interface**:
```typescript
interface IStorageService {
  upload(file: Buffer, path: string): Promise<string>;
  download(path: string): Promise<Buffer>;
  delete(path: string): Promise<void>;
  getUrl(path: string): string;
}

// Implementations: LocalStorageService, SpacesStorageService
```

**Database Service**: 
- Connection strings that switch between local and managed DB
- Use environment variables for configuration

**Cache Service**: 
- Redis connection that can point to local or managed Redis
- Fallback to in-memory cache if Redis unavailable

### Migration Strategy After Phase 1

#### 1. Deploy to DigitalOcean App Platform
- **Backend**: Deploy as Web Service
- **Frontend**: Deploy as Static Site
- **Database**: Use Managed PostgreSQL
- **Redis**: Use Managed Redis (or Redis in App Platform)

#### 2. File Storage Migration
```bash
# Step 1: Update environment variables
STORAGE_TYPE=spaces
DO_SPACES_ENDPOINT=nyc3.digitaloceanspaces.com
DO_SPACES_KEY=your-access-key
DO_SPACES_SECRET=your-secret-key
DO_SPACES_BUCKET=your-bucket-name

# Step 2: Run migration script (to be created)
npm run migrate:files

# No code changes needed!
```

#### 3. Database Migration
```bash
# Step 1: Export local database
pg_dump crm_dev > backup.sql

# Step 2: Import to DigitalOcean Managed Database
psql $DO_DATABASE_URL < backup.sql

# Step 3: Update environment variable
DATABASE_URL=your-do-database-url
```

#### 4. Search Service Options
1. **Option A**: Elasticsearch on Droplet (self-managed)
2. **Option B**: PostgreSQL full-text search (initially)
3. **Option C**: Managed Elasticsearch service (when available)

### Environment Variables Structure

**Local Development (.env.local)**:
```env
NODE_ENV=development
DATABASE_URL=postgresql://localhost/crm_dev
REDIS_URL=redis://localhost:6379
STORAGE_TYPE=local
ELASTICSEARCH_URL=http://localhost:9200
```

**Production (.env.production)**:
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@db-cluster.ondigitalocean.com:25060/crm_prod
REDIS_URL=redis://redis-cluster.ondigitalocean.com:25061
STORAGE_TYPE=spaces
DO_SPACES_ENDPOINT=nyc3.digitaloceanspaces.com
DO_SPACES_KEY=your-key
DO_SPACES_SECRET=your-secret
DO_SPACES_BUCKET=crm-uploads
ELASTICSEARCH_URL=http://elasticsearch-droplet:9200
```

### Benefits of This Approach
- ✅ No Docker complexity during development
- ✅ Clean separation of concerns
- ✅ Environment variables control everything
- ✅ Zero code changes for migration
- ✅ Can develop/test locally with exact same codebase
- ✅ Easy rollback if needed
- ✅ Gradual migration possible (e.g., database first, then files)

### Migration Checklist
- [ ] Set up DigitalOcean account and projects
- [ ] Create Managed PostgreSQL cluster
- [ ] Create Spaces bucket
- [ ] Set up App Platform project
- [ ] Configure environment variables
- [ ] Test connections from local to cloud services
- [ ] Run database migration
- [ ] Run file migration
- [ ] Deploy application
- [ ] Verify all services working
- [ ] Update DNS records

### Rollback Plan
1. Keep local backups for 30 days
2. Database: Point back to local CONNECTION_STRING
3. Files: Change STORAGE_TYPE back to 'local'
4. Cache: Redis will repopulate automatically

### Cost Estimation (DigitalOcean)
- App Platform (Basic): $5-20/month
- Managed PostgreSQL: $15-60/month
- Spaces: $5/month + bandwidth
- Total: ~$25-85/month for initial deployment