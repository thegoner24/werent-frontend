'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Container from '../ui/Container';
import { useAuth } from '@/contexts/AuthContext';
import { Review, voteReviewHelpful, reportReview, moderateReview } from '@/api/items';

interface ReviewsProps {
  reviews: Review[];
  title?: string;
  showFilters?: boolean;
  showSubmitForm?: boolean;
  className?: string;
  onSubmitReview?: (review: Omit<Review, 'date'>) => void;
  onVoteHelpful?: (reviewId: string | number, isHelpful: boolean) => void;
  onReportReview?: (reviewId: string | number, reason: string) => void;
  onModerateReview?: (reviewId: string | number, action: 'approve' | 'reject') => void;
  isAdmin?: boolean;
  reviewsPerPage?: number;
  // New props for enhanced functionality
  requireVerification?: boolean;
  allowMedia?: boolean;
  maxPhotos?: number;
  maxVideos?: number;
  productId?: string;
  productName?: string;
  // New props for API integration
  itemId?: string | number; // Required for API calls
  onReviewUpdate?: () => void; // Callback to refresh reviews after actions
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

const MediaGallery: React.FC<{ 
  photos?: string[]; 
  videos?: string[];
  onRemove?: (type: 'photo' | 'video', index: number) => void;
  isEditable?: boolean;
}> = ({ photos = [], videos = [], onRemove, isEditable = false }) => {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  if (photos.length === 0 && videos.length === 0) return null;

  return (
    <div className="mt-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {photos.map((photo, index) => (
          <div key={`photo-${index}`} className="relative group">
            <Image
              src={photo}
              alt={`Review photo ${index + 1}`}
              width={100}
              height={96}
              className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setSelectedMedia(photo)}
            />
            {isEditable && onRemove && (
              <button
                onClick={() => onRemove('photo', index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
              >
                ×
              </button>
            )}
          </div>
        ))}
        {videos.map((video, index) => (
          <div key={`video-${index}`} className="relative group">
            <video
              src={video}
              className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setSelectedMedia(video)}
              controls
            />
            {isEditable && onRemove && (
              <button
                onClick={() => onRemove('video', index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Media Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setSelectedMedia(null)}>
          <div className="max-w-4xl max-h-full p-4">
            {selectedMedia.includes('.mp4') || selectedMedia.includes('.webm') ? (
              <video src={selectedMedia} controls className="max-w-full max-h-full" />
            ) : (
              <Image 
                src={selectedMedia} 
                alt="Full size" 
                width={800} 
                height={600} 
                className="max-w-full max-h-full object-contain" 
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ReviewCard: React.FC<{ 
  review: Review; 
  onVoteHelpful?: (reviewId: string | number, isHelpful: boolean) => void;
  onReportReview?: (reviewId: string | number, reason: string) => void;
  onModerateReview?: (reviewId: string | number, action: 'approve' | 'reject') => void;
  isAdmin?: boolean;
  currentUserId?: number;
}> = ({ review, onVoteHelpful, onReportReview, onModerateReview, isAdmin, currentUserId }) => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');

  const handleVoteHelpful = (isHelpful: boolean) => {
    if (onVoteHelpful && review.id) {
      onVoteHelpful(review.id, isHelpful);
    }
  };

  const handleReport = () => {
    if (onReportReview && review.id) {
      onReportReview(review.id, reportReason);
      setShowReportModal(false);
      setReportReason('');
    }
  };

  const handleModerate = (action: 'approve' | 'reject') => {
    if (onModerateReview && review.id) {
      onModerateReview(review.id, action);
    }
  };

  // Compute user interaction status from review data
  const hasVotedHelpful = review.helpfulVotes?.includes(currentUserId?.toString() || '');
  const hasReported = review.reportedBy?.includes(currentUserId?.toString() || '');

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

      {/* Review Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#ff6b98] rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {review.userAvatar ? (
                <Image 
                  src={review.userAvatar} 
                  alt={review.user || 'User'} 
                  width={40} 
                  height={40} 
                  className="w-full h-full rounded-full object-cover" 
                />
              ) : (
                (review.user || 'A').split(' ').map(n => n[0]).join('')
              )}
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-gray-900">{review.user}</h4>
              {review.verifiedPurchase && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Verified Purchase
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">{review.date}</p>
            {review.purchaseDate && (
              <p className="text-xs text-gray-400">Purchased: {review.purchaseDate}</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <StarRating rating={review.rating} />
          <span className="text-sm text-gray-600">{review.rating}/5</span>
        </div>
      </div>

      {/* Review Content */}
      <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>

      {/* Media Gallery */}
      {(review.photos && review.photos.length > 0) || (review.videos && review.videos.length > 0) ? (
        <MediaGallery photos={review.photos} videos={review.videos} />
      ) : null}

      {/* Review Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => handleVoteHelpful(true)}
            disabled={hasVotedHelpful}
            className={`flex items-center space-x-1 text-sm ${
              hasVotedHelpful 
                ? 'text-green-600 font-medium' 
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
            <span>Helpful ({review.helpful || 0})</span>
          </button>
          
          <button
            onClick={() => setShowReportModal(true)}
            disabled={hasReported}
            className={`text-sm ${
              hasReported 
                ? 'text-red-600 font-medium' 
                : 'text-gray-600 hover:text-red-600'
            }`}
          >
            {hasReported ? 'Reported' : 'Report'}
          </button>
        </div>

        {/* Admin Actions */}
        {isAdmin && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleModerate('approve')}
              className="px-3 py-1 text-xs bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Approve
            </button>
            <button
              onClick={() => handleModerate('reject')}
              className="px-3 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600"
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
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff6b98]"
              rows={4}
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleReport}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
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

const ReviewForm: React.FC<{ 
  onSubmit: (review: Omit<Review, 'date'>) => void;
  requireVerification?: boolean;
  allowMedia?: boolean;
  maxPhotos?: number;
  maxVideos?: number;
  productId?: string;
  productName?: string;
}> = ({ 
  onSubmit, 
  requireVerification = false, 
  allowMedia = false, 
  maxPhotos = 5, 
  maxVideos = 2,
  productId,
  productName
}) => {
  const { user: authUser, isAuthenticated } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [verifiedPurchase, setVerifiedPurchase] = useState(false);
  const [purchaseDate, setPurchaseDate] = useState('');
  const [orderId, setOrderId] = useState('');

  const handleFileUpload = (files: FileList, type: 'photo' | 'video') => {
    const maxFiles = type === 'photo' ? maxPhotos : maxVideos;
    const currentFiles = type === 'photo' ? photos : videos;
    
    if (currentFiles.length + files.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} ${type}s`);
      return;
    }

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (type === 'photo') {
          setPhotos(prev => [...prev, result]);
        } else {
          setVideos(prev => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveMedia = (type: 'photo' | 'video', index: number) => {
    if (type === 'photo') {
      setPhotos(prev => prev.filter((_, i) => i !== index));
    } else {
      setVideos(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !comment.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    if (requireVerification && !verifiedPurchase) {
      alert('Please verify your purchase before submitting a review');
      return;
    }

    setIsSubmitting(true);
    try {
      const reviewData: Omit<Review, 'date'> = {
        user: authUser ? `${authUser.first_name} ${authUser.last_name}` : 'Anonymous',
        rating,
        comment: comment.trim(),
        review_message: comment.trim(), // Use both for compatibility
        id: Date.now().toString(),
        helpful: 0,
        reported: false,
        moderated: false,
        // User integration
        user_id: authUser?.id,
        userEmail: authUser?.email,
        userAvatar: authUser ? undefined : undefined, // Could be set from user profile
        // Verification
        verifiedPurchase,
        purchaseDate: verifiedPurchase ? purchaseDate : undefined,
        orderId: verifiedPurchase ? orderId : undefined,
        // Media
        photos: photos.length > 0 ? photos : undefined,
        videos: videos.length > 0 ? videos : undefined,
        // Product info
        productId,
        productName
      };

      await onSubmit(reviewData);
      
      // Reset form
      setRating(0);
      setComment('');
      setPhotos([]);
      setVideos([]);
      setVerifiedPurchase(false);
      setPurchaseDate('');
      setOrderId('');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated && requireVerification) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🔒</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Login Required</h3>
          <p className="text-gray-600 mb-4">You need to be logged in to write a verified review.</p>
          <button className="bg-[#ff6b98] text-white px-6 py-2 rounded-md hover:bg-[#ff6b98]/90">
            Login to Review
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Write a Review</h3>
      {productName && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Reviewing: <span className="font-medium text-gray-900">{productName}</span></p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Info */}
        {authUser && (
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-8 h-8 bg-[#ff6b98] rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {authUser.first_name.charAt(0)}{authUser.last_name.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {authUser.first_name} {authUser.last_name}
              </p>
              <p className="text-xs text-gray-600">{authUser.email}</p>
            </div>
          </div>
        )}

        {/* Verification Section */}
        {requireVerification && (
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                id="verifiedPurchase"
                checked={verifiedPurchase}
                onChange={(e) => setVerifiedPurchase(e.target.checked)}
                className="rounded border-gray-300 text-[#ff6b98] focus:ring-[#ff6b98]"
              />
              <label htmlFor="verifiedPurchase" className="text-sm font-medium text-gray-700">
                I have purchased this product
              </label>
            </div>
            
            {verifiedPurchase && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Purchase Date
                  </label>
                  <input
                    type="date"
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff6b98]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff6b98]"
                    placeholder="Enter your order ID"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating *
          </label>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl transition-colors ${
                  star <= rating ? 'text-yellow-400' : 'text-gray-300'
                } hover:text-yellow-400`}
              >
                ★
              </button>
            ))}
            <span className="text-sm text-gray-600 ml-2">
              {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Select rating'}
            </span>
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review *
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff6b98] resize-none"
            rows={4}
            placeholder="Share your experience with this product..."
            required
          />
        </div>

        {/* Media Upload */}
        {allowMedia && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photos (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'photo')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff6b98]"
                disabled={photos.length >= maxPhotos}
              />
              <p className="text-xs text-gray-500 mt-1">
                {photos.length}/{maxPhotos} photos uploaded
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Videos (Optional)
              </label>
              <input
                type="file"
                accept="video/*"
                multiple
                onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'video')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff6b98]"
                disabled={videos.length >= maxVideos}
              />
              <p className="text-xs text-gray-500 mt-1">
                {videos.length}/{maxVideos} videos uploaded
              </p>
            </div>

            {/* Media Preview */}
            {(photos.length > 0 || videos.length > 0) && (
              <MediaGallery 
                photos={photos} 
                videos={videos} 
                onRemove={handleRemoveMedia}
                isEditable={true}
              />
            )}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || rating === 0 || !comment.trim() || (requireVerification && !verifiedPurchase)}
          className="w-full bg-[#ff6b98] text-white py-3 px-6 rounded-md font-semibold hover:bg-[#ff6b98]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
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
        className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-[#ff6b98]/10 hover:border-[#ff6b98] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        Previous
      </button>
      
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
            page === currentPage
              ? 'bg-[#ff6b98] text-white'
              : 'border border-gray-300 hover:bg-[#ff6b98]/10 hover:border-[#ff6b98]'
          }`}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-[#ff6b98]/10 hover:border-[#ff6b98] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
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
  reviewsPerPage = 3,
  requireVerification = false,
  allowMedia = false,
  maxPhotos = 5,
  maxVideos = 2,
  productId,
  productName,
  itemId, // Added itemId prop
  onReviewUpdate // Added onReviewUpdate prop
}: ReviewsProps) {
  const { user: authUser, accessToken } = useAuth();
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
    }
  };

  const handleVoteHelpful = async (reviewId: string | number, isHelpful: boolean) => {
    if (onVoteHelpful) {
      onVoteHelpful(reviewId, isHelpful);
    } else if (itemId && accessToken) {
      try {
        await voteReviewHelpful(itemId, reviewId, isHelpful, accessToken);
        // Refresh reviews after voting
        if (onReviewUpdate) {
          onReviewUpdate();
        }
      } catch (error) {
        console.error('Failed to vote on review:', error);
      }
    }
  };

  const handleReportReview = async (reviewId: string | number, reason: string) => {
    if (onReportReview) {
      onReportReview(reviewId, reason);
    } else if (itemId && accessToken) {
      try {
        await reportReview(itemId, reviewId, reason, accessToken);
        // Refresh reviews after reporting
        if (onReviewUpdate) {
          onReviewUpdate();
        }
      } catch (error) {
        console.error('Failed to report review:', error);
      }
    }
  };

  const handleModerateReview = async (reviewId: string | number, action: 'approve' | 'reject') => {
    if (onModerateReview) {
      onModerateReview(reviewId, action);
    } else if (itemId && accessToken) {
      try {
        await moderateReview(itemId, reviewId, action, accessToken);
        // Refresh reviews after moderation
        if (onReviewUpdate) {
          onReviewUpdate();
        }
      } catch (error) {
        console.error('Failed to moderate review:', error);
      }
    }
  };

  return (
    <div className={`border-t border-gray-200 p-8 ${className}`}>
      <Container>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">{title}</h3>
        
        {/* Review Submission Form */}
        {showSubmitForm && (
          <ReviewForm 
            onSubmit={handleSubmitReview}
            requireVerification={requireVerification}
            allowMedia={allowMedia}
            maxPhotos={maxPhotos}
            maxVideos={maxVideos}
            productId={productId}
            productName={productName}
          />
        )}
        
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
                currentUserId={authUser?.id}
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