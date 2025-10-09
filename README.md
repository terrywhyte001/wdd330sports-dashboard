# Sports Dashboard - WDD 330 Final Project

**Two Complete Implementations** of a sports dashboard that displays live sports scores and news from multiple API sources.

## 🎯 **Dual Implementation Approach**

This project includes **TWO fully functional versions** to demonstrate different architectural approaches:

1. **Client-Side Version**: Pure HTML, CSS, and vanilla JavaScript (meets strict requirements)
2. **Backend Version**: Node.js/Express with MongoDB (real-world implementation)

## 🎯 Project Requirements Met

✅ **Technology Stack**: HTML, CSS, and vanilla JavaScript only  
✅ **Two External APIs**: NewsAPI.org + TheSportsDB API  
✅ **No OpenWeatherMap**: Using sports-specific APIs  
✅ **Static + Dynamic Content**: HTML structure with JavaScript-generated content  
✅ **CSS Animations**: Multiple entrance animations and transitions  
✅ **Clean Code**: ES6 modules, classes, proper organization  
✅ **Responsive Design**: Mobile-first CSS with media queries  
✅ **Accessibility**: Semantic HTML, ARIA labels, proper contrast  

## 🏆 Features

- **Live Sports Scores**: Real-time scores from multiple sports
- **Sports News Feed**: Latest headlines and articles
- **Responsive Design**: Works on desktop, tablet, and mobile
- **CSS Animations**: Smooth transitions and loading effects
- **Error Handling**: Graceful fallbacks when APIs are unavailable
- **Caching**: Local storage for offline functionality
- **Auto-refresh**: Updates data every 2 minutes

## 📁 Project Structure

```
wdd330sports-dashboard/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # All styles with animations
├── js/
│   ├── main.js         # Main application controller
│   ├── api.js          # API handlers for news and sports
│   ├── ui.js           # UI controller for DOM manipulation
│   └── utils.js        # Utility functions
└── README.md           # This file
```

## 🔌 API Sources

### 1. NewsAPI.org
- **Purpose**: Sports news headlines and articles
- **Endpoint**: `https://newsapi.org/v2/everything`
- **Features**: Real-time news, multiple sources, filtering

### 2. TheSportsDB API
- **Purpose**: Live sports scores and team information
- **Endpoint**: `https://www.thesportsdb.com/api/v1/json/`
- **Features**: Multiple sports, live scores, team data

## 🚀 How to Run Both Versions

### **Version 1: Client-Side Only (Requirements Compliant)**
1. **Open `index.html`** directly in a modern web browser
2. **Or serve via HTTP server**:
   ```bash
   npm run serve
   # OR
   python -m http.server 8000
   ```
3. **Access**: http://localhost:8000

### **Version 2: Node.js/Express Backend (Full-Stack)**
1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Set up environment variables** in `.env`:
   ```
   NEWS_API_KEY=your_newsdata_api_key
   SPORTS_API_KEY=your_apisports_key
   MONGODB_URI=your_mongodb_connection_string
   ```
3. **Start the server**:
   ```bash
   npm start
   ```
4. **Access**: http://localhost:3000

## 🎨 CSS Animations Included

- **Slide-down header** animation
- **Fade-in-up** content sections
- **Staggered card animations** for scores and news
- **Loading spinner** with rotation
- **Hover effects** on interactive elements
- **Notification slide-in** animations

## 📱 Responsive Breakpoints

- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: Below 768px
- **Small Mobile**: Below 480px

## 🔧 Technical Implementation

### ES6 Modules Used:
- `main.js` - Application controller and initialization
- `api.js` - API communication and data fetching
- `ui.js` - DOM manipulation and UI updates
- `utils.js` - Helper functions and utilities

### Classes Implemented:
- `SportsDashboard` - Main application class
- `NewsAPI` - News data fetching
- `SportsAPI` - Sports scores fetching
- `UIController` - UI management
- `DateUtils`, `StringUtils`, etc. - Utility classes

### Error Handling:
- Network timeout handling
- API failure fallbacks
- User-friendly error messages
- Loading states and recovery options

## 🌐 Browser Support

- **Chrome** 60+
- **Firefox** 55+
- **Safari** 12+
- **Edge** 79+

## 📋 Accessibility Features

- Semantic HTML5 elements
- ARIA labels and roles
- Keyboard navigation support
- High contrast colors
- Screen reader friendly content
- Alternative text for visual elements

## 🎯 Learning Objectives Achieved

1. **API Integration**: Successfully fetch and display data from two different APIs
2. **DOM Manipulation**: Dynamic content generation and updates
3. **Responsive Design**: Mobile-first CSS with flexible layouts
4. **JavaScript ES6+**: Modern syntax, modules, classes, async/await
5. **Error Handling**: Robust error management and user feedback
6. **Performance**: Efficient data caching and network optimization

## 🏁 Project Status

**✅ Complete** - All requirements met and fully functional

---

**Author**: Evbosaru Iyen Samuel  
**Course**: WDD 330 - Web Frontend Development  
**Date**: October 2025

This is the starter version of the Sports Dashboard project for Week 5.  
It uses **Node.js + Express** with placeholder routes for two APIs:  
- `/api/scores`  
- `/api/news`

### Setup
```bash
npm install
npm sta