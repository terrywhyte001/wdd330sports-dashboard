// Advanced JavaScript with complex data manipulation and filtering
class ScoreManager {
  constructor() {
    this.scores = [];
    this.favorites = JSON.parse(localStorage.getItem('favoriteTeams')) || [];
    this.filters = { sport: 'all', status: 'all' };
    this.refreshInterval = null;
  }

  async loadScores() {
    const scoresDiv = document.getElementById("scoresData");
    const loadingDiv = document.getElementById("scoresLoading");
    
    try {
      this.showLoading(true);
      const res = await fetch("/api/scores");
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      
      const data = await res.json();
      this.scores = this.processScoresData(data);
      
      this.renderScores();
      this.updateLastRefresh();
      this.saveToLocalStorage();
      
    } catch (err) {
      this.handleError(err);
      console.error('Score loading error:', err);
    } finally {
      this.showLoading(false);
    }
  }

  processScoresData(rawData) {
    return rawData.map((game, index) => ({
      id: `game_${index}_${Date.now()}`,
      team: game.team || 'Unknown Team',
      opponent: game.opponent || 'Unknown Opponent',
      score: game.score || '0-0',
      sport: game.sport || 'Unknown',
      status: game.status || 'Unknown',
      date: new Date(game.date || Date.now()),
      isFavorite: this.isFavoriteGame(game.team, game.opponent),
      priority: this.calculatePriority(game)
    })).sort((a, b) => b.priority - a.priority);
  }

  isFavoriteGame(team1, team2) {
    return this.favorites.includes(team1) || this.favorites.includes(team2);
  }

  calculatePriority(game) {
    let priority = 0;
    if (this.isFavoriteGame(game.team, game.opponent)) priority += 10;
    if (game.status === 'Live') priority += 5;
    if (game.sport === 'Soccer') priority += 2;
    return priority;
  }

  renderScores() {
    const scoresDiv = document.getElementById("scoresData");
    const filteredScores = this.applyFilters();
    
    if (filteredScores.length === 0) {
      scoresDiv.innerHTML = '<p class="no-data">No scores match your current filters.</p>';
      return;
    }

    scoresDiv.innerHTML = filteredScores
      .map(game => this.createScoreCard(game))
      .join("");
    
    this.attachEventListeners();
  }

  createScoreCard(game) {
    const favoriteIcon = game.isFavorite ? '⭐' : '☆';
    const statusClass = game.status.toLowerCase().replace(' ', '-');
    
    return `
      <div class="score-card ${statusClass} ${game.isFavorite ? 'favorite' : ''}" 
           data-game-id="${game.id}" data-sport="${game.sport}">
        <div class="score-header">
          <span class="sport-badge">${game.sport}</span>
          <button class="favorite-btn" data-team1="${game.team}" data-team2="${game.opponent}">
            ${favoriteIcon}
          </button>
        </div>
        <div class="teams-container">
          <div class="team home-team">${game.team}</div>
          <div class="vs-divider">VS</div>
          <div class="team away-team">${game.opponent}</div>
        </div>
        <div class="score-display">${game.score}</div>
        <div class="game-meta">
          <span class="status ${statusClass}">${game.status}</span>
          <span class="date">${game.date.toLocaleDateString()}</span>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    // Event 1: Favorite toggle
    document.querySelectorAll('.favorite-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.toggleFavorite(e));
    });

    // Event 2: Score card click for details
    document.querySelectorAll('.score-card').forEach(card => {
      card.addEventListener('click', (e) => this.showGameDetails(e));
    });

    // Event 3: Double click for quick actions
    document.querySelectorAll('.score-card').forEach(card => {
      card.addEventListener('dblclick', (e) => this.quickAction(e));
    });
  }

  toggleFavorite(event) {
    event.stopPropagation();
    const btn = event.target;
    const team1 = btn.dataset.team1;
    const team2 = btn.dataset.team2;
    
    const teams = [team1, team2];
    teams.forEach(team => {
      const index = this.favorites.indexOf(team);
      if (index > -1) {
        this.favorites.splice(index, 1);
      } else {
        this.favorites.push(team);
      }
    });
    
    localStorage.setItem('favoriteTeams', JSON.stringify(this.favorites));
    this.loadScores(); // Refresh to update priorities
    this.showNotification(`Favorite teams updated!`);
  }

  showGameDetails(event) {
    const gameId = event.currentTarget.dataset.gameId;
    const game = this.scores.find(g => g.id === gameId);
    if (game) {
      this.displayModal({
        title: `${game.team} vs ${game.opponent}`,
        content: `
          <p><strong>Sport:</strong> ${game.sport}</p>
          <p><strong>Status:</strong> ${game.status}</p>
          <p><strong>Score:</strong> ${game.score}</p>
          <p><strong>Date:</strong> ${game.date.toLocaleString()}</p>
          <p><strong>Favorite:</strong> ${game.isFavorite ? 'Yes' : 'No'}</p>
        `
      });
    }
  }

  quickAction(event) {
    const sport = event.currentTarget.dataset.sport;
    this.filters.sport = sport;
    this.renderScores();
    this.showNotification(`Filtered by ${sport}`);
  }

  applyFilters() {
    return this.scores.filter(game => {
      const sportMatch = this.filters.sport === 'all' || game.sport === this.filters.sport;
      const statusMatch = this.filters.status === 'all' || game.status === this.filters.status;
      return sportMatch && statusMatch;
    });
  }

  saveToLocalStorage() {
    const dataToSave = {
      scores: this.scores,
      lastUpdate: new Date().toISOString(),
      favorites: this.favorites,
      filters: this.filters,
      userPreferences: {
        autoRefresh: true,
        refreshInterval: 30000
      }
    };
    localStorage.setItem('sportsData', JSON.stringify(dataToSave));
  }

  loadFromLocalStorage() {
    const saved = localStorage.getItem('sportsData');
    if (saved) {
      const data = JSON.parse(saved);
      this.scores = data.scores || [];
      this.favorites = data.favorites || [];
      this.filters = data.filters || { sport: 'all', status: 'all' };
      return data;
    }
    return null;
  }

  showLoading(show) {
    const loadingDiv = document.getElementById("scoresLoading");
    const scoresDiv = document.getElementById("scoresData");
    
    if (show) {
      if (loadingDiv) loadingDiv.style.display = 'block';
      if (scoresDiv) scoresDiv.style.opacity = '0.5';
    } else {
      if (loadingDiv) loadingDiv.style.display = 'none';
      if (scoresDiv) scoresDiv.style.opacity = '1';
    }
  }

  handleError(error) {
    const scoresDiv = document.getElementById("scoresData");
    scoresDiv.innerHTML = `
      <div class="error-container">
        <h3>⚠️ Unable to load scores</h3>
        <p>${error.message}</p>
        <button onclick="scoreManager.loadScores()" class="retry-btn">
          🔄 Try Again
        </button>
      </div>
    `;
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
  }

  displayModal(options) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>${options.title}</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">${options.content}</div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.modal-close').addEventListener('click', () => {
      modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  }

  updateLastRefresh() {
    const timeEl = document.getElementById('lastRefresh');
    if (timeEl) {
      timeEl.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
    }
  }

  startAutoRefresh() {
    this.refreshInterval = setInterval(() => {
      this.loadScores();
    }, 30000); // Refresh every 30 seconds
  }

  stopAutoRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }
}

// Initialize the score manager
const scoreManager = new ScoreManager();

// Advanced News Management with complex filtering and categorization
class NewsManager {
  constructor() {
    this.articles = [];
    this.categories = ['All', 'Soccer', 'Basketball', 'Football', 'Baseball', 'Tennis'];
    this.currentCategory = 'All';
    this.readArticles = JSON.parse(localStorage.getItem('readArticles')) || [];
    this.bookmarks = JSON.parse(localStorage.getItem('bookmarkedArticles')) || [];
    this.searchTerm = '';
  }

  async loadNews() {
    const newsDiv = document.getElementById("newsData");
    
    try {
      this.showNewsLoading(true);
      const res = await fetch("/api/news");
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      
      const data = await res.json();
      this.articles = this.processNewsData(data);
      
      this.renderNews();
      this.updateNewsTimestamp();
      this.saveNewsToStorage();
      
    } catch (err) {
      this.handleNewsError(err);
      console.error('News loading error:', err);
    } finally {
      this.showNewsLoading(false);
    }
  }

  processNewsData(rawData) {
    return rawData.map((article, index) => ({
      id: `article_${index}_${Date.now()}`,
      title: article.title || 'No Title',
      content: article.content || article.description || 'No description available',
      source: article.source || 'Unknown Source',
      date: new Date(article.date || Date.now()),
      category: this.categorizeArticle(article.title + ' ' + article.content),
      url: article.url || '#',
      isRead: this.readArticles.includes(`article_${index}`),
      isBookmarked: this.bookmarks.includes(`article_${index}`),
      readingTime: this.calculateReadingTime(article.content),
      sentiment: this.analyzeSentiment(article.title + ' ' + article.content)
    })).sort((a, b) => b.date - a.date);
  }

  categorizeArticle(text) {
    const keywords = {
      'Soccer': ['soccer', 'football', 'fifa', 'premier league', 'champions league', 'goal'],
      'Basketball': ['basketball', 'nba', 'slam dunk', 'playoff', 'lebron', 'curry'],
      'Football': ['nfl', 'touchdown', 'quarterback', 'super bowl', 'patriots'],
      'Baseball': ['baseball', 'mlb', 'home run', 'world series', 'yankees'],
      'Tennis': ['tennis', 'wimbledon', 'grand slam', 'djokovic', 'federer']
    };

    const lowerText = text.toLowerCase();
    for (const [category, terms] of Object.entries(keywords)) {
      if (terms.some(term => lowerText.includes(term))) {
        return category;
      }
    }
    return 'General';
  }

  calculateReadingTime(content) {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    return Math.ceil(words / wordsPerMinute);
  }

  analyzeSentiment(text) {
    const positiveWords = ['win', 'victory', 'champion', 'success', 'amazing', 'excellent'];
    const negativeWords = ['lose', 'defeat', 'injury', 'scandal', 'controversy', 'banned'];
    
    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  renderNews() {
    const newsDiv = document.getElementById("newsData");
    const filteredArticles = this.filterArticles();
    
    if (filteredArticles.length === 0) {
      newsDiv.innerHTML = '<p class="no-news">No articles match your current filters.</p>';
      return;
    }

    newsDiv.innerHTML = `
      <div class="news-controls">
        ${this.renderCategoryFilter()}
        ${this.renderSearchBox()}
      </div>
      <div class="articles-container">
        ${filteredArticles.map(article => this.createNewsCard(article)).join('')}
      </div>
    `;
    
    this.attachNewsEventListeners();
  }

  renderCategoryFilter() {
    return `
      <div class="category-filter">
        <label for="categorySelect">Category:</label>
        <select id="categorySelect">
          ${this.categories.map(cat => 
            `<option value="${cat}" ${cat === this.currentCategory ? 'selected' : ''}>${cat}</option>`
          ).join('')}
        </select>
      </div>
    `;
  }

  renderSearchBox() {
    return `
      <div class="search-box">
        <input type="text" id="newsSearch" placeholder="Search articles..." value="${this.searchTerm}">
        <button id="clearSearch">Clear</button>
      </div>
    `;
  }

  createNewsCard(article) {
    const sentimentIcon = {
      'positive': '😊',
      'negative': '😔',
      'neutral': '😐'
    }[article.sentiment];

    return `
      <article class="news-card ${article.isRead ? 'read' : 'unread'} ${article.sentiment}" 
               data-article-id="${article.id}" data-category="${article.category}">
        <div class="news-header">
          <div class="news-meta">
            <span class="category-tag">${article.category}</span>
            <span class="sentiment-indicator" title="Sentiment: ${article.sentiment}">
              ${sentimentIcon}
            </span>
            <span class="reading-time">${article.readingTime} min read</span>
          </div>
          <div class="news-actions">
            <button class="bookmark-btn ${article.isBookmarked ? 'bookmarked' : ''}" 
                    data-article-id="${article.id}">
              ${article.isBookmarked ? '🔖' : '📌'}
            </button>
            <button class="share-btn" data-article-id="${article.id}">📤</button>
          </div>
        </div>
        
        <h3 class="news-title">${article.title}</h3>
        <p class="news-content">${this.truncateText(article.content, 150)}</p>
        
        <div class="news-footer">
          <div class="source-date">
            <span class="source">📰 ${article.source}</span>
            <span class="date">📅 ${article.date.toLocaleDateString()}</span>
          </div>
          <button class="read-more-btn" data-article-id="${article.id}">
            Read More
          </button>
        </div>
      </article>
    `;
  }

  truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  }

  filterArticles() {
    return this.articles.filter(article => {
      const categoryMatch = this.currentCategory === 'All' || article.category === this.currentCategory;
      const searchMatch = this.searchTerm === '' || 
        article.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      return categoryMatch && searchMatch;
    });
  }

  attachNewsEventListeners() {
    // Event 4: Category filter change
    const categorySelect = document.getElementById('categorySelect');
    if (categorySelect) {
      categorySelect.addEventListener('change', (e) => {
        this.currentCategory = e.target.value;
        this.renderNews();
        this.showNotification(`Filtered by ${this.currentCategory}`);
      });
    }

    // Event 5: Search functionality
    const searchInput = document.getElementById('newsSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchTerm = e.target.value;
        this.debounce(() => this.renderNews(), 300)();
      });
    }

    // Event 6: Clear search
    const clearBtn = document.getElementById('clearSearch');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.searchTerm = '';
        document.getElementById('newsSearch').value = '';
        this.renderNews();
      });
    }

    // Event 7: Bookmark toggle
    document.querySelectorAll('.bookmark-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.toggleBookmark(e));
    });

    // Event 8: Share article
    document.querySelectorAll('.share-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.shareArticle(e));
    });

    // Event 9: Read more
    document.querySelectorAll('.read-more-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.readMore(e));
    });

    // Event 10: Mark as read on hover
    document.querySelectorAll('.news-card').forEach(card => {
      card.addEventListener('mouseenter', (e) => this.markAsRead(e));
    });
  }

  toggleBookmark(event) {
    event.stopPropagation();
    const articleId = event.target.dataset.articleId;
    const index = this.bookmarks.indexOf(articleId);
    
    if (index > -1) {
      this.bookmarks.splice(index, 1);
      this.showNotification('Bookmark removed');
    } else {
      this.bookmarks.push(articleId);
      this.showNotification('Article bookmarked');
    }
    
    localStorage.setItem('bookmarkedArticles', JSON.stringify(this.bookmarks));
    this.renderNews();
  }

  shareArticle(event) {
    const articleId = event.target.dataset.articleId;
    const article = this.articles.find(a => a.id === articleId);
    
    if (navigator.share && article) {
      navigator.share({
        title: article.title,
        text: article.content.substring(0, 100) + '...',
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${article.title} - ${window.location.href}`);
      this.showNotification('Article link copied to clipboard');
    }
  }

  readMore(event) {
    const articleId = event.target.dataset.articleId;
    const article = this.articles.find(a => a.id === articleId);
    
    if (article) {
      this.displayArticleModal(article);
      this.markArticleAsRead(articleId);
    }
  }

  markAsRead(event) {
    const articleId = event.currentTarget.dataset.articleId;
    if (!this.readArticles.includes(articleId)) {
      setTimeout(() => this.markArticleAsRead(articleId), 2000);
    }
  }

  markArticleAsRead(articleId) {
    if (!this.readArticles.includes(articleId)) {
      this.readArticles.push(articleId);
      localStorage.setItem('readArticles', JSON.stringify(this.readArticles));
    }
  }

  displayArticleModal(article) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content article-modal">
        <div class="modal-header">
          <h2>${article.title}</h2>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="article-meta">
            <span class="source">${article.source}</span>
            <span class="date">${article.date.toLocaleDateString()}</span>
            <span class="category">${article.category}</span>
            <span class="reading-time">${article.readingTime} min read</span>
          </div>
          <div class="article-content">${article.content}</div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  saveNewsToStorage() {
    const dataToSave = {
      articles: this.articles,
      readArticles: this.readArticles,
      bookmarks: this.bookmarks,
      currentCategory: this.currentCategory,
      searchTerm: this.searchTerm,
      lastUpdate: new Date().toISOString()
    };
    localStorage.setItem('newsData', JSON.stringify(dataToSave));
  }

  showNewsLoading(show) {
    const loadingDiv = document.getElementById("newsLoading");
    const newsDiv = document.getElementById("newsData");
    
    if (show) {
      if (loadingDiv) loadingDiv.style.display = 'block';
      if (newsDiv) newsDiv.style.opacity = '0.5';
    } else {
      if (loadingDiv) loadingDiv.style.display = 'none';
      if (newsDiv) newsDiv.style.opacity = '1';
    }
  }

  handleNewsError(error) {
    const newsDiv = document.getElementById("newsData");
    newsDiv.innerHTML = `
      <div class="error-container">
        <h3>⚠️ Unable to load news</h3>
        <p>${error.message}</p>
        <button onclick="newsManager.loadNews()" class="retry-btn">
          🔄 Try Again
        </button>
      </div>
    `;
  }

  updateNewsTimestamp() {
    const timeEl = document.getElementById('newsLastRefresh');
    if (timeEl) {
      timeEl.textContent = `News updated: ${new Date().toLocaleTimeString()}`;
    }
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification news-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
  }
}

// Initialize managers and load data
const newsManager = new NewsManager();

// Enhanced initialization with error handling and progressive enhancement
document.addEventListener('DOMContentLoaded', () => {
  // Load data with staggered timing for better UX
  setTimeout(() => scoreManager.loadScores(), 100);
  setTimeout(() => newsManager.loadNews(), 300);
  
  // Set up auto-refresh
  scoreManager.startAutoRefresh();
  
  // Load cached data first for instant display
  const cachedScores = scoreManager.loadFromLocalStorage();
  if (cachedScores && cachedScores.scores.length > 0) {
    scoreManager.scores = cachedScores.scores;
    scoreManager.renderScores();
  }
  
  console.log('🏆 Sports Dashboard fully initialized by Evbosaru Iyen Samuel');
});
