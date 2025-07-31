import { refreshAccessToken } from '../api/refresh';

// Track if a refresh is already in progress to avoid multiple simultaneous refresh attempts
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

/**
 * Decode JWT token to check expiration
 * @param token JWT token
 * @returns true if token is expired or invalid
 */
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true; // Consider invalid tokens as expired
  }
}

/**
 * Get a valid access token, refreshing if necessary
 * @returns Promise with valid access token or null if refresh fails
 */
export async function getValidAccessToken(): Promise<string | null> {
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');

  // If no tokens exist, return null
  if (!accessToken || !refreshToken) {
    return null;
  }

  // If access token is still valid, return it
  if (!isTokenExpired(accessToken)) {
    return accessToken;
  }

  // If refresh token is also expired, clear storage and return null
  if (isTokenExpired(refreshToken)) {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    return null;
  }

  // If already refreshing, wait for the existing refresh to complete
  if (isRefreshing && refreshPromise) {
    try {
      return await refreshPromise;
    } catch (error) {
      return null;
    }
  }

  // Start refresh process
  isRefreshing = true;
  refreshPromise = performTokenRefresh(refreshToken);

  try {
    const newAccessToken = await refreshPromise;
    return newAccessToken;
  } catch (error) {
    console.error('Token refresh failed:', error);
    // Clear all auth data on refresh failure
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    return null;
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }
}

/**
 * Perform the actual token refresh
 * @param refreshToken The refresh token
 * @returns Promise with new access token
 */
async function performTokenRefresh(refreshToken: string): Promise<string> {
  try {
    const response = await refreshAccessToken(refreshToken);
    
    if (response.success && response.data.access_token) {
      const newAccessToken = response.data.access_token;
      
      // Update localStorage with new access token
      localStorage.setItem('access_token', newAccessToken);
      
      return newAccessToken;
    } else {
      throw new Error('Invalid refresh response');
    }
  } catch (error) {
    console.error('Failed to refresh token:', error);
    throw error;
  }
}

/**
 * Enhanced fetch function with automatic token refresh
 * @param url Request URL
 * @param options Fetch options
 * @returns Promise with fetch response
 */
export async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  // Get valid access token (refresh if needed)
  const accessToken = await getValidAccessToken();
  
  if (!accessToken) {
    throw new Error('No valid access token available');
  }

  // Add authorization header
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
    'Authorization': `Bearer ${accessToken}`,
  };

  // Make the request
  const response = await fetch(url, {
    ...options,
    headers,
    mode: 'cors',
    credentials: 'include',
  });

  // If we get a 401, try to refresh token once more
  if (response.status === 401) {
    console.log('Received 401, attempting token refresh...');
    
    // Force refresh by clearing current token and trying again
    localStorage.removeItem('access_token');
    const newAccessToken = await getValidAccessToken();
    
    if (newAccessToken) {
      // Retry the request with new token
      const retryHeaders = {
        ...headers,
        'Authorization': `Bearer ${newAccessToken}`,
      };
      
      return fetch(url, {
        ...options,
        headers: retryHeaders,
        mode: 'cors',
        credentials: 'include',
      });
    } else {
      // If refresh failed, redirect to login
      window.location.href = '/login';
      throw new Error('Authentication failed');
    }
  }

  return response;
}

/**
 * Enhanced apiFetch with automatic token refresh middleware
 * @param endpoint API endpoint
 * @param options Request options
 * @returns Promise with parsed JSON response
 */
export async function authenticatedApiFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const BASE_URL = 'https://werent-backend-api.onrender.com';
  const url = `${BASE_URL}${endpoint}`;
  
  try {
    console.log(`Authenticated API Request: ${options.method || 'GET'} ${url}`);
    
    const response = await authenticatedFetch(url, options);
    
    console.log(`API Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      let errorMessage = 'API request failed';
      try {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        errorMessage = errorText || errorMessage;
      } catch (textError) {
        console.error('Could not parse error response:', textError);
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log('API Response data:', data);
    return data;
  } catch (error) {
    console.error(`Authenticated API fetch error for ${endpoint}:`, error);
    throw error;
  }
}