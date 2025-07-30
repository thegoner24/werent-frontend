"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Container from '../../../components/ui/Container';
import { useAuth } from '../../../contexts/AuthContext';
import ProfileTab from '../ProfileTab';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with gradient background */}
      <div className="h-32 bg-gradient-to-r from-purple-600 to-pink-500">
        <Container className="h-full flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
            <p className="text-sm opacity-90 mt-1">Manage your account information</p>
          </div>
        </Container>
      </div>
      
      <Container className="py-8">
        <div className="max-w-4xl mx-auto">
          <ProfileTab />
        </div>
      </Container>
    </div>
  );
}
