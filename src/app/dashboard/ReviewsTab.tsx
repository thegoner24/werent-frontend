'use client';

import React, { useState, useMemo } from 'react';
import { Review } from '@/components/Reviews';

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

interface ReviewsTabProps {
  user: User;
}

// Mock user reviews data
const mockUserReviews: Review[] = [
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
    user: "Sarah Johnson",
    rating: 4,
    comment: "Beautiful cocktail dress for my corporate event. Great quality fabric and perfect fit.",
    date: "2024-01-10",
    helpful: 8,
    reported: false,
    moderated: false
  },
  {
    id: "3",
    user: "Sarah Johnson",
    rating: 5,
    comment: "Incredible experience! The dress exceeded my expectations and I received so many compliments.",
    date: "2024-01-05",
    helpful: 15,
    reported: false,
    moderated: false
  },
  {
    id: "4",
    user: "Sarah Johnson",
    rating: 3,
    comment: "The dress was okay, but the sizing was a bit off. Customer service was helpful though.",
    date: "2023-12-28",
    helpful: 3,
    reported: false,
    moderated: false
  },
  {
    id: "5",
    user: "Sarah Johnson",
    rating: 5,
    comment: "Perfect for my engagement party! The dress was exactly what I was looking for.",
    date: "2023-12-20",
    helpful: 18,
    reported: false,
    moderated: false
  }
];

// Sentiment analysis keywords
const positiveKeywords = ['perfect', 'beautiful', 'stunning', 'excellent', 'amazing', 'love', 'great', 'wonderful', 'incredible', 'outstanding'];
const negativeKeywords = ['disappointed', 'terrible', 'bad', 'poor', 'awful', 'hate', 'worst', 'unacceptable', 'problem', 'issue'];

const getSentiment = (comment: string): 'positive' | 'negative' | 'neutral' => {
  const lowerComment = comment.toLowerCase();
  const positiveCount = positiveKeywords.filter(keyword => lowerComment.includes(keyword)).length;
  const negativeCount = negativeKeywords.filter(keyword => lowerComment.includes(keyword)).length;
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
};

const ReviewsTab: React.FC<ReviewsTabProps> = ({ user }) => {
  const [userReviews, setUserReviews] = useState<Review[]>(mockUserReviews);
  const [activeFilter, setActiveFilter] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'helpful'>('date');

  // User analytics calculations
  const userAnalytics = useMemo(() => {
    const totalReviews = userReviews.length;
    const averageRating = totalReviews > 0 ? userReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews : 0;
    const totalHelpfulVotes = userReviews.reduce((sum, review) => sum + (review.helpful || 0), 0);
    
    const sentimentAnalysis = userReviews.reduce((acc, review) => {
      const sentiment = getSentiment(review.comment);
      acc[sentiment]++;
      return acc;
    }, { positive: 0, negative: 0, neutral: 0 });

    const ratingDistribution = userReviews.reduce((acc, review) => {
      acc[review.rating] = (acc[review.rating] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const mostHelpfulReview = userReviews.reduce((max, review) => 
      (review.helpful || 0) > (max.helpful || 0) ? review : max
    );

    const recentReviews = userReviews
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);

    return {
      totalReviews,
      averageRating: averageRating.toFixed(1),
      totalHelpfulVotes,
      sentimentAnalysis,
      ratingDistribution,
      mostHelpfulReview,
      recentReviews
    };
  }, [userReviews]);

  // Filter and sort reviews
  const filteredAndSortedReviews = useMemo(() => {
    let filtered = userReviews;

    // Apply sentiment filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(review => getSentiment(review.comment) === activeFilter);
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'rating':
          return b.rating - a.rating;
        case 'helpful':
          return (b.helpful || 0) - (a.helpful || 0);
        default:
          return 0;
      }
    });
  }, [userReviews, activeFilter, sortBy]);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* User Review Summary */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-tr from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user.first_name.charAt(0)}{user.last_name.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Your Review Analytics</h2>
            <p className="text-gray-600">Track your review activity and impact</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{userAnalytics.totalReviews}</div>
            <div className="text-sm text-gray-600">Reviews Written</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{userAnalytics.averageRating}/5</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{userAnalytics.totalHelpfulVotes}</div>
            <div className="text-sm text-gray-600">Helpful Votes</div>
          </div>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Sentiment Analysis</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Positive Reviews</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(userAnalytics.sentimentAnalysis.positive / userAnalytics.totalReviews) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900">{userAnalytics.sentimentAnalysis.positive}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Neutral Reviews</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gray-500 h-2 rounded-full"
                    style={{ width: `${(userAnalytics.sentimentAnalysis.neutral / userAnalytics.totalReviews) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900">{userAnalytics.sentimentAnalysis.neutral}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Negative Reviews</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${(userAnalytics.sentimentAnalysis.negative / userAnalytics.totalReviews) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900">{userAnalytics.sentimentAnalysis.negative}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Rating Distribution</h3>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = userAnalytics.ratingDistribution[rating] || 0;
              const percentage = userAnalytics.totalReviews > 0 ? (count / userAnalytics.totalReviews) * 100 : 0;
              
              return (
                <div key={rating} className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-600 w-8">{rating}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Most Helpful Review */}
      {userAnalytics.mostHelpfulReview && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Most Helpful Review</h3>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#ff6b98] rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {userAnalytics.mostHelpfulReview.user.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{userAnalytics.mostHelpfulReview.user}</h4>
                  <p className="text-sm text-gray-500">{userAnalytics.mostHelpfulReview.date}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < userAnalytics.mostHelpfulReview.rating ? "text-yellow-400" : "text-gray-300"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm font-medium text-green-600">
                  {userAnalytics.mostHelpfulReview.helpful} helpful votes
                </span>
              </div>
            </div>
            <p className="text-gray-700">{userAnalytics.mostHelpfulReview.comment}</p>
          </div>
        </div>
      )}

      {/* Recent Reviews */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-0">Your Reviews</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff6b98]"
            >
              <option value="all">All Reviews</option>
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff6b98]"
            >
              <option value="date">Sort by Date</option>
              <option value="rating">Sort by Rating</option>
              <option value="helpful">Sort by Helpful</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredAndSortedReviews.map((review) => {
            const sentiment = getSentiment(review.comment);
            const sentimentColor = getSentimentColor(sentiment);

            return (
              <div key={review.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#ff6b98] rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {review.user.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{review.user}</h4>
                      <p className="text-sm text-gray-500">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className={`text-sm font-medium ${sentimentColor}`}>
                      {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-3">{review.comment}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Helpful: {review.helpful || 0}</span>
                    {review.reported && (
                      <span className="text-red-600 font-medium">⚠️ Reported</span>
                    )}
                    {review.moderated && (
                      <span className="text-yellow-600 font-medium">⏳ Pending</span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 text-xs bg-[#ff6b98] text-white rounded-md hover:bg-[#ff6b98]/90">
                      Edit
                    </button>
                    <button className="px-3 py-1 text-xs bg-gray-600 text-white rounded-md hover:bg-gray-700">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredAndSortedReviews.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No reviews found with the current filter.</p>
          </div>
        )}
      </div>

      {/* Review Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Writing Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Make Your Reviews More Helpful</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Include specific details about the product</li>
              <li>• Mention how you used the item</li>
              <li>• Share both pros and cons</li>
              <li>• Be honest and authentic</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Earn More Helpful Votes</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Write detailed, thoughtful reviews</li>
              <li>• Include photos when possible</li>
              <li>• Respond to questions from other users</li>
              <li>• Keep reviews updated and relevant</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsTab; 