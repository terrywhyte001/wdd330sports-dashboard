/**
 * Sports Dashboard Main Application
 * A client-side web application using vanilla JavaScript, HTML, and CSS
 * 
 * Author: Evbosaru Iyen Samuel
 * Course: WDD 330 - Web Frontend Development
 * Date: October 2025
 * 
 * Features:
 * - Live sports scores from multiple sources
 * - Latest sports news headlines
 * - Responsive design with CSS animations
 * - Error handling and fallback data
 * - ES6 modules and modern JavaScript
 */

import { NewsAPI, SportsAPI, ErrorHandler } from './api.js';
import { UIController } from './ui.js';
import { DateUtils, StringUtils, StorageUtils, NetworkUtils, PerformanceUtils } from './utils.js';

/**
 * Main Dashboard Application Class
 */
class SportsDashboard {
  constructor() {
    this.isLoading = false;
    this.refreshInterval = null;
    this.networkCleanup = null;
    
    // Cache keys for localStorage
    this.CACHE_KEYS = {
      SCORES: 'sports_dashboard_scores',
      NEWS: 'sports_dashboard_news',
      LAST_UPDATE: 'sports_dashboard_last_update'
    };
    
    // Cache expiry time (5 minutes)
    this.CACHE_EXPIRY = 5 * 60 * 1000;
    
    this.init();
  }

  /**
   * Initialize the application
   */
  async init() {
    console.log('🏆 Sports Dashboard initializing...');
    
    try {
      // Setup UI event listeners
      UIController.initializeEventListeners();
      
      // Setup network monitoring
      this.setupNetworkMonitoring();
      
      // Load initial data
      await this.loadInitialData();
      
      // Setup auto-refresh (every 2 minutes)
      this.setupAutoRefresh();
      
      // Make dashboard globally accessible for UI callbacks
      window.dashboardApp = this;
      
      console.log('✅ Sports Dashboard initialized successfully');
      
    } catch (error) {
      console.error('❌ Failed to initialize Sports Dashboard:', error);
      this.handleInitializationError(error);
    }
  }

  /**
   * Load initial data from APIs or cache
   */
  async loadInitialData() {
    // Check if we have cached data that's still valid
    const cachedData = this.getCachedData();
    
    if (cachedData.isValid) {
      console.log('📦 Loading from cache...');
      UIController.displayScores(cachedData.scores, cachedData.scoresFallback);
      UIController.displayNews(cachedData.news, cachedData.newsFallback);
      UIController.showNotification('Loaded cached data');
    }
    
    // Always try to fetch fresh data
    await this.refreshAll();
  }

  /**
   * Refresh all data sources
   */
  async refreshAll() {
    if (this.isLoading) {
      console.log('⏳ Refresh already in progress...');
      return;
    }

    this.isLoading = true;
    UIController.updateRefreshButton(true);

    console.log('🔄 Refreshing all data...');

    try {
      // Show loading states
      UIController.showLoading('scores');
      UIController.showLoading('news');

      // Fetch data in parallel for better performance
      const [scoresResult, newsResult] = await Promise.allSettled([
        PerformanceUtils.measureTime(() => this.refreshScores(), 'Scores API'),
        PerformanceUtils.measureTime(() => this.refreshNews(), 'News API')
      ]);

      // Handle results
      this.handleRefreshResult(scoresResult, 'scores');
      this.handleRefreshResult(newsResult, 'news');

      // Update cache timestamp
      this.updateCacheTimestamp();

      // Show success notification
      UIController.showNotification('Data refreshed successfully');

    } catch (error) {
      console.error('❌ Error during refresh:', error);
      ErrorHandler.showError('general', ErrorHandler.getUserFriendlyMessage(error));
    } finally {
      this.isLoading = false;
      UIController.updateRefreshButton(false);
    }
  }

  /**
   * Refresh sports scores
   */
  async refreshScores() {
    try {
      const result = await SportsAPI.fetchLiveScores();
      
      if (result.success && result.data) {
        // Process and clean the data
        const processedScores = result.data.map(score => ({
          ...score,
          team: StringUtils.cleanTeamName(score.team),
          opponent: StringUtils.cleanTeamName(score.opponent),
          score: StringUtils.sanitizeScore(score.score),
          date: DateUtils.formatDate(score.date)
        }));

        // Display and cache the data
        UIController.displayScores(processedScores, result.fallback);
        this.cacheData(this.CACHE_KEYS.SCORES, {
          data: processedScores,
          fallback: result.fallback
        });

        return { success: true, data: processedScores };
      } else {
        throw new Error(result.error || 'Failed to fetch scores');
      }
    } catch (error) {
      console.error('❌ Error refreshing scores:', error);
      UIController.showError('scores', ErrorHandler.getUserFriendlyMessage(error));
      return { success: false, error: error.message };
    }
  }

  /**
   * Refresh sports news
   */
  async refreshNews() {
    try {
      let result = await NewsAPI.fetchSportsNews();
      
      // Try alternative source if primary fails
      if (!result.success) {
        console.log('🔄 Trying alternative news source...');
        result = await NewsAPI.fetchAlternativeNews();
      }
      
      if (result.success && result.data) {
        // Process and clean the data
        const processedNews = result.data.map(article => ({
          ...article,
          title: StringUtils.truncate(article.title, 120),
          content: StringUtils.truncate(article.content, 200),
          date: DateUtils.getRelativeTime(article.date)
        }));

        // Display and cache the data
        UIController.displayNews(processedNews, result.fallback);
        this.cacheData(this.CACHE_KEYS.NEWS, {
          data: processedNews,
          fallback: result.fallback
        });

        return { success: true, data: processedNews };
      } else {
        throw new Error(result.error || 'Failed to fetch news');
      }
    } catch (error) {
      console.error('❌ Error refreshing news:', error);
      UIController.showError('news', ErrorHandler.getUserFriendlyMessage(error));
      return { success: false, error: error.message };
    }
  }

  /**
   * Handle refresh result from Promise.allSettled
   */
  handleRefreshResult(result, type) {
    if (result.status === 'fulfilled') {
      console.log(`✅ ${type} refreshed successfully`);
    } else {
      console.error(`❌ Failed to refresh ${type}:`, result.reason);
    }
  }

  /**
   * Setup automatic refresh interval
   */
  setupAutoRefresh() {
    // Clear existing interval
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }

    // Set up new interval (2 minutes)
    this.refreshInterval = setInterval(() => {
      if (!this.isLoading && NetworkUtils.isOnline()) {
        console.log('⏰ Auto-refreshing data...');
        this.refreshAll();
      }
    }, 2 * 60 * 1000);

    console.log('⏰ Auto-refresh enabled (every 2 minutes)');
  }

  /**
   * Setup network status monitoring
   */
  setupNetworkMonitoring() {
    this.networkCleanup = NetworkUtils.monitorNetworkStatus(
      () => {
        console.log('🌐 Network connection restored');
        UIController.showNotification('Connection restored - refreshing data');
        this.refreshAll();
      },
      () => {
        console.log('📴 Network connection lost');
        UIController.showNotification('Connection lost - using cached data');
      }
    );
  }

  /**
   * Cache data in localStorage
   */
  cacheData(key, data) {
    if (StorageUtils.isAvailable()) {
      StorageUtils.save(key, {
        ...data,
        timestamp: Date.now()
      });
    }
  }

  /**
   * Get cached data if still valid
   */
  getCachedData() {
    if (!StorageUtils.isAvailable()) {
      return { isValid: false };
    }

    const lastUpdate = StorageUtils.load(this.CACHE_KEYS.LAST_UPDATE, 0);
    const isValid = (Date.now() - lastUpdate) < this.CACHE_EXPIRY;

    if (!isValid) {
      return { isValid: false };
    }

    const scoresCache = StorageUtils.load(this.CACHE_KEYS.SCORES, {});
    const newsCache = StorageUtils.load(this.CACHE_KEYS.NEWS, {});

    return {
      isValid: true,
      scores: scoresCache.data || [],
      news: newsCache.data || [],
      scoresFallback: scoresCache.fallback || false,
      newsFallback: newsCache.fallback || false
    };
  }

  /**
   * Update cache timestamp
   */
  updateCacheTimestamp() {
    if (StorageUtils.isAvailable()) {
      StorageUtils.save(this.CACHE_KEYS.LAST_UPDATE, Date.now());
    }
  }

  /**
   * Handle initialization errors
   */
  handleInitializationError(error) {
    console.error('💥 Critical initialization error:', error);
    
    // Show user-friendly error message
    document.body.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        text-align: center;
        padding: 2rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        font-family: 'Segoe UI', sans-serif;
      ">
        <h1>⚠️ Sports Dashboard Error</h1>
        <p>Sorry, there was a problem loading the dashboard.</p>
        <p style="opacity: 0.8; font-size: 0.9rem;">${ErrorHandler.getUserFriendlyMessage(error)}</p>
        <button onclick="location.reload()" style="
          margin-top: 1rem;
          padding: 0.75rem 1.5rem;
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
        ">
          🔄 Reload Page
        </button>
      </div>
    `;
  }

  /**
   * Cleanup resources when app is destroyed
   */
  destroy() {
    console.log('🧹 Cleaning up Sports Dashboard...');
    
    // Clear intervals
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    
    // Cleanup network monitoring
    if (this.networkCleanup) {
      this.networkCleanup();
    }
    
    // Remove global reference
    if (window.dashboardApp === this) {
      delete window.dashboardApp;
    }
  }

  // Public methods for UI callbacks
  refreshScoresOnly() {
    if (!this.isLoading) {
      this.refreshScores();
    }
  }

  refreshNewsOnly() {
    if (!this.isLoading) {
      this.refreshNews();
    }
  }
}

/**
 * Initialize the application when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('📱 DOM loaded, starting Sports Dashboard...');
  
  // Create and start the dashboard
  const dashboard = new SportsDashboard();
  
  // Handle page unload
  window.addEventListener('beforeunload', () => {
    dashboard.destroy();
  });
  
  // Handle visibility change (page becomes visible/hidden)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && NetworkUtils.isOnline()) {
      console.log('👁️ Page became visible, refreshing data...');
      dashboard.refreshAll();
    }
  });
});

/**
 * Handle uncaught errors
 */
window.addEventListener('error', (event) => {
  console.error('🚨 Uncaught error:', event.error);
  ErrorHandler.logError(event.error, 'Global Error Handler');
});

/**
 * Handle unhandled promise rejections
 */
window.addEventListener('unhandledrejection', (event) => {
  console.error('🚨 Unhandled promise rejection:', event.reason);
  ErrorHandler.logError(event.reason, 'Promise Rejection Handler');
  event.preventDefault(); // Prevent default browser error handling
});