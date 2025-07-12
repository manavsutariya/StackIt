import axios from 'axios';
// ==================== HTTP CLIENT ====================

// Adapter Pattern - HTTP client adapter

class HttpClientAdapter {
  constructor(axiosInstance = axios) {
    this.client = axiosInstance;
    this.cache = new Map();
  }

  async execute(config) {
    // Apply request interceptors
    let finalConfig = { ...config };
    
    // Check cache first
    // if (config.cache && config.method === 'GET') {
    //   const cacheKey = this._getCacheKey(config);
    //   const cached = this.cache.get(cacheKey);
    //   if (cached && Date.now() - cached.timestamp < config.cache) {
    //     return cached.data;
    //   }
    // }

    try {

      const response = await this.client(finalConfig);
      
      // Cache response if needed
      // if (config.cache && config.method === 'GET') {
      //   const cacheKey = this._getCacheKey(config);
      //   this.cache.set(cacheKey, {
      //     data: response.data,
      //     timestamp: Date.now()
      //   });
      // }

      return response.data;
    } catch (error) {
      throw this._transformError(error);
    }
  }

  _getCacheKey(config) {
    return `${config.method}:${config.url}:${JSON.stringify(config.data || {})}`;
  }

  _transformError(error) {
    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data?.message || error.response.statusText,
        data: error.response.data
      };
    }
    return { message: error.message || 'Network error' };
  }
}

export default HttpClientAdapter;