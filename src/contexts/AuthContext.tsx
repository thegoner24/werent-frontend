"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getProfile } from '../api/profile';
import { getValidAccessToken } from '../utils/authMiddleware';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  profile_image?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  is_admin?: boolean;
  is_verified?: boolean;
  uuid?: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  updateUser: (userData: User) => void;
  refreshProfile: () => Promise<void>;
  refreshAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedAccessToken = localStorage.getItem('access_token');
      const storedRefreshToken = localStorage.getItem('refresh_token');

      if (storedUser && storedAccessToken && storedRefreshToken) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
      }
    } catch (error) {
      console.error('Error loading auth state from localStorage:', error);
      // Clear corrupted data
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (userData: User, accessToken: string, refreshToken: string) => {
    setUser(userData);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    
    // Store in localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  };

  const logout = useCallback(() => {
    // Clear all authentication data first
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    
    // Update state (this might cause a brief warning in dev mode, but it's safe to ignore)
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    
    // Use a small delay to ensure state updates are processed
    // before forcing a full page reload
    setTimeout(() => {
      // Redirect to home page with a full page reload
      // This ensures a clean state and avoids any React warnings
      window.location.href = '/';
    }, 50);
  }, []);

  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const refreshProfile = useCallback(async () => {
    if (!accessToken) {
      return;
    }

    try {
      const response = await getProfile(accessToken);
      if (response.success && response.data.user) {
        updateUser(response.data.user);
      }
    } catch (error) {
      console.error('Failed to refresh profile:', error);
      // Don't throw error to avoid breaking the UI
      // The user will continue with their cached profile data
    }
  }, [accessToken]);

  const refreshAccessTokenMethod = useCallback(async (): Promise<string | null> => {
    try {
      const newAccessToken = await getValidAccessToken();
      if (newAccessToken) {
        setAccessToken(newAccessToken);
        return newAccessToken;
      } else {
        // If refresh failed, logout user
        logout();
        return null;
      }
    } catch (error) {
      console.error('Failed to refresh access token:', error);
      logout();
      return null;
    }
  }, []);

  const isAuthenticated = !!user && !!accessToken;

  const value: AuthContextType = {
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
    refreshProfile,
    refreshAccessToken: refreshAccessTokenMethod,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
