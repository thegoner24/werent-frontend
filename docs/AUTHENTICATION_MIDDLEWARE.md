# Authentication Middleware Documentation

This document describes the implementation and usage of the automatic token refresh middleware for the WeRent frontend application.

## Overview

The authentication middleware provides automatic JWT token refresh functionality to ensure seamless user experience without requiring manual re-authentication when access tokens expire.

## Features

- **Automatic Token Refresh**: Automatically refreshes expired access tokens using refresh tokens
- **Concurrent Request Handling**: Prevents multiple simultaneous refresh attempts
- **Error Handling**: Gracefully handles refresh failures and redirects to login
- **TypeScript Support**: Fully typed interfaces and functions
- **React Integration**: Custom hooks and context integration
- **Fallback Mechanisms**: Maintains backward compatibility with existing token-based APIs

## Architecture

### Core Components

1. **Token Refresh API** (`src/api/refresh.ts`)
   - Handles the actual token refresh API call
   - Interfaces for request/response types

2. **Authentication Middleware** (`src/utils/authMiddleware.ts`)
   - Core middleware logic for token validation and refresh
   - Enhanced fetch functions with automatic retry
   - Token expiration checking utilities

3. **React Hook** (`src/hooks/useAuthenticatedApi.ts`)
   - Convenient React hook for authenticated API calls
   - Provides common HTTP methods (GET, POST, PUT, PATCH, DELETE)

4. **Enhanced AuthContext** (`src/contexts/AuthContext.tsx`)
   - Integrated token refresh method
   - State management for authentication

## Usage Examples

### Method 1: Using the useAuthenticatedApi Hook (Recommended)

```typescript
import { useAuthenticatedApi } from '../hooks/useAuthenticatedApi';

function MyComponent() {
  const api = useAuthenticatedApi();

  const fetchData = async () => {
    try {
      // Automatically handles token refresh if needed
      const response = await api.get('/api/user/profile');
      console.log(response.data);
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  const updateData = async (data) => {
    try {
      const response = await api.post('/api/user/update', data);
      console.log('Updated:', response.data);
    } catch (error) {
      console.error('Update Error:', error);
    }
  };

  return (
    <div>
      <button onClick={fetchData}>Fetch Data</button>
      <button onClick={() => updateData({ name: 'John' })}>Update Data</button>
    </div>
  );
}
```

### Method 2: Using Authenticated API Functions

```typescript
import { getProfileAuthenticated, updateProfileAuthenticated } from '../api/profile';

function ProfileComponent() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        // Automatically handles token refresh
        const response = await getProfileAuthenticated();
        setProfile(response.data.user);
      } catch (error) {
        console.error('Failed to load profile:', error);
      }
    };

    loadProfile();
  }, []);

  const handleUpdate = async (updateData) => {
    try {
      const response = await updateProfileAuthenticated(updateData);
      setProfile(response.data.user);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <div>
      {profile && (
        <div>
          <h2>{profile.first_name} {profile.last_name}</h2>
          <p>{profile.email}</p>
        </div>
      )}
    </div>
  );
}
```

### Method 3: Manual Token Refresh

```typescript
import { useAuth } from '../contexts/AuthContext';

function ManualRefreshComponent() {
  const { refreshAccessToken, logout } = useAuth();

  const handleManualRefresh = async () => {
    try {
      const newToken = await refreshAccessToken();
      if (newToken) {
        console.log('Token refreshed successfully');
      } else {
        console.log('Refresh failed, user logged out');
      }
    } catch (error) {
      console.error('Refresh error:', error);
    }
  };

  return (
    <button onClick={handleManualRefresh}>
      Refresh Token
    </button>
  );
}
```

## API Reference

### `useAuthenticatedApi()` Hook

Returns an object with the following methods:

- `get(endpoint: string)`: Make a GET request
- `post(endpoint: string, data?: any)`: Make a POST request
- `put(endpoint: string, data?: any)`: Make a PUT request
- `patch(endpoint: string, data?: any)`: Make a PATCH request
- `delete(endpoint: string)`: Make a DELETE request
- `apiRequest(endpoint: string, options: RequestInit)`: Make a custom request
- `isAuthenticated: boolean`: Current authentication status

### `getValidAccessToken()` Function

Utility function that:
- Checks if the current access token is valid
- Automatically refreshes if expired but refresh token is valid
- Returns `null` if both tokens are expired or invalid

### `authenticatedFetch()` Function

Enhanced fetch function that:
- Automatically adds authorization headers
- Handles token refresh on 401 responses
- Redirects to login on authentication failure

## Error Handling

### Token Expiration Flow

1. **Access Token Valid**: Request proceeds normally
2. **Access Token Expired, Refresh Token Valid**: 
   - Automatically refreshes access token
   - Retries original request with new token
   - Updates localStorage with new token
3. **Both Tokens Expired**: 
   - Clears authentication data
   - Redirects to login page
   - Throws authentication error

### Error Types

- **Authentication Failed**: Both tokens are invalid or refresh failed
- **Network Error**: Request failed due to network issues
- **API Error**: Server returned an error response
- **Validation Error**: Request data validation failed

## Security Considerations

### Token Storage
- Access tokens are stored in localStorage
- Refresh tokens are stored in localStorage
- Tokens are cleared on logout or authentication failure

### Token Validation
- JWT tokens are decoded to check expiration
- Invalid tokens are treated as expired
- Refresh attempts are limited to prevent infinite loops

### Concurrent Requests
- Multiple simultaneous requests share the same refresh promise
- Prevents race conditions during token refresh
- Ensures only one refresh request is made at a time

## Best Practices

### For Developers

1. **Use the Hook**: Prefer `useAuthenticatedApi()` for new components
2. **Error Handling**: Always wrap API calls in try-catch blocks
3. **Loading States**: Show loading indicators during API calls
4. **Fallback UI**: Provide fallback UI for authentication failures

### For API Integration

1. **Consistent Endpoints**: Use consistent API endpoint patterns
2. **Error Responses**: Ensure API returns proper error codes
3. **Token Format**: Maintain consistent JWT token format
4. **Refresh Endpoint**: Ensure refresh endpoint is reliable

## Migration Guide

### From Manual Token Management

**Before:**
```typescript
const token = localStorage.getItem('access_token');
const response = await apiFetch('/api/profile', { method: 'GET' }, token);
```

**After:**
```typescript
const api = useAuthenticatedApi();
const response = await api.get('/api/profile');
```

### From Direct API Calls

**Before:**
```typescript
const response = await getProfile(accessToken);
```

**After:**
```typescript
const response = await getProfileAuthenticated();
```

## Troubleshooting

### Common Issues

1. **Infinite Refresh Loop**: Check refresh token expiration
2. **401 Errors**: Verify API endpoint authentication requirements
3. **Network Errors**: Check API server availability
4. **CORS Issues**: Ensure proper CORS configuration

### Debug Tips

1. Check browser console for authentication logs
2. Verify token expiration times in JWT payload
3. Monitor network requests in browser dev tools
4. Check localStorage for token presence

## Testing

### Unit Tests
- Test token expiration logic
- Test refresh functionality
- Test error handling scenarios

### Integration Tests
- Test API calls with expired tokens
- Test concurrent request handling
- Test authentication flow

### Manual Testing
- Test with expired access tokens
- Test with expired refresh tokens
- Test network failure scenarios

## Performance Considerations

- Token validation is performed client-side to avoid unnecessary API calls
- Refresh requests are deduplicated to prevent multiple simultaneous calls
- Failed refresh attempts clear authentication data immediately
- Automatic logout prevents unnecessary retry attempts

## Future Enhancements

- Token refresh scheduling based on expiration time
- Offline token validation
- Enhanced error reporting and analytics
- Token refresh retry with exponential backoff