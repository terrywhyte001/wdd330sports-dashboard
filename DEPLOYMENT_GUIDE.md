# 🚀 Deployment Guide - Sports Dashboard

## 📋 **Quick Deployment Checklist**

### ✅ **Pre-Deployment**
- [x] All code tested and working locally
- [x] Environment variables documented
- [x] Database connection configured
- [x] API keys secured
- [x] Documentation complete

---

## 🌐 **Deployment Options**

### **Option 1: Netlify (Recommended for Client-Side Version)**

#### **Steps:**
1. **Prepare Client-Side Files**:
   ```bash
   # Create deployment folder
   mkdir netlify-deploy
   cp index.html netlify-deploy/
   cp -r css/ js/ netlify-deploy/
   ```

2. **Deploy to Netlify**:
   - Visit https://netlify.com
   - Drag and drop your `netlify-deploy` folder
   - Or connect your GitHub repository
   - Set build command: `npm run build` (if using build process)
   - Set publish directory: `dist` or root folder

3. **Configure Environment**:
   - Go to Site Settings → Environment Variables
   - Add your API keys securely

#### **Live URL**: Will be provided after deployment (e.g., `https://sports-dashboard-evbosaru.netlify.app`)

---

### **Option 2: Heroku (For Full Node.js Backend)**

#### **Steps:**
1. **Install Heroku CLI**:
   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   heroku login
   ```

2. **Prepare for Heroku**:
   ```bash
   # Add Procfile
   echo "web: node server.js" > Procfile
   
   # Update package.json engines
   {
     "engines": {
       "node": "18.x",
       "npm": "9.x"
     }
   }
   ```

3. **Deploy**:
   ```bash
   heroku create sports-dashboard-evbosaru
   heroku config:set NEWS_API_KEY=your_news_api_key
   heroku config:set SPORTS_API_KEY=your_sports_api_key
   heroku config:set MONGODB_URI=your_mongodb_connection
   git push heroku main
   ```

#### **Live URL**: `https://sports-dashboard-evbosaru.herokuapp.com`

---

### **Option 3: Vercel (Modern Serverless)**

#### **Steps:**
1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Configure vercel.json**:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "./server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "/"
       }
     ]
   }
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

---

### **Option 4: GitHub Pages (Client-Side Only)**

#### **Steps:**
1. **Prepare gh-pages branch**:
   ```bash
   git checkout -b gh-pages
   # Move client files to root
   mv public/* .
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin gh-pages
   ```

2. **Enable GitHub Pages**:
   - Go to repository Settings
   - Scroll to Pages section
   - Select `gh-pages` branch
   - Save

#### **Live URL**: `https://terrywhyte001.github.io/wdd330sports-dashboard/`

---

## 🔐 **Environment Variables Setup**

### **Required Variables**:
```env
# API Keys
NEWS_API_KEY=your_newsdata_io_api_key
SPORTS_API_KEY=your_apisports_api_key

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sportsdashboard

# Server Configuration
PORT=3000
NODE_ENV=production
```

### **How to Get API Keys**:

#### **NewsData.io**:
1. Visit https://newsdata.io/
2. Sign up for free account
3. Get API key from dashboard
4. Free tier: 200 requests/day

#### **API-Sports**:
1. Visit https://www.api-football.com/
2. Sign up for free account  
3. Get API key from dashboard
4. Free tier: 100 requests/day

#### **MongoDB Atlas** (if using database):
1. Visit https://www.mongodb.com/atlas
2. Create free cluster
3. Get connection string
4. Add to environment variables

---

## 📊 **Performance Optimization**

### **Before Deployment**:
```bash
# Minify CSS and JS
npm install -g clean-css-cli uglify-js
cleancss -o public/css/style.min.css public/css/style.css
uglifyjs public/js/app.js -o public/js/app.min.js

# Optimize images
# Use online tools or imagemin for compression
```

### **CDN Configuration**:
- Enable CDN through your hosting provider
- Configure cache headers for static assets
- Use compression (gzip/brotli)

---

## 🔍 **Testing Deployment**

### **Checklist**:
- [ ] Application loads without errors
- [ ] All API endpoints working
- [ ] Database connections successful
- [ ] Environment variables loaded
- [ ] CSS animations functioning
- [ ] Mobile responsiveness working
- [ ] All links and buttons functional
- [ ] LocalStorage saving/loading data
- [ ] Error handling working properly

### **Test URLs**:
```bash
# Test main endpoints
curl https://your-deployed-url.com/
curl https://your-deployed-url.com/api/scores
curl https://your-deployed-url.com/api/news
```

---

## 📱 **Mobile Testing**

### **Responsive Design Check**:
- iPhone SE (375px width)
- iPhone 12 Pro (390px width)  
- iPad (768px width)
- Desktop (1200px+ width)

### **Performance Testing**:
- Google PageSpeed Insights
- GTmetrix
- WebPageTest
- Lighthouse audit

---

## 🎬 **Video Recording Setup**

### **Recommended Tools**:
- **Loom**: https://loom.com (free, easy to use)
- **OBS Studio**: https://obsproject.com (advanced, free)
- **Camtasia**: https://www.techsmith.com/video-editor.html (paid)

### **Recording Checklist**:
- [ ] Good lighting for face recording
- [ ] Clear audio (use external mic if possible)
- [ ] Screen resolution set to 1080p
- [ ] Browser zoom at 100%
- [ ] Close unnecessary applications
- [ ] Test recording setup before final video

### **Video Script Outline**:
1. **Introduction** (30s): Face on camera, introduce yourself and project
2. **Live Demo** (3m): Show all features working
3. **Code Walkthrough** (1.5m): Highlight key technical implementations
4. **Conclusion** (30s): Summarize achievements

---

## 📋 **Final Submission Links**

### **Update These in Your Skills Document**:

```markdown
**Student Name**: Evbosaru Iyen Samuel

**Live Application URL**: https://your-deployed-app.com

**Source Code Repository**: https://github.com/terrywhyte001/wdd330sports-dashboard

**Trello Board URL**: https://trello.com/b/your-board-id

**Video Demonstration**: https://youtube.com/watch?v=your-video-id
```

---

## ✅ **Deployment Success Indicators**

- ✅ Application accessible via public URL
- ✅ All features functioning properly
- ✅ No console errors in production
- ✅ Mobile responsive on all devices
- ✅ Fast loading times (< 3 seconds)
- ✅ SEO optimized (meta tags, descriptions)
- ✅ Accessibility compliant
- ✅ Cross-browser compatible

**Your Sports Dashboard is now ready for submission! 🚀**

---

**Deployed by**: Evbosaru Iyen Samuel  
**Course**: WDD 330 - Web Frontend Development  
**Date**: October 2025