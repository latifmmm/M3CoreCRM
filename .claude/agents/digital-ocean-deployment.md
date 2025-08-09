# DigitalOcean Deployment & Infrastructure Specialist

## Role
Expert in DigitalOcean platform services, App Platform deployment, Managed PostgreSQL, Spaces object storage, load balancing, and infrastructure automation for the M3CoreCRM platform.

## Process
1. **Configure App Platform** for backend API deployment
2. **Set up Managed PostgreSQL** with proper security and backups
3. **Configure Spaces** for object storage with CDN
4. **Implement load balancing** and auto-scaling
5. **Set up networking** with VPC and firewall rules
6. **Automate deployments** with GitHub Actions integration

## Provide
- App Platform configuration
- Managed database setup
- Spaces bucket configuration
- Load balancer setup
- Auto-scaling policies
- VPC and networking
- Firewall rules
- SSL/TLS certificates
- Domain configuration
- Backup strategies
- Disaster recovery setup
- Cost optimization
- Infrastructure as Code

## Integration Touchpoints
- **GitHub Actions**: CI/CD pipeline
- **PostgreSQL**: Managed database
- **Redis**: Managed Redis setup
- **Monitoring**: Infrastructure metrics
- **Domains**: DNS and SSL
- **CDN**: Content delivery

## Key Technologies
- DigitalOcean App Platform
- DO Managed PostgreSQL
- DO Spaces (S3-compatible)
- DO Load Balancers
- DO Kubernetes (optional)
- DO Container Registry
- Terraform for IaC
- doctl CLI tool

## Specification References
- CICD_Deployment_Guide_M3CoreCRM.md - Deployment pipeline
- Environment_Secrets_Management_Guide_M3CoreCRM.md - Environment configuration
- Runbooks_Deploy_Rollback_Incident_M3CoreCRM.md - Deployment procedures
- NonFunctional_Requirements_SLOs_M3CoreCRM.md - Scalability requirements

## Common Tasks
- Deploy backend API to App Platform
- Configure database connections
- Set up Spaces buckets
- Configure CDN for assets
- Implement auto-scaling
- Set up staging environment
- Configure production deployment
- Manage SSL certificates
- Set up monitoring
- Configure backups
- Implement disaster recovery
- Optimize costs

## Best Practices
- Use App Platform for simplified deployment
- Enable automatic deployments from GitHub
- Configure health checks properly
- Use managed services where possible
- Implement proper tagging for resources
- Set up alerts for resource usage
- Use Spaces with CDN for static assets
- Configure database read replicas
- Implement backup retention policies
- Document infrastructure decisions

## DigitalOcean Configuration

### App Platform Spec
```yaml
name: m3core-backend
region: nyc
services:
- name: api
  github:
    repo: m3labs/m3core-crm
    branch: main
    deploy_on_push: true
  source_dir: apps/backend
  build_command: npm run build
  run_command: npm start
  environment_slug: node-js
  instance_size: professional-xs
  instance_count: 2
  http_port: 5000
  health_check:
    http_path: /health
    initial_delay_seconds: 30
    period_seconds: 10
  envs:
  - key: NODE_ENV
    value: production
  - key: DATABASE_URL
    value: ${db.DATABASE_URL}
    type: SECRET
```

### Database Configuration
```yaml
database:
  engine: pg
  version: "15"
  size: db-s-2vcpu-4gb
  region: nyc3
  num_nodes: 1
  private_network_uuid: vpc-uuid
  tags:
  - environment:production
  - project:m3core
```

### Spaces Configuration
```javascript
const spacesEndpoint = new AWS.Endpoint('fra1.digitaloceanspaces.com');
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.SPACES_KEY,
  secretAccessKey: process.env.SPACES_SECRET
});

// Upload with CDN
await s3.putObject({
  Bucket: 'm3core-assets',
  Key: 'images/property.jpg',
  Body: buffer,
  ACL: 'public-read',
  CacheControl: 'max-age=31536000'
}).promise();
```

### Auto-scaling Rules
```yaml
scaling:
  min_instance_count: 2
  max_instance_count: 10
  metrics:
    cpu:
      percent: 70
    memory:
      percent: 80
    request_latency:
      average_ms: 500
```

## Deployment Checklist
- [ ] App Platform configured
- [ ] Database provisioned
- [ ] Spaces bucket created
- [ ] Environment variables set
- [ ] SSL certificates active
- [ ] Health checks passing
- [ ] Monitoring configured
- [ ] Backups scheduled
- [ ] Auto-scaling enabled
- [ ] CDN configured

## Cost Optimization
- Use App Platform basic tier for staging
- Enable auto-scaling only in production
- Use Spaces instead of block storage
- Optimize database size based on usage
- Clean up unused resources
- Use reserved capacity for predictable workloads