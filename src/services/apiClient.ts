/**
 * Centralized API Client for KrushiSetu
 * Communicates with backend Express routes connected to MongoDB Atlas.
 */

const API_BASE = '/api';

export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  error?: string;
  code?: string;
  status: number;
}

class ApiClient {
  private getToken(): string | null {
    try {
      return localStorage.getItem('krishisetu_jwt_token_v6') || localStorage.getItem('krishisetu_token');
    } catch {
      return null;
    }
  }

  private getHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  public async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = endpoint.startsWith('/api') ? endpoint : `${API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

    try {
      const res = await fetch(url, {
        ...options,
        headers: this.getHeaders((options.headers as Record<string, string>) || {}),
      });

      let json: any = null;
      try {
        json = await res.json();
      } catch {
        json = null;
      }

      if (!res.ok) {
        // Handle database unavailable state (503)
        if (res.status === 503) {
          return {
            status: 503,
            error: 'The KrushiSetu database is temporarily unavailable. Please verify your connection or try again shortly.',
            code: 'DATABASE_UNAVAILABLE',
          };
        }

        return {
          status: res.status,
          error: json?.error || `Request failed with status ${res.status}`,
          code: json?.code,
          data: json,
        };
      }

      return {
        status: res.status,
        success: true,
        data: json,
        ...json,
      };
    } catch (err: unknown) {
      return {
        status: 0,
        error: 'Network connection error. Please verify backend server and database availability.',
        code: 'NETWORK_ERROR',
      };
    }
  }

  public async get<T = any>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
          searchParams.append(k, String(v));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
      }
    }
    return this.request<T>(url, { method: 'GET' });
  }

  public async post<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public async put<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  /**
   * Check backend and MongoDB Atlas connectivity
   */
  public async checkHealth(): Promise<{ isHealthy: boolean; databaseConnected: boolean; message: string }> {
    const res = await this.get('/health');
    if (res.status === 200 && res.data?.databaseConnected) {
      return { isHealthy: true, databaseConnected: true, message: 'MongoDB Atlas online' };
    }
    return {
      isHealthy: false,
      databaseConnected: Boolean(res.data?.databaseConnected),
      message: res.error || 'Database degraded or unreachable',
    };
  }
}

export const apiClient = new ApiClient();
