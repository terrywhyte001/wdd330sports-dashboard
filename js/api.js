/**
 * API Configuration and Keys
 * Using APIs that support CORS for client-side calls
 */
const API_CONFIG = {
  // News API using RSS2JSON service (supports CORS)
  news: {
    primary: {
      url: 'https://api.rss2json.com/v1/api.json',
      rss_url: 'https://feeds.skysports.com/feeds/11095', // Sky Sports RSS
      count: 10
    },
    secondary: {
      url: 'https://api.rss2json.com/v1/api.json', 
      rss_url: 'http://www.espn.com/espn/rss/news', // ESPN RSS
      count: 8
    }
  },
  
  // Sports API using TheSportsDB (free, supports CORS)
  sports: {
    primary: {
      url: 'https://www.thesportsdb.com/api/v1/json/3/eventsday.php',
      params: {
        d: new Date().toISOString().split('T')[0] // Today's date YYYY-MM-DD
      }
    },
    secondary: {
      url: 'https://www.thesportsdb.com/api/v1/json/3/eventslast.php',
      params: {
        id: '4328' // Premier League ID for recent matches
      }
    }
  }
};

/**
 * Base API class for handling HTTP requests
 */
export class BaseAPI {
  /**
   * Make a GET request with error handling
   * @param {string} url - The API endpoint URL
   * @param {Object} options - Request options (headers, etc.)
   * @returns {Promise<Object>} - The response data
   */
  static async get(url, options = {}) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      
      const response = await fetch(url, {
        method: 'GET',
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please check your connection');
      }
      throw error;
    }
  }

  /**
   * Handle API errors consistently
   * @param {Error} error - The error object
   * @returns {Object} - Formatted error response
   */
  static handleError(error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
      data: []
    };
  }
}

/**
 * Sports News API Handler
 */
export class NewsAPI extends BaseAPI {
  /**
   * Fetch sports news from RSS feed via rss2json (Primary Source)
   * @returns {Promise<Object>} - News data
   */
  static async fetchSportsNews() {
    try {
      // Primary: Sky Sports RSS via RSS2JSON
      const url = `${API_CONFIG.news.primary.url}?rss_url=${encodeURIComponent(API_CONFIG.news.primary.rss_url)}&count=${API_CONFIG.news.primary.count}`;
      
      const response = await this.get(url);
      
      if (response.status === 'ok' && response.items) {
        const newsItems = response.items.slice(0, 8).map(item => ({
          title: item.title || 'No title available',
          content: this.stripHtmlTags(item.description) || 'No description available',
          source: 'Sky Sports',
          date: new Date(item.pubDate || Date.now()).toLocaleDateString(),
          link: item.link || '#'
        }));
        
        return {
          success: true,
          data: newsItems,
          count: newsItems.length
        };
      } else {
        throw new Error('Invalid response from primary news API');
      }
    } catch (error) {
      console.warn('Primary news API failed, trying secondary...');
      return this.fetchAlternativeNews();
    }
  }

  /**
   * Alternative news source (ESPN RSS via RSS2JSON)
   */
  static async fetchAlternativeNews() {
    try {
      // Secondary: ESPN RSS via RSS2JSON
      const url = `${API_CONFIG.news.secondary.url}?rss_url=${encodeURIComponent(API_CONFIG.news.secondary.rss_url)}&count=${API_CONFIG.news.secondary.count}`;
      
      const response = await this.get(url);
      
      if (response.status === 'ok' && response.items) {
        const newsItems = response.items.slice(0, 8).map(item => ({
          title: item.title || 'No title available',
          content: this.stripHtmlTags(item.description) || 'No description available',
          source: 'ESPN',
          date: new Date(item.pubDate || Date.now()).toLocaleDateString(),
          link: item.link || '#'
        }));
        
        return {
          success: true,
          data: newsItems,
          count: newsItems.length
        };
      } else {
        throw new Error('Invalid response from secondary news API');
      }
    } catch (error) {
      console.warn('Secondary news API failed, using fallback data...');
      return this.getFallbackNews();
    }
  }

  /**
   * Strip HTML tags from content
   * @param {string} html - HTML string
   * @returns {string} - Clean text
   */
  static stripHtmlTags(html) {
    if (!html) return '';
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }

  /**
   * Provide fallback news data when APIs fail
   * @returns {Object} - Sample news data
   */
  static getFallbackNews() {
    const sampleNews = [
      {
        title: "Manchester City Extends Lead at Top of Premier League",
        content: "City's dominant 3-0 victory over rivals puts them five points clear at the summit with crucial matches ahead.",
        source: "Sky Sports",
        date: new Date().toLocaleDateString(),
        link: "#"
      },
      {
        title: "Champions League Draw Delivers Blockbuster Ties",
        content: "European football's elite competition has delivered some mouth-watering quarter-final matchups that promise entertainment.",
        source: "ESPN",
        date: new Date(Date.now() - 86400000).toLocaleDateString(),
        link: "#"
      },
      {
        title: "NBA Trade Deadline Shakes Up Championship Race",
        content: "Several major moves have shifted the balance of power in both conferences as teams prepare for the playoff push.",
        source: "The Athletic",
        date: new Date(Date.now() - 172800000).toLocaleDateString(),
        link: "#"
      },
      {
        title: "Wimbledon Sees Stunning Upset in Women's Singles",
        content: "The defending champion crashes out in straight sets to an unseeded opponent in a major shock at the All England Club.",
        source: "BBC Sport",
        date: new Date(Date.now() - 259200000).toLocaleDateString(),
        link: "#"
      },
      {
        title: "Formula 1 Returns with New Regulations",
        content: "The new season kicks off with significant rule changes designed to improve racing and increase competitive balance.",
        source: "Motorsport.com",
        date: new Date(Date.now() - 345600000).toLocaleDateString(),
        link: "#"
      },
      {
        title: "Olympic Preparations Intensify for Paris 2024",
        content: "Athletes across all disciplines are making final preparations as the Summer Olympics approach with high expectations.",
        source: "Olympic Channel",
        date: new Date(Date.now() - 432000000).toLocaleDateString(),
        link: "#"
      }
    ];

    return {
      success: true,
      data: sampleNews,
      count: sampleNews.length,
      fallback: true
    };
  }
}

/**
 * Sports Scores API Handler
 */
export class SportsAPI extends BaseAPI {
  /**
   * Fetch today's sports events from TheSportsDB (Primary Source)
   * @returns {Promise<Object>} - Sports scores data
   */
  static async fetchLiveScores() {
    try {
      // Primary: Today's events from TheSportsDB
      const today = new Date().toISOString().split('T')[0];
      const url = `${API_CONFIG.sports.primary.url}?d=${today}`;
      
      const response = await this.get(url);
      
      if (response.events && response.events.length > 0) {
        const sportsData = response.events.slice(0, 10).map(event => ({
          sport: event.strSport || 'Soccer',
          team: event.strHomeTeam || 'Team A',
          opponent: event.strAwayTeam || 'Team B',
          score: this.formatScore(event),
          status: this.getEventStatus(event),
          date: new Date(event.dateEvent || Date.now()).toLocaleDateString(),
          league: event.strLeague || 'Unknown League'
        }));

        return {
          success: true,
          data: sportsData,
          count: sportsData.length
        };
      } else {
        // No events today, try recent matches
        return this.fetchRecentMatches();
      }
    } catch (error) {
      console.warn('Primary sports API failed, trying recent matches...');
      return this.fetchRecentMatches();
    }
  }

  /**
   * Fetch recent matches (Secondary Source)
   */
  static async fetchRecentMatches() {
    try {
      // Secondary: Recent Premier League matches
      const url = `${API_CONFIG.sports.secondary.url}?id=4328`;
      
      const response = await this.get(url);
      
      if (response.events && response.events.length > 0) {
        const sportsData = response.events.slice(0, 8).map(event => ({
          sport: 'Soccer',
          team: event.strHomeTeam || 'Team A',
          opponent: event.strAwayTeam || 'Team B',
          score: this.formatScore(event),
          status: this.getEventStatus(event),
          date: new Date(event.dateEvent || Date.now()).toLocaleDateString(),
          league: event.strLeague || 'Premier League'
        }));

        return {
          success: true,
          data: sportsData,
          count: sportsData.length
        };
      } else {
        throw new Error('No recent matches found');
      }
    } catch (error) {
      console.warn('Secondary sports API failed, using fallback data...');
      return this.getFallbackScores();
    }
  }

  /**
   * Format score from TheSportsDB event data
   * @param {Object} event - Event object from API
   * @returns {string} - Formatted score
   */
  static formatScore(event) {
    if (event.intHomeScore !== null && event.intAwayScore !== null) {
      return `${event.intHomeScore}-${event.intAwayScore}`;
    } else if (event.strScore) {
      return event.strScore;
    } else {
      return 'vs'; // Not yet played
    }
  }

  /**
   * Get event status from TheSportsDB event data
   * @param {Object} event - Event object from API
   * @returns {string} - Event status
   */
  static getEventStatus(event) {
    if (event.strStatus) {
      return event.strStatus;
    } else if (event.intHomeScore !== null && event.intAwayScore !== null) {
      return 'Final';
    } else {
      const eventTime = new Date(event.strTimestamp || event.dateEvent);
      const now = new Date();
      
      if (eventTime > now) {
        return 'Scheduled';
      } else {
        return 'Live';
      }
    }
  }

  /**
   * Provide fallback scores data when APIs fail
   * @returns {Object} - Sample scores data
   */
  static getFallbackScores() {
    const sampleScores = [
      {
        sport: "Soccer",
        team: "Manchester City",
        opponent: "Arsenal",
        score: "2-1",
        status: "Final",
        date: new Date().toLocaleDateString(),
        league: "Premier League"
      },
      {
        sport: "Soccer", 
        team: "Liverpool",
        opponent: "Chelsea",
        score: "3-0",
        status: "Final",
        date: new Date().toLocaleDateString(),
        league: "Premier League"
      },
      {
        sport: "Basketball",
        team: "Los Angeles Lakers",
        opponent: "Golden State Warriors",
        score: "112-108",
        status: "Final",
        date: new Date().toLocaleDateString(),
        league: "NBA"
      },
      {
        sport: "Basketball",
        team: "Boston Celtics",
        opponent: "Miami Heat",
        score: "98-95",
        status: "Final",
        date: new Date(Date.now() - 86400000).toLocaleDateString(),
        league: "NBA"
      },
      {
        sport: "American Football",
        team: "Kansas City Chiefs",
        opponent: "Buffalo Bills",
        score: "24-20",
        status: "Final",
        date: new Date(Date.now() - 172800000).toLocaleDateString(),
        league: "NFL"
      },
      {
        sport: "Soccer",
        team: "Real Madrid",
        opponent: "Barcelona",
        score: "2-1",
        status: "Final",
        date: new Date(Date.now() - 259200000).toLocaleDateString(),
        league: "La Liga"
      },
      {
        sport: "Ice Hockey",
        team: "Toronto Maple Leafs",
        opponent: "Boston Bruins",
        score: "4-2",
        status: "Final",
        date: new Date(Date.now() - 345600000).toLocaleDateString(),
        league: "NHL"
      },
      {
        sport: "Baseball",
        team: "New York Yankees",
        opponent: "Boston Red Sox",
        score: "7-4",
        status: "Final",
        date: new Date(Date.now() - 432000000).toLocaleDateString(),
        league: "MLB"
      }
    ];

    return {
      success: true,
      data: sampleScores,
      count: sampleScores.length,
      fallback: true
    };
  }
}

/**
 * Generic error handler for the application
 */
export class ErrorHandler {
  /**
   * Display error message to user
   * @param {string} elementId - ID of element to show error in
   * @param {string} message - Error message
   */
  static showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
      element.style.display = 'block';
      element.innerHTML = `
        <p><strong>⚠️ Error:</strong> ${message}</p>
        <button onclick="location.reload()" class="retry-btn">Try Again</button>
      `;
    }
  }

  /**
   * Hide error message
   * @param {string} elementId - ID of element to hide
   */
  static hideError(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.style.display = 'none';
    }
  }
}