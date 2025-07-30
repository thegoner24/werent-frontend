'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { fetchItemById, addReviewToItem, ReviewData } from "@/api/items";
import Container from "@/components/ui/Container";
import Reviews from "@/components/Reviews";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  brand?: string;
  color?: string;
  created_at?: string;
  description?: string;
  gender?: string;
  image?: string; // API may return a single image string or images array
  images?: string[]; // fallback for images array
  price?: number;
  price_per_day?: number; // API field
  quantity?: number;
  rating?: number;
  updated_at?: string;
  reviews?: number;
  reviewList?: Review[]; // Optional: for legacy compatibility
  features?: string[];
  specifications?: Record<string, string>;
}

interface Review {
  id?: number;
  user?: string;
  rating: number;
  comment?: string;
  date: string;
}

const ProductDetail = () => {
  const params = useParams();
  const id = params?.id as string; // Cast to string to fix type error
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [rentalDays, setRentalDays] = useState<number>(1);
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  
  // Review form state
  const [showReviewForm, setShowReviewForm] = useState<boolean>(false);
  const [reviewFormData, setReviewFormData] = useState<ReviewData>({
    user: "",
    rating: 5,
    comment: ""
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);
  const [reviewSubmitError, setReviewSubmitError] = useState<string>("");
  const [reviewSubmitSuccess, setReviewSubmitSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getProduct() {
      setLoading(true);
      setError(null);
      try {
        const apiData = await import('@/api/items').then(m => m.fetchItemById(id));
        const apiProduct = apiData.data;
        setProduct({
          ...apiProduct,
          price: apiProduct.price_per_day ?? apiProduct.price,
          images: (apiProduct.images || (apiProduct.image ? [apiProduct.image] : [])).map((img: string) =>
            img.startsWith('data:image') ? img : `data:image/jpeg;base64,${img}`
          ),
          reviewList: apiProduct.reviewList || [],
          specifications: apiProduct.specifications || {},
          features: apiProduct.features || [],
        });
      } catch (e) {
        setError('Failed to load product.');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    if (id) getProduct();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link 
            href="/shop" 
            className="bg-[#ff6b98] text-white px-6 py-3 rounded-md hover:bg-[#e55a87] transition-colors"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = (product.price ?? 0) * rentalDays;
  const safeImages = product.images && product.images.length > 0 ? product.images : ['/default-image.png'];
  
  // Process reviews for filtering and sorting
  const reviewList = Array.isArray(product.reviewList) ? product.reviewList : [];
  const reviewCount = reviewList.length || product.reviews || 0;
  const features = Array.isArray(product.features) ? product.features : [];
  const specifications = typeof product.specifications === 'object' && product.specifications !== null ? product.specifications : {};
  
  // Filter and sort reviews based on user selection
  const filteredAndSortedReviews = reviewList.filter(review => {
    if (ratingFilter === 'all') return true;
    if (ratingFilter === '5') return review.rating === 5;
    if (ratingFilter === '4+') return review.rating >= 4;
    if (ratingFilter === '3+') return review.rating >= 3;
    return true;
  }).sort((a, b) => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <Container>
          <div className="py-4">
            <nav className="flex items-center space-x-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-[#ff6b98] transition-colors">Home</Link>
              <span>/</span>
              <Link href="/products" className="hover:text-[#ff6b98] transition-colors">Products</Link>
              <span>/</span>
              <span className="text-gray-900">{product.name || 'Unknown Product'}</span>
            </nav>
          </div>
        </Container>
      </div>

      {/* Product Detail */}
      <div className="bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-10">
            {/* Image Gallery */}
            <div>
              <div className="aspect-square bg-gray-100 overflow-hidden rounded-lg mb-4">
                <Image
                  src={safeImages[selectedImage]}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
              {safeImages.length > 1 && (
                <div className="flex space-x-2">
                  {safeImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-16 h-16 rounded-md overflow-hidden border-2 ${selectedImage === idx ? 'border-[#ff6b98]' : 'border-gray-200'} transition-colors`}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Product Info */}
            <div className="flex flex-col space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name || 'Unknown Product'}</h1>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm text-gray-600">{product.rating || 0}/5</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-sm text-gray-500">{product.brand || 'No Brand'}</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-sm text-gray-500">{product.color || 'N/A'}</span>
                </div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 ${i < (product.rating || 0) ? "text-yellow-400" : "text-gray-300"}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">{(product.rating || 0).toFixed(1)} ({reviewCount} reviews)</span>
                </div>
                <div className="text-xl font-semibold text-[#ff6b98] mb-4">
                  {product.price ? `₫${product.price.toLocaleString()}/day` : 'Contact for price'}
                </div>
                <div className="mb-4 text-gray-700">
                  {product.description || 'No description available.'}
                </div>
              </div>
              {/* Rental Options */}
              <div className="flex flex-col space-y-2">
                <label className="font-medium">Size:</label>
                <select
                  value={selectedSize}
                  onChange={e => setSelectedSize(e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="">Select size</option>
                  {features.map((size, idx) => (
                    <option key={idx} value={size}>{size}</option>
                  ))}
                </select>
                <label className="font-medium mt-2">Rental Days:</label>
                <input
                  type="number"
                  min={1}
                  value={rentalDays}
                  onChange={e => setRentalDays(Number(e.target.value))}
                  className="border rounded px-2 py-1 w-24"
                />
                <div className="mt-2 text-md">
                  <span className="font-semibold">Total Price: </span>
                  <span className="text-[#ff6b98] font-bold">₫{totalPrice.toLocaleString()}</span>
                </div>
              </div>
              {/* Specifications */}
              <div>
                <h2 className="font-semibold mb-1">Specifications</h2>
                <ul className="list-disc pl-5 text-gray-700">
                  {Object.entries(specifications).length === 0 ? (
                    <li>No specifications available.</li>
                  ) : (
                    Object.entries(specifications).map(([key, value]) => (
                      <li key={key}><span className="font-medium">{key}:</span> {value}</li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </div>
          {/* Features */}
          <div className="mt-8">
            <h2 className="font-semibold mb-2">Features</h2>
            {features.length === 0 ? (
              <div className="text-gray-500">No features listed.</div>
            ) : (
              <ul className="list-disc pl-5 text-gray-700">
                {features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            )}
          </div>
          {/* Reviews */}
          <div className="mt-8">
            <h2 className="font-semibold mb-2">Reviews</h2>
            {filteredAndSortedReviews.length === 0 ? (
              <div className="text-gray-500">No reviews yet.</div>
            ) : (
              /* Type casting to ensure compatibility with Reviews component */
              <Reviews reviews={filteredAndSortedReviews.map(review => ({
                ...review,
                id: review.id ? String(review.id) : undefined, // Convert id to string to match expected type
                user: review.user || 'Anonymous',
                date: review.date || new Date().toISOString(),
                rating: review.rating || 0,
                comment: review.comment || ''
              }))} />
            )}
          </div>
        </Container>
      </div>

      {/* Customer Reviews Section with Filters */}
      <div className="border-t border-gray-200 p-8">
        <Container>
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Customer Reviews</h3>
          
          {/* Review Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Rating</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
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
          
          {/* Review List */}
          {reviewList.length > 0 ? (
            <div className="space-y-6">
              <div className="text-sm text-gray-600 mb-4">
                Showing {filteredAndSortedReviews.length} of {reviewList.length} reviews
              </div>
              {filteredAndSortedReviews.map((review, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#ff6b98] rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {(review.user || 'A').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{review.user || 'Anonymous'}</h4>
                        <p className="text-sm text-gray-500">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="flex text-yellow-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-4 w-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">{review.rating}/5</span>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{review.comment || 'No comment provided.'}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No reviews yet for this product.</p>
            </div>
          )}

          {/* Write a Review Button */}
          <div className="mt-8 text-center">
            <button 
              className="bg-[#ff6b98] text-white px-6 py-3 rounded-md hover:bg-[#e55a87] transition-colors"
              onClick={() => setShowReviewForm(true)}
            >
              Write a Review
            </button>
          </div>
          
          {/* Review Form Modal */}
          {showReviewForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Write a Review</h3>
                  <button 
                    onClick={() => {
                      setShowReviewForm(false);
                      setReviewFormData({ user: "", rating: 5, comment: "" });
                      setReviewSubmitError("");
                      setReviewSubmitSuccess(false);
                    }}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {reviewSubmitSuccess ? (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="mt-4 text-lg font-medium text-gray-900">Thank you for your review!</p>
                    <p className="mt-2 text-sm text-gray-500">Your feedback helps others make better rental decisions.</p>
                    <button
                      onClick={() => {
                        setShowReviewForm(false);
                        setReviewFormData({ user: "", rating: 5, comment: "" });
                        setReviewSubmitError("");
                        setReviewSubmitSuccess(false);
                      }}
                      className="mt-6 bg-[#ff6b98] text-white px-4 py-2 rounded-md hover:bg-[#e55a87] transition-colors"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    if (!reviewFormData.user.trim() || !reviewFormData.comment.trim()) {
                      setReviewSubmitError("Please fill out all fields");
                      return;
                    }
                    
                    setIsSubmittingReview(true);
                    setReviewSubmitError("");
                    
                    try {
                      await addReviewToItem(id, reviewFormData);
                      
                      // Update the product data to include the new review
                      const updatedProduct = await fetchItemById(id);
                      setProduct(updatedProduct.data);
                      
                      setReviewSubmitSuccess(true);
                    } catch (error) {
                      setReviewSubmitError(error instanceof Error ? error.message : "Failed to submit review");
                    } finally {
                      setIsSubmittingReview(false);
                    }
                  }}>
                    <div className="space-y-4">
                      {reviewSubmitError && (
                        <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
                          {reviewSubmitError}
                        </div>
                      )}
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                        <input
                          type="text"
                          value={reviewFormData.user}
                          onChange={(e) => setReviewFormData({...reviewFormData, user: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff6b98]"
                          placeholder="Enter your name"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewFormData({...reviewFormData, rating: star})}
                              className="focus:outline-none"
                            >
                              <svg
                                className={`h-8 w-8 ${star <= reviewFormData.rating ? "text-yellow-400" : "text-gray-300"}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </button>
                          ))}
                          <span className="ml-2 text-sm text-gray-600">{reviewFormData.rating}/5</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
                        <textarea
                          value={reviewFormData.comment}
                          onChange={(e) => setReviewFormData({...reviewFormData, comment: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff6b98] min-h-[100px]"
                          placeholder="Share your experience with this product"
                          required
                        ></textarea>
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setShowReviewForm(false);
                            setReviewFormData({ user: "", rating: 5, comment: "" });
                            setReviewSubmitError("");
                          }}
                          className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmittingReview}
                          className={`px-4 py-2 bg-[#ff6b98] text-white rounded-md hover:bg-[#e55a87] transition-colors ${isSubmittingReview ? "opacity-70 cursor-not-allowed" : ""}`}
                        >
                          {isSubmittingReview ? "Submitting..." : "Submit Review"}
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </Container>
      </div>
    </div>
  );
};

export default ProductDetail;
