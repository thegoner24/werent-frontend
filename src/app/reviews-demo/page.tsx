'use client';

import React, { useState } from 'react';
import Reviews, { Review } from '@/components/Reviews';

// Mock reviews data with enhanced features
const mockReviews: Review[] = [
  {
    id: "1",
    user: "Sarah Johnson",
    rating: 5,
    comment: "Absolutely stunning! This gown was perfect for my wedding reception. The quality is exceptional and it fit like a dream.",
    date: "2024-01-15",
    helpful: 12,
    reported: false,
    moderated: false
  },
  {
    id: "2",
    user: "Emma Davis",
    rating: 4,
    comment: "Beautiful dress, great quality fabric. Shipping was a bit slow but worth the wait.",
    date: "2024-01-10",
    helpful: 8,
    reported: false,
    moderated: false
  },
  {
    id: "3",
    user: "Maria Rodriguez",
    rating: 5,
    comment: "Wore this to a charity gala and received so many compliments! The design is timeless.",
    date: "2024-01-08",
    helpful: 15,
    reported: false,
    moderated: false
  },
  {
    id: "4",
    user: "Jennifer Smith",
    rating: 4,
    comment: "Excellent rental experience. The dress was in perfect condition and the alterations were spot on.",
    date: "2024-01-05",
    helpful: 6,
    reported: false,
    moderated: false
  },
  {
    id: "5",
    user: "Amanda Wilson",
    rating: 5,
    comment: "This gown made me feel like a princess! The attention to detail is incredible.",
    date: "2024-01-02",
    helpful: 20,
    reported: false,
    moderated: false
  },
  {
    id: "6",
    user: "Lisa Thompson",
    rating: 3,
    comment: "The dress was okay, but the sizing was a bit off. Customer service was helpful though.",
    date: "2023-12-28",
    helpful: 3,
    reported: false,
    moderated: true
  },
  {
    id: "7",
    user: "Rachel Green",
    rating: 5,
    comment: "Perfect for my engagement party! The dress exceeded my expectations.",
    date: "2023-12-25",
    helpful: 18,
    reported: false,
    moderated: false
  },
  {
    id: "8",
    user: "Michelle Brown",
    rating: 4,
    comment: "Lovely dress, very elegant. Would definitely rent again for special occasions.",
    date: "2023-12-20",
    helpful: 9,
    reported: false,
    moderated: false
  }
];

export default function ReviewsDemo() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [activeTab, setActiveTab] = useState<'basic' | 'with-form' | 'no-reviews' | 'admin'>('basic');
  const [isAdmin, setIsAdmin] = useState(false);

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
        <div className="flex flex-wrap gap-4 mb-8">
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
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'admin' 
                ? 'bg-[#ff6b98] text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Admin View
          </button>
          <button
            onClick={() => setIsAdmin(!isAdmin)}
            className={`px-3 py-2 text-sm rounded-md border ${
              isAdmin 
                ? 'bg-green-600 text-white border-green-600' 
                : 'bg-gray-100 text-gray-700 border-gray-300'
            }`}
          >
            {isAdmin ? 'Admin Mode: ON' : 'Admin Mode: OFF'}
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
          {activeTab === 'admin' && (
            <Reviews 
              reviews={reviews}
              title="Customer Reviews (Admin View)"
              showFilters={true}
              showSubmitForm={true}
              reviewsPerPage={5}
              onSubmitReview={handleSubmitReview}
              onVoteHelpful={async (reviewId, isHelpful) => {
                console.log('Admin vote helpful:', { reviewId, isHelpful });
                alert(`Admin marked review as ${isHelpful ? 'helpful' : 'not helpful'}`);
              }}
              onReportReview={async (reviewId, reason) => {
                console.log('Admin report review:', { reviewId, reason });
                alert('Review reported by admin!');
              }}
              onModerateReview={async (reviewId, action) => {
                console.log('Admin moderate review:', { reviewId, action });
                alert(`Review ${action}ed by admin!`);
              }}
              isAdmin={isAdmin}
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
                <li>• Helpful vote counts</li>
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
              <h3 className="font-medium text-gray-900 mb-2">Review Management</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Pagination (3 reviews per page by default)</li>
                <li>• Helpful voting system</li>
                <li>• Review reporting with reasons</li>
                <li>• Admin moderation controls</li>
                <li>• Moderation status indicators</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Filtering & Sorting</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Filter by rating (all, 5 stars, 4+, 3+)</li>
                <li>• Sort by date, rating, and helpfulness</li>
                <li>• Review count display</li>
                <li>• Rating distribution chart</li>
                <li>• Page navigation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 