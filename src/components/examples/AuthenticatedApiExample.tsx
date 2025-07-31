"use client";

import React, { useState, useEffect } from 'react';
import { useAuthenticatedApi } from '../../hooks/useAuthenticatedApi';
import { getProfileAuthenticated, updateProfileAuthenticated, UpdateProfilePayload } from '../../api/profile';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Example component demonstrating how to use the authenticated API middleware
 * This component shows three different approaches:
 * 1. Using the useAuthenticatedApi hook
 * 2. Using the authenticated API functions directly
 * 3. Using the AuthContext refresh method
 */
export default function AuthenticatedApiExample() {
  const { user, isAuthenticated, refreshAccessToken } = useAuth();
  const api = useAuthenticatedApi();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Example 1: Using the useAuthenticatedApi hook
  const handleApiHookExample = async () => {
    if (!isAuthenticated) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      // This will automatically handle token refresh if needed
      const response = await api.get('/api/auth/profile');
      setMessage(`Profile fetched successfully: ${response.data.user.email}`);
    } catch (err) {
      setError(`API Hook Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Example 2: Using authenticated API functions directly
  const handleDirectApiExample = async () => {
    if (!isAuthenticated) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      // This will automatically handle token refresh if needed
      const response = await getProfileAuthenticated();
      setMessage(`Profile fetched directly: ${response.data.user.email}`);
    } catch (err) {
      setError(`Direct API Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Example 3: Manual token refresh
  const handleManualRefresh = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const newToken = await refreshAccessToken();
      if (newToken) {
        setMessage('Token refreshed successfully');
      } else {
        setError('Failed to refresh token');
      }
    } catch (err) {
      setError(`Refresh Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Example 4: Update profile with automatic token refresh
  const handleUpdateProfile = async () => {
    if (!isAuthenticated || !user) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const updatePayload: UpdateProfilePayload = {
        first_name: user.first_name,
        last_name: user.last_name,
        phone_number: user.phone_number || '',
      };

      const response = await updateProfileAuthenticated(updatePayload);
      setMessage(`Profile updated successfully: ${response.data.user.email}`);
    } catch (err) {
      setError(`Update Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
          Authentication Required
        </h3>
        <p className="text-yellow-700">
          Please log in to see the authenticated API examples.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Authenticated API Middleware Examples
      </h2>
      
      <div className="space-y-4">
        {/* Status Messages */}
        {message && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800">{message}</p>
          </div>
        )}
        
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Example Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleApiHookExample}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Test API Hook'}
          </button>

          <button
            onClick={handleDirectApiExample}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Test Direct API'}
          </button>

          <button
            onClick={handleManualRefresh}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Manual Token Refresh'}
          </button>

          <button
            onClick={handleUpdateProfile}
            disabled={loading}
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Update Profile'}
          </button>
        </div>

        {/* Documentation */}
        <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            How to Use the Authentication Middleware
          </h3>
          
          <div className="space-y-3 text-sm text-gray-700">
            <div>
              <h4 className="font-medium text-gray-900">Method 1: useAuthenticatedApi Hook</h4>
              <p>Use the custom hook for convenient API calls with automatic token refresh.</p>
              <code className="block mt-1 p-2 bg-gray-100 rounded text-xs">
                {`const api = useAuthenticatedApi();
const response = await api.get('/api/endpoint');`}
              </code>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900">Method 2: Direct Authenticated Functions</h4>
              <p>Use the authenticated versions of API functions that handle token refresh automatically.</p>
              <code className="block mt-1 p-2 bg-gray-100 rounded text-xs">
                {`import { getProfileAuthenticated } from '../api/profile';
const response = await getProfileAuthenticated();`}
              </code>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900">Method 3: Manual Token Refresh</h4>
              <p>Manually refresh tokens using the AuthContext method.</p>
              <code className="block mt-1 p-2 bg-gray-100 rounded text-xs">
                {`const { refreshAccessToken } = useAuth();
const newToken = await refreshAccessToken();`}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}