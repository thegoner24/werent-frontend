'use client';

import React, { useState, useMemo } from 'react';
import { Review } from '@/components/Reviews';

// Mock data for admin reviews
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
  },
  {
    id: "9",
    user: "Jessica Parker",
    rating: 2,
    comment: "Disappointed with the quality. The dress arrived with stains and the fit was terrible.",
    date: "2023-12-18",
    helpful: 1,
    reported: true,
    moderated: true
  },
  {
    id: "10",
    user: "Sophia Williams",
    rating: 5,
    comment: "Incredible experience! The dress was perfect and the service was outstanding.",
    date: "2023-12-15",
    helpful: 25,
    reported: false,
    moderated: false
  }
];

// Sentiment analysis keywords
const positiveKeywords = ['perfect', 'beautiful', 'stunning', 'excellent', 'amazing', 'love', 'great', 'wonderful', 'incredible', 'outstanding'];
const negativeKeywords = ['disappointed', 'terrible', 'bad', 'poor', 'awful', 'hate', 'worst', 'unacceptable', 'problem', 'issue'];

const getSentiment = (comment: string | undefined): 'positive' | 'negative' | 'neutral' => {
  const lowerComment = (comment || '').toLowerCase();
  const positiveCount = positiveKeywords.filter(keyword => lowerComment.includes(keyword)).length;
  const negativeCount = negativeKeywords.filter(keyword => lowerComment.includes(keyword)).length;
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
};

const ReviewsTab: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [responseText, setResponseText] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'reported' | 'responded'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'helpful' | 'sentiment'>('date');

  // Analytics calculations
  const analytics = useMemo(() => {
    const totalReviews = reviews.length;
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
    const pendingModeration = reviews.filter(r => r.moderated).length;
    const reportedReviews = reviews.filter(r => r.reported).length;
    const totalHelpfulVotes = reviews.reduce((sum, review) => sum + (review.helpful || 0), 0);
    
    const sentimentAnalysis = reviews.reduce((acc, review) => {
      const sentiment = getSentiment(review.comment);
      acc[sentiment]++;
      return acc;
    }, { positive: 0, negative: 0, neutral: 0 });

    const ratingDistribution = reviews.reduce((acc, review) => {
      acc[review.rating] = (acc[review.rating] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return {
      totalReviews,
      averageRating: averageRating.toFixed(1),
      pendingModeration,
      reportedReviews,
      totalHelpfulVotes,
      sentimentAnalysis,
      ratingDistribution
    };
  }, [reviews]);

  // Filter and sort reviews
  const filteredAndSortedReviews = useMemo(() => {
    let filtered = reviews;

    // Apply status filter
    if (filterStatus === 'pending') {
      filtered = filtered.filter(r => r.moderated);
    } else if (filterStatus === 'reported') {
      filtered = filtered.filter(r => r.reported);
    } else if (filterStatus === 'responded') {
      filtered = filtered.filter(r => r.id && reviews.find(r2 => r2.id === r.id)?.comment?.includes('Response:'));
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
        case 'sentiment':
          const sentimentA = getSentiment(a.comment);
          const sentimentB = getSentiment(b.comment);
          const sentimentOrder = { positive: 3, neutral: 2, negative: 1 };
          return sentimentOrder[sentimentB] - sentimentOrder[sentimentA];
        default:
          return 0;
      }
    });
  }, [reviews, filterStatus, sortBy]);

  const handleRespond = (reviewId: string | number) => {
    if (!responseText.trim()) return;
    
    setReviews(prev => prev.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          comment: `${review.comment}\n\n--- Admin Response ---\n${responseText}`
        };
      }
      return review;
    }));
    
    setResponseText('');
    setSelectedReview(null);
  };

  const handleModerate = (reviewId: string | number, action: 'approve' | 'reject') => {
    setReviews(prev => prev.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          moderated: action === 'reject' ? false : review.moderated
        };
      }
      return review;
    }));
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Reviews</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{analytics.totalReviews}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{analytics.averageRating}/5</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Moderation</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{analytics.pendingModeration}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-red-500">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Reported Reviews</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{analytics.reportedReviews}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sentiment Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Analysis</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Positive</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(analytics.sentimentAnalysis.positive / analytics.totalReviews) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900">{analytics.sentimentAnalysis.positive}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Neutral</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gray-500 h-2 rounded-full"
                    style={{ width: `${(analytics.sentimentAnalysis.neutral / analytics.totalReviews) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900">{analytics.sentimentAnalysis.neutral}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Negative</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${(analytics.sentimentAnalysis.negative / analytics.totalReviews) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900">{analytics.sentimentAnalysis.negative}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = analytics.ratingDistribution[rating] || 0;
              const percentage = analytics.totalReviews > 0 ? (count / analytics.totalReviews) * 100 : 0;
              
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

      {/* Reviews Management */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-0">Reviews Management</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff6b98]"
            >
              <option value="all">All Reviews</option>
              <option value="pending">Pending Moderation</option>
              <option value="reported">Reported</option>
              <option value="responded">With Responses</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff6b98]"
            >
              <option value="date">Sort by Date</option>
              <option value="rating">Sort by Rating</option>
              <option value="helpful">Sort by Helpful</option>
              <option value="sentiment">Sort by Sentiment</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredAndSortedReviews.map((review) => {
            const sentiment = getSentiment(review.comment);
            const sentimentColor = {
              positive: 'text-green-600',
              negative: 'text-red-600',
              neutral: 'text-gray-600'
            }[sentiment];

            return (
              <div key={review.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#ff6b98] rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {review.user?.split(' ').map((n: string) => n[0]).join('') || '?'}
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
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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
                    {review.moderated && (
                      <>
                        <button
                          onClick={() => handleModerate(review.id!, 'approve')}
                          className="px-3 py-1 text-xs bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleModerate(review.id!, 'reject')}
                          className="px-3 py-1 text-xs bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setSelectedReview(review)}
                      className="px-3 py-1 text-xs bg-[#ff6b98] text-white rounded-md hover:bg-[#ff6b98]/90"
                    >
                      Respond
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Response Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Respond to Review</h3>
            <div className="mb-4 p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600 mb-2">Original Review:</p>
              <p className="text-gray-900">{selectedReview.comment}</p>
            </div>
            <textarea
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Write your response to this review..."
              className="w-full p-3 border border-gray-300 rounded-md mb-4 resize-none"
              rows={4}
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setSelectedReview(null);
                  setResponseText('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRespond(selectedReview.id!)}
                disabled={!responseText.trim()}
                className="px-4 py-2 bg-[#ff6b98] text-white rounded-md hover:bg-[#ff6b98]/90 disabled:opacity-50"
              >
                Send Response
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsTab; 