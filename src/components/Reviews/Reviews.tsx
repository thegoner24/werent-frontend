'use client';

import React, { useState, useMemo } from 'react';
import Container from '../ui/Container';

export interface Review {
  user: string;
  rating: number;
  comment: string;
  date: string;
}

interface ReviewsProps {
  reviews: Review[];
  title?: string;
  showFilters?: boolean;
  className?: string;
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

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-shadow">
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
      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
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

export default function Reviews({ 
  reviews, 
  title = "Customer Reviews", 
  showFilters = true,
  className = ""
}: ReviewsProps) {
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');

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
        }
        return 0;
      });
  }, [reviews, ratingFilter, sortBy]);

  if (reviews.length === 0) {
    return (
      <div className={`border-t border-gray-200 p-8 ${className}`}>
        <Container>
          <h3 className="text-xl font-semibold text-gray-900 mb-6">{title}</h3>
          <div className="text-center py-8">
            <p className="text-gray-500">No reviews yet.</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className={`border-t border-gray-200 p-8 ${className}`}>
      <Container>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">{title}</h3>
        
        {/* Reviews Summary */}
        <ReviewsSummary reviews={reviews} />
        
        {/* Review Filters */}
        {showFilters && (
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
              </select>
            </div>
          </div>
        )}
        
        {/* Reviews List */}
        <div className="space-y-6">
          <div className="text-sm text-gray-600 mb-4">
            Showing {filteredAndSortedReviews.length} of {reviews.length} reviews
          </div>
          {filteredAndSortedReviews.map((review, index) => (
            <ReviewCard key={index} review={review} />
          ))}
        </div>
      </Container>
    </div>
  );
} 