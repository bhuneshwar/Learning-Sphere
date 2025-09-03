// Performance utilities for caching and optimization

// Simple in-memory cache implementation
class SimpleCache {
  constructor(maxSize = 50, ttl = 5 * 60 * 1000) { // 5 minutes TTL
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
  }

  set(key, value) {
    // Remove oldest entry if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  get(key) {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    // Check if item has expired
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  delete(key) {
    return this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }
}

// Global cache instances
export const apiCache = new SimpleCache(50, 5 * 60 * 1000); // 5 minutes
export const imageCache = new SimpleCache(100, 30 * 60 * 1000); // 30 minutes

// Debounce function for search inputs
export const debounce = (func, wait) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for scroll events
export const throttle = (func, limit) => {
  let inThrottle;
  
  return function() {
    const args = arguments;
    const context = this;
    
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Preload images for better performance
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Batch preload multiple images
export const preloadImages = async (urls) => {
  try {
    const promises = urls.map(url => preloadImage(url));
    return await Promise.allSettled(promises);
  } catch (error) {
    console.warn('Error preloading images:', error);
    return [];
  }
};

// Local storage with expiration
export const localStorageWithExpiry = {
  setItem: (key, value, ttl = 24 * 60 * 60 * 1000) => { // 24 hours default
    const item = {
      value,
      expiry: Date.now() + ttl
    };
    localStorage.setItem(key, JSON.stringify(item));
  },

  getItem: (key) => {
    const itemStr = localStorage.getItem(key);
    
    if (!itemStr) return null;
    
    try {
      const item = JSON.parse(itemStr);
      
      if (Date.now() > item.expiry) {
        localStorage.removeItem(key);
        return null;
      }
      
      return item.value;
    } catch (error) {
      localStorage.removeItem(key);
      return null;
    }
  },

  removeItem: (key) => {
    localStorage.removeItem(key);
  }
};

// React component lazy loading utility
export const lazyLoad = (importFunc, fallback = null) => {
  const LazyComponent = React.lazy(importFunc);
  
  return (props) => (
    <React.Suspense fallback={fallback || <div className="loading">Loading...</div>}>
      <LazyComponent {...props} />
    </React.Suspense>
  );
};

// Optimize images by adding query parameters
export const optimizeImageUrl = (url, options = {}) => {
  if (!url) return url;
  
  const { width, height, quality = 85, format = 'webp' } = options;
  
  // This would typically work with an image optimization service
  // For now, we'll just return the original URL
  // In a real app, you might use services like Cloudinary, ImageKit, etc.
  
  let optimizedUrl = url;
  const params = new URLSearchParams();
  
  if (width) params.append('w', width);
  if (height) params.append('h', height);
  if (quality !== 85) params.append('q', quality);
  if (format !== 'jpg' && format !== 'jpeg') params.append('f', format);
  
  if (params.toString()) {
    optimizedUrl += (url.includes('?') ? '&' : '?') + params.toString();
  }
  
  return optimizedUrl;
};

// Check if user prefers reduced motion
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Virtual scrolling utility for large lists
export const calculateVirtualScrollItems = (
  totalItems,
  containerHeight,
  itemHeight,
  scrollTop,
  buffer = 3
) => {
  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    totalItems - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight)
  );
  
  const start = Math.max(0, visibleStart - buffer);
  const end = Math.min(totalItems - 1, visibleEnd + buffer);
  
  return { start, end, visibleStart, visibleEnd };
};

// Performance monitoring utilities
export const performanceMonitor = {
  // Mark the start of an operation
  mark: (name) => {
    if ('performance' in window && 'mark' in performance) {
      performance.mark(`${name}-start`);
    }
  },

  // Mark the end of an operation and measure duration
  measure: (name) => {
    if ('performance' in window && 'mark' in performance && 'measure' in performance) {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
      
      const measure = performance.getEntriesByName(name)[0];
      return measure ? measure.duration : null;
    }
    return null;
  },

  // Get all performance entries
  getEntries: () => {
    if ('performance' in window) {
      return performance.getEntries();
    }
    return [];
  }
};
