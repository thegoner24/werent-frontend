// Central API settings and endpoints
const BASE_URL = 'https://werent-backend-api.onrender.com';

export const AUTH_HEADER = 'Authorization';

export const endpoints = {
  signup: '/api/auth/signup',
  login: '/api/auth/login',
  profile: '/api/auth/profile',
  items: '/items',
  testimonials: '/testimonial',
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
  if (options.headers) {
    headers = Object.assign({}, headers, options.headers as Record<string, string>);
  }
  if (token) {
    headers[AUTH_HEADER] = `Bearer ${token}`;
  }
  if (token) {
    headers[AUTH_HEADER] = `Bearer ${token}`;
  }
  const res = await fetch(url, {
    ...options,
    headers,
  });
  if (!res.ok) {
    const error = await res.text();
    console.error('API error response:', error);
    throw new Error(error || 'API request failed');
  }
  return res.json();
};

export default BASE_URL;
