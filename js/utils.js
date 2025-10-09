/**
 * Utility functions for the Sports Dashboard application
 */

/**
 * Date and time utilities
 */
export class DateUtils {
  /**
   * Format date to readable string
   * @param {Date|string} date - Date to format
   * @returns {string} - Formatted date string
   */
  static formatDate(date) {
    if (!date) return 'Unknown';
    
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return 'Invalid Date';
    
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  /**
   * Format date with time
   * @param {Date|string} date - Date to format
   * @returns {string} - Formatted date and time string
   */
  static formatDateTime(date) {
    if (!date) return 'Unknown';
    
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return 'Invalid Date';
    
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Get relative time (e.g., "2 hours ago")
   * @param {Date|string} date - Date to compare
   * @returns {string} - Relative time string
   */
  static getRelativeTime(date) {
    if (!date) return 'Unknown';
    
    const dateObj = new Date(date);
    const now = new Date();
    const diffMs = now - dateObj;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Recently';
    }
  }
}

/**
 * String manipulation utilities
 */
export class StringUtils {
  /**
   * Truncate text to specified length
   * @param {string} text - Text to truncate
   * @param {number} maxLength - Maximum length
   * @returns {string} - Truncated text
   */
  static truncate(text, maxLength = 100) {
    if (!text || typeof text !== 'string') return '';
    
    if (text.length <= maxLength) return text;
    
    return text.substring(0, maxLength).trim() + '...';
  }

  /**
   * Capitalize first letter of each word
   * @param {string} text - Text to capitalize
   * @returns {string} - Capitalized text
   */
  static capitalizeWords(text) {
    if (!text || typeof text !== 'string') return '';
    
    return text.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  /**
   * Clean and format team names
   * @param {string} teamName - Team name to clean
   * @returns {string} - Cleaned team name
   */
  static cleanTeamName(teamName) {
    if (!teamName) return 'Unknown Team';
    
    // Remove common prefixes/suffixes
    let cleaned = teamName
      .replace(/^(FC|CF|AC|AS|US|SC)\s+/i, '')
      .replace(/\s+(FC|CF|AC|AS|US|SC)$/i, '')
      .trim();
    
    return this.capitalizeWords(cleaned);
  }
}

/**
 * Data validation utilities
 */
export class ValidationUtils {
  /**
   * Validate if data is a valid array with items
   * @param {any} data - Data to validate
   * @returns {boolean} - Whether data is valid
   */
  static isValidArray(data) {
    return Array.isArray(data) && data.length > 0;
  }

  /**
   * Validate if object has required properties
   * @param {Object} obj - Object to validate
   * @param {Array} requiredProps - Array of required property names
   * @returns {boolean} - Whether object is valid
   */
  static hasRequiredProps(obj, requiredProps) {
    if (!obj || typeof obj !== 'object') return false;
    
    return requiredProps.every(prop => 
      obj.hasOwnProperty(prop) && obj[prop] !== null && obj[prop] !== undefined
    );
  }

  /**
   * Sanitize and validate score string
   * @param {string} score - Score to validate
   * @returns {string} - Sanitized score
   */
  static sanitizeScore(score) {
    if (!score) return '0-0';
    
    // Remove any non-numeric characters except dashes, spaces, and colons
    const cleaned = score.toString().replace(/[^0-9\-:\s,]/g, '');
    
    // If it doesn't look like a score, return default
    if (!/\d/.test(cleaned)) return '0-0';
    
    return cleaned.trim();
  }
}

/**
 * Performance and optimization utilities
 */
export class PerformanceUtils {
  /**
   * Debounce function calls
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} - Debounced function
   */
  static debounce(func, wait) {
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

  /**
   * Throttle function calls
   * @param {Function} func - Function to throttle
   * @param {number} limit - Time limit in milliseconds
   * @returns {Function} - Throttled function
   */
  static throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Measure execution time of a function
   * @param {Function} func - Function to measure
   * @param {string} label - Label for the measurement
   * @returns {any} - Function result
   */
  static async measureTime(func, label = 'Operation') {
    const start = performance.now();
    const result = await func();
    const end = performance.now();
    
    console.log(`${label} took ${(end - start).toFixed(2)} milliseconds`);
    return result;
  }
}

/**
 * Local storage utilities
 */
export class StorageUtils {
  /**
   * Save data to localStorage with error handling
   * @param {string} key - Storage key
   * @param {any} data - Data to store
   * @returns {boolean} - Success status
   */
  static save(key, data) {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      return false;
    }
  }

  /**
   * Load data from localStorage with error handling
   * @param {string} key - Storage key
   * @param {any} defaultValue - Default value if not found
   * @returns {any} - Stored data or default value
   */
  static load(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      
      return JSON.parse(item);
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return defaultValue;
    }
  }

  /**
   * Remove item from localStorage
   * @param {string} key - Storage key
   * @returns {boolean} - Success status
   */
  static remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
      return false;
    }
  }

  /**
   * Clear all localStorage data
   * @returns {boolean} - Success status
   */
  static clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
      return false;
    }
  }

  /**
   * Check if localStorage is available
   * @returns {boolean} - Availability status
   */
  static isAvailable() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }
}

/**
 * Network and connectivity utilities
 */
export class NetworkUtils {
  /**
   * Check if user is online
   * @returns {boolean} - Online status
   */
  static isOnline() {
    return navigator.onLine;
  }

  /**
   * Wait for network connection
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise<boolean>} - Connection status
   */
  static async waitForConnection(timeout = 5000) {
    return new Promise((resolve) => {
      if (this.isOnline()) {
        resolve(true);
        return;
      }

      const timeoutId = setTimeout(() => {
        window.removeEventListener('online', onlineHandler);
        resolve(false);
      }, timeout);

      const onlineHandler = () => {
        clearTimeout(timeoutId);
        window.removeEventListener('online', onlineHandler);
        resolve(true);
      };

      window.addEventListener('online', onlineHandler);
    });
  }

  /**
   * Setup network status monitoring
   * @param {Function} onOnline - Callback when online
   * @param {Function} onOffline - Callback when offline
   */
  static monitorNetworkStatus(onOnline, onOffline) {
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    // Return cleanup function
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }
}

/**
 * Error handling utilities
 */
export class ErrorUtils {
  /**
   * Create user-friendly error messages
   * @param {Error} error - Error object
   * @returns {string} - User-friendly message
   */
  static getUserFriendlyMessage(error) {
    if (!error) return 'An unknown error occurred';

    // Network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return 'Unable to connect to the server. Please check your internet connection.';
    }

    // Timeout errors
    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      return 'The request took too long to complete. Please try again.';
    }

    // API errors
    if (error.message.includes('HTTP')) {
      return 'The service is temporarily unavailable. Please try again later.';
    }

    // CORS errors
    if (error.message.includes('CORS')) {
      return 'Unable to access the external service due to security restrictions.';
    }

    // Default message
    return error.message || 'Something went wrong. Please try again.';
  }

  /**
   * Log error with context
   * @param {Error} error - Error object
   * @param {string} context - Context where error occurred
   */
  static logError(error, context = 'Unknown') {
    console.group(`🚨 Error in ${context}`);
    console.error('Error:', error);
    console.trace('Stack trace:');
    console.groupEnd();

    // In production, you might want to send this to an error tracking service
  }
}

/**
 * Animation utilities
 */
export class AnimationUtils {
  /**
   * Add entrance animation to elements
   * @param {Element} element - Element to animate
   * @param {string} animationType - Type of animation
   */
  static addEntranceAnimation(element, animationType = 'fadeInUp') {
    if (!element) return;

    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'all 0.6s ease-out';

    // Trigger animation on next frame
    requestAnimationFrame(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    });
  }

  /**
   * Stagger animations for multiple elements
   * @param {NodeList|Array} elements - Elements to animate
   * @param {number} delay - Delay between animations in ms
   */
  static staggerAnimation(elements, delay = 100) {
    elements.forEach((element, index) => {
      setTimeout(() => {
        this.addEntranceAnimation(element);
      }, index * delay);
    });
  }
}