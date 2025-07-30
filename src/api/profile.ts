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

export interface GetProfileResponse {
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

export interface ValidationErrorResponse {
  details: {
    field_errors: {
      [key: string]: string[];
    };
  };
  error: string;
  error_code: string;
  success: false;
}

export class ProfileValidationError extends Error {
  public fieldErrors: { [key: string]: string[] };
  
  constructor(response: ValidationErrorResponse) {
    super(response.error);
    this.name = 'ProfileValidationError';
    this.fieldErrors = response.details.field_errors;
  }
}

export async function getProfile(token: string): Promise<GetProfileResponse> {
  return await apiFetch(endpoints.profile, {
    method: 'GET',
  }, token);
}

export async function updateProfile(payload: UpdateProfilePayload, token: string): Promise<UpdateProfileResponse> {
  try {
    return await apiFetch(endpoints.profile, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }, token);
  } catch (error) {
    // Try to parse as validation error
    try {
      const errorText = error instanceof Error ? error.message : String(error);
      const errorData = JSON.parse(errorText);
      
      if (errorData.error_code === 'VALIDATION_ERROR' && errorData.details?.field_errors) {
        throw new ProfileValidationError(errorData);
      }
    } catch (parseError) {
      // If parsing fails, fall through to original error
    }
    
    // Re-throw original error if not a validation error
    throw error;
  }
}
