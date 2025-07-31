import { apiFetch, endpoints } from './index';

export interface BookingPayload {
  item_id: number;
  start_date: string; // Format: YYYY-MM-DD
  end_date: string; // Format: YYYY-MM-DD
}

export interface BookingResponse {
  id: number;
  item_id: number;
  user_id: number;
  start_date: string;
  end_date: string;
  total_price: number;
  is_paid: boolean;
  status: string;
  quantity: number;
  item_name?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Create a new booking
 * @param payload The booking data to be sent
 * @param token The user's authentication token
 * @returns The created booking
 */
export async function createBooking(payload: BookingPayload, token: string): Promise<BookingResponse> {
  try {
    console.log('Creating booking with endpoint:', endpoints.bookings);
    console.log('Booking payload:', payload);
    
    // Validate payload
    if (!payload.item_id || !payload.start_date || !payload.end_date) {
      throw new Error('Missing required booking information');
    }

    // Ensure dates are in correct format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(payload.start_date) || !dateRegex.test(payload.end_date)) {
      throw new Error('Invalid date format. Use YYYY-MM-DD');
    }
    
    // Ensure we're using the correct endpoint and method
    const response = await apiFetch(endpoints.bookings, {
      method: 'POST',
      body: JSON.stringify(payload)
    }, token);
    
    console.log('Booking API response:', response);
    
    // Handle both response formats (direct or nested in data property)
    const bookingData = response.data || response;
    
    // Validate response data
    if (!bookingData.id) {
      throw new Error('Invalid booking response from server');
    }
    
    return bookingData;
  } catch (error) {
    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error creating booking:', errorMessage);
    
    // Log additional details about the error
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }
    
    throw error;
  }
}

/**
 * Get all bookings for the current user
 * @param token The user's authentication token
 * @returns Array of user's bookings
 */
export async function getUserBookings(token: string): Promise<BookingResponse[]> {
  try {
    const response = await apiFetch(`${endpoints.bookings}user`, {
      method: 'GET',
    }, token);
    
    return response.data || response;
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
}

/**
 * Get bookings for a specific user by user ID
 * @param userId The ID of the user
 * @param token The authentication token
 * @returns Array of user's bookings
 */
export async function getUserBookingsByUserId(userId: number, token: string): Promise<BookingResponse[]> {
  try {
    const response = await apiFetch(`${endpoints.bookings}user/${userId}`, {
      method: 'GET',
    }, token);
    
    // The API returns { data: [...], message: "...", success: true }
    return response.data || [];
  } catch (error) {
    console.error(`Error fetching bookings for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Get a specific booking by ID
 * @param id The ID of the booking to fetch
 * @param token The user's authentication token
 * @returns The booking details
 */
export async function getBookingById(id: number, token: string): Promise<BookingResponse> {
  try {
    const response = await apiFetch(`${endpoints.bookings}${id}`, {
      method: 'GET',
    }, token);
    
    return response.data || response;
  } catch (error) {
    console.error(`Error fetching booking with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Cancel a booking
 * @param id The ID of the booking to cancel
 * @param token The user's authentication token
 * @returns The updated booking
 */
export async function cancelBooking(id: number, token: string): Promise<BookingResponse> {
  try {
    const response = await apiFetch(`${endpoints.bookings}${id}/cancel`, {
      method: 'PUT',
    }, token);
    
    return response.data || response;
  } catch (error) {
    console.error(`Error cancelling booking with ID ${id}:`, error);
    throw error;
  }
}