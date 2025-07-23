"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Container from '../../components/ui/Container';
import { useAuth } from '../../contexts/AuthContext';
import OverviewTab from './OverviewTab';
import RentalsTab from './RentalsTab';
import PaymentsTab from './PaymentsTab';
import ProfileTab from './ProfileTab';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

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
  const validTabs = ['overview', 'rentals', 'payments', 'profile'] as const;
  type TabKey = typeof validTabs[number];
  const [activeTab, setActiveTab] = React.useState<TabKey>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab && ['overview', 'rentals', 'payments', 'profile'].includes(tab)) {
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
                className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors ${activeTab === 'profile' ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow' : 'text-gray-700 hover:bg-purple-50'}`}
                onClick={() => handleTabChange('profile')}
              >
                Profile
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'overview' && <OverviewTab user={user} handleLogout={handleLogout} />}
            {activeTab === 'rentals' && <RentalsTab />}
            {activeTab === 'payments' && <PaymentsTab />}
            {activeTab === 'profile' && <ProfileTab />}
          </div>
        </div>
      </Container>
    </div>
  );
}
