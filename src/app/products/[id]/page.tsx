'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { fetchItemById, addReviewToItem, fetchItemReviews, ReviewData, fetchItemsByCategory, Review } from "@/api/items";
import Container from "@/components/ui/Container";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import Reviews from '@/components/Reviews';

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
  size?: string; // Size from backend
  sizes?: string[]; // Available sizes from backend
  type?: string; // Product type from backend
  user_id?: number; // User ID from backend
  designer_name?: string; // Designer name from backend
}

const ProductDetail = () => {
  const params = useParams();
  const id = params?.id as string; // Cast to string to fix type error
  const { accessToken, isAuthenticated, user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [rentalDays, setRentalDays] = useState<number>(1);
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  
  // Review pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [reviewsPerPage, setReviewsPerPage] = useState<number>(5);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [isLoadingReviews, setIsLoadingReviews] = useState<boolean>(false);
  
  // Review form state
  const [showReviewForm, setShowReviewForm] = useState<boolean>(false);
  const [reviewFormData, setReviewFormData] = useState<ReviewData>({
    user: "", // Will be set from authenticated user
    rating: 5,
    review_message: "",
    images: []
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);
  const [reviewSubmitError, setReviewSubmitError] = useState<string>("");
  const [reviewSubmitSuccess, setReviewSubmitSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  // Initialize review form with user data when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setReviewFormData(prevData => ({
        ...prevData,
        user: `${user.first_name} ${user.last_name}`.trim()
      }));
    }
  }, [isAuthenticated, user]);

  // Set default selected size when product is loaded
  useEffect(() => {
    if (product && product.size && !selectedSize) {
      setSelectedSize(product.size);
    }
  }, [product, selectedSize]);

  useEffect(() => {
    async function getProduct() {
      setLoading(true);
      setError(null);
      try {
        const apiProduct = await import('@/api/items').then(m => m.fetchItemById(id));
        
        // Fetch reviews for this product
        let reviewList = [];
        try {
          setIsLoadingReviews(true);
          // Convert rating filter to number for API
          let ratingParam: number | undefined = undefined;
          if (ratingFilter === '5') ratingParam = 5;
          else if (ratingFilter === '4+') ratingParam = 4;
          else if (ratingFilter === '3+') ratingParam = 3;
          
          // Convert sort option to API parameter
          let sortParam: 'date_asc' | 'date_desc' | 'rating_asc' | 'rating_desc' | undefined = undefined;
          if (sortBy === 'recent') sortParam = 'date_desc';
          else if (sortBy === 'oldest') sortParam = 'date_asc';
          else if (sortBy === 'highest') sortParam = 'rating_desc';
          else if (sortBy === 'lowest') sortParam = 'rating_asc';
          
          // Create query params object
          const queryParams = {
            page: currentPage,
            limit: reviewsPerPage,
            rating: ratingParam,
            sort_by: sortParam
          };
          
          // Pass accessToken only if it exists
          const reviewsResponse = await fetchItemReviews(id, queryParams, accessToken || undefined);
          if (reviewsResponse && reviewsResponse.data) {
            reviewList = reviewsResponse.data;
            if (reviewsResponse.meta && reviewsResponse.meta.total) {
              setTotalReviews(reviewsResponse.meta.total);
            }
            console.log('Fetched reviews:', reviewList);
          }
        } catch (reviewError) {
          console.error('Error fetching reviews:', reviewError);
          // Continue with product display even if reviews fail to load
        } finally {
          setIsLoadingReviews(false);
        }
        
        setProduct({
          ...apiProduct,
          price: apiProduct.price_per_day ?? apiProduct.price,
          images: (apiProduct.images || (apiProduct.image ? [apiProduct.image] : [])).map((img: string) =>
            img.startsWith('data:image') ? img : `data:image/jpeg;base64,${img}`
          ),
          reviewList: reviewList || apiProduct.reviewList || [],
          specifications: apiProduct.specifications || {},
          features: apiProduct.features || [],
          size: apiProduct.size,
          sizes: apiProduct.sizes,
          type: apiProduct.type,
          user_id: apiProduct.user_id,
          designer_name: apiProduct.designer_name,
        });
        
        // Fetch related products by category
        if (apiProduct.type) {
          try {
            // Fetch all items and filter by type on frontend since backend filter doesn't work properly
            const allItemsData = await import('@/api/items').then(m => m.fetchItems());
            if (allItemsData && allItemsData.data) {
              // Filter by same type, exclude current product, and limit to 4 items
              const filteredRelated = allItemsData.data
                .filter((item: any) => item.type === apiProduct.type && item.id !== apiProduct.id)
                .slice(0, 4)
                .map((item: any) => ({
                  ...item,
                  price: item.price_per_day ?? item.price,
                  images: (item.images || (item.image ? [item.image] : [])).map((img: string) =>
                    img.startsWith('data:image') ? img : `data:image/jpeg;base64,${img}`
                  ),
                }));
              setRelatedProducts(filteredRelated);
              console.log('Related products for type:', apiProduct.type, filteredRelated);
            }
          } catch (relatedError) {
            console.error('Error fetching related products:', relatedError);
            // Continue without related products if fetch fails
          }
        }
      } catch (e) {
        setError('Failed to load product.');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    if (id) getProduct();
  }, [id, accessToken, currentPage, reviewsPerPage, ratingFilter, sortBy]);

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
                  {product.price ? `$${product.price.toLocaleString()}/day` : 'Contact for price'}
                </div>
                <div className="mb-4 text-gray-700">
                  {product.description || 'No description available.'}
                </div>
                
                {/* Designer Banner */}
                <div className="bg-gradient-to-r from-[#ff6b98] to-[#e55a87] rounded-lg p-6 mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {product.brand ? product.brand.charAt(0).toUpperCase() : (product.designer_name ? product.designer_name.charAt(0).toUpperCase() : 'D')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-white">
                        {product.brand || (product.designer_name ? `Designer: ${product.designer_name}` : 'Designer Collection')}
                      </h3>
                      <p className="text-white/90 text-sm">
                        {product.brand ? 'Premium brand collection' : product.user_id ? `Created by designer ID: ${product.user_id}` : 'Curated by professional interior designers'}
                      </p>
                    </div>
                  </div>
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
                  {(product.sizes || [product.size].filter(Boolean) || []).map((size, idx) => (
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
                  <span className="text-[#ff6b98] font-bold">${totalPrice.toLocaleString()}</span>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col space-y-3 mt-6">
                  <button className="w-full bg-[#ff6b98] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#e55a87] transition-colors">
                    Add to Wishlist
                  </button>
                  <button className="w-full border-2 border-[#ff6b98] text-[#ff6b98] py-3 px-6 rounded-lg font-semibold hover:bg-[#ff6b98] hover:text-white transition-colors">
                    Rent Now
                  </button>
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
        </Container>
      </div>

      {/* Customer Reviews Section with Filters */}
      <div className="border-t border-gray-200 p-8 bg-gray-50">
        <Container>
          {/* Overall Rating Summary - Full Width */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 w-full mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{(product.rating || 0).toFixed(1)}</div>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 ${i < Math.round(product.rating || 0) ? "text-yellow-400" : "text-gray-300"}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{totalReviews} reviews</div>
                </div>
              </div>
              
              <div className="flex-1 md:ml-8">
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = reviewList.filter(review => review.rating === rating).length;
                    const percentage = reviewList.length > 0 ? (count / reviewList.length) * 100 : 0;
                    
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
          
          {/* Review Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
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
          {isLoadingReviews ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff6b98]"></div>
            </div>
          ) : reviewList.length > 0 ? (
            <div className="space-y-6">
              <div className="text-sm text-gray-600 mb-4">
                Showing {reviewList.length} of {totalReviews} reviews
              </div>
              {reviewList.map((review, index) => (
                <div key={index} className="border border-gray-100 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#ff6b98] to-[#ff8fab] rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-white font-semibold text-base">
                          {(review.user_full_name || 'A').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg">{review.user_full_name || 'Anonymous'}</h4>
                        <div className="flex items-center mt-1">
                          <span className="text-sm text-gray-500 mr-3">{review.date ? new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Unknown date'}</span>
                          <div className="flex items-center">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  xmlns="http://www.w3.org/2000/svg"
                                  className={`h-4 w-4 ${i < review.rating ? "text-yellow-400" : "text-gray-200"}`}
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-sm font-medium text-gray-700 ml-2">{review.rating}/5</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Verified Purchase Badge */}
                    <div className="flex items-center">
                      <span className="bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full border border-green-100 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Verified Purchase
                      </span>
                    </div>
                  </div>
                  
                  <div className="prose prose-sm max-w-none mb-6">
                    <p className="text-gray-700 leading-relaxed">{review.review_message || 'No comment provided.'}</p>
                  </div>
                  
                  {/* Review Images */}
                  {review.images && review.images.length > 0 && (
                    <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                      <h5 className="text-sm font-medium text-gray-700 mb-3">Photos from this review</h5>
                      <div className="flex flex-wrap gap-3">
                        {review.images.map((image, imgIndex) => (
                          <div key={imgIndex} className="relative group">
                            <div className="relative w-28 h-28 rounded-lg overflow-hidden border border-gray-100 shadow-sm group cursor-pointer">
                              <img 
                                src={image} 
                                alt={`Review image ${imgIndex + 1}`}
                                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                                onClick={() => {
                                  // Create modal or lightbox effect for image viewing
                                  const modal = document.createElement('div');
                                  modal.style.position = 'fixed';
                                  modal.style.top = '0';
                                  modal.style.left = '0';
                                  modal.style.width = '100%';
                                  modal.style.height = '100%';
                                  modal.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
                                  modal.style.display = 'flex';
                                  modal.style.justifyContent = 'center';
                                  modal.style.alignItems = 'center';
                                  modal.style.zIndex = '9999';
                                  modal.style.padding = '20px';
                                  modal.style.cursor = 'pointer';
                                  modal.style.backdropFilter = 'blur(5px)';
                                  modal.style.transition = 'opacity 0.3s ease';
                                  
                                  const imgContainer = document.createElement('div');
                                  imgContainer.style.position = 'relative';
                                  imgContainer.style.maxWidth = '90%';
                                  imgContainer.style.maxHeight = '90%';
                                  imgContainer.style.display = 'flex';
                                  imgContainer.style.justifyContent = 'center';
                                  imgContainer.style.alignItems = 'center';
                                  imgContainer.style.transition = 'transform 0.3s ease';
                                  imgContainer.style.transform = 'scale(0.95)';
                                  
                                  const img = document.createElement('img');
                                  img.src = image;
                                  img.style.maxWidth = '100%';
                                  img.style.maxHeight = '100%';
                                  img.style.objectFit = 'contain';
                                  img.style.borderRadius = '8px';
                                  img.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.3)';
                                  
                                  // Close button
                                  const closeBtn = document.createElement('button');
                                  closeBtn.innerHTML = '&times;';
                                  closeBtn.style.position = 'absolute';
                                  closeBtn.style.top = '20px';
                                  closeBtn.style.right = '20px';
                                  closeBtn.style.background = 'rgba(255, 255, 255, 0.2)';
                                  closeBtn.style.color = 'white';
                                  closeBtn.style.border = 'none';
                                  closeBtn.style.borderRadius = '50%';
                                  closeBtn.style.width = '40px';
                                  closeBtn.style.height = '40px';
                                  closeBtn.style.fontSize = '24px';
                                  closeBtn.style.cursor = 'pointer';
                                  closeBtn.style.display = 'flex';
                                  closeBtn.style.justifyContent = 'center';
                                  closeBtn.style.alignItems = 'center';
                                  closeBtn.style.transition = 'background 0.2s';
                                  
                                  closeBtn.addEventListener('mouseover', () => {
                                    closeBtn.style.background = 'rgba(255, 255, 255, 0.3)';
                                  });
                                  
                                  closeBtn.addEventListener('mouseout', () => {
                                    closeBtn.style.background = 'rgba(255, 255, 255, 0.2)';
                                  });
                                  
                                  imgContainer.appendChild(img);
                                  modal.appendChild(imgContainer);
                                  modal.appendChild(closeBtn);
                                  document.body.appendChild(modal);
                                  
                                  // Animation
                                  setTimeout(() => {
                                    imgContainer.style.transform = 'scale(1)';
                                  }, 10);
                                  
                                  const closeModal = () => {
                                    imgContainer.style.transform = 'scale(0.95)';
                                    modal.style.opacity = '0';
                                    setTimeout(() => {
                                      document.body.removeChild(modal);
                                    }, 300);
                                  };
                                  
                                  modal.addEventListener('click', (e) => {
                                    if (e.target === modal) {
                                      closeModal();
                                    }
                                  });
                                  
                                  closeBtn.addEventListener('click', (e) => {
                                    e.stopPropagation();
                                    closeModal();
                                  });
                                }}
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4.25 2A2.25 2.25 0 002 4.25v11.5A2.25 2.25 0 004.25 18h11.5A2.25 2.25 0 0018 15.75V4.25A2.25 2.25 0 0015.75 2H4.25zM15 5a1 1 0 00-1-1h-3a1 1 0 000 2h3a1 1 0 001-1zm-9 6a3 3 0 116 0 3 3 0 01-6 0zm9-4a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Pagination Controls */}
              {totalReviews > reviewsPerPage && (
                <div className="flex justify-center mt-8">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                      Previous
                    </button>
                    
                    {/* Page numbers */}
                    {Array.from({ length: Math.min(5, Math.ceil(totalReviews / reviewsPerPage)) }, (_, i) => {
                      // Calculate page numbers to show
                      const totalPages = Math.ceil(totalReviews / reviewsPerPage);
                      let startPage = Math.max(1, currentPage - 2);
                      let endPage = Math.min(totalPages, startPage + 4);
                      
                      // Adjust start if end is maxed out
                      if (endPage === totalPages) {
                        startPage = Math.max(1, endPage - 4);
                      }
                      
                      const pageNum = startPage + i;
                      if (pageNum <= endPage) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-1 rounded-md ${currentPage === pageNum ? 'bg-[#ff6b98] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                      return null;
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(totalReviews / reviewsPerPage)))}
                      disabled={currentPage === Math.ceil(totalReviews / reviewsPerPage)}
                      className={`px-3 py-1 rounded-md ${currentPage === Math.ceil(totalReviews / reviewsPerPage) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
              
              {/* Per page selector */}
              <div className="flex justify-end mt-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Reviews per page:</span>
                  <select
                    value={reviewsPerPage}
                    onChange={(e) => {
                      setReviewsPerPage(Number(e.target.value));
                      setCurrentPage(1); // Reset to first page when changing items per page
                    }}
                    className="px-2 py-1 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 py-8 text-center">No reviews yet. Be the first to review this product!</div>
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
                      setReviewFormData({ user: "", rating: 5, review_message: "", images: [] });
                      setSelectedImages([]);
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
                        setReviewFormData({ user: "", rating: 5, review_message: "", images: [] });
                        setSelectedImages([]);
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
                    const trimmedReview = reviewFormData.review_message.trim();
                    if (!trimmedReview) {
                      setReviewSubmitError("Please enter your review");
                      return;
                    }
                    
                    if (trimmedReview.length < 5) {
                      setReviewSubmitError("Your review must be at least 5 characters long");
                      return;
                    }
                    
                    if (!isAuthenticated || !accessToken) {
                      setReviewSubmitError("You must be logged in to submit a review");
                      return;
                    }
                    
                    setIsSubmittingReview(true);
                    setReviewSubmitError("");
                    
                    try {
                      await addReviewToItem(id, reviewFormData, accessToken);
                      
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
                          value={reviewFormData.review_message}
                          onChange={(e) => setReviewFormData({...reviewFormData, review_message: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff6b98] min-h-[100px]"
                          placeholder="Share your experience with this product"
                          required
                        ></textarea>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Upload Images (Optional)</label>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            setSelectedImages(files);
                            
                            // Convert images to base64
                            Promise.all(
                              files.map(file => {
                                return new Promise<string>((resolve) => {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    resolve(reader.result as string);
                                  };
                                  reader.readAsDataURL(file);
                                });
                              })
                            ).then(base64Images => {
                              setReviewFormData({
                                ...reviewFormData,
                                images: base64Images
                              });
                            });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff6b98]"
                        />
                        {selectedImages.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {selectedImages.map((file, index) => (
                              <div key={index} className="relative w-16 h-16 rounded overflow-hidden">
                                <img 
                                  src={URL.createObjectURL(file)} 
                                  alt={`Preview ${index}`} 
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newImages = [...selectedImages];
                                    newImages.splice(index, 1);
                                    setSelectedImages(newImages);
                                    
                                    const newBase64Images = [...(reviewFormData.images || [])];
                                    newBase64Images.splice(index, 1);
                                    setReviewFormData({
                                      ...reviewFormData,
                                      images: newBase64Images
                                    });
                                  }}
                                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setShowReviewForm(false);
                            setReviewFormData({ user: "", rating: 5, review_message: "", images: [] });
                            setSelectedImages([]);
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
      
      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="bg-gray-50 py-12">
          <Container>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-gray-200 relative">
                    <Image
                      src={relatedProduct.images && relatedProduct.images.length > 0 ? relatedProduct.images[0] : '/shop/mock-chair.jpg'}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{relatedProduct.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{relatedProduct.brand || relatedProduct.type || 'Premium Collection'}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[#ff6b98] font-bold">${relatedProduct.price}/day</span>
                      <div className="flex items-center">
                        <svg className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm text-gray-600">{relatedProduct.rating ? relatedProduct.rating.toFixed(1) : '4.0'}</span>
                      </div>
                    </div>
                    <Link href={`/products/${relatedProduct.id}`} className="mt-3 block w-full bg-[#ff6b98] text-white text-center py-2 rounded-md hover:bg-[#e55a87] transition-colors">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
