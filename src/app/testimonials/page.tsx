'use client';

import React, { useEffect, useState } from 'react';
import { apiFetch, endpoints } from '../../api/index';
import Image from 'next/image';
import { getUserProfileImage } from '../../api/users';
import { motion } from 'framer-motion';

type Testimonial = {
  review_message: string;
  created_at: string;
  id: number;
  images: any[];
  item_id: number;
  rating: number;
  service_id: number;
  updated_at: string;
  user_full_name: string;
  user_id: number;
};

// Component to handle featured testimonial avatar with image fetching
const FeaturedTestimonialAvatar: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => {
  const [avatarSrc, setAvatarSrc] = useState<string>(`/avatar${(testimonial.user_id % 4) + 1}.svg`);
  
  useEffect(() => {
    const processTestimonialImages = async () => {
      try {        
        // Use testimonial images if available
        if (Array.isArray(testimonial.images) && testimonial.images.length > 0) {
          const firstImage = testimonial.images[0];
          
          // Case 1: Image is a string (likely base64)
          if (typeof firstImage === 'string') {
            setAvatarSrc(firstImage.startsWith('data:image') 
              ? firstImage 
              : `data:image/jpeg;base64,${firstImage}`);
            return;
          }
          
          // Case 2: Image is an object with image_base64 property
          if (typeof firstImage === 'object' && firstImage) {
            // Use type assertion to handle the image_base64 property
            const imgObj = firstImage as { image_base64?: string };
            if (imgObj.image_base64) {
              const base64 = imgObj.image_base64;
              setAvatarSrc(base64.startsWith('data:image') 
                ? base64 
                : `data:image/jpeg;base64,${base64}`);
              return;
            }
          }
        }
        
        // Keep default avatar if no images found
      } catch (error) {
        console.error(`Error processing testimonial images for user ${testimonial.user_id}:`, error);
        // Keep the default avatar if there's an error
      }
    };
    
    processTestimonialImages();
  }, [testimonial.user_id, testimonial.images]);
  
  return (
    <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg">
      <Image 
        src={avatarSrc}
        alt={testimonial.user_full_name}
        fill
        className="object-cover"
        unoptimized={true}
      />
    </div>
  );
};

// Component to handle grid testimonial avatar with image fetching
const TestimonialGridAvatar: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => {
  const [avatarSrc, setAvatarSrc] = useState<string>(`/avatar${(testimonial.user_id % 4) + 1}.svg`);
  
  useEffect(() => {
    const processTestimonialImages = async () => {
      try {        
        // Use testimonial images if available
        if (Array.isArray(testimonial.images) && testimonial.images.length > 0) {
          const firstImage = testimonial.images[0];
          
          // Case 1: Image is a string (likely base64)
          if (typeof firstImage === 'string') {
            setAvatarSrc(firstImage.startsWith('data:image') 
              ? firstImage 
              : `data:image/jpeg;base64,${firstImage}`);
            return;
          }
          
          // Case 2: Image is an object with image_base64 property
          if (typeof firstImage === 'object' && firstImage) {
            // Use type assertion to handle the image_base64 property
            const imgObj = firstImage as { image_base64?: string };
            if (imgObj.image_base64) {
              const base64 = imgObj.image_base64;
              setAvatarSrc(base64.startsWith('data:image') 
                ? base64 
                : `data:image/jpeg;base64,${base64}`);
              return;
            }
          }
        }
        
        // Keep default avatar if no images found
      } catch (error) {
        console.error(`Error processing testimonial images for user ${testimonial.user_id}:`, error);
        // Keep the default avatar if there's an error
      }
    };
    
    processTestimonialImages();
  }, [testimonial.user_id, testimonial.images]);
  
  return (
    <div className="relative w-14 h-14 rounded-full overflow-hidden mr-4 border-2 border-[#ff6b98]">
      <Image 
        src={avatarSrc}
        alt={testimonial.user_full_name}
        fill
        className="object-cover"
        unoptimized={true}
      />
    </div>
  );
};

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch(endpoints.testimonials, { method: 'GET' })
      .then((data) => {
        // If data is not an array, try to extract the array or fallback to []
        if (Array.isArray(data)) {
          setTestimonials(data);
        } else if (Array.isArray(data?.data)) {
          setTestimonials(data.data);
        } else {
          setTestimonials([]);
        }
        setLoading(false);
        console.log(testimonials);
      })
      .catch(() => {
        setError('Failed to load testimonials.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] via-[#f0f4ff] to-[#fdf1f9] py-20 px-4 sm:px-6 lg:px-8">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-40 left-1/3 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      
      {/* Header */}
      <motion.div 
        className="max-w-3xl mx-auto text-center mb-16 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b98] to-[#7366ff] drop-shadow-sm">
          Our Testimonials
        </h1>
        <div className="flex justify-center mb-4">
          <span className="inline-block w-24 h-1.5 rounded-full bg-gradient-to-r from-[#ff6b98] to-[#7366ff]"></span>
        </div>
        <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
          Discover what our clients have to say about their extraordinary rental experiences with WeRent
        </p>
      </motion.div>
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#ff6b98]"></div>
        </div>
      ) : error ? (
        <div className="text-center py-20 bg-white bg-opacity-80 rounded-xl shadow-lg max-w-md mx-auto">
          <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-500 text-lg font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-[#ff6b98] text-white rounded-lg hover:bg-[#ff6b98]/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-20 bg-white bg-opacity-80 rounded-xl shadow-lg max-w-md mx-auto">
          <p className="text-gray-500 text-lg">No testimonials available at this time.</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          {/* Featured testimonial */}
          {testimonials.length > 0 && (
            <motion.div 
              className="mb-16 max-w-4xl mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
                <div className="md:w-2/5 bg-gradient-to-br from-[#ff6b98] to-[#7366ff] p-8 flex items-center justify-center">
                  <div className="flex flex-col items-center mb-8">
                    <FeaturedTestimonialAvatar testimonial={testimonials[0]} />
                  </div>
                </div>
                <div className="md:w-3/5 p-10 flex flex-col justify-center">
                  <div className="flex mb-4">
                    {Array.from({ length: testimonials[0].rating }).map((_, i) => (
                      <svg key={i} className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                    {Array.from({ length: 5 - testimonials[0].rating }).map((_, i) => (
                      <svg key={i} className="w-6 h-6 text-gray-300 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="text-2xl font-light italic text-gray-700 mb-6 leading-relaxed">
                    "{testimonials[0].review_message}"
                  </blockquote>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{testimonials[0].user_full_name}</h3>
                    <p className="text-sm text-gray-500">{new Date(testimonials[0].created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Grid of testimonials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.slice(1).map((t: Testimonial, index: number) => (
              <motion.div
                key={t.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="p-6 flex-1">
                  <div className="flex items-center mb-4">
                    <TestimonialGridAvatar testimonial={t} />
                    <div>
                      <h3 className="font-semibold text-gray-800">{t.user_full_name}</h3>
                      <p className="text-xs text-gray-500">{new Date(t.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                    </div>
                  </div>
                  
                  <div className="flex mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                    {Array.from({ length: 5 - t.rating }).map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  
                  <blockquote className="text-gray-700 italic mb-0 line-clamp-4">
                    "{t.review_message}"
                  </blockquote>
                </div>
                
                <div className="px-6 py-3 bg-gradient-to-r from-[#ff6b98]/5 to-[#7366ff]/5 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-[#ff6b98]">Verified Rental</span>
                    <span className="text-xs text-gray-500">Item #{t.item_id}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
