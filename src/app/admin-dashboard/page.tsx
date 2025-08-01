"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/ui/Container';
import Link from 'next/link';
import ProductsTab from './ProductsTab';
import CategoriesTab from './CategoriesTab';
import BrandsTab from './BrandsTab';
import ReviewsTab from './ReviewsTab';
import BookingsTab, { BookingsTabRef } from './BookingsTab';

export default function AdminDashboard() {
  const router = useRouter();
  const bookingsTabRef = useRef<BookingsTabRef>(null);
  
  // State for active tab
  const [activeTab, setActiveTab] = useState('reviews');
  
  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    // Refresh bookings data when bookings tab is activated
    if (tab === 'bookings' && bookingsTabRef.current) {
      bookingsTabRef.current.refreshBookings();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with background gradient */}
      <div className="relative h-32 flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-500">
        <div className="absolute inset-0 opacity-20">
          {/* Pattern overlay */}
          <div className="absolute inset-0" style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
          }} />
        </div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-3xl font-bold mb-2 drop-shadow-lg">Admin Dashboard</h1>
          <div className="text-sm opacity-90">
            <Link href="/" className="hover:underline">Home</Link> / <span>Admin</span>
          </div>
        </div>
      </div>
      
      <Container className="py-8">
        <div className="flex flex-col md:flex-row max-w-6xl mx-auto gap-8">
          {/* Side Navigation */}
          <aside className="w-full md:w-64 mb-8 md:mb-0">
            <nav className="bg-white rounded-2xl shadow-lg p-6 flex md:flex-col gap-4 md:gap-0">
              <button
                className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors mb-2 md:mb-0 ${activeTab === 'reviews' ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow' : 'text-gray-700 hover:bg-pink-50'}`}
                onClick={() => handleTabChange('reviews')}
              >
                Reviews
              </button>
              <button
                className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors mb-2 md:mb-0 ${activeTab === 'products' ? 'bg-gradient-to-r from-blue-400 to-purple-500 text-white shadow' : 'text-gray-700 hover:bg-blue-50'}`}
                onClick={() => handleTabChange('products')}
              >
                Products
              </button>
              <button
                className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors mb-2 md:mb-0 ${activeTab === 'categories' ? 'bg-gradient-to-r from-green-400 to-teal-400 text-white shadow' : 'text-gray-700 hover:bg-green-50'}`}
                onClick={() => handleTabChange('categories')}
              >
                Categories
              </button>
              <button
                className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors mb-2 md:mb-0 ${activeTab === 'brands' ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow' : 'text-gray-700 hover:bg-purple-50'}`}
                onClick={() => handleTabChange('brands')}
              >
                Brands
              </button>
              <button
                className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors mb-2 md:mb-0 ${activeTab === 'bookings' ? 'bg-gradient-to-r from-orange-400 to-red-400 text-white shadow' : 'text-gray-700 hover:bg-orange-50'}`}
                onClick={() => handleTabChange('bookings')}
              >
                Bookings
              </button>
              <button
                className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors ${activeTab === 'settings' ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow' : 'text-gray-700 hover:bg-gray-50'}`}
                onClick={() => handleTabChange('settings')}
              >
                Settings
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'reviews' && <ReviewsTab />}
            {activeTab === 'products' && <ProductsTab />}
            {activeTab === 'categories' && <CategoriesTab />}
            {activeTab === 'brands' && <BrandsTab />}
            {activeTab === 'bookings' && <BookingsTab ref={bookingsTabRef} />}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Settings</h2>
                <p className="text-gray-600">Settings functionality will be implemented here.</p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
