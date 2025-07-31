import { apiFetch } from './index';

// Unified Review interface that matches backend API structure
export interface Review {
  id?: number | string; // Handle both string and number IDs from API
  user?: string;
  user_full_name?: string; // <-- Add this for mapped field
  rating: number;
  comment?: string;
  review_message?: string; // Backend field name
  date: string;
  created_at?: string;
  updated_at?: string;
  item_id?: number;
  user_id?: number;
  service_id?: number;
  // Additional fields for enhanced functionality
  images?: string[]; // Base64 encoded images
  helpful?: number;
  reported?: boolean;
  moderated?: boolean;
  // User integration fields
  userEmail?: string;
  userAvatar?: string;
  // Verification fields
  verifiedPurchase?: boolean;
  purchaseDate?: string;
  orderId?: string;
  // Media fields
  photos?: string[];
  videos?: string[];
  // Additional metadata
  productId?: string;
  productName?: string;
  helpfulVotes?: string[]; // Array of user IDs who voted helpful
  reportedBy?: string[]; // Array of user IDs who reported
}

// Utility to fetch items from backend API
export async function fetchItems() {
  const response = await apiFetch('/items', {
    method: 'GET',
  });
  // Extract the actual array of items from response.data
  const items = Array.isArray(response.data) ? response.data : [];
  return items.map((item: any, idx: number) => ({
  id: item.id ?? idx,
  image: (item.images && Array.isArray(item.images) && item.images.length > 0)
    ? (item.images[0].startsWith('data:image')
        ? item.images[0]
        : `data:image/jpeg;base64,${item.images[0]}`)
    : '/placeholder.png',
  name: item.name ?? item.brand ?? 'Unknown',
  rating: item.rating ?? 0,
  price: item.price_per_day ?? item.price ?? 0,
  ...item,
  reviews: Array.isArray(item.reviews) ? item.reviews : [],
}));
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
  const response = await apiFetch(`/items/${id}`, {
    method: 'GET',
  });
  // If backend returns { data: {...product} }, extract data
  const item = response.data ?? response;
  return {
    id: item.id,
    image: (item.images && Array.isArray(item.images) && item.images.length > 0)
      ? (item.images[0].startsWith('data:image')
          ? item.images[0]
          : `data:image/jpeg;base64,${item.images[0]}`)
      : '/placeholder.png',
    name: item.name ?? item.brand ?? 'Unknown',
    rating: item.rating ?? 0,
    price: item.price_per_day ?? item.price ?? 0,
    ...item,
    reviews: Array.isArray(item.reviews) ? item.reviews : [],
  };
}

// Interface for review data
export interface ReviewData {
  user: string;
  rating: number;
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
    // Ensure images are base64 (no data:image prefix)
    const safeImages = (reviewData.images || []).map(img => {
      if (img.startsWith('data:image')) {
        // Remove data:image/...;base64, prefix if present
        return img.split(',')[1] || img;
      }
      return img;
    });
    return await apiFetch(`/items/${itemId}/reviews`, {
      method: 'POST',
      body: JSON.stringify({ ...reviewData, images: safeImages }),
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
    
    const res = await apiFetch(endpoint, {
      method: 'GET',
    }, token);
    // Ensure all review images are base64 data URLs for frontend
    if (Array.isArray(res.data)) {
      res.data = res.data.map((review: any) => ({
        ...review,
        // Ensure images are base64 URLs
        images: Array.isArray(review.images)
          ? review.images.filter((img: any) => typeof img === 'string').map((img: string) =>
              typeof img === 'string' && img.startsWith('data:image') ? img : (typeof img === 'string' ? `data:image/jpeg;base64,${img}` : '')
            ).filter(Boolean)
          : [],
        // Ensure review_message and user_full_name fields exist
        review_message: review.review_message ?? review.comment ?? '',
        user_full_name: review.user_full_name ?? review.user ?? 'Anonymous',
      }));
    }
    return res;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch reviews');
  }
}

// Vote helpful on a review
export async function voteReviewHelpful(
  itemId: string | number,
  reviewId: string | number,
  isHelpful: boolean,
  token: string
) {
  try {
    return await apiFetch(`/api/items/${itemId}/reviews/${reviewId}/vote`, {
      method: 'POST',
      body: JSON.stringify({ helpful: isHelpful }),
    }, token);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to vote on review');
  }
}

// Report a review
export async function reportReview(
  itemId: string | number,
  reviewId: string | number,
  reason: string,
  token: string
) {
  try {
    return await apiFetch(`/api/items/${itemId}/reviews/${reviewId}/report`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }, token);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to report review');
  }
}

// Moderate a review (admin only)
export async function moderateReview(
  itemId: string | number,
  reviewId: string | number,
  action: 'approve' | 'reject',
  token: string
) {
  try {
    return await apiFetch(`/api/items/${itemId}/reviews/${reviewId}/moderate`, {
      method: 'POST',
      body: JSON.stringify({ action }),
    }, token);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to moderate review');
  }
}

// Delete a review (user can delete their own, admin can delete any)
export async function deleteReview(
  itemId: string | number,
  reviewId: string | number,
  token: string
) {
  try {
    return await apiFetch(`/api/items/${itemId}/reviews/${reviewId}`, {
      method: 'DELETE',
    }, token);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete review');
  }
}

