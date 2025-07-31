import { apiFetch } from './index';

// Utility to fetch items from backend API
export async function fetchItems() {
  const response = await fetch('https://werent-backend-api.onrender.com/items');
  if (!response.ok) {
    throw new Error('Failed to fetch items');
  }
  return response.json();
}

// Fetch items by category/type
export async function fetchItemsByCategory(type: string, limit?: number) {
  const queryParams = new URLSearchParams();
  if (limit) {
    queryParams.append('limit', limit.toString());
  }
  
  const response = await fetch(`https://werent-backend-api.onrender.com/items?type=${encodeURIComponent(type)}&${queryParams.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch items by category');
  }
  return response.json();
}

// Fetch a single item by id
export async function fetchItemById(id: string | number) {
  const response = await fetch(`https://werent-backend-api.onrender.com/items/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch item');
  }
  return response.json();
}

// Interface for review data
export interface ReviewData {
  user: string;
  rating: number;
  comment?: string; // For backward compatibility
  review_message: string; // Required by backend
  date?: string; // Optional as it might be set by the backend
  images?: string[]; // Base64 encoded images
}

// Interfaces for creating items
export interface CreateItemPayload {
  brand: string;
  color: string;
  description: string;
  gender: string;
  images: string[];
  name: string;
  price_per_day: number;
  product_code: string;
  quantity: number;
  size: string;
  type: string;
}

export interface ItemImage {
  created_at: string;
  id: number;
  image_base64: string;
  item_id: number;
}

export interface CreateItemResponse {
  data: {
    brand: string;
    color: string;
    created_at: string;
    description: string;
    gender: string;
    id: number;
    images: ItemImage[];
    name: string;
    price_per_day: number;
    product_code: string;
    quantity: number;
    rating: number;
    size: string;
    type: string;
    updated_at: string;
    user_id: number;
  };
  message: string;
  success: boolean;
}

// Create a new item (admin only)
export async function createItem(payload: CreateItemPayload, token: string): Promise<CreateItemResponse> {
  return await apiFetch('/items', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, token);
}

// Add a review to an item
export async function addReviewToItem(itemId: string | number, reviewData: ReviewData, token: string) {
  try {
    return await apiFetch(`/items/${itemId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    }, token);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to add review');
  }
}

// Interface for review pagination and filtering
export interface ReviewQueryParams {
  page?: number;
  limit?: number;
  rating?: number;
  sort_by?: 'date_asc' | 'date_desc' | 'rating_asc' | 'rating_desc';
}

// Fetch reviews for an item with pagination and filtering
export async function fetchItemReviews(
  itemId: string | number, 
  queryParams?: ReviewQueryParams,
  token?: string
) {
  try {
    // Build query string from params
    const queryString = queryParams ? 
      Object.entries(queryParams)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
        .join('&') : '';
    
    const endpoint = `/items/${itemId}/reviews${queryString ? `?${queryString}` : ''}`;
    
    return await apiFetch(endpoint, {
      method: 'GET',
    }, token);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch reviews');
  }
}

