// Central API settings and endpoints
const BASE_URL = 'https://werent-backend-api.onrender.com';

export const AUTH_HEADER = 'Authorization';

export const endpoints = {
  signup: '/api/auth/signup',
  login: '/api/auth/login',
  profile: '/api/auth/profile',
  refresh: '/api/auth/refresh',
  items: '/items',
  testimonials: '/testimonial',
  bookings: '/bookings/', // Updated to use /bookings/ endpoint
};

export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {},
  token?: string
) => {
  const url = `${BASE_URL}${endpoint}`;
  let headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  if (token) {
    const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    headers[AUTH_HEADER] = formattedToken;
  }
  
  if (options.headers) {
    headers = Object.assign({}, headers, options.headers as Record<string, string>);
  }
  
  try {
    console.log(`API Request: ${options.method || 'GET'} ${url}`, { headers });
    
    const res = await fetch(url, {
      ...options,
      headers,
      mode: 'cors',
      credentials: 'include',
    });
    
    console.log(`API Response status: ${res.status} ${res.statusText}`);
    
    if (!res.ok) {
      let errorMessage = 'API request failed';
      try {
        const errorText = await res.text();
        console.error('API error response:', errorText);
        errorMessage = errorText || errorMessage;
      } catch (textError) {
        console.error('Could not parse error response:', textError);
      }
      throw new Error(errorMessage);
    }
    
    const data = await res.json();
    console.log('API Response data:', data);
    return data;
  } catch (error) {
    console.error(`API fetch error for ${endpoint}:`, error);
    throw error;
  }
};

// Re-export the authenticated API fetch for convenience
export { authenticatedApiFetch } from '../utils/authMiddleware';

export default BASE_URL;
