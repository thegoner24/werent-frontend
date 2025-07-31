import { apiFetch } from './index';

// Interface for testimonial image
export interface TestimonialImage {
  created_at: string;
  id: number;
  image_base64: string;
  item_id: number | null;
}

// Interface for testimonial data from API
export interface TestimonialData {
  created_at: string;
  id: number;
  images: TestimonialImage[];
  item_id: number;
  rating: number;
  review_message: string;
  user_id: number;
  user_full_name: string;
}

export interface TestimonialResponse {
  data: TestimonialData[];
  message: string;
  success: boolean;
}

// Fetch testimonials from backend API
export async function fetchTestimonials(): Promise<TestimonialResponse> {
  return await apiFetch('/testimonial', {
    method: 'GET',
  });
}
