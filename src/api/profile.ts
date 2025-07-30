import { apiFetch, endpoints } from './index';

export interface UpdateProfilePayload {
  first_name: string;
  last_name: string;
  phone_number: string;
  profile_image?: string;
}

export interface UpdateProfileResponse {
  data: {
    user: {
      id: number;
      email: string;
      first_name: string;
      last_name: string;
      phone_number: string;
      profile_image?: string;
      created_at: string;
      updated_at: string;
      is_active: boolean;
      is_admin?: boolean;
      is_verified?: boolean;
      uuid?: string;
    };
  };
  message: string;
  success: boolean;
}

export async function updateProfile(payload: UpdateProfilePayload, token: string): Promise<UpdateProfileResponse> {
  return apiFetch(endpoints.profile, {
    method: 'PUT',
    body: JSON.stringify(payload),
  }, token);
}
