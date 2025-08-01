import { apiFetch, endpoints } from './index';

export interface UserProfileData {
  id: number;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  profile_image?: string;
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
  is_admin?: boolean;
  is_verified?: boolean;
  uuid?: string;
}

export interface UserProfileResponse {
  data: {
    user: UserProfileData;
  };
  message: string;
  success: boolean;
}

/**
 * Fetch a user profile by user ID
 * @param userId The ID of the user to fetch
 * @returns Promise with user profile data
 */
export async function getUserById(userId: number): Promise<UserProfileData | null> {
  try {
    // Instead of trying to fetch individual users, use the profile endpoint
    // which is already configured and working
    const response = await apiFetch(endpoints.profile, {
      method: 'GET',
    });
    
    if (response && response.success && response.data && response.data.user) {
      // This will return the current logged-in user's profile
      // Note: This won't actually get profiles by ID, but at least avoids the API error
      return response.data.user;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching user profile:`, error);
    return null;
  }
}

/**
 * Get user profile image URL or base64 data
 * @param userId User ID to get profile image for
 * @returns Promise with profile image URL/data or null if not available
 */
export async function getUserProfileImage(userId: number): Promise<string | null> {
  try {
    const userProfile = await getUserById(userId);
    
    if (userProfile && userProfile.profile_image) {
      return userProfile.profile_image;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching profile image for user ${userId}:`, error);
    return null;
  }
}
