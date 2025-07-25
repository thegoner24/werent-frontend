'use client';

import React, { useState } from 'react';
import Reviews from '@/components/Reviews';
import { Review } from '@/components/Reviews';

// Mock reviews with enhanced data
const mockReviews: Review[] = [
  {
    id: "1",
    user: "Sarah Johnson",
    rating: 5,
    comment: "Absolutely stunning! This gown was perfect for my wedding reception. The quality is exceptional and it fit like a dream.",
    date: "2024-01-15",
    helpful: 12,
    reported: false,
    moderated: false,
    userId: 1,
    userEmail: "sarah.johnson@email.com",
    verifiedPurchase: true,
    purchaseDate: "2024-01-10",
    orderId: "ORD-2024-001",
    photos: [
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=300&fit=crop"
    ],
    productId: "1",
    productName: "Elegant Wedding Gown",
    helpfulVotes: ["2", "3", "4"],
    reportedBy: []
  },
  {
    id: "2",
    user: "Michael Chen",
    rating: 4,
    comment: "Beautiful cocktail dress for my corporate event. Great quality fabric and perfect fit.",
    date: "2024-01-10",
    helpful: 8,
    reported: false,
    moderated: false,
    userId: 2,
    userEmail: "michael.chen@email.com",
    verifiedPurchase: true,
    purchaseDate: "2024-01-05",
    orderId: "ORD-2024-002",
    videos: [
      "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
    ],
    productId: "1",
    productName: "Elegant Wedding Gown",
    helpfulVotes: ["1", "5"],
    reportedBy: []
  },
  {
    id: "3",
    user: "Emma Wilson",
    rating: 5,
    comment: "Incredible experience! The dress exceeded my expectations and I received so many compliments.",
    date: "2024-01-05",
    helpful: 15,
    reported: false,
    moderated: false,
    userId: 3,
    userEmail: "emma.wilson@email.com",
    verifiedPurchase: true,
    purchaseDate: "2024-01-01",
    orderId: "ORD-2024-003",
    photos: [
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=300&fit=crop"
    ],
    videos: [
      "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
    ],
    productId: "1",
    productName: "Elegant Wedding Gown",
    helpfulVotes: ["1", "2", "4", "5"],
    reportedBy: []
  },
  {
    id: "4",
    user: "Anonymous",
    rating: 3,
    comment: "The dress was okay, but the sizing was a bit off. Customer service was helpful though.",
    date: "2023-12-28",
    helpful: 3,
    reported: false,
    moderated: false,
    verifiedPurchase: false,
    productId: "1",
    productName: "Elegant Wedding Gown",
    helpfulVotes: ["6"],
    reportedBy: []
  },
  {
    id: "5",
    user: "Lisa Rodriguez",
    rating: 5,
    comment: "Perfect for my engagement party! The dress was exactly what I was looking for.",
    date: "2023-12-20",
    helpful: 18,
    reported: false,
    moderated: false,
    userId: 5,
    userEmail: "lisa.rodriguez@email.com",
    verifiedPurchase: true,
    purchaseDate: "2023-12-15",
    orderId: "ORD-2023-045",
    photos: [
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=300&fit=crop"
    ],
    productId: "1",
    productName: "Elegant Wedding Gown",
    helpfulVotes: ["1", "2", "3", "4", "6"],
    reportedBy: []
  }
];

export default function ReviewIntegrationDemo() {
  const [activeTab, setActiveTab] = useState('basic');
  const [isAdmin, setIsAdmin] = useState(false);

  const handleSubmitReview = async (reviewData: Omit<Review, 'date'>) => {
    console.log('Review submitted:', reviewData);
    alert('Review submitted successfully! (Check console for details)');
  };

  const handleVoteHelpful = async (reviewId: string, isHelpful: boolean) => {
    console.log('Vote helpful:', { reviewId, isHelpful });
    alert(`Marked review as ${isHelpful ? 'helpful' : 'not helpful'}`);
  };

  const handleReportReview = async (reviewId: string, reason: string) => {
    console.log('Report review:', { reviewId, reason });
    alert('Review reported successfully! Our team will review it.');
  };

  const handleModerateReview = async (reviewId: string, action: 'approve' | 'reject') => {
    console.log('Moderate review:', { reviewId, action });
    alert(`Review ${action}ed successfully!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Review Integration Demo
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Showcasing user accounts, verification, and media features
          </p>
          
          {/* Admin Toggle */}
          <div className="flex justify-center mb-6">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="rounded border-gray-300 text-[#ff6b98] focus:ring-[#ff6b98]"
              />
              <span className="text-sm font-medium text-gray-700">Admin Mode</span>
            </label>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('basic')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'basic'
                ? 'bg-[#ff6b98] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Basic Reviews
          </button>
          <button
            onClick={() => setActiveTab('verified')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'verified'
                ? 'bg-[#ff6b98] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Verified Purchases
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'media'
                ? 'bg-[#ff6b98] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Media Reviews
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'admin'
                ? 'bg-[#ff6b98] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Admin Features
          </button>
        </div>

        {/* Demo Content */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {activeTab === 'basic' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Basic Reviews</h2>
              <p className="text-gray-600 mb-6">
                Standard review functionality with user authentication and basic features.
              </p>
              <Reviews
                reviews={mockReviews}
                showSubmitForm={true}
                showFilters={true}
                reviewsPerPage={3}
                onSubmitReview={handleSubmitReview}
                onVoteHelpful={handleVoteHelpful}
                onReportReview={handleReportReview}
                onModerateReview={handleModerateReview}
                isAdmin={isAdmin}
                productId="1"
                productName="Elegant Wedding Gown"
              />
            </div>
          )}

          {activeTab === 'verified' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Verified Purchase Reviews</h2>
              <p className="text-gray-600 mb-6">
                Reviews that require purchase verification. Users must confirm they purchased the product.
              </p>
              <Reviews
                reviews={mockReviews.filter(r => r.verifiedPurchase)}
                showSubmitForm={true}
                showFilters={true}
                reviewsPerPage={3}
                requireVerification={true}
                onSubmitReview={handleSubmitReview}
                onVoteHelpful={handleVoteHelpful}
                onReportReview={handleReportReview}
                onModerateReview={handleModerateReview}
                isAdmin={isAdmin}
                productId="1"
                productName="Elegant Wedding Gown"
              />
            </div>
          )}

          {activeTab === 'media' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Media Reviews</h2>
              <p className="text-gray-600 mb-6">
                Reviews with photo and video uploads. Users can attach media to their reviews.
              </p>
              <Reviews
                reviews={mockReviews.filter(r => r.photos || r.videos)}
                showSubmitForm={true}
                showFilters={true}
                reviewsPerPage={3}
                allowMedia={true}
                maxPhotos={5}
                maxVideos={2}
                onSubmitReview={handleSubmitReview}
                onVoteHelpful={handleVoteHelpful}
                onReportReview={handleReportReview}
                onModerateReview={handleModerateReview}
                isAdmin={isAdmin}
                productId="1"
                productName="Elegant Wedding Gown"
              />
            </div>
          )}

          {activeTab === 'admin' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin Features</h2>
              <p className="text-gray-600 mb-6">
                Admin panel with moderation tools, analytics, and review management.
              </p>
              <Reviews
                reviews={mockReviews}
                showSubmitForm={false}
                showFilters={true}
                reviewsPerPage={5}
                onSubmitReview={handleSubmitReview}
                onVoteHelpful={handleVoteHelpful}
                onReportReview={handleReportReview}
                onModerateReview={handleModerateReview}
                isAdmin={true}
                productId="1"
                productName="Elegant Wedding Gown"
              />
            </div>
          )}
        </div>

        {/* Feature Overview */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-3xl mb-4">👤</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">User Integration</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• User authentication required</li>
              <li>• Automatic user info population</li>
              <li>• User avatar support</li>
              <li>• User-specific voting tracking</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-3xl mb-4">✅</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Purchase Verification</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Verified purchase badges</li>
              <li>• Purchase date tracking</li>
              <li>• Order ID validation</li>
              <li>• Enhanced credibility</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-3xl mb-4">📸</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Media Support</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Photo uploads (up to 5)</li>
              <li>• Video uploads (up to 2)</li>
              <li>• Media gallery display</li>
              <li>• Full-screen media viewer</li>
            </ul>
          </div>
        </div>

        {/* Technical Details */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Technical Implementation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Enhanced Review Interface</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• User ID and email tracking</li>
                <li>• Purchase verification fields</li>
                <li>• Media arrays (photos/videos)</li>
                <li>• Helpful votes tracking</li>
                <li>• Report tracking</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">New Component Features</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Media gallery component</li>
                <li>• Verification form fields</li>
                <li>• User authentication integration</li>
                <li>• Enhanced review cards</li>
                <li>• Admin moderation tools</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 