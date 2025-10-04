# Deployment Guide - ExpenseFlow

## 🚀 Development

### Prerequisites
- **Node.js**: v14.0.0 or higher
- **npm**: v6.0.0 or higher (comes with Node.js)
- **Git**: For version control

### Local Development Setup

```bash
# 1. Navigate to project directory
cd expense-management-system

# 2. Install dependencies
npm install

# 3. Start development server
npm start
```

The app will open at `http://localhost:3000`

### Available Scripts

```bash
# Start development server
npm start

# Create production build
npm run build

# Run tests
npm test

# Eject from Create React App (not recommended)
npm run eject
```

## 📦 Production Build

### Build for Production

```bash
# Create optimized production build
npm run build
```

This creates a `build` folder with:
- Minified JavaScript
- Optimized CSS
- Compressed assets
- Production-ready code

### Build Output
```
build/
├── static/
│   ├── css/
│   ├── js/
│   └── media/
├── index.html
└── manifest.json
```

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

**Easiest deployment for React apps**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd expense-management-system
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - Project name: expense-management-system
# - Directory: ./
# - Override settings? N

# Production deployment
vercel --prod
```

**Or use Vercel Dashboard:**
1. Go to https://vercel.com
2. Sign in with GitHub/GitLab/Bitbucket
3. Click "Import Project"
4. Select your repository
5. Deploy!

**Vercel Settings:**
- Framework Preset: Create React App
- Build Command: `npm run build`
- Output Directory: `build`
- Install Command: `npm install`

### Option 2: Netlify

**Great for static sites with easy setup**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy
netlify deploy

# Production deployment
netlify deploy --prod
```

**Or use Netlify Dashboard:**
1. Go to https://netlify.com
2. Sign in
3. Click "Add new site"
4. Connect to Git provider
5. Configure:
   - Build command: `npm run build`
   - Publish directory: `build`
6. Deploy!

**Netlify Configuration** (netlify.toml):
```toml
[build]
  command = "npm run build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option 3: GitHub Pages

**Free hosting with GitHub**

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to package.json:
```json
{
  "homepage": "https://yourusername.github.io/expense-management-system",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

3. Deploy:
```bash
npm run deploy
```

### Option 4: AWS Amplify

**Scalable AWS-powered hosting**

1. Install Amplify CLI:
```bash
npm install -g @aws-amplify/cli
```

2. Initialize:
```bash
amplify init
```

3. Add hosting:
```bash
amplify add hosting
```

4. Publish:
```bash
amplify publish
```

### Option 5: Firebase Hosting

**Google's fast hosting service**

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login:
```bash
firebase login
```

3. Initialize:
```bash
firebase init hosting
```

4. Build and deploy:
```bash
npm run build
firebase deploy
```

### Option 6: Traditional Web Server

**For Apache, Nginx, etc.**

1. Build the project:
```bash
npm run build
```

2. Copy `build` folder to web server
3. Configure server for single-page app
4. Set up HTTPS (recommended)

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/expense-management-system/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Apache Configuration (.htaccess):**
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

## 🔧 Environment Variables

### Create .env.local file:
```bash
cp .env.example .env.local
```

### Edit variables:
```env
REACT_APP_NAME=ExpenseFlow
REACT_APP_VERSION=1.0.0
```

### For Production:
Set environment variables in your hosting platform:

**Vercel:**
- Dashboard → Project → Settings → Environment Variables

**Netlify:**
- Dashboard → Site Settings → Build & Deploy → Environment

**AWS Amplify:**
- Console → App Settings → Environment Variables

## 🌍 Domain Configuration

### Custom Domain

**Vercel:**
1. Dashboard → Project → Settings → Domains
2. Add your domain
3. Update DNS records

**Netlify:**
1. Site Settings → Domain Management
2. Add custom domain
3. Update DNS records

### DNS Records
```
Type: CNAME
Name: www
Value: your-app.vercel.app (or netlify.app)
```

## 📊 Monitoring & Analytics

### Add Analytics

**Google Analytics:**
1. Add to `public/index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Performance Monitoring
- Vercel Analytics (built-in)
- Netlify Analytics (paid)
- Google Lighthouse (free)

## 🔒 Security Best Practices

### HTTPS
- Always use HTTPS in production
- Most hosting platforms provide free SSL
- Redirect HTTP to HTTPS

### Environment Variables
- Never commit `.env` files
- Use platform-specific env vars
- Rotate API keys regularly

### Content Security Policy
Add to `public/index.html`:
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline';">
```

## 🐛 Troubleshooting

### Build Errors

**Issue:** Module not found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue:** Memory errors
```bash
# Increase Node memory
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

### Deployment Issues

**Issue:** Blank page after deployment
- Check browser console for errors
- Verify `homepage` in package.json
- Check routing configuration

**Issue:** 404 on page refresh
- Configure server for SPA
- Add redirect rules
- Check base URL

### Performance Issues

**Issue:** Slow loading
- Enable gzip/brotli compression
- Use CDN for static assets
- Optimize images
- Code splitting

## 📈 Optimization Tips

### Build Optimization
```bash
# Analyze bundle size
npm install --save-dev webpack-bundle-analyzer
```

### Image Optimization
- Use WebP format
- Compress images
- Lazy load images
- Use appropriate sizes

### Code Splitting
- Already configured with Create React App
- Lazy load routes
- Dynamic imports

### Caching
- Configure cache headers
- Use service workers
- Enable browser caching

## 🔄 Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
    
    - name: Install dependencies
      run: npm install
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Vercel
      run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

### GitLab CI/CD

Create `.gitlab-ci.yml`:
```yaml
stages:
  - build
  - deploy

build:
  stage: build
  script:
    - npm install
    - npm run build
  artifacts:
    paths:
      - build/

deploy:
  stage: deploy
  script:
    - npm install -g netlify-cli
    - netlify deploy --prod --dir=build
  only:
    - main
```

## 🎉 Post-Deployment

### Checklist
- ✅ Test all features
- ✅ Check mobile responsiveness
- ✅ Verify HTTPS
- ✅ Test in multiple browsers
- ✅ Check performance (Lighthouse)
- ✅ Set up monitoring
- ✅ Configure backups
- ✅ Update documentation

### Monitoring
- Set up uptime monitoring
- Configure error tracking
- Monitor performance metrics
- Track user analytics

## 📞 Support

For deployment issues:
- Check hosting platform documentation
- Review build logs
- Test locally first
- Verify environment variables

---

**Congratulations! Your ExpenseFlow app is now live! 🚀**

For additional help, refer to:
- README.md (full documentation)
- QUICK_START.md (getting started)
- FEATURES.md (feature list)

