'use client';

import React, { useEffect, useState } from 'react';
import { apiFetch, endpoints } from '../../api/index';

type Testimonial = {
  review_message: string;
  created_at: string;
  id: number;
  images: string[];
  item_id: number;
  rating: number;
  service_id: number;
  updated_at: string;
  user_full_name: string;
  user_id: number;
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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-50 py-16 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-5xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 drop-shadow-lg animate-slide-down">
          <span className="inline-block align-middle mr-2">★</span>Testimonials<span className="inline-block align-middle ml-2">★</span>
        </h1>
        <div className="flex justify-center mb-2">
          <span className="inline-block w-16 h-1 rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400"></span>
        </div>
        <p className="mb-2 text-lg text-gray-600 font-medium">What our awesome users are saying about us</p>
      </div>
      {loading ? (
        <div className="text-center text-gray-500 animate-pulse">Loading testimonials...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {testimonials.map((t: Testimonial) => (
            <div
              key={t.id}
              className="relative bg-white bg-opacity-90 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 p-8 flex flex-col items-center border border-purple-100 hover:border-pink-200 group"
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gradient-to-tr from-purple-400 via-pink-400 to-blue-400 p-1 rounded-full shadow-lg">
                <img
                  src={
                    Array.isArray(t.images) && typeof t.images[0] === 'string' && t.images[0].startsWith('data:image')
                      ? t.images[0]
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(t.user_full_name)}`
                  }
                  alt={t.user_full_name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                />
              </div>
              <div className="mt-14 text-center w-full flex-1 flex flex-col justify-between">
                <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-purple-600 transition-colors">{t.user_full_name}</h3>
                <div className="flex justify-center mb-2">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">★</span>
                  ))}
                  {Array.from({ length: 5 - t.rating }).map((_, i) => (
                    <span key={i} className="text-gray-300 text-lg">★</span>
                  ))}
                </div>
                <blockquote className="relative px-4 py-2 italic text-gray-700 mb-3">
                  <span className="absolute left-0 top-0 text-3xl text-purple-200 -ml-2 -mt-2">“</span>
                  {t.review_message}
                  <span className="absolute right-0 bottom-0 text-3xl text-purple-200 -mr-2 -mb-2">”</span>
                </blockquote>
                <span className="text-xs text-gray-400">{new Date(t.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

