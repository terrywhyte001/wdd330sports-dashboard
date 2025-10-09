/**
 * UI Controller - Handles all DOM manipulation and user interface updates
 */
export class UIController {
  /**
   * Show loading state for a section
   * @param {string} sectionType - 'scores' or 'news'
   */
  static showLoading(sectionType) {
    const loadingElement = document.getElementById(`loading-${sectionType}`);
    const containerElement = document.getElementById(`${sectionType}-container`);
    const errorElement = document.getElementById(`${sectionType}-error`);
    
    if (loadingElement) loadingElement.style.display = 'flex';
    if (containerElement) containerElement.style.display = 'none';
    if (errorElement) errorElement.style.display = 'none';
  }

  /**
   * Hide loading state for a section
   * @param {string} sectionType - 'scores' or 'news'
   */
  static hideLoading(sectionType) {
    const loadingElement = document.getElementById(`loading-${sectionType}`);
    const containerElement = document.getElementById(`${sectionType}-container`);
    
    if (loadingElement) loadingElement.style.display = 'none';
    if (containerElement) containerElement.style.display = 'grid';
  }

  /**
   * Display sports scores in the UI
   * @param {Array} scores - Array of score objects
   * @param {boolean} isFallback - Whether this is fallback data
   */
  static displayScores(scores, isFallback = false) {
    const container = document.getElementById('scores-container');
    if (!container) return;

    this.hideLoading('scores');

    if (!scores || scores.length === 0) {
      container.innerHTML = '<p class="no-data">No live scores available at the moment.</p>';
      return;
    }

    const scoresHTML = scores.map((score, index) => `
      <div class="score-card" style="animation-delay: ${index * 0.1}s">
        <div class="sport-type">${this.escapeHtml(score.sport)}${score.league ? ` - ${this.escapeHtml(score.league)}` : ''}</div>
        <div class="teams">
          ${this.escapeHtml(score.team)} vs ${this.escapeHtml(score.opponent)}
        </div>
        <div class="score">${this.escapeHtml(score.score)}</div>
        <div class="game-status">
          <span class="status">${this.escapeHtml(score.status || 'Live')}</span>
          <span class="date">${this.escapeHtml(score.date)}</span>
        </div>
        ${isFallback ? '<div class="fallback-notice">📡 Demo Data</div>' : ''}
      </div>
    `).join('');

    container.innerHTML = scoresHTML;
    
    // Add CSS for fallback notice if needed
    if (isFallback) {
      this.addFallbackStyles();
    }
  }

  /**
   * Display news articles in the UI
   * @param {Array} newsItems - Array of news objects
   * @param {boolean} isFallback - Whether this is fallback data
   */
  static displayNews(newsItems, isFallback = false) {
    const container = document.getElementById('news-container');
    if (!container) return;

    this.hideLoading('news');

    if (!newsItems || newsItems.length === 0) {
      container.innerHTML = '<p class="no-data">No news articles available at the moment.</p>';
      return;
    }

    const newsHTML = newsItems.map((article, index) => `
      <article class="news-card" style="animation-delay: ${index * 0.1}s">
        <h3 class="news-title">${this.escapeHtml(article.title)}</h3>
        <p class="news-content">${this.escapeHtml(article.content)}</p>
        <div class="news-meta">
          <span class="news-source">📰 ${this.escapeHtml(article.source)}</span>
          <span class="news-date">📅 ${this.escapeHtml(article.date)}</span>
        </div>
        ${isFallback ? '<div class="fallback-notice">📡 Demo Data</div>' : ''}
      </article>
    `).join('');

    container.innerHTML = newsHTML;
    
    // Add CSS for fallback notice if needed
    if (isFallback) {
      this.addFallbackStyles();
    }
  }

  /**
   * Show error message for a section
   * @param {string} sectionType - 'scores' or 'news'
   * @param {string} message - Error message to display
   */
  static showError(sectionType, message) {
    const errorElement = document.getElementById(`${sectionType}-error`);
    const containerElement = document.getElementById(`${sectionType}-container`);
    
    this.hideLoading(sectionType);
    
    if (errorElement) {
      errorElement.style.display = 'block';
      errorElement.innerHTML = `
        <div class="error-content">
          <h4>⚠️ Unable to load ${sectionType}</h4>
          <p>${this.escapeHtml(message)}</p>
          <button class="retry-btn" onclick="window.dashboardApp.refresh${sectionType.charAt(0).toUpperCase() + sectionType.slice(1)}()">
            🔄 Try Again
          </button>
        </div>
      `;
    }
    
    if (containerElement) {
      containerElement.style.display = 'none';
    }
  }

  /**
   * Update the refresh button state
   * @param {boolean} isLoading - Whether refresh is in progress
   */
  static updateRefreshButton(isLoading) {
    const refreshBtn = document.getElementById('refreshBtn');
    if (!refreshBtn) return;

    if (isLoading) {
      refreshBtn.disabled = true;
      refreshBtn.innerHTML = '⏳ Refreshing...';
      refreshBtn.style.opacity = '0.6';
    } else {
      refreshBtn.disabled = false;
      refreshBtn.innerHTML = '🔄 Refresh';
      refreshBtn.style.opacity = '1';
    }
  }

  /**
   * Show success notification
   * @param {string} message - Success message
   */
  static showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.innerHTML = `
      <span>✅ ${this.escapeHtml(message)}</span>
      <button onclick="this.parentElement.remove()">×</button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 3000);
    
    // Add CSS if not already present
    this.addNotificationStyles();
  }

  /**
   * Escape HTML to prevent XSS attacks
   * @param {string} text - Text to escape
   * @returns {string} - Escaped text
   */
  static escapeHtml(text) {
    if (typeof text !== 'string') return text;
    
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Add fallback notice styles
   */
  static addFallbackStyles() {
    if (document.getElementById('fallback-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'fallback-styles';
    style.textContent = `
      .fallback-notice {
        background: rgba(255, 193, 7, 0.2);
        color: #856404;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.7rem;
        font-weight: 600;
        text-align: center;
        margin-top: 0.5rem;
        border: 1px solid rgba(255, 193, 7, 0.3);
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Add notification styles
   */
  static addNotificationStyles() {
    if (document.getElementById('notification-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 1rem;
        animation: slideInRight 0.3s ease-out;
      }
      
      .notification button {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Initialize UI event listeners
   */
  static initializeEventListeners() {
    // Refresh button
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        if (window.dashboardApp) {
          window.dashboardApp.refreshAll();
        }
      });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (event) => {
      // Ctrl/Cmd + R for refresh
      if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
        event.preventDefault();
        if (window.dashboardApp) {
          window.dashboardApp.refreshAll();
        }
      }
    });

    // Add error retry button styles
    this.addRetryButtonStyles();
  }

  /**
   * Add retry button styles
   */
  static addRetryButtonStyles() {
    if (document.getElementById('retry-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'retry-styles';
    style.textContent = `
      .retry-btn {
        background: linear-gradient(45deg, #667eea, #764ba2);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        margin-top: 0.5rem;
        transition: all 0.3s ease;
      }
      
      .retry-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      }
      
      .no-data {
        text-align: center;
        color: #666;
        font-style: italic;
        padding: 2rem;
        background: rgba(0, 0, 0, 0.05);
        border-radius: 8px;
        grid-column: 1 / -1;
      }
      
      .error-content {
        text-align: center;
      }
      
      .error-content h4 {
        margin-bottom: 0.5rem;
        color: #d63384;
      }
      
      .error-content p {
        margin-bottom: 1rem;
        color: #666;
      }
    `;
    document.head.appendChild(style);
  }
}