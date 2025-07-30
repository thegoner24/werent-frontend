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

