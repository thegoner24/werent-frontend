"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Container from '../../components/ui/Container';
import { useAuth } from '../../contexts/AuthContext';
import OverviewTab from './OverviewTab';
import RentalsTab from './RentalsTab';
import PaymentsTab from './PaymentsTab';
import ReviewsTab from './ReviewsTab';
import AdminTab from './AdminTab';

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

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, isLoading, refreshProfile } = useAuth();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Refresh profile when accessing dashboard to get latest verification status
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      refreshProfile();
    }
  }, [isAuthenticated, isLoading, refreshProfile]);

  const handleLogout = () => {
    logout();
  };

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

  // Tab navigation via URL
  const validTabs = ['overview', 'rentals', 'payments', 'reviews', 'admin'] as const;
  type TabKey = typeof validTabs[number];
  const [activeTab, setActiveTab] = React.useState<TabKey>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab && ['overview', 'rentals', 'payments', 'reviews', 'admin'].includes(tab)) {
        return tab as TabKey;
      }
    }
    return 'overview';
  });

  // Sync tab with URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab && validTabs.includes(tab as TabKey)) {
      setActiveTab(tab as TabKey);
    }
  }, [typeof window !== 'undefined' ? window.location.search : '']);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    const params = new URLSearchParams(window.location.search);
    params.set('tab', tab);
    const url = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', url);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container>
        <div className="flex flex-col md:flex-row max-w-6xl mx-auto gap-8">
          {/* Side Navigation */}
          <aside className="w-full md:w-64 mb-8 md:mb-0">
            <nav className="bg-white rounded-2xl shadow-lg p-6 flex md:flex-col gap-4 md:gap-0">
              <button
                className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors mb-2 md:mb-0 ${activeTab === 'overview' ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow' : 'text-gray-700 hover:bg-pink-50'}`}
                onClick={() => handleTabChange('overview')}
              >
                Overview
              </button>
              <button
                className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors mb-2 md:mb-0 ${activeTab === 'rentals' ? 'bg-gradient-to-r from-blue-400 to-purple-500 text-white shadow' : 'text-gray-700 hover:bg-blue-50'}`}
                onClick={() => handleTabChange('rentals')}
              >
                My Rentals
              </button>
              <button
                className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors mb-2 md:mb-0 ${activeTab === 'payments' ? 'bg-gradient-to-r from-green-400 to-teal-400 text-white shadow' : 'text-gray-700 hover:bg-green-50'}`}
                onClick={() => handleTabChange('payments')}
              >
                Payment Methods
              </button>
              <button
                className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors mb-2 md:mb-0 ${activeTab === 'reviews' ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white shadow' : 'text-gray-700 hover:bg-orange-50'}`}
                onClick={() => handleTabChange('reviews')}
              >
                My Reviews
              </button>
              {user.is_admin && (
                <button
                  className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors mb-2 md:mb-0 ${activeTab === 'admin' ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow' : 'text-gray-700 hover:bg-purple-50'}`}
                  onClick={() => handleTabChange('admin')}
                >
                  Admin Panel
                </button>
              )}
              <Link 
                href="/dashboard/profile"
                className="w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors text-gray-700 hover:bg-purple-50 block"
              >
                Profile
              </Link>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'overview' && <OverviewTab user={user} handleLogout={handleLogout} />}
            {activeTab === 'rentals' && <RentalsTab />}
            {activeTab === 'payments' && <PaymentsTab />}
            {activeTab === 'reviews' && <ReviewsTab user={user} />}
            {activeTab === 'admin' && user.is_admin && <AdminTab user={user} />}
          </div>
        </div>
      </Container>
    </div>
  );
}
