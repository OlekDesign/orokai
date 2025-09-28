# Deployment Guide

This guide covers different deployment strategies for the Orokai crypto platform.

## 🚀 Quick Deploy Options

### 1. GitHub Pages (Current Setup)

**Automatic Deployment:**
```bash
git push origin main  # Triggers automatic deployment
```

**Manual Deployment:**
```bash
npm run deploy
```

**Configuration:**
- Repository: `https://github.com/OlekDesign/orokai`
- Live URL: `https://olekdesign.github.io/orokai/`
- Build folder: `dist/`

### 2. Vercel (Recommended for Production)

**Setup:**
1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

**Environment Variables:**
```bash
VITE_API_BASE_URL=https://your-api.com
VITE_ENABLE_ANALYTICS=true
# Add other production variables
```

**Custom Domain:**
1. Add domain in Vercel dashboard
2. Update DNS records
3. SSL automatically configured

### 3. Netlify

**Drag & Drop:**
1. Run `npm run build`
2. Drag `dist` folder to Netlify

**Git Integration:**
1. Connect GitHub repository
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

**Redirects for SPA:**
Create `public/_redirects`:
```
/*    /index.html   200
```

### 4. AWS S3 + CloudFront

**S3 Setup:**
```bash
# Install AWS CLI
aws configure

# Create S3 bucket
aws s3 mb s3://your-bucket-name

# Upload build files
npm run build
aws s3 sync dist/ s3://your-bucket-name --delete

# Configure bucket for static hosting
aws s3 website s3://your-bucket-name --index-document index.html --error-document index.html
```

**CloudFront Setup:**
1. Create CloudFront distribution
2. Set S3 bucket as origin
3. Configure custom error pages for SPA routing
4. Set up custom domain and SSL

## 🐳 Docker Deployment

### Development

```bash
# Build and run development container
docker-compose up app-dev

# Access at http://localhost:5173
```

### Production

```bash
# Build production image
docker build -f Dockerfile.prod -t orokai:latest .

# Run production container
docker run -p 80:80 orokai:latest

# Or use docker-compose
docker-compose up app-prod
```

### Docker Hub

```bash
# Tag for Docker Hub
docker tag orokai:latest yourusername/orokai:latest

# Push to Docker Hub
docker push yourusername/orokai:latest
```

## ☁️ Cloud Platform Deployment

### Google Cloud Platform

**Cloud Run:**
```bash
# Build and deploy
gcloud run deploy orokai \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

**App Engine:**
Create `app.yaml`:
```yaml
runtime: nodejs18
env: standard

handlers:
- url: /static
  static_dir: dist/static
  
- url: /.*
  static_files: dist/index.html
  upload: dist/index.html
```

Deploy:
```bash
gcloud app deploy
```

### Azure

**Static Web Apps:**
```bash
# Install Azure CLI
az login

# Create static web app
az staticwebapp create \
  --name orokai \
  --resource-group myResourceGroup \
  --source https://github.com/OlekDesign/orokai \
  --location "Central US" \
  --branch main \
  --app-location "/" \
  --output-location "dist"
```

### DigitalOcean

**App Platform:**
1. Connect GitHub repository
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Set environment variables
4. Deploy

**Droplet (Manual):**
```bash
# Create droplet with Ubuntu
# SSH into droplet
ssh root@your-droplet-ip

# Install Node.js and nginx
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs nginx

# Clone repository
git clone https://github.com/OlekDesign/orokai.git
cd orokai

# Install dependencies and build
npm install
npm run build

# Configure nginx
cp nginx.conf /etc/nginx/sites-available/orokai
ln -s /etc/nginx/sites-available/orokai /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default

# Copy build files
cp -r dist/* /var/www/html/

# Start nginx
systemctl start nginx
systemctl enable nginx
```

## 🔧 Environment Configuration

### Production Environment Variables

Create `.env.production`:
```bash
# API Configuration
VITE_API_BASE_URL=https://api.orokai.com
VITE_WS_URL=wss://ws.orokai.com

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_REAL_TIME_DATA=true

# Third-party Services
VITE_STRIPE_PUBLIC_KEY=pk_live_your_live_key
VITE_SENTRY_DSN=https://your-production-sentry-dsn

# Analytics
VITE_GA_TRACKING_ID=GA-XXXXXXXXX-X

# Security
VITE_DEBUG_MODE=false
VITE_MOCK_API=false
```

### Staging Environment

Create `.env.staging`:
```bash
# API Configuration
VITE_API_BASE_URL=https://staging-api.orokai.com
VITE_WS_URL=wss://staging-ws.orokai.com

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_REAL_TIME_DATA=true

# Third-party Services
VITE_STRIPE_PUBLIC_KEY=pk_test_your_test_key
VITE_SENTRY_DSN=https://your-staging-sentry-dsn

# Development
VITE_DEBUG_MODE=true
VITE_MOCK_API=false
```

## 🔐 Security Considerations

### HTTPS Configuration

**Nginx SSL:**
```nginx
server {
    listen 443 ssl http2;
    server_name orokai.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=63072000" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
}
```

### Content Security Policy

Add to `index.html`:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; 
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
               font-src 'self' https://fonts.gstatic.com;">
```

## 📊 Monitoring and Analytics

### Error Tracking (Sentry)

```typescript
// src/lib/sentry.ts
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
});
```

### Performance Monitoring

```typescript
// src/lib/analytics.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
  // Send to your analytics service
  console.log(metric);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

## 🔄 CI/CD Pipeline

### GitHub Actions (Included)

The project includes a comprehensive CI/CD pipeline:

- **Code Quality**: Linting, type checking
- **Security**: Vulnerability scanning
- **Build**: Production build creation
- **Deploy**: Automatic deployment to GitHub Pages
- **Docker**: Container image building

### Custom Deployment Script

Create `scripts/deploy.sh`:
```bash
#!/bin/bash

# Build the application
echo "Building application..."
npm run build

# Run tests
echo "Running tests..."
npm run test

# Deploy based on environment
if [ "$1" = "production" ]; then
    echo "Deploying to production..."
    # Add production deployment commands
elif [ "$1" = "staging" ]; then
    echo "Deploying to staging..."
    # Add staging deployment commands
else
    echo "Please specify environment: production or staging"
    exit 1
fi

echo "Deployment completed!"
```

Make executable:
```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh production
```

## 🚨 Rollback Strategy

### Quick Rollback

**GitHub Pages:**
```bash
git revert HEAD
git push origin main
```

**Vercel:**
- Use Vercel dashboard to rollback to previous deployment
- Or redeploy previous commit

**Docker:**
```bash
# Keep previous image tagged
docker tag orokai:latest orokai:previous
docker tag orokai:new orokai:latest

# Rollback
docker tag orokai:previous orokai:latest
docker-compose up -d app-prod
```

### Database Rollback (Future)

When you add a backend:
```bash
# Backup before deployment
pg_dump orokai_prod > backup_$(date +%Y%m%d_%H%M%S).sql

# Rollback if needed
psql orokai_prod < backup_20231201_120000.sql
```

## 📋 Deployment Checklist

### Pre-deployment

- [ ] All tests pass
- [ ] Code reviewed and approved
- [ ] Environment variables configured
- [ ] Database migrations ready (if applicable)
- [ ] Backup created
- [ ] Monitoring alerts configured

### Post-deployment

- [ ] Application loads correctly
- [ ] All features working
- [ ] Performance metrics normal
- [ ] Error rates normal
- [ ] Analytics tracking working
- [ ] SSL certificate valid
- [ ] CDN cache cleared (if applicable)

### Rollback Plan

- [ ] Rollback procedure documented
- [ ] Previous version tagged
- [ ] Database rollback plan (if applicable)
- [ ] Team notified of rollback procedure

---

Choose the deployment method that best fits your team's needs and infrastructure requirements. For most teams, Vercel or Netlify provide the easiest setup with automatic deployments from GitHub.
