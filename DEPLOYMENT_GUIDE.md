# 🚀 Deployment Guide for Disaster Alert

## Production Checklist

### Before Deployment
- [ ] Generate strong SECRET_KEY and JWT_SECRET_KEY
- [ ] Get NASA EONET API key
- [ ] Setup domain and SSL certificate
- [ ] Configure backup strategy
- [ ] Setup monitoring and logging

### Environment Setup

1. **Create Production .env**
   ```bash
   cp .env.example .env.production
   ```

2. **Generate Secure Keys**
   ```bash
   # Generate SECRET_KEY
   python -c "import secrets; print(secrets.token_hex(32))"
   
   # Generate JWT_SECRET_KEY
   python -c "import secrets; print(secrets.token_hex(32))"
   ```

3. **Update .env.production**
   ```
   FLASK_ENV=production
   SECRET_KEY=<generated-key>
   JWT_SECRET_KEY=<generated-key>
   NASA_API_KEY=<your-key>
   DB_PASSWORD=<strong-password>
   FRONTEND_URL=https://yourdomain.com
   BACKEND_URL=https://api.yourdomain.com
   ```

## Docker Deployment

### Local/Development
```bash
# Build and run
docker-compose up --build

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Staging/Production

1. **Build Images**
   ```bash
   docker-compose -f docker-compose.yml build --no-cache
   ```

2. **Push to Registry** (Optional)
   ```bash
   docker tag disaster-alert-backend myregistry/disaster-backend:latest
   docker tag disaster-alert-frontend myregistry/disaster-frontend:latest
   docker push myregistry/disaster-backend:latest
   docker push myregistry/disaster-frontend:latest
   ```

3. **Deploy**
   ```bash
   docker-compose --env-file .env.production up -d
   ```

## Cloud Deployment Options

### AWS Deployment

#### ECS + RDS
```yaml
# Approximate service: $80-150/month
- ECS Fargate: $30-50/month
- RDS MySQL: $40-80/month
- ALB: $15-20/month
- S3 (for logs): $5-10/month
```

#### EC2 + RDS
```yaml
# Approximate cost: $50-100/month
- t3.medium EC2: $30/month
- RDS MySQL t3.micro: $20/month
- Storage: $5-10/month
```

### DigitalOcean Deployment

```bash
# Approximate cost: $12-24/month

# 1. Create droplet (Basic: $6/month)
# 2. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 3. Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/latest/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 4. Clone and deploy
git clone <your-repo>
cd disaster-alert
docker-compose --env-file .env.production up -d

# 5. Setup reverse proxy (Nginx)
# Use managed database: $15/month
```

### Heroku Deployment (Easiest)

```bash
# Approximate cost: Free-$50/month

# 1. Login to Heroku
heroku login

# 2. Create app
heroku create disaster-alert

# 3. Add MySQL addon
heroku addons:create cleardb:ignite

# 4. Set environment variables
heroku config:set FLASK_ENV=production
heroku config:set SECRET_KEY=<key>
heroku config:set NASA_API_KEY=<key>

# 5. Deploy
git push heroku main

# 6. Run migrations
heroku run python
```

## Nginx Reverse Proxy Setup

```nginx
# /etc/nginx/sites-available/disaster-alert

upstream backend {
    server backend:8080;
}

upstream frontend {
    server frontend:3000;
}

server {
    listen 80;
    server_name yourdomain.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    client_max_body_size 20M;
    
    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
    }
    
    # Backend API
    location /api {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## SSL/HTTPS Setup

### Let's Encrypt with Certbot

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificates
sudo certbot certonly --nginx -d yourdomain.com

# Auto-renew
sudo systemctl enable certbot.timer
```

## Database Backup Strategy

### Automated MySQL Backups

```bash
#!/bin/bash
# backup-db.sh

BACKUP_DIR="/backups/mysql"
DB_USER="disaster_user"
DB_PASS="disaster_password"
DB_NAME="disaster_alert"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup
mysqldump -u$DB_USER -p$DB_PASS $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Compress
gzip $BACKUP_DIR/backup_$DATE.sql

# Keep only last 30 days
find $BACKUP_DIR -mtime +30 -delete

# Upload to S3 (optional)
# aws s3 cp $BACKUP_DIR/backup_$DATE.sql.gz s3://your-bucket/backups/
```

### Schedule with Cron

```bash
# Run daily at 2 AM
0 2 * * * /path/to/backup-db.sh
```

## Monitoring & Logging

### Health Checks

```bash
# Check backend health
curl http://localhost:8080/health

# Check database
docker-compose exec db mysqladmin -uroot -proot_password ping
```

### Logging Setup

```bash
# View all logs
docker-compose logs -f

# View specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# Save logs
docker-compose logs > logs_$(date +%Y%m%d_%H%M%S).txt
```

### Log Aggregation (ELK Stack)

Optional: Setup Elasticsearch, Logstash, Kibana for centralized logging

## Performance Optimization

### Database
```sql
-- Add indexes
CREATE INDEX idx_event_date ON events(date);
CREATE INDEX idx_event_category ON events(category);
CREATE INDEX idx_event_status ON events(status);
CREATE INDEX idx_event_location ON events(latitude, longitude);
```

### Caching
```python
# Add Redis to docker-compose.yml
# Implement caching in Flask for frequently accessed data
```

### CDN
```
# Consider Cloudflare or CloudFront for static assets
# Configure DNS to point to CDN
```

## Troubleshooting Deployment

### Backend Won't Start
```bash
# Check MySQL connection
docker-compose logs backend

# Verify database exists
docker-compose exec db mysql -uroot -proot_password -e "SHOW DATABASES;"

# Check environment variables
docker-compose exec backend env
```

### Frontend Not Loading
```bash
# Check Nginx logs
docker-compose logs frontend

# Verify API connectivity
curl http://localhost:8080/health
```

### Database Issues
```bash
# Connect to MySQL
docker-compose exec db mysql -uroot -proot_password

# Check tables
SHOW TABLES;
SELECT COUNT(*) FROM events;
```

## Scaling Strategy

### Horizontal Scaling
```yaml
# Multiple backend instances behind load balancer
# Multiple frontend instances behind reverse proxy
# Read replicas for database
```

### Vertical Scaling
```yaml
# Increase RAM/CPU for containers
# Optimize database queries
# Implement caching layer
```

## Cost Optimization

- Use smaller instance types in off-peak hours
- Enable auto-scaling based on metrics
- Use spot instances for non-critical services
- Implement CDN for static assets
- Archive old event data to cheaper storage

## Security Checklist

- [x] Change default database passwords
- [x] Use strong SECRET_KEY and JWT_SECRET_KEY
- [x] Enable HTTPS/SSL
- [x] Setup firewall rules
- [x] Configure CORS properly
- [x] Enable SQL injection prevention (SQLAlchemy)
- [x] Regular security updates
- [x] API rate limiting
- [x] Backup encryption
- [x] Monitor for suspicious activity
