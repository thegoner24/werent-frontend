import { useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authenticatedApiFetch } from '../utils/authMiddleware';

/**
 * Custom hook for making authenticated API requests with automatic token refresh
 * @returns Object with authenticated API methods
 */
export function useAuthenticatedApi() {
  const { isAuthenticated, logout } = useAuth();

  /**
   * Make an authenticated API request with automatic token refresh
   * @param endpoint API endpoint
   * @param options Request options
   * @returns Promise with API response
   */
  const apiRequest = useCallback(async (
    endpoint: string,
    options: RequestInit = {}
  ) => {
    if (!isAuthenticated) {
      throw new Error('User is not authenticated');
    }

    try {
      return await authenticatedApiFetch(endpoint, options);
    } catch (error) {
      // If the error indicates authentication failure, logout the user
      if (error instanceof Error && error.message.includes('Authentication failed')) {
        logout();
      }
      throw error;
    }
  }, [isAuthenticated, logout]);

  /**
   * Make a GET request
   * @param endpoint API endpoint
   * @returns Promise with API response
   */
  const get = useCallback((endpoint: string) => {
    return apiRequest(endpoint, { method: 'GET' });
  }, [apiRequest]);

  /**
   * Make a POST request
   * @param endpoint API endpoint
   * @param data Request body data
   * @returns Promise with API response
   */
  const post = useCallback((endpoint: string, data?: any) => {
    return apiRequest(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }, [apiRequest]);

  /**
   * Make a PUT request
   * @param endpoint API endpoint
   * @param data Request body data
   * @returns Promise with API response
   */
  const put = useCallback((endpoint: string, data?: any) => {
    return apiRequest(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }, [apiRequest]);

  /**
   * Make a PATCH request
   * @param endpoint API endpoint
   * @param data Request body data
   * @returns Promise with API response
   */
  const patch = useCallback((endpoint: string, data?: any) => {
    return apiRequest(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }, [apiRequest]);

  /**
   * Make a DELETE request
   * @param endpoint API endpoint
   * @returns Promise with API response
   */
  const del = useCallback((endpoint: string) => {
    return apiRequest(endpoint, { method: 'DELETE' });
  }, [apiRequest]);

  return {
    apiRequest,
    get,
    post,
    put,
    patch,
    delete: del,
    isAuthenticated,
  };
}