import { apiFetch } from './index';

// Utility to fetch items from backend API
export async function fetchItems() {
  const response = await fetch('https://werent-backend-api.onrender.com/items');
  if (!response.ok) {
    throw new Error('Failed to fetch items');
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
  comment: string;
  date?: string; // Optional as it might be set by the backend
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
export async function addReviewToItem(itemId: string | number, reviewData: ReviewData) {
  const response = await fetch(`https://werent-backend-api.onrender.com/items/${itemId}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reviewData),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to add review');
  }
  
  return response.json();
}

