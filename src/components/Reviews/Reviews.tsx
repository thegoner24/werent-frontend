'use client';

import React, { useState, useMemo } from 'react';
import Container from '../ui/Container';

export interface Review {
  user: string;
  rating: number;
  comment: string;
  date: string;
  id?: string;
  helpful?: number;
  reported?: boolean;
  moderated?: boolean;
}

interface ReviewsProps {
  reviews: Review[];
  title?: string;
  showFilters?: boolean;
  showSubmitForm?: boolean;
  className?: string;
  onSubmitReview?: (review: Omit<Review, 'date'>) => void;
  onVoteHelpful?: (reviewId: string, isHelpful: boolean) => void;
  onReportReview?: (reviewId: string, reason: string) => void;
  onModerateReview?: (reviewId: string, action: 'approve' | 'reject') => void;
  isAdmin?: boolean;
  reviewsPerPage?: number;
}

const StarRating: React.FC<{ rating: number; size?: 'sm' | 'md' | 'lg' }> = ({ 
  rating, 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <div className="flex text-yellow-400">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          className={`${sizeClasses[size]} ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const ReviewCard: React.FC<{ 
  review: Review; 
  onVoteHelpful?: (reviewId: string, isHelpful: boolean) => void;
  onReportReview?: (reviewId: string, reason: string) => void;
  onModerateReview?: (reviewId: string, action: 'approve' | 'reject') => void;
  isAdmin?: boolean;
}> = ({ review, onVoteHelpful, onReportReview, onModerateReview, isAdmin }) => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [hasVoted, setHasVoted] = useState(false);

  const handleVoteHelpful = (isHelpful: boolean) => {
    if (review.id && onVoteHelpful && !hasVoted) {
      onVoteHelpful(review.id, isHelpful);
      setHasVoted(true);
    }
  };

  const handleReport = () => {
    if (review.id && onReportReview && reportReason.trim()) {
      onReportReview(review.id, reportReason);
      setShowReportModal(false);
      setReportReason('');
    }
  };

  const handleModerate = (action: 'approve' | 'reject') => {
    if (review.id && onModerateReview) {
      onModerateReview(review.id, action);
    }
  };

  return (
    <div className={`border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-shadow ${
      review.moderated ? 'opacity-60' : ''
    }`}>
      {/* Moderation Status */}
      {review.moderated && (
        <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">This review is pending moderation</p>
        </div>
      )}

      <div className="flex items-center justify-between mb-3">
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
        <div className="flex items-center">
          <div className="mr-2">
            <StarRating rating={review.rating} />
          </div>
          <span className="text-sm text-gray-600">{review.rating}/5</span>
        </div>
      </div>
      
      <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>

      {/* Review Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          {/* Helpful Voting */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleVoteHelpful(true)}
              disabled={hasVoted}
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-[#ff6b98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
              <span>Helpful</span>
            </button>
            {review.helpful && review.helpful > 0 && (
              <span className="text-sm text-gray-500">({review.helpful})</span>
            )}
          </div>

          {/* Report Button */}
          <button
            onClick={() => setShowReportModal(true)}
            className="text-sm text-gray-600 hover:text-red-600"
          >
            Report
          </button>
        </div>

        {/* Admin Moderation Actions */}
        {isAdmin && review.moderated && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleModerate('approve')}
              className="px-3 py-1 text-xs bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Approve
            </button>
            <button
              onClick={() => handleModerate('reject')}
              className="px-3 py-1 text-xs bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Reject
            </button>
          </div>
        )}
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Report Review</h3>
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Please provide a reason for reporting this review..."
              className="w-full p-3 border border-gray-300 rounded-md mb-4 resize-none"
              rows={3}
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleReport}
                disabled={!reportReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ReviewForm: React.FC<{ onSubmit: (review: Omit<Review, 'date'>) => void }> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    user: '',
    rating: 0,
    comment: ''
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.user.trim() || !formData.comment.trim() || formData.rating === 0) {
      alert('Please fill in all fields and select a rating.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({ user: '', rating: 0, comment: '' });
      setHoveredRating(0);
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 mb-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Name *
          </label>
          <input
            type="text"
            value={formData.user}
            onChange={(e) => setFormData({ ...formData, user: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff6b98]"
            placeholder="Enter your name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating *
          </label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData({ ...formData, rating: star })}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-8 w-8 ${
                    star <= (hoveredRating || formData.rating) 
                      ? "text-yellow-400" 
                      : "text-gray-300"
                  } transition-colors duration-200`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {formData.rating > 0 ? `${formData.rating}/5` : 'Select rating'}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review *
          </label>
          <textarea
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff6b98] resize-none"
            rows={4}
            placeholder="Share your experience with this product..."
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !formData.user.trim() || !formData.comment.trim() || formData.rating === 0}
            className="bg-[#ff6b98] text-white px-6 py-2 rounded-md hover:bg-[#ff6b98]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

const ReviewsSummary: React.FC<{ reviews: Review[] }> = ({ reviews }) => {
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const ratingDistribution = reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  return (
    <div className="bg-gray-50 rounded-lg p-6 mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
            <StarRating rating={Math.round(averageRating)} size="lg" />
            <div className="text-sm text-gray-600 mt-1">{reviews.length} reviews</div>
          </div>
        </div>
        
        <div className="flex-1 md:ml-8">
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingDistribution[rating] || 0;
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              
              return (
                <div key={rating} className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 w-8">{rating}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 text-sm rounded-md ${
            page === currentPage
              ? 'bg-[#ff6b98] text-white'
              : 'border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

export default function Reviews({ 
  reviews, 
  title = "Customer Reviews", 
  showFilters = true,
  showSubmitForm = false,
  className = "",
  onSubmitReview,
  onVoteHelpful,
  onReportReview,
  onModerateReview,
  isAdmin = false,
  reviewsPerPage = 3
}: ReviewsProps) {
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and sort reviews
  const filteredAndSortedReviews = useMemo(() => {
    return reviews
      .filter(review => {
        if (ratingFilter === 'all') return true;
        if (ratingFilter === '5') return review.rating === 5;
        if (ratingFilter === '4+') return review.rating >= 4;
        if (ratingFilter === '3+') return review.rating >= 3;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'recent') {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        } else if (sortBy === 'oldest') {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        } else if (sortBy === 'highest') {
          return b.rating - a.rating;
        } else if (sortBy === 'lowest') {
          return a.rating - b.rating;
        } else if (sortBy === 'helpful') {
          return (b.helpful || 0) - (a.helpful || 0);
        }
        return 0;
      });
  }, [reviews, ratingFilter, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedReviews.length / reviewsPerPage);
  const paginatedReviews = filteredAndSortedReviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  const handleSubmitReview = async (reviewData: Omit<Review, 'date'>) => {
    if (onSubmitReview) {
      await onSubmitReview(reviewData);
    } else {
      // Default behavior - add to local state (for demo purposes)
      const newReview: Review = {
        ...reviewData,
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        helpful: 0,
        reported: false,
        moderated: false
      };
      console.log('New review submitted:', newReview);
      // In a real app, you would send this to your API
    }
  };

  const handleVoteHelpful = (reviewId: string, isHelpful: boolean) => {
    if (onVoteHelpful) {
      onVoteHelpful(reviewId, isHelpful);
    } else {
      console.log('Vote helpful:', { reviewId, isHelpful });
    }
  };

  const handleReportReview = (reviewId: string, reason: string) => {
    if (onReportReview) {
      onReportReview(reviewId, reason);
    } else {
      console.log('Report review:', { reviewId, reason });
    }
  };

  const handleModerateReview = (reviewId: string, action: 'approve' | 'reject') => {
    if (onModerateReview) {
      onModerateReview(reviewId, action);
    } else {
      console.log('Moderate review:', { reviewId, action });
    }
  };

  return (
    <div className={`border-t border-gray-200 p-8 ${className}`}>
      <Container>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">{title}</h3>
        
        {/* Review Submission Form */}
        {showSubmitForm && <ReviewForm onSubmit={handleSubmitReview} />}
        
        {/* Reviews Summary */}
        {reviews.length > 0 && <ReviewsSummary reviews={reviews} />}
        
        {/* Review Filters */}
        {showFilters && reviews.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Rating
              </label>
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff6b98]"
              >
                <option value="all">All ratings</option>
                <option value="5">5 stars only</option>
                <option value="4+">4+ stars</option>
                <option value="3+">3+ stars</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff6b98]"
              >
                <option value="recent">Most recent</option>
                <option value="oldest">Oldest first</option>
                <option value="highest">Highest rated</option>
                <option value="lowest">Lowest rated</option>
                <option value="helpful">Most helpful</option>
              </select>
            </div>
          </div>
        )}
        
        {/* Reviews List */}
        {reviews.length > 0 ? (
          <div className="space-y-6">
            <div className="text-sm text-gray-600 mb-4">
              Showing {paginatedReviews.length} of {filteredAndSortedReviews.length} reviews
              {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
            </div>
            {paginatedReviews.map((review, index) => (
              <ReviewCard 
                key={review.id || index} 
                review={review}
                onVoteHelpful={handleVoteHelpful}
                onReportReview={handleReportReview}
                onModerateReview={handleModerateReview}
                isAdmin={isAdmin}
              />
            ))}
            
            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No reviews yet.</p>
            {showSubmitForm && (
              <p className="text-sm text-gray-400 mt-2">Be the first to write a review!</p>
            )}
          </div>
        )}
      </Container>
    </div>
  );
} 