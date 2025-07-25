'use client';

import React, { useState } from 'react';
import Reviews, { Review } from '@/components/Reviews';

// Mock reviews data
const mockReviews: Review[] = [
  {
    user: "Sarah Johnson",
    rating: 5,
    comment: "Absolutely stunning! This gown was perfect for my wedding reception. The quality is exceptional and it fit like a dream.",
    date: "2024-01-15"
  },
  {
    user: "Emma Davis",
    rating: 4,
    comment: "Beautiful dress, great quality fabric. Shipping was a bit slow but worth the wait.",
    date: "2024-01-10"
  },
  {
    user: "Maria Rodriguez",
    rating: 5,
    comment: "Wore this to a charity gala and received so many compliments! The design is timeless.",
    date: "2024-01-08"
  },
  {
    user: "Jennifer Smith",
    rating: 4,
    comment: "Excellent rental experience. The dress was in perfect condition and the alterations were spot on.",
    date: "2024-01-05"
  },
  {
    user: "Amanda Wilson",
    rating: 5,
    comment: "This gown made me feel like a princess! The attention to detail is incredible.",
    date: "2024-01-02"
  }
];

export default function ReviewsDemo() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [activeTab, setActiveTab] = useState<'basic' | 'with-form' | 'no-reviews'>('basic');

  const handleSubmitReview = async (reviewData: Omit<Review, 'date'>) => {
    const newReview: Review = {
      ...reviewData,
      date: new Date().toISOString().split('T')[0]
    };
    
    setReviews(prev => [newReview, ...prev]);
    alert('Review submitted successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Reviews Component Demo</h1>
        
        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('basic')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'basic' 
                ? 'bg-[#ff6b98] text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Basic Reviews
          </button>
          <button
            onClick={() => setActiveTab('with-form')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'with-form' 
                ? 'bg-[#ff6b98] text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            With Review Form
          </button>
          <button
            onClick={() => setActiveTab('no-reviews')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'no-reviews' 
                ? 'bg-[#ff6b98] text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            No Reviews
          </button>
        </div>

        {/* Demo Content */}
        <div className="bg-white rounded-lg shadow-lg">
          {activeTab === 'basic' && (
            <Reviews 
              reviews={reviews}
              title="Customer Reviews"
              showFilters={true}
              showSubmitForm={false}
            />
          )}
          
          {activeTab === 'with-form' && (
            <Reviews 
              reviews={reviews}
              title="Customer Reviews"
              showFilters={true}
              showSubmitForm={true}
              onSubmitReview={handleSubmitReview}
            />
          )}
          
          {activeTab === 'no-reviews' && (
            <Reviews 
              reviews={[]}
              title="Customer Reviews"
              showFilters={true}
              showSubmitForm={true}
              onSubmitReview={handleSubmitReview}
            />
          )}
        </div>

        {/* Component Features */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Component Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Review Display</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Star ratings with hover effects</li>
                <li>• User avatars with initials</li>
                <li>• Review dates and comments</li>
                <li>• Responsive design</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Review Submission</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Interactive star rating selection</li>
                <li>• Form validation</li>
                <li>• Loading states</li>
                <li>• Customizable submission handler</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Filtering & Sorting</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Filter by rating (all, 5 stars, 4+, 3+)</li>
                <li>• Sort by date and rating</li>
                <li>• Review count display</li>
                <li>• Rating distribution chart</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Customization</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Optional review form</li>
                <li>• Optional filters</li>
                <li>• Custom titles</li>
                <li>• Custom CSS classes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 