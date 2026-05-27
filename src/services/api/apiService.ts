import { DB_CONFIG, QUERY_CONFIG } from './config';

interface QueryParams {
  [key: string]: string | number | boolean;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

class ApiService {
  private cache = new Map<string, { data: any; timestamp: number }>();

  async get<T>(endpoint: string, params?: QueryParams): Promise<ApiResponse<T>> {
    const cacheKey = `${endpoint}${JSON.stringify(params || {})}`;
    
    // Check cache
    if (QUERY_CONFIG.cache) {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < QUERY_CONFIG.cacheTime) {
        return { success: true, data: cached.data };
      }
    }

    try {
      let url = `${DB_CONFIG.baseUrl}${endpoint}`;
      if (params) {
        const queryString = Object.entries(params)
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join('&');
        url += `?${queryString}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
        signal: AbortSignal.timeout(QUERY_CONFIG.timeout),
      });

      return await this.handleResponse<T>(response, cacheKey);
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${DB_CONFIG.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(QUERY_CONFIG.timeout),
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${DB_CONFIG.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(QUERY_CONFIG.timeout),
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${DB_CONFIG.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
        signal: AbortSignal.timeout(QUERY_CONFIG.timeout),
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  private getHeaders(): Record<string, string> {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  private async handleResponse<T>(response: Response, cacheKey?: string): Promise<ApiResponse<T>> {
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${response.status}`,
        message: data.message,
      };
    }

    // Cache successful response
    if (cacheKey && QUERY_CONFIG.cache) {
      this.cache.set(cacheKey, {
        data: data.data || data,
        timestamp: Date.now(),
      });
    }

    return {
      success: true,
      data: data.data || data,
      message: data.message,
    };
  }

  private handleError<T>(error: any): ApiResponse<T> {
    console.error('API Error:', error);
    return {
      success: false,
      error: error.message || 'Network error',
    };
  }

  clearCache(endpoint?: string) {
    if (endpoint) {
      this.cache.delete(endpoint);
    } else {
      this.cache.clear();
    }
  }
}

export const apiService = new ApiService();
